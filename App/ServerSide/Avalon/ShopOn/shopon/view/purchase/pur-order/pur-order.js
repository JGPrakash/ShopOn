
$.fn.purchaseOrder = function () {
    return $.pageController.getPage(this, function (page, $$) {

        //Import Services required     
        page.itemService = new ItemService();
        page.inventoryService = new InventoryService();
        page.stockService = new StockService();
        page.purchaseService = new PurchaseService();
        page.trayService = new TrayService();
        page.purchaseBillService = new PurchaseBillService();
        page.finfactsService = new FinfactsService();
        page.finfactsEntry = new FinfactsEntry();

        page.accService = new AccountingService();
        page.dynaReportService = new DynaReportService();
        page.billService = new BillService();
        page.stockAPI = new StockAPI();
        page.vendorAPI = new VendorAPI();
        page.maximumIdAPI = new MaximumIdAPI();
        page.itemAttributeAPI = new ItemAttributeAPI();
        page.taxclassAPI = new TaxClassAPI();
        page.mainproducttypeAPI = new MainProductTypeAPI();
        page.productTypeAPI = new ProductTypeAPI();
        page.itemAPI = new ItemAPI();
        page.purchaseBillPaymentAPI = new PurchaseBillPaymentAPI();
        page.finfactsEntryAPI = new FinfactsEntryAPI();
        page.purchaseBillAPI = new PurchaseBillAPI();

        page.receiveMode = false;
        page.stockMode = false;
        page.damageMode = false;
        page.trayMode = false;

        page.sales_tax = [];
        page.sales_tax_no = -1;
        page.attr_list = [];
        document.title = "ShopOn - Purchase Order";
        $("body").keydown(function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode == 112) {
                e.preventDefault();
                page.events.btnNewPO_click();
            }
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnBack_click();
            }
            if (keyCode == 119) {
                e.preventDefault();
                page.events.btnGetPendingPayVendor_click();
            }
        });
        $("[controlid=pnlNewPOPopup]").keydown(function (e) {
            var keyCode = e.keyCode || e.which;
            if (e.altKey && e.which == 78) {
                e.preventDefault();
                page.events.btnAddNewVendor_click();
            }
        });
        $("[controlid=txtInvoiceNo]").on('focusout', function () {
            if (page.controls.txtInvoiceNo.val() != "" && page.controls.txtInvoiceNo.val() != null) {
                page.purchaseBillAPI.searchValues("", "", "invoice_no like '" + page.controls.txtInvoiceNo.val() + "'", "", function (data) {
                    if (data.length > 0) {
                        if (!confirm("This Invoice No Is Already Precent Are You Sure To Register It Again")) {
                            page.controls.txtInvoiceNo.val("");
                            page.controls.txtInvoiceNo.focus();
                        }
                    }
                });
            }
        });
        setTimeout(function () {
            $("[controlid=dsExpectedDate]").datepicker("option", "minDate", new Date());
        }, 100)
        function PrintingOD(data) {
            var r = window.open(null, "_blank");
            var doc = r.document;
            var head = false;

            doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; } #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td  {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;} </style><div class='col-lg-12'>");
            doc.write("<span style='float:right;font-size:17px;'>ORIGINAL</span><br>");
            doc.write("<div><h1><center>" + CONTEXT.COMPANY_NAME.toUpperCase() + "</center></h1></div>");
            doc.write("<center><div style='width:600px;'>" + '' + CONTEXT.COMPANY_ADDRESS_LINE2 + '' + "</center>");
            doc.write("<center>" + '' + CONTEXT.COMPANY_PHONE_NO + '' + "</center></div>");
            doc.write("<div><span style='float:left'>DL.No : " + '' + CONTEXT.COMPANY_DL_NO + '' + "</span></div>");
            doc.write("<div><span class='col-lg-12' style='float:right'>TIN : " + CONTEXT.COMPANY_TIN_NO + "</span></div><br>");
            doc.write("<div><span class='col-lg-12' style='float:right'>GST : " + CONTEXT.COMPANY_GST_NO + " </span></div>");

            doc.write("<div><h5><center> INVOICE </center></h5></div>");
            doc.write("<br><br><table style='width:100%;' cellpadding='0' cellspacing='0' border='1'>");
            doc.write("<tr ><td  style='width:350px;'>");
            doc.write("<br><div style='font-weight:bold'>" + $$("ddlPOVendor").selectedData().vendor_name.toUpperCase() + "</div><br>");
            doc.write("<div>" + page.controls.lblPOVendorAddress.html() + "");
            doc.write("<br>PH:" + page.controls.lblPOVendorPhone.html() + "");

            var txt_dl_no = (data[0].license_no == null || data[0].license_no == "null" || data[0].license_no == undefined) ? "" : data[0].license_no;
            var txt_tin_no = (data[0].tin_no == null || data[0].tin_no == "null" || data[0].tin_no == undefined) ? "" : data[0].tin_no;
            var txt_gst_no = (data[0].gst_no == null || data[0].gst_no == "null" || data[0].gst_no == undefined) ? "" : data[0].gst_no;

            doc.write("<br>DL.No : ");
            doc.write("<br>GST : ");
            doc.write("<br>TIN : </div></td>");
            doc.write("<td><div>PURCHASE BILL</div><br>");
            doc.write("BILL NO : " + page.controls.lblPOBillNo.value() + "<br>");
            doc.write("BILL DATE : " + page.controls.lblPOOrderedDate.html() + "</div><br></td>");
            //doc.write("<div>DUE ON : " +  + "</div><br>");
            //doc.write("<td><div>TOTAL BILLS : " + data[0].tot_bills + "<br>");
            //doc.write("PREVIOUS BALANCE : " + page.controls.lblPendingPayment.html() + "</div><br>");
            //doc.write("</td></tr>");
            doc.write("</tr>");


            doc.write("</table><br>");


            doc.write("<table  id='orgTblItem' style='width:100%;' cellpadding='0'; cellspacing='0'; border='0'; >");
            doc.write("<tr style='font-weight:bold;'>");
            doc.write("<th class='col' style=' width: 5px; height: 30px;'>S.No</th>");
            doc.write("<th class='col' style=' width: 130px; height: 30px;'>Product Name</th>");
            //doc.write("<th class='col' style=' width: 50px; height: auto;'>Pack</th>");
            //doc.write("<th class='col' style=' width: 50px; height: auto;'>Bill No</th>");
            doc.write("<th class='col' style=' width: 80px; height: 30px;'>Batch</th>");
            doc.write("<th class='col' style=' width: 90px; height: 30px;'>Exp</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>Qty</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>Free</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>MRP</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>Rate</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>PDis</th>");
            //doc.write("<th class='col' style=' width: 50px; height: auto;'>Tax</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>CGST</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>SGST</th>");
            doc.write("<th class='col' style=' width: 60px; height: 30px;'>Amount</th>");
            doc.write("</tr>");
            var no_of_prd = 0;
            var tot_Qty = 0;
            var tot_tax_cgst = 0;
            var tot_tax_sgst = 0;
            var s_no = 1;
            $(data).each(function (i, item) {
                var tax_cgst = 0;
                var tax_sgst = 0;

                tax_cgst = parseFloat(item.tax_amt) / parseFloat(2);
                tax_sgst = parseFloat(item.tax_amt) / parseFloat(2);

                var txt_Batch = (item.batch_no == null || item.batch_no == "null" || item.batch_no == undefined) ? "" : item.batch_no;
                var txt_exp_date = (item.expiry_date == null || item.expiry_date == "null" || item.expiry_date == undefined) ? "" : item.expiry_date;
                var txt_Qnty = (item.qty == null || item.qty == "null" || item.qty == undefined) ? "0" : item.qty;
                var txt_FQnty = (item.free_qty == null || item.free_qty == "null" || item.free_qty == undefined) ? "0" : item.free_qty;
                var txt_Price = (item.cost == null || item.cost == "null" || item.cost == undefined) ? "0" : item.cost;
                var txt_Disc = (item.discount == null || item.discount == "null" || item.discount == undefined) ? "0" : item.discount;
                var txt_Mrp = (item.mrp == null || item.mrp == "null" || item.mrp == undefined) ? "0" : item.mrp;
                var txt_Tot_Price = (item.total_price == null || item.total_price == "null" || item.total_price == undefined) ? "0" : item.total_price;
                doc.write("<tr  style='text-align: center;border:1px'>");
                doc.write("<td  class='col' style=' width: 5px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + s_no + "</td>");
                doc.write("<td  class='col' style=' width: 130px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + item.item_name + "</td>");
                //doc.write("<td  class='col' style=' width: 50px; height: auto;'>" + item.packing + "</td>");
                doc.write("<td  class='col' style=' width: 80px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_Batch + "</td>");
                doc.write("<td  class='col' style=' width: 90px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_exp_date + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_Qnty + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_FQnty + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Mrp).toFixed(CONTEXT.COUNT_AFTER_POINTS) + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Price).toFixed(CONTEXT.COUNT_AFTER_POINTS) + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Disc).toFixed(CONTEXT.COUNT_AFTER_POINTS) + "</td>");

                //doc.write("<td  class='col' style=' width: 90px; height: auto;'>" + parseFloat(item.tax_per) + "%</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(tax_cgst).toFixed(CONTEXT.COUNT_AFTER_POINTS) + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(tax_sgst).toFixed(CONTEXT.COUNT_AFTER_POINTS) + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Tot_Price).toFixed(CONTEXT.COUNT_AFTER_POINTS) + "</td>");
                doc.write("</tr>");

                no_of_prd = no_of_prd + 1;
                s_no = s_no + 1;
                tot_Qty = parseInt(tot_Qty) + parseInt(item.qty);
                tot_tax_cgst = parseFloat(tot_tax_cgst) + parseFloat(tax_cgst);
                tot_tax_sgst = parseFloat(tot_tax_sgst) + parseFloat(tax_sgst);
            });
            doc.write("<tr><td colspan='9' style=''><div> No.of.Items :  " + no_of_prd + "</div></td><td colspan='4'> <div ><b>SubTotal: </b><span style='float:right'>" + parseFloat(page.controls.lblSubTotal.value()).toFixed(CONTEXT.COUNT_AFTER_POINTS) + "</span> </div></td> </tr>");
            doc.write("<tr><td colspan='9' style=''><div> Quantity : " + tot_Qty + "</div></td><td colspan='4'> <div ><b>Discount Amount: </b><span style='float:right'>" + parseFloat(page.controls.lblTotalDiscounts.value()).toFixed(CONTEXT.COUNT_AFTER_POINTS) + "</span> </div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>CGST: </b><span style='float:right'>" + parseFloat(tot_tax_cgst).toFixed(CONTEXT.COUNT_AFTER_POINTS) + " </span></div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>SGST: </b><span style='float:right'>" + parseFloat(tot_tax_sgst).toFixed(CONTEXT.COUNT_AFTER_POINTS) + "</span> </div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>Tax Amount: </b><span style='float:right'>" + parseFloat(page.controls.lblTotalTax.value()).toFixed(CONTEXT.COUNT_AFTER_POINTS) + " </span></div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>Bill Amount: </b><span style='float:right'>" + parseFloat(page.controls.lblTotal.value()).toFixed(CONTEXT.COUNT_AFTER_POINTS) + "</span> </div> </td></tr>");
            doc.write("</tr>");
            doc.write("</table>");

            doc.write("<div align='right'><h5>For " + CONTEXT.COMPANY_NAME + "</h5>");



            discount: page.controls.lblTotalDiscounts.value(),

            //doc.write("<footer> <h2 align='center'></h2></footer><div align='center'><p>&copy; 2017 <a href='http://www.wototech.com'>www.wototech.com</a><p></div></body></html>");
            doc.write("</div></div></body></html>");
            doc.write("</div>");


            doc.write("</div></body></html>");

            //doc.write("<center>&copy; 2017 <a href='http://www.wototech.com'>www.wototech.com</a></center></div></body></html>");

            doc.close();
            r.focus();
            r.print();
        }

        function getVariation(data) {

        }

        page.savePurchaseOrder = function (callback) {


            if (page.currentPO.state_text == "Created") {
                var poItems = page.controls.grdPOItems.allData();

                //do validations
                $(poItems).each(function (i, item) {
                    if (item.qty == null || isNaN(item.qty) || parseFloat(item.qty) < 0 || item.qty == "" || item.qty == 0)
                        item.qty = 0;//If not a number or negative set flag=1
                    //throw "Quantity should be a number and non negative.";
                    if (item.free_qty == null || isNaN(item.free_qty) || parseFloat(item.free_qty) < 0) //If not a number or negative set flag=1
                        item.free_qty = 0;
                    if((parseFloat(item.qty)+parseFloat(item.free_qty)) <= 0)
                        throw "Quantity should be a number and non negative.";
                });

                var newPO = {
                    po_no: page.currentPO.po_no,
                    vendor_no: page.controls.ddlPOVendor.selectedValue(),
                    expected_date: page.controls.dsPOExpectedDate.getDate(),
                    invoice_no: page.controls.txtInvoiceNo.val()
                };

                $$("msgPanel").show("Updating purchase order...");
                page.purchaseService.updatePO(newPO, function () {
                    var result = compareContents(page.currentPOItem, poItems, "po_no,item_no", "po_no,item_no,qty,free_qty,tax_per,alter_unit_fact,unit_identity");

                    $$("msgPanel").show("Updating items in purchase order...");
                    page.purchaseService.deletePOItems(0, result.deletedDate, function () {
                        page.purchaseService.updatePOItems(0, result.updatedData, function () {
                            page.purchaseService.addPOItems(0, result.addedData, function () {
                                callback();
                            });
                        });
                    });
                });
            }
            else if (page.currentPO.state_text == "Ordered") {
                var grdItems = page.controls.grdPOItems.allData();
                var poItems = [];
                $(grdItems).each(function (i, item) {

                    if (item.qty == null || isNaN(item.qty) || parseFloat(item.qty) < 0 || item.qty == "") //If not a number or negative set flag=1
                        item.qty = 0;
                        //throw "Quantity should be a number and non negative.";

                    if (item.free_qty == null || isNaN(item.free_qty) || parseFloat(item.free_qty) < 0) //If not a number or negative set flag=1
                        item.free_qty = 0;
                        //throw "Free Quantity should be a number and non negative.";

                    if (item.cost == null || isNaN(item.cost) || parseFloat(item.cost) < 0 || (item.cost == "" && item.cost != 0)) //If not a number or negative set flag=1
                        item.cost = 0;
                        //throw "Cost should be a number greater than zero and non negative.";

                    if (item.disc_per == null || isNaN(item.disc_per) || parseFloat(item.disc_per) < 0) //If not a number or negative set flag=1
                        throw "Discount percentage should be a number and non negative.";

                    if (item.disc_val == null || isNaN(item.disc_val) || parseFloat(item.disc_val) < 0) //If not a number or negative set flag=1
                        throw "Discount value should be a number and non negative.";

                    if (item.tax_per == null || isNaN(item.tax_per) || parseFloat(item.tax_per) < 0) //If not a number or negative set flag=1
                        throw "Tax percentage should be a number and non negative.";

                    poItems.push({
                        po_no: item.po_no,
                        item_no: item.item_no,
                        //free_qty: item.free_qty,
                        cost: item.cost,
                        disc_per: item.disc_per,
                        disc_val: item.disc_val,
                        tax_per: item.tax_per,
                        total_price: item.total_price,
                    });
                });

                var newPO = {
                    po_no: page.currentPO.po_no,
                    vendor_no: page.controls.ddlPOVendor.selectedValue(),
                    invoice_no: page.controls.txtInvoiceNo.val()
                };


                $$("msgPanel").show("Updating purchase order...");
                page.purchaseService.updatePO(newPO, function () {

                    $$("msgPanel").show("Updating items in purchase order...");
                    page.purchaseService.updatePOItems(0, poItems, function () {
                        callback();
                    });
                });
            }

        }
        // Advance Search
        $("[controlid=txtAdvVendor]").keyup(function () {
            page.advanceItemSearch($$("txtAdvVendor").val(), $$("txtAdvManufacturer").val());
        });
        $("[controlid=txtAdvManufacturer]").keyup(function () {
            page.advanceItemSearch($$("txtAdvVendor").val(), $$("txtAdvManufacturer").val());
        });
        page.advanceItemSearch = function (ven_name, man_name) {
            page.itemService.getItemTouchAdvanceSearchPO(ven_name, man_name, function (data) {
                page.controls.grdAdvSearchItem.hide();
                //page.controls.grdTouchAdvSearchItem.width("100%");
                //page.controls.grdTouchAdvSearchItem.height("220px");
                page.controls.grdTouchAdvSearchItem.setTemplate({
                    selection: "Multiple",
                    columns: [
                            { 'name': "", 'width': "0px", 'dataField': "item_no" },
                            { 'name': "", 'width': "0px", 'dataField': "item_name" },
                            { 'name': "", 'width': "0px", 'dataField': "item_code" },
                            { 'name': "", 'width': "0px", 'dataField': "vendor_name" },
                            { 'name': "", 'width': "0px", 'dataField': "man_name" },
                            { 'name': "", 'width': "0px", 'dataField': "tax" },
                            { 'name': "", 'width': "0px", 'dataField': "price" },
                            { 'name': "", 'width': "0px", 'dataField': "mrp" },
                            { 'name': "Select Items", 'width': "100%", 'dataField': "item_no", itemTemplate: "<div id='detailGrid'></div>" }

                    ]
                })

                $$("grdTouchAdvSearchItem").rowBound = function (row, item) {
                    var htmlTemplate = [];
                    htmlTemplate.push("<div><img id='output' style='max-width:150px; max-height:150px; min-height:150px;' src='" + CONTEXT.ImageDownloadPath + item.item_no + '/' + item.image_name + "'/><BR><p style='background-color:orange;'><span > Vendor : " + item.vendor_name + "<BR> Manufacturer : " + item.man_name + "<BR> MRP : " + item.mrp + "</span></p></div>");

                    $(row).find("[id=detailGrid]").html(htmlTemplate.join(""));
                }

                //page.controls.grdTouchAdvSearchItem.createRow(item);
                page.controls.grdTouchAdvSearchItem.dataBind(data);

                //page.controls.grdTouchAdvSearchItem.dataBind(data);
            });
        }

        page.calculate = function () {

            var finalsubtotal = 0;
            var finaldiscount = 0;
            var finaltax = 0;
            var finaltotal = 0;
            var net_rate = 0;

            $(page.controls.grdPOItems.getAllRows()).each(function (i, row) {
                $(row).find("[datafield=sl_no]").find("div").html(i+1);
                var poItem = page.controls.grdPOItems.getRowData(row);
                if (poItem.disc_per == "" || poItem.disc_per == null || poItem.disc_per == undefined)
                    poItem.disc_per = 0;
                if (poItem.disc_val == "" || poItem.disc_val == null || poItem.disc_val == undefined)
                    poItem.disc_val = 0;
                if (poItem.tax_per == "" || poItem.tax_per == null || poItem.tax_per == undefined)
                    poItem.tax_per = 0;
                var subtotal = parseFloat(poItem.cost) * parseFloat(poItem.qty);
                var discount = (subtotal * parseFloat(poItem.disc_per) / 100) + (parseFloat(poItem.disc_val) * parseFloat(poItem.qty));

                function getTaxPercent(tax_class_no) {
                    var rdata = 0;
                    $(page.sales_tax).each(function (i, item) {
                        if (tax_class_no == item.tax_class_no) {
                            rdata = item.tax_per;
                        }
                    });
                    return rdata;
                }
                poItem.tax_per = getTaxPercent(poItem.tax_class_no);
                var tax = (subtotal - discount) * parseFloat(poItem.tax_per) / 100;
                var total = (subtotal - discount) + tax;
                total = (isNaN(total) ||total == "Infinity") ? 0 : total;
                var buyingCost = (subtotal - discount) / poItem.qty;
                buyingCost = (isNaN(buyingCost) || buyingCost == "Infinity") ? 0 : buyingCost;

                if (CONTEXT.ENABLE_FREE_VARIATION) {
                    net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                } else {
                    net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                }
                net_rate = (isNaN(net_rate) || net_rate == "Infinity") ? 0 : net_rate;

                $(row).find("[datafield=tax_per]").find("div").html(poItem.tax_per);
                $(row).find("[datafield=total_price]").find("div").html(total.toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=buying_cost]").find("div").html(buyingCost.toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=net_rate]").find("div").html(net_rate);
                poItem.net_rate = net_rate;
                poItem.total_price = total;
                finalsubtotal = finalsubtotal + subtotal;
                finaldiscount = finaldiscount + discount;
                finaltax = finaltax + tax;
                finaltotal = finaltotal + total;

            });
            var total_after_Rnd_off = Math.round(parseFloat(finaltotal));
            var round_off = parseFloat(parseFloat(finaltotal) - parseFloat(total_after_Rnd_off)).toFixed(CONTEXT.COUNT_AFTER_POINTS);

            page.controls.lblRndOff.value(parseFloat(round_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblTotal.value(parseFloat(total_after_Rnd_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblTotalCopy.value(parseFloat(total_after_Rnd_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblSubTotal.value(parseFloat(finalsubtotal).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblTotalDiscounts.value(parseFloat(finaldiscount).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblTotalTax.value(parseFloat(finaltax).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            var remainingAmount = parseFloat(page.controls.lblTotal.value()) - parseFloat(page.controls.lblTotalAmtPaid.html());
            page.controls.lblTotalAmtRemaining.value(parseFloat(remainingAmount).toFixed(CONTEXT.COUNT_AFTER_POINTS));

        }
        page.calculateDelivery = function () {

            var finalsubtotal = 0;
            var finaldiscount = 0;
            var finaltax = 0;
            var finaltotal = 0;
            var net_rate = 0;

            $(page.controls.grdPOItems.getAllRows()).each(function (i, row) {
                var poItem = page.controls.grdPOItems.getRowData(row);
                if (poItem.disc_per == "" || poItem.disc_per == null || poItem.disc_per == undefined)
                    poItem.disc_per = 0;
                if (poItem.disc_val == "" || poItem.disc_val == null || poItem.disc_val == undefined)
                    poItem.disc_val = 0;
                if (poItem.tax_per == "" || poItem.tax_per == null || poItem.tax_per == undefined)
                    poItem.tax_per = 0;
                poItem.qty_delivered = (poItem.qty_delivered == null || poItem.qty_delivered == "" || typeof poItem.qty_delivered == "undefined") ? 0 : poItem.qty_delivered;
                poItem.qty_returned = (poItem.qty_returned == null || poItem.qty_returned == "" || typeof poItem.qty_returned == "undefined") ? 0 : poItem.qty_returned;
                poItem.free_qty = (poItem.free_qty == null || poItem.free_qty == "" || typeof poItem.free_qty == "undefined") ? 0 : poItem.free_qty;
                var subtotal = parseFloat(poItem.cost) * (parseFloat(poItem.qty_delivered) + parseFloat(poItem.qty_returned) - parseFloat(poItem.free_qty));
                subtotal = parseFloat(subtotal) < 0 ? 0 : subtotal;
                var discount = (subtotal * parseFloat(poItem.disc_per) / 100) + (parseFloat(poItem.disc_val) * parseFloat(poItem.qty_delivered));

                function getTaxPercent(tax_class_no) {
                    var rdata = 0;
                    $(page.sales_tax).each(function (i, item) {
                        if (tax_class_no == item.tax_class_no) {
                            rdata = item.tax_per;
                        }
                    });
                    return rdata;
                }
                poItem.tax_per = getTaxPercent(poItem.tax_class_no);
                var tax = (subtotal - discount) * parseFloat(poItem.tax_per) / 100;
                var total = (subtotal - discount) + tax;
                total = (isNaN(total) || total == "Infinity") ? 0 : total;
                var buyingCost = (subtotal - discount) / poItem.qty;
                buyingCost = (isNaN(buyingCost) || buyingCost == "Infinity") ? 0 : buyingCost;

                //if (CONTEXT.ENABLE_FREE_VARIATION) {
                //    net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(5);
                //} else {
                //    net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(5);
                //}
                //net_rate = (isNaN(net_rate) || net_rate == "Infinity") ? 0 : net_rate;

                //$(row).find("[datafield=tax_per]").find("div").html(poItem.tax_per);
                //$(row).find("[datafield=total_price]").find("div").html(total.toFixed(5));
                //$(row).find("[datafield=buying_cost]").find("div").html(buyingCost.toFixed(5));
                //$(row).find("[datafield=net_rate]").find("div").html(net_rate);
                //poItem.net_rate = net_rate;
                poItem.total_price = total;
                finalsubtotal = finalsubtotal + subtotal;
                finaldiscount = finaldiscount + discount;
                finaltax = finaltax + tax;
                finaltotal = finaltotal + total;

            });
            var total_after_Rnd_off = Math.round(parseFloat(finaltotal));
            var round_off = parseFloat(parseFloat(finaltotal) - parseFloat(total_after_Rnd_off)).toFixed(CONTEXT.COUNT_AFTER_POINTS);

            page.controls.lblDeliveryAmount.html(parseFloat(total_after_Rnd_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            //page.controls.lblRndOff.value(parseFloat(round_off).toFixed(5));
            //page.controls.lblTotal.value(parseFloat(total_after_Rnd_off).toFixed(5));
            //page.controls.lblTotalCopy.value(parseFloat(total_after_Rnd_off).toFixed(5));
            //page.controls.lblSubTotal.value(parseFloat(finalsubtotal).toFixed(5));
            //page.controls.lblTotalDiscounts.value(parseFloat(finaldiscount).toFixed(5));
            //page.controls.lblTotalTax.value(parseFloat(finaltax).toFixed(5));

            //var remainingAmount = parseFloat(page.controls.lblTotal.value()) - parseFloat(page.controls.lblTotalAmtPaid.html());
            //page.controls.lblTotalAmtRemaining.value(parseFloat(remainingAmount).toFixed(5));

        }
        page.variation = function (row, billItem, callback) {
            var var_data = [];
            $(billItem.variation_data).each(function (i, item) {
                if (item.variation_name != null) {
                    // if (parseInt(item.cost) != 0) {
                    var_data.push({
                        value: item.variation_name,
                        label: item.variation_name,
                        mrp: item.mrp,
                        batch_no: item.batch_no,
                        expiry_date: item.expiry_date,
                        cost: item.cost,
                        man_date: item.man_date,
                        active: item.active,
                        var_no: item.var_no,
                        selling_price: item.selling_price,
                        pre_alter_price_1: item.pre_alter_price_1,
                        pre_alter_price_2: item.pre_alter_price_2
                    });
                    // }
                }
            })
            callback(var_data);
        }
        page.selectGridBill = function (item, currentRow) {
            var newitem = {
                item_no: item.item_no,
                item_code: item.item_code,
                item_name: item.item_name,
                item_name_tr: item.item_name_tr,
                unit: item.unit,
                qty: 1,
                temp_qty: 1,
                temp_free_qty: "0",
                additional_tax: "0",
                qty_type: item.qty_type,
                tray_id: item.tray_no,
                barcode: item.barcode,
                temp_cost: item.cost,
                cost: item.cost,
                buying_cost: item.buying_cost,
                disc_per: item.disc_per,
                disc_val: item.disc_val,

                qty_stock: item.qty_stock,
                alter_unit: item.alter_unit,
                alter_unit_fact: item.alter_unit_fact,
                tax_per: item.tax_per,//taxData[0].tax,
                expiry_days: item.expiry_days,
                unit_identity: 0,
                state_no: "00",
                temp_free_qty: "0",
                tax_class_no: item.tax_class_no,
                tax_inclusive: item.tax_inclusive,
                rack_no: item.rack_no,
                var_supp_no: item.var_supp_no,
                var_buying_cost: item.var_buying_cost,
                var_mrp: item.var_mrp,
                var_batch_no: item.var_batch_no,
                var_man_date: item.var_man_date,
                var_expiry_date: item.var_expiry_date,

                cess_qty: item.cess_qty,
                cess_qty_amount: item.cess_qty_amount,
                cess_per: item.cess_per,
                sgst_per: item.sgst_per,
                cgst_per: item.cgst_per,
                igst_per: item.igst_per,
                cgst_val: 0,
                sgst_val: 0,
                igst_val: 0,
                cess_per_val: 0,
                tax_per_amt: 0,

                var_attribute: item.var_attribute,
                var_stock_attribute: item.var_stock_attribute,
                var_attr_key: item.var_attr_key,
                var_stock_attr_key: item.var_stock_attr_key,

                attr_type1: item.attr_type1,
                attr_value1: "",
                attr_type2: item.attr_type2,
                attr_value2: "",
                attr_type3: item.attr_type3,
                attr_value3: "",
                attr_type4: item.attr_type4,
                attr_value4: "",
                attr_type5: item.attr_type5,
                attr_value5: "",
                attr_type6: item.attr_type6,
                attr_value6: "",
                get_sku:"1"

            };
            page.controls.grdPOItems.createRow(item, currentRow);

            page.controls.grdPOItems.edit(true);
            var rows = page.controls.grdPOItems.getRow({
                item_no: item.item_no
            });
            page.controls.grdPOItems.getAllRows()[parseInt(rows.length) - 1].click();
        }
        page.setAttributes = function (row, billItem) {

            $(billItem.var_stock_attribute.split(",")).each(function (i, item) {
                var value = "-1";
                if (item == "cost") {
                    if (billItem.cost != "" && billItem.cost != null && typeof billItem.cost != "undefined") {
                        value = parseFloat(billItem.buying_cost).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                    }
                }
                if (item == "invoice_no") {
                    if ($$("txtInvoiceNo").value() != "" && $$("txtInvoiceNo").value() != null && typeof $$("txtInvoiceNo").value() != "undefined") {
                        value = $$("txtInvoiceNo").value();
                    }
                }
                if (item == "vendor_no") {
                    if (page.controls.ddlPOVendor.selectedValue() != "" && page.controls.ddlPOVendor.selectedValue() != null && typeof page.controls.ddlPOVendor.selectedValue() != "undefined") {
                        value = page.controls.ddlPOVendor.selectedValue();
                    }
                }
                if (value != "-1" && item != "cost") {
                    if (i == 0) {
                        billItem.attr_value1 = value;
                        $(row).find("input[dataField=attr_value1]").val(billItem.attr_value1).change();
                    }
                    if (i == 1) {
                        billItem.attr_value2 = value;
                        $(row).find("input[dataField=attr_value2]").val(billItem.attr_value2).change();
                    }
                    if (i == 2) {
                        billItem.attr_value3 = value;
                        $(row).find("input[dataField=attr_value3]").val(billItem.attr_value3).change();
                    }
                    if (i == 3) {
                        billItem.attr_value4 = value;
                        $(row).find("input[dataField=attr_value4]").val(billItem.attr_value4).change();
                    }
                    if (i == 4) {
                        billItem.attr_value5 = value;
                        $(row).find("input[dataField=attr_value5]").val(billItem.attr_value5).change();
                    }
                    if (i == 5) {
                        billItem.attr_value6 = value;
                        $(row).find("input[dataField=attr_value6]").val(billItem.attr_value6).change();
                    }
                }
            });
        }
        page.tot_qty = function (item, callback) {
            var qty = 0;
            $(page.controls.grdPOItems.allData()).each(function (j, data) {
                if (item.item_no == data.item_no) {
                    if (!isNaN(data.qty_tostock)) {
                        qty = parseFloat(qty) + parseFloat(data.qty_tostock);
                    }
                }
            });
            callback(qty);
        }
        page.view = {
            searchInput: function () {
                return page.controls.txtPOSearch.val();
            },
            searchResult: function (data) {
                page.controls.grdPOResult.width("120%");
                page.controls.grdPOResult.height("430px");
                page.controls.grdPOResult.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "", 'width': "0px", 'dataField': "po_no",visible:false },
                        { 'name': "PO No", 'rlabel': 'PO No', 'width': "100px", 'dataField': "po_id" },
                        { 'name': "Supplier", 'rlabel': 'Supplier', 'width': "150px", 'dataField': "vendor_name" },
                        { 'name': "State", 'rlabel': 'Order State', 'width': "100px", 'dataField': "state_text" },
                        { 'name': "Expected Date", 'rlabel': 'Expected Date', 'width': "150px", 'dataField': "expected_date" },
                        { 'name': "Delivered Date", 'rlabel': 'Delivered Date', 'width': "150px", 'dataField': "delivered_date" },
                        { 'name': "Due Date", 'rlabel': 'Due Date', 'width': "150px", 'dataField': "due_date" },
                        { 'name': "Amount", 'rlabel': 'Amount', 'width': "150px", 'dataField': "total_amount", visible: ($$("ddlState").selectedValue() != "911") },
                        { 'name': "Paid", 'rlabel': 'Paid', 'width': "100px", 'dataField': "total_paid_amount", visible: ($$("ddlState").selectedValue() != "911") },
                        { 'name': "Balance", 'rlabel': 'Balance', 'width': "100px", 'dataField': "balance", visible: ($$("ddlState").selectedValue() != "911") },
                        { 'name': "Settlement Amount", 'width': "130px", 'dataField': "total_return_amount", visible: ($$("ddlState").selectedValue() != "910") },
                        { 'name': "Settlement Paid", 'width': "120px", 'dataField': "total_return_paid_amount", visible: ($$("ddlState").selectedValue() != "910") },
                        { 'name': "Settlement Balance", 'width': "120px", 'dataField': "return_balance", visible: ($$("ddlState").selectedValue() != "910") },
                       // { 'name': "Ordered", 'width': "70px", 'dataField': "ordered_date" },
                      //  { 'name': "Expected", 'width': "80px", 'dataField': "expected_date" },
                       // { 'name': "Delivered", 'width': "70px", 'dataField': "delivered_date" },
                        { 'name': "", 'width': "0px", 'dataField': "jrn_id" }

                    ]
                });
                page.controls.grdPOResult.selectionChanged = function (rowList, dataList) {
                    page.events.grdPOResult_select(dataList);
                }
                page.controls.grdPOResult.rowBound = function (row, item) {
                    if (item.state_text == "Created" || item.state_text == "Ordered" || item.state_text == "Confirmed") {
                        row[0].style.color = "#368605";
                        $(row[0]).css("font-weight", "bold")
                    }
                    else if (item.state_text == "Cancel" || item.state_text == "Removed") {
                        row[0].style.color = "red";
                        $(row[0]).css("font-weight", "bold")
                    }
                    else {
                        if (parseFloat(Math.round(item.total_return_amount)) == parseFloat(item.total_amount)) {
                            row[0].style.color = "red";
                            $(row[0]).css("font-weight", "bold")
                        }
                        else if (parseFloat(item.total_return_amount) > 0) {
                            row[0].style.color = "orange";
                            $(row[0]).css("font-weight", "bold")
                        }
                        else {
                            row[0].style.color = "#368605";
                            $(row[0]).css("font-weight", "bold")
                        }
                    }
                }
                page.controls.grdPOResult.dataBind(data);
            },
            purchaseHistory: function () {
                var repInput = {
                    viewMode: "Standard",
                    fromDate: '',
                    toDate: '',
                    vendor_no: page.controls.ddlPOVendor.selectedValue(),
                    item_no: '',
                    bill_type: '',
                    state_no: '',
                    store_no: ''
                }
                page.dynaReportService.getPurchaseReport(repInput, function (data) {
                    var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                    var poSummary = { tot_ret: 0, tot_pay: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                    var bill_no = 0;
                    $(data).each(function (i, item) {
                        if (item.bill_no != bill_no) {
                            if (item.bill_type == "Purchase") {
                                salSummary.tot_sale = salSummary.tot_sale + parseFloat(item.total);
                                salSummary.tot_pay = salSummary.tot_pay + parseFloat(item.total_paid_amount);
                            }
                            else {
                                salSummary.tot_ret = salSummary.tot_ret + parseFloat(item.total);
                                salSummary.tot_ret_pay = salSummary.tot_ret_pay + parseFloat(item.total_paid_amount);
                            }

                            if (item.po_no == page.currentPO.po_no) {
                                if (item.bill_type == "Purchase") {
                                    poSummary.tot_sale = item.total;
                                    poSummary.tot_pay = item.total_paid_amount;
                                    poSummary.tot_bal = parseFloat(poSummary.tot_sale) - parseFloat(poSummary.tot_pay);
                                }
                                else {
                                    poSummary.tot_ret = poSummary.tot_ret + parseFloat(item.total);
                                    poSummary.tot_ret_pay = poSummary.tot_ret_pay + parseFloat(item.total_paid_amount);
                                    poSummary.tot_ret_bal = parseFloat(poSummary.tot_ret) - parseFloat(poSummary.tot_ret_pay);
                                }

                            }
                            bill_no = item.bill_no;
                        }
                    });
                    page.controls.lblTotalSales.html(parseFloat(salSummary.tot_sale).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                    page.controls.lblTotalPayment.html(parseFloat(salSummary.tot_pay).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                    page.controls.lblTotalReturns.html(parseFloat(salSummary.tot_ret).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                    page.controls.lblTotalReturnsPayment.html(parseFloat(salSummary.tot_ret_pay).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                    page.controls.lblTotalReturnsBalance.html(parseFloat(parseFloat(salSummary.tot_ret) - parseFloat(salSummary.tot_ret_pay)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                    page.controls.lblPendingPayment.html(parseFloat(parseFloat(page.controls.lblTotalSales.html()) - parseFloat(page.controls.lblTotalPayment.html())).toFixed(CONTEXT.COUNT_AFTER_POINTS));

                    page.controls.lblTotal.value(parseFloat(poSummary.tot_sale).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                    page.controls.lblTotalCopy.value(parseFloat(poSummary.tot_sale).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                    page.controls.lblTotalAmtPaid.html(isNaN(parseFloat(poSummary.tot_pay)) ? 0 : parseFloat(poSummary.tot_pay).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                    page.controls.lblTotalAmtRemaining.value(parseFloat(poSummary.tot_bal).toFixed(CONTEXT.COUNT_AFTER_POINTS));

                    page.controls.lblReturns.html(parseFloat(poSummary.tot_ret).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                    page.controls.lblReturnsPaid.value(parseFloat(poSummary.tot_ret_pay).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                    page.controls.lblReturnsBalance.value(parseFloat(poSummary.tot_ret_bal).toFixed(CONTEXT.COUNT_AFTER_POINTS));

                    if (parseFloat($$("lblReturns").html()) != 0) {
                        $$("btnCompleteReturnPOItem").hide();
                        page.controls.btnCompleteReturnPOItem.selectedObject.prev().hide();
                    }

                });
            },
            selectedPO: function (item) {
                if (item) {
                    page.controls.lblPONo.html(item.po_no);
                    page.controls.lblTempPONo.html(item.po_id);
                    page.controls.lblPOState.html(item.state_text);
                    page.controls.lblJournalId.html(item.jrn_id);

                    page.controls.ddlPOVendor.selectedValueAppend(item.vendor_no, item.vendor_name);
                    page.controls.lblPOVendorAddress.html(item.vendor_address);
                    page.controls.lblPOVendorPhone.html(item.vendor_phone);
                    page.controls.lblPOVendorEmail.html(item.vendor_email);
                    page.controls.lblPOVendorGst.html(item.gst_no);
                    // page.controls.txtInvoiceNo.text(item.invoice_no);
                    $$("txtInvoiceNo").value(item.invoice_no);
                    page.controls.lblPOBillNo.value(item.po_bill_no);
                    page.controls.lblTempPOBillNo.value(item.bill_code);
                    page.controls.lblPOOrderedDate.html(item.ordered_date);
                    page.controls.lblPOConfirmedDate.html(item.confirmed_date);
                    page.controls.dsPOExpectedDate.setDate(dbDate(item.expected_date));
                    page.controls.dsPODueDate.setDate(dbDate(item.due_date));
                    page.controls.lblPODeliveredDate.html(item.delivered_date);
                    page.controls.lblTotalAmtPaid.html(item.total_paid_amount);
                    var remainingAmount = page.controls.lblTotal.value() - page.controls.lblTotalAmtPaid.html();
                    page.controls.lblTotalAmtRemaining.value(remainingAmount);

                    //page.controls.lblTotal.value(parseInt(total));


                    page.view.purchaseHistory();


                    page.selectedPO = item;


                    page.purchaseService.getInvoiceBillDetails(item.po_no, function (data) {
                        $$("grdTransactions").height("80px");
                        $$("grdTransactions").setTemplate({
                            selection: "Single",
                            columns: [
                                { 'name': "Pay Id", 'rlabel': "Pay Id", 'width': "80px", 'dataField': "pay_id" },
                                { 'name': "Pay Date", 'rlabel': "Pay Date", 'width': "120px", 'dataField': "pay_date" },
                                { 'name': "Amount", 'rlabel': "Amount", 'width': "120px", 'dataField': "amount" },
                                { 'name': "Pay Type", 'rlabel': "Pay Type", 'width': "120px", 'dataField': "pay_type" },
                                { 'name': "Collector", 'rlabel': "Collector", 'width': "120px", 'dataField': "collector_name" },
                            ]
                        });
                        page.controls.grdTransactions.dataBind(data);
                    });
                    page.purchaseBillService.getBillByPO(item.po_no, function (data) {
                        $$("grdBillTransactions").height("80px");
                        $$("grdBillTransactions").setTemplate({
                            selection: "Single",
                            columns: [
                                { 'name': "", 'width': "0px", 'dataField': "bill_no",visible:false },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "80px", 'dataField': "bill_code" },
                                { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "120px", 'dataField': "bill_date" },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "120px", 'dataField': "bill_type" },
                                { 'name': "Amount", 'rlabel': 'Amount', 'width': "120px", 'dataField': "total" },
                                { 'name': "Paid", 'rlabel': 'Paid', 'width': "120px", 'dataField': "paid" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "120px", 'dataField': "balance" },
                                { 'name': "Action", 'rlabel': 'Action', 'width': "120px", 'dataField': "bill_no", editable: false, itemTemplate: "<input type='button' class='grid-button' value='' action='Open' style='    border: none;    background-color: transparent;    background-image: url(Open_file.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' /> <input type='button' title='Jasper Print'  class='grid-button' value='' action='PrintJasper' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/print.png);    background-size: contain;    width: 25px;    height: 25px;;margin-right:10px' />  " }
                            ]
                        });
                        page.controls.grdBillTransactions.rowCommand = function (action, actionElement, rowId, row, rowData) {
                            if (action == "Open") {
                                var data = {
                                    bill_no: $(row).find("[datafield=bill_no]").find("div").html(),
                                    bill_type: "Purchase"
                                }
                                page.events.btnOpenBill_click(data);
                            }
                            if (action == "PrintJasper") {
                                page.PrintBillType = rowData.bill_type;
                                page.PrintBillNo = rowData.bill_no;
                                page.controls.pnlPrintingPopup.open();
                                page.controls.pnlPrintingPopup.title("Select Export Type");
                                page.controls.pnlPrintingPopup.width("500");
                                page.controls.pnlPrintingPopup.height("200");
                            }
                        }
                        page.controls.grdBillTransactions.dataBind(data);
                    });
                }
                return page.selectedPO;
            },
            selectedPOItems: function (data) {
                page.currentPOItems = data;

                if (page.currentPO.state_text == "Created") {
                    page.controls.grdPOItems.width("100%");
                    page.controls.grdPOItems.height("auto");
                    page.controls.grdPOItems.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Sl No", 'rlabel': "Sl No", 'width': "70px", 'dataField': "sl_no" },
                            { 'name': "Bar Code", 'rlabel': "Barcode", 'width': "150px", 'dataField': "barcode", visible: CONTEXT.SHOW_BARCODE },
                            { 'name': "Item Name", 'rlabel': "Item Name", 'width': "120px", 'dataField': "item_name", editable: false },
                            //{ 'name': "Item No", 'width': "100px", 'dataField': "item_no", editable: false },
                            { 'name': "Item No", 'rlabel': "Item No", 'width': "100px", 'dataField': "item_code", editable: false },
                            { 'name': "Rack No", 'rlabel': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                            { 'name': "In Stock", 'rlabel': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                            { 'name': "", 'width': "0px", 'dataField': "qty", },
                            { 'name': "Qty", 'rlabel': "Qty", 'width': "70px", 'dataField': "temp_qty", editable: page.currentPO.state_text == "Created", },
                            //{ 'name': "Free Item", 'width': "80px", 'dataField': "free_item", editable: page.currentPO.state_text == "Created", },
                            //{ 'name': "Unit", 'width': "60px", 'dataField': "unit", editable: false },
                            { 'name': "Unit", 'rlabel': "Unit", 'width': "80px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                            { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: page.currentPO.state_text == "Created" },
                            { 'name': "Free Qty", 'rlabel': "Free Qty", 'width': "100px", 'dataField': "temp_free_qty", editable: page.currentPO.state_text == "Created", visible: CONTEXT.SHOW_FREE },
                            { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                            { 'name': "", 'width': "1px", 'dataField': "tray_id", visible: false },
                          //  { 'name': "GST%", 'width': "60px", 'dataField': "tax_per", editable: false,visble:false },
                            { 'name': "Action", 'rlabel': "Action", 'width': "60px", 'dataField': "item_no", editable: false, visible: page.currentPO.state_text == "Created", itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='    border: none;    background-color: transparent;    background-image: url(cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" },
                        { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                        { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                        { 'name': "", 'width': "0px", 'dataField': "variation_data" },

                        { 'name': "", 'width': "0px", 'dataField': "var_attribute", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attribute", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_attr_key", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attr_key", visible: false },

                        { 'name': "", 'width': "0px", 'dataField': "attr_type1", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type2", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type3", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type4", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type5", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type6", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_attr_key", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attr_key", visible: false },
                        ]
                    });
                }
                else if (page.currentPO.state_text == "Ordered") {
                    page.controls.grdPOItems.width("2000px");
                    page.controls.grdPOItems.height("auto");
                    page.controls.grdPOItems.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Sl No", 'rlabel': "Sl No", 'width': "70px", 'dataField': "sl_no" },
                            { 'name': "Bar Code", 'rlabel': "Barcode", 'width': "150px", 'dataField': "barcode", visible: CONTEXT.SHOW_BARCODE },
                            { 'name': "Item Name", 'rlabel': "Item Name", 'width': "120px", 'dataField': "item_name", editable: false },
                            //{ 'name': "Item No", 'width': "100px", 'dataField': "item_no", editable: false },
                            { 'name': "Item No", 'rlabel': "Item No", 'width': "100px", 'dataField': "item_code", editable: false },
                            { 'name': "Rack No", 'rlabel': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                            { 'name': "In Stock", 'rlabel': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                            { 'name': "", 'width': "0px", 'dataField': "qty", editable: page.currentPO.state_text == "Created", },
                            { 'name': "Qty", 'rlabel': "Qty", 'width': "70px", 'dataField': "temp_qty", editable: page.currentPO.state_text == "Created", },
                            //{ 'name': "Free Item", 'width': "80px", 'dataField': "free_item", editable: page.currentPO.state_text == "Created", },
                            { 'name': "", 'width': "0px", 'dataField': "qty_stock", editable: false },
                            { 'name': "Tray", 'rlabel': "Tray", 'width': "80px", 'dataField': "tray_count", editable: page.currentPO.state_text == "Created", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                            { 'name': "Unit", 'rlabel': "Unit", 'width': "60px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },//editable: false },
                            { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: page.currentPO.state_text == "Created" },
                            { 'name': "Free Qty", 'rlabel': "Free Qty", 'width': "100px", 'dataField': "temp_free_qty", editable: page.currentPO.state_text == "Created", visible: CONTEXT.SHOW_FREE },

                            { 'name': "Cost", 'rlabel': "Cost", 'width': "70px", 'dataField': "cost", editable: page.currentPO.state_text == "Ordered" },
                           // { 'name': "MRP", 'width': "70px", 'dataField': "mrp", editable: page.currentPO.state_text == "Ordered", visible: CONTEXT.ENABLE_MRP },
                            { 'name': "Disc %", 'rlabel': "Disc %", 'width': "70px", 'dataField': "disc_per", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Disc Value", 'rlabel': "Disc Value", 'width': "80px", 'dataField': "disc_val", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "GST%", 'rlabel': "GST", 'width': "60px", 'dataField': "tax_per", editable: false },
                            { 'name': "Net Rate", 'rlabel': "Net Rate", 'width': "100px", 'dataField': "net_rate", editable: false },
                            { 'name': "Total", 'rlabel': "Total", 'width': "90px", 'dataField': "total_price" },//, editable: false },
                            { 'name': "Buying Cost", 'rlabel': "Buying Cost", 'width': "90px", 'dataField': "buying_cost" },

                            { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                            { 'name': "Action", 'rlabel': "Action", 'width': "60px", 'dataField': "item_no", editable: false, visible: page.currentPO.state_text == "Created", itemTemplate: "<input type='button' value='Delete' action='Delete' />" },
                            { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                            { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                            { 'name': "", 'width': "0px", 'dataField': "variation_data" },
                            { 'name': "", 'width': "0px", 'dataField': "var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "free_var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "var_attribute", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attribute", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_attr_key", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attr_key", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "attr_type1", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type2", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type3", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type4", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type5", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type6", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_attr_key", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attr_key", visible: false },
                        ]
                    });
                }
                else if (page.damageMode == true) {
                    page.controls.grdPOItems.width("2550px");
                    page.controls.grdPOItems.height("auto");
                    page.controls.grdPOItems.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Sl No", 'rlabel': "Sl No", 'width': "70px", 'dataField': "sl_no" },
                            { 'name': "Bar Code", 'rlabel': "Barcode", 'width': "150px", 'dataField': "barcode", visible: CONTEXT.SHOW_BARCODE },
                            { 'name': "Item Name", 'rlabel': "Item Name", 'width': "160px", 'dataField': "item_name" },
                            //{ 'name': "Item No", 'width': "100px", 'dataField': "item_no" },
                            { 'name': "Item No", 'rlabel': "Item No", 'width': "100px", 'dataField': "item_code", editable: false },
                            { 'name': "Rack No", 'rlabel': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                            { 'name': "In Stock", 'rlabel': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                            { 'name': "", 'width': "0px", 'dataField': "qty" },
                            { 'name': "Qty", 'rlabel': "Qty", 'width': "70px", 'dataField': "temp_qty", editable: page.currentPO.state_text == "Created", },
                            { 'name': "", 'width': "100px", 'dataField': "free_qty", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Free Qty", 'rlabel': "Free Qty", 'width': "100px", 'dataField': "temp_free_qty", editable: page.currentPO.state_text == "Ordered", visible: CONTEXT.SHOW_FREE },
                            //{ 'name': "Free Item", 'width': "80px", 'dataField': "free_item", editable: page.currentPO.state_text == "Created", },
                            { 'name': "Delivered", 'rlabel': "Delivered", 'width': "100px", 'dataField': "qty_delivered" },

                            { 'name': "Damage", 'rlabel': "Damage", 'width': "100px", 'dataField': "qty_damaged", editable: page.currentPO.state_text == "Confirmed" },
                            { 'name': "Stocked", 'rlabel': "Stocked", 'width': "100px", 'dataField': "qty_instock" },
                            { 'name': "Cancelled", 'rlabel': "Cancelled", 'width': "100px", 'dataField': "qty_returned" },
                            { 'name': "Tray", 'rlabel': "Tray", 'width': "80px", 'dataField': "tray_count", visible: CONTEXT.ENABLE_MODULE_TRAY },

                            { 'name': "Unit", 'rlabel': "Unit", 'width': "60px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                            { 'name': "Cost", 'rlabel': "Cost", 'width': "70px", 'dataField': "cost" },
                            { 'name': "Disc %", 'rlabel': "Disc %", 'width': "70px", 'dataField': "disc_per" },
                            { 'name': "Disc Value", 'rlabel': "Disc Value", 'width': "80px", 'dataField': "disc_val" },
                            { 'name': "GST%", 'rlabel': "GST", 'width': "60px", 'dataField': "tax_per" },
                            { 'name': "Total", 'rlabel': "Total", 'width': "90px", 'dataField': "total_price" },
                            { 'name': "Net Rate", 'rlabel': "Net Rate", 'width': "100px", 'dataField': "net_rate", editable: false },
                            { 'name': "Buying Cost", 'rlabel': "Buying Cost", 'width': "90px", 'dataField': "buying_cost" },
                            { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                            { 'name': "", 'width': "1px", 'dataField': "tray_id", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                            { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                            { 'name': "", 'width': "0px", 'dataField': "variation_data" },
                            { 'name': "", 'width': "0px", 'dataField': "var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "free_var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "var_attribute", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attribute", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_attr_key", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attr_key", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "attr_type1", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type2", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type3", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type4", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type5", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type6", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_attr_key", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attr_key", visible: false },
                        ]
                    });
                }
                else if (page.receiveMode == true) {
                    page.controls.grdPOItems.width("2550px");
                    page.controls.grdPOItems.height("auto");
                    page.controls.grdPOItems.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Sl No", 'rlabel': "Sl No", 'width': "70px", 'dataField': "sl_no" },
                            { 'name': "Bar Code", 'rlabel': "Barcode", 'width': "150px", 'dataField': "barcode", visible: CONTEXT.SHOW_BARCODE },
                            { 'name': "Item Name", 'rlabel': "Item Name", 'width': "160px", 'dataField': "item_name" },
                            //{ 'name': "Item No", 'width': "100px", 'dataField': "item_no" },
                            { 'name': "Item No", 'rlabel': "Item No", 'width': "100px", 'dataField': "item_code", editable: false },
                            { 'name': "Rack No", 'rlabel': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                            { 'name': "In Stock", 'rlabel': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                            { 'name': "", 'width': "0px", 'dataField': "qty" },
                            { 'name': "Qty", 'rlabel': "Qty", 'width': "70px", 'dataField': "temp_qty", },
                            { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Free Qty", 'rlabel': "Free Qty", 'width': "100px", 'dataField': "temp_free_qty", editable: page.currentPO.state_text == "Ordered", visible: CONTEXT.SHOW_FREE },
                            //{ 'name': "Free Item", 'width': "80px", 'dataField': "free_item", editable: page.currentPO.state_text == "Created", },
                            { 'name': "Delivered", 'rlabel': "Delivered", 'width': "100px", 'dataField': "qty_delivered" },

                            { 'name': "Receive", 'rlabel': "Receive", 'width': "100px", 'dataField': "qty_received", editable: page.currentPO.state_text == "Confirmed" },
                            { 'name': "Stocked", 'rlabel': "Stocked", 'width': "100px", 'dataField': "qty_instock" },
                            { 'name': "Cancelled", 'rlabel': "Cancelled", 'width': "100px", 'dataField': "qty_returned" },
                            { 'name': "Tray", 'rlabel': "Tray", 'width': "80px", 'dataField': "tray_count", visible: CONTEXT.ENABLE_MODULE_TRAY },

                            { 'name': "Unit", 'rlabel': "Unit", 'width': "60px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                            { 'name': "Cost", 'rlabel': "Cost", 'width': "70px", 'dataField': "cost" },
                            { 'name': "Disc %", 'rlabel': "Disc %", 'width': "70px", 'dataField': "disc_per" },
                            { 'name': "Disc Value", 'rlabel': "Disc Value", 'width': "80px", 'dataField': "disc_val" },
                            { 'name': "GST%", 'rlabel': "GST", 'width': "60px", 'dataField': "tax_per" },
                            { 'name': "Total", 'rlabel': "Total", 'width': "90px", 'dataField': "total_price" },
                            { 'name': "Net Rate", 'rlabel': "Net Rate", 'width': "100px", 'dataField': "net_rate", editable: false },
                            { 'name': "Buying Cost", 'rlabel': "Buying Cost", 'width': "90px", 'dataField': "buying_cost" },
                            { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                            { 'name': "", 'width': "1px", 'dataField': "tray_id", visible: false },
                            { 'name': "", 'width': "1px", 'dataField': "var_cost", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                            { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                            { 'name': "", 'width': "0px", 'dataField': "variation_data" },
                            { 'name': "", 'width': "0px", 'dataField': "var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "free_var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "var_attribute", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attribute", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_attr_key", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attr_key", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "attr_type1", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type2", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type3", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type4", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type5", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type6", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_attr_key", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attr_key", visible: false },
                        ]
                    });
                }
                else if (page.trayMode == true) {
                    page.controls.grdPOItems.width("2000px");
                    page.controls.grdPOItems.height("auto");
                    page.controls.grdPOItems.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Sl No", 'rlabel': "Sl No", 'width': "70px", 'dataField': "sl_no" },
                            { 'name': "Bar Code", 'rlabel': "Barcode", 'width': "150px", 'dataField': "barcode", visible: false },
                            { 'name': "Item Name", 'rlabel': "Item Name", 'width': "160px", 'dataField': "item_name" },
                            //{ 'name': "Item No", 'width': "100px", 'dataField': "item_no" },
                            { 'name': "Item No", 'rlabel': "Item No", 'width': "100px", 'dataField': "item_code", editable: false },
                            { 'name': "Rack No", 'rlabel': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: false },
                            { 'name': "In Stock", 'rlabel': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                            { 'name': "", 'width': "0px", 'dataField': "qty" },
                            { 'name': "Qty", 'rlabel': "Qty", 'width': "70px", 'dataField': "temp_qty", },
                            { 'name': "", 'width': "100px", 'dataField': "free_qty", editable: page.currentPO.state_text == "Ordered", visible: false },
                            { 'name': "Free Qty", 'rlabel': "Free Qty", 'width': "100px", 'dataField': "temp_free_qty", editable: page.currentPO.state_text == "Ordered", visible: CONTEXT.SHOW_FREE },
                            //{ 'name': "Free Item", 'width': "80px", 'dataField': "free_item", editable: page.currentPO.state_text == "Created", },
                            { 'name': "Delivered", 'rlabel': "Delivered", 'width': "100px", 'dataField': "qty_delivered" },

                            { 'name': "Stocked", 'rlabel': "Stocked", 'width': "100px", 'dataField': "qty_instock" },
                            { 'name': "Cancelled", 'rlabel': "Cancelled", 'width': "100px", 'dataField': "qty_returned" },
                            { 'name': "Tray", 'rlabel': "Tray", 'width': "80px", 'dataField': "tray_count", visible: CONTEXT.ENABLE_MODULE_TRAY },
                            { 'name': "Receive Tray", 'rlabel': "Receive Tray", 'width': "100px", 'dataField': "tray_received", editable: true, visible: CONTEXT.ENABLE_MODULE_TRAY },

                            { 'name': "Unit", 'rlabel': "Unit", 'width': "60px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                            { 'name': "Cost", 'rlabel': "Cost", 'width': "70px", 'dataField': "cost", visible: false },
                            { 'name': "Disc %", 'rlabel': "Disc %", 'width': "70px", 'dataField': "disc_per", visible: false },
                            { 'name': "Disc Value", 'rlabel': "Disc Value", 'rlabel': "Unit", 'width': "80px", 'dataField': "disc_val", visible: false },
                            { 'name': "GST%", 'rlabel': "GST", 'width': "60px", 'dataField': "tax_per", visible: false },
                            { 'name': "Total", 'rlabel': "Total", 'width': "90px", 'dataField': "total_price", visible: false },
                            { 'name': "Net Rate", 'rlabel': "Net Rate", 'width': "100px", 'dataField': "net_rate", editable: false },
                            { 'name': "Buying Cost", 'rlabel': "Buying Cost", 'width': "90px", 'dataField': "buying_cost", visible: false },
                            { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                            { 'name': "", 'width': "1px", 'dataField': "tray_id", visible: false },
                            { 'name': "", 'width': "1px", 'dataField': "var_cost", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                            { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                            { 'name': "", 'width': "0px", 'dataField': "variation_data" },
                            { 'name': "", 'width': "0px", 'dataField': "var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "free_var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "var_attribute", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attribute", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_attr_key", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attr_key", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "attr_type1", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type2", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type3", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type4", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type5", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type6", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_attr_key", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attr_key", visible: false },
                        ]
                    });
                }
                else if (page.stockMode == true) {
                    page.controls.grdPOItems.width("4350px");
                    page.controls.grdPOItems.height("auto");
                    page.controls.grdPOItems.setTemplate({
                        selection: "Single", sort: false,
                        columns: [
                            { 'name': "Sl No", 'rlabel': "Sl No", 'width': "70px", 'dataField': "sl_no" },
                            { 'name': "Bar Code", 'rlabel': "Barcode", 'width': "150px", 'dataField': "barcode", visible: false },
                            { 'name': "Item Name", 'rlabel': "Item Name", 'width': "160px", 'dataField': "item_name" },
                            { 'name': "Item No", 'width': "0px", 'dataField': "item_no",visible:false },
                            { 'name': "Item No", 'rlabel': "Item No", 'width': "100px", 'dataField': "item_code", editable: false },
                            { 'name': "Rack No", 'rlabel': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: false },
                            { 'name': "In Stock", 'rlabel': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                            { 'name': "", 'width': "0px", 'dataField': "qty" },
                            { 'name': "Qty", 'rlabel': "Qty", 'width': "70px", 'dataField': "temp_qty", },
                            { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Free Qty", 'rlabel': "Free Qty", 'width': "100px", 'dataField': "temp_free_qty", editable: page.currentPO.state_text == "Ordered", visible: CONTEXT.SHOW_FREE },
                            //{ 'name': "Free Item", 'width': "80px", 'dataField': "free_item",},
                            { 'name': "Delivered", 'rlabel': "Delivered", 'width': "100px", 'dataField': "qty_delivered" },
                            { 'name': "Stocked", 'rlabel': "Stocked", 'width': "100px", 'dataField': "qty_instock" },
                            { 'name': "Cancelled", 'rlabel': "Cancelled", 'width': "100px", 'dataField': "qty_returned" },
                            { 'name': "Attributes", 'rlabel': 'Attributes', 'width': "500px", itemTemplate: "<div  id='Attributes'></div>" },

                            //{ 'name': "Variation", 'width': "120px", 'dataField': "variation_name", editable: page.currentPO.state_text == "Confirmed" || page.currentPO.state_text == "Delivered", itemTemplate: "<input placeholder='Variation Name' controlId='txtVariationName' control='purchaseOrder.autoCompleteList' />" },
                            { 'name': "To Stock", 'rlabel': "To Stock", 'width': "100px", 'dataField': "qty_tostock", editable: page.currentPO.state_text == "Confirmed" || page.currentPO.state_text == "Delivered" },
                            { 'name': "", 'width': "30px", itemTemplate: "<div  id='stockDetail'></div>" },
                            { 'name': "Prev" + CONTEXT.SALE_PRICE_NAME, 'rlabel': "Prev Selling", 'width': "130px", 'dataField': "pre_selling_price", editable: false },
                            { 'name': "Profit %", 'rlabel': "Profit %", 'width': "120px", 'dataField': "profit", editable: page.currentPO.state_text == "Delivered" || page.currentPO.state_text == "Confirmed", headerTemplate: "<div><span style='width:100px;'>" + WEBUI.LANG[CONTEXT.CurrentLanguage]["Profit %"] + "</span><input type='text' id='profitPrice' style='width:100px;margin-top:3px;' placeholder='" + WEBUI.LANG[CONTEXT.CurrentLanguage]["Profit %"] + "'></div>" },
                            { 'name': CONTEXT.SALE_PRICE_NAME, 'rlabel': "Selling Price", 'width': "120px", 'dataField': "selling_price", editable: page.currentPO.state_text == "Delivered" || page.currentPO.state_text == "Confirmed" },

                            //Rate Configuration
                           { 'name': "Pre" + CONTEXT.ALTER_PRICE_1_LABEL_NAME, 'rlabel': 'Pre Rate B', 'width': "150px", 'dataField': "pre_alter_price_1", editable: false, visible: CONTEXT.ENABLE_ALTER_PRICE_1 },
                           { 'name': "Price1%", 'rlabel': 'Price1%', 'width': "120px", 'dataField': "price1", editable: true, visible: CONTEXT.ENABLE_ALTER_PRICE_1, headerTemplate: "<div><span style='width:100px;'>" + WEBUI.LANG[CONTEXT.CurrentLanguage]["Price1%"] + "</span><input type='text' id='profitPrice1' style='width:120px;margin-top:3px;' placeholder='" + WEBUI.LANG[CONTEXT.CurrentLanguage]["Price1%"] + "'></div>" },
                           { 'name': "New" + CONTEXT.ALTER_PRICE_1_LABEL_NAME, 'rlabel': 'New Rate B', 'width': "120px", 'dataField': "alter_price_1", editable: true, visible: CONTEXT.ENABLE_ALTER_PRICE_1 },
                           { 'name': "Pre" + CONTEXT.ALTER_PRICE_2_LABEL_NAME, 'rlabel': 'Pre Rate C', 'width': "150px", 'dataField': "pre_alter_price_2", editable: false, visible: CONTEXT.ENABLE_ALTER_PRICE_2 },
                           { 'name': "Price2%", 'rlabel': 'Price2%', 'width': "120px", 'dataField': "price2", editable: true, visible: CONTEXT.ENABLE_ALTER_PRICE_2, headerTemplate: "<div><span style='width:100px;'>" + WEBUI.LANG[CONTEXT.CurrentLanguage]["Price2%"] + "</span><input type='text' id='profitPrice2' style='width:120px;margin-top:3px;' placeholder='" + WEBUI.LANG[CONTEXT.CurrentLanguage]["Price2%"] + "'></div>" },
                           { 'name': "New" + CONTEXT.ALTER_PRICE_2_LABEL_NAME, 'rlabel': 'New Rate C', 'width': "120px", 'dataField': "alter_price_2", editable: true, visible: CONTEXT.ENABLE_ALTER_PRICE_2 },
                           { 'name': "Pre Price Limit", 'rlabel': 'Pre Price Limit', 'width': "150px", 'dataField': "pre_price_limit", editable: false, visible: CONTEXT.ENABLE_PRICE_LIMIT },
                           { 'name': "New Price Limit", 'rlabel': 'New Price Limit', 'width': "150px", 'dataField': "price_limit", editable: true, visible: CONTEXT.ENABLE_PRICE_LIMIT },

                            { 'name': "Unit", 'rlabel': 'Unit', 'width': "60px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                            { 'name': "Cost", 'rlabel': 'Cost', 'width': "70px", 'dataField': "cost" },
                            { 'name': "Disc %", 'rlabel': 'Disc %', 'width': "70px", 'dataField': "disc_per" },
                            { 'name': "Disc Value", 'rlabel': 'Disc Value', 'width': "80px", 'dataField': "disc_val" },
                            { 'name': "Tax%", 'rlabel': 'GST', 'width': "60px", 'dataField': "tax_per" },
                            { 'name': "Total", 'rlabel': 'Total', 'width': "90px", 'dataField': "total_price" },
                            { 'name': "Net Rate", 'rlabel': 'Net Rate', 'width': "100px", 'dataField': "net_rate", editable: false },
                            { 'name': "Buying Cost", 'rlabel': 'Buying Cost', 'width': "90px", 'dataField': "buying_cost" },
                            { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                            { 'name': "", 'width': "1px", 'dataField': "tray_id", visible: false },
                            { 'name': "", 'width': "1px", 'dataField': "var_cost", editable: true, },
                            { 'name': "", 'width': "", 'dataField': "free_variation_name", editable: false, visible: false },
                           { 'name': "", 'width': "", 'dataField': "free_variation_id", editable: false, visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                           { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                           { 'name': "", 'width': "0px", 'dataField': "variation_data" },
                           { 'name': "", 'width': "0px", 'dataField': "var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "free_var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "var_attribute", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attribute", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_attr_key", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attr_key", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "attr_type1", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type2", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type3", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type4", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type5", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type6", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_attr_key", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attr_key", visible: false },
                        ]
                    });

                    setTimeout(function () {
                        $$("grdPOItems").selectedObject.find(".grid_header div[id=profitPrice]").on('keyup', function (e) {
                            if (e.which == 13) {
                                doneProfitCalculate();
                                if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                                    $$("grdPOItems").selectedObject.find(".grid_header div[id=profitPrice1]").focus().select();
                                }
                            }
                        });
                        $$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice]").on('focusout', function (e) {
                            doneProfitCalculate();
                        });
                        $$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice1]").on('keyup', function (e) {
                            if (e.which == 13) {
                                donePrice1ProfitCalculate();
                                if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                                    $$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice2]").focus().select();
                                }
                            }
                        });
                        $$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice1]").on('focusout', function (e) {
                            donePrice1ProfitCalculate();
                        });
                        $$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice2]").on('keyup', function (e) {
                            if (e.which == 13) {
                                donePrice2ProfitCalculate();
                            }
                        });
                        $$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice2]").on('focusout', function (e) {
                            donePrice2ProfitCalculate();
                        });
                    }, 1000);
                }
                else if (page.currentPO.state_text == "Confirmed" || page.currentPO.state_text == "Delivered" || page.currentPO.state_text == "Stocked") {
                    page.controls.grdPOItems.width("2250px");
                    page.controls.grdPOItems.height("auto");
                    page.controls.grdPOItems.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Sl No", 'rlabel': "Sl No", 'width': "70px", 'dataField': "sl_no" },
                            { 'name': "Bar Code", 'rlabel': "Barcode", 'width': "150px", 'dataField': "barcode", visible: CONTEXT.SHOW_BARCODE },
                            { 'name': "Item Name", 'rlabel': "Item Name", 'width': "160px", 'dataField': "item_name" },
                            //{ 'name': "Item No", 'width': "100px", 'dataField': "item_no" },
                            { 'name': "Item No", 'rlabel': "Item No", 'width': "100px", 'dataField': "item_code", editable: false },
                            { 'name': "Rack No", 'rlabel': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                            { 'name': "In Stock", 'rlabel': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                            { 'name': "", 'width': "0px", 'dataField': "qty" },
                            { 'name': "Qty", 'rlabel': "Qty", 'width': "70px", 'dataField': "temp_qty", },
                            { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Free Qty", 'rlabel': "Free Qty", 'width': "100px", 'dataField': "temp_free_qty", editable: page.currentPO.state_text == "Ordered", visible: CONTEXT.SHOW_FREE },
                            //{ 'name': "Free Item", 'width': "80px", 'dataField': "free_item", },

                            { 'name': "Delivered", 'rlabel': "Delivered", 'width': "80px", 'dataField': "qty_delivered" },
                            { 'name': "Stocked", 'rlabel': "Stocked", 'width': "80px", 'dataField': "qty_instock" },
                            { 'name': "Cancelled", 'rlabel': "Cancelled", 'width': "100px", 'dataField': "qty_returned" },
                            { 'name': "Tray", 'rlabel': "Tray", 'width': "80px", 'dataField': "tray_count", visible: CONTEXT.ENABLE_MODULE_TRAY },

                            { 'name': "Unit", 'rlabel': "Unit", 'width': "60px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                            { 'name': "Cost", 'rlabel': "Cost", 'width': "70px", 'dataField': "cost" },
                            { 'name': "Disc %", 'rlabel': "Disc %", 'width': "70px", 'dataField': "disc_per" },
                            { 'name': "Disc Value", 'rlabel': "Disc Value", 'width': "80px", 'dataField': "disc_val" },
                            { 'name': "Tax%", 'rlabel': "GST", 'width': "60px", 'dataField': "tax_per" },
                            { 'name': "Total", 'rlabel': "Total", 'width': "90px", 'dataField': "total_price" },
                            { 'name': "Net Rate", 'rlabel': "Net Rate", 'width': "100px", 'dataField': "net_rate", editable: false },
                            { 'name': "Buying Cost", 'rlabel': "Buying Cost", 'width': "90px", 'dataField': "buying_cost" },
                             //{ 'name': "Cancelled", 'width': "80px", 'dataField': "qty_returned" },

                             { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                             { 'name': "", 'width': "1px", 'dataField': "tray_id", visible: false },
                            { 'name': "Action", 'rlabel': "Action", 'width': "60px", 'dataField': "item_no", editable: false, visible: page.currentPO.state_text == "Created", itemTemplate: "<input type='button' value='Delete' action='Delete' />" },
                            { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                            { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                            { 'name': "", 'width': "0px", 'dataField': "variation_data" },
                            { 'name': "", 'width': "0px", 'dataField': "var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "free_var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "attr_type1", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type2", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type3", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type4", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type5", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type6", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_attr_key", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attr_key", visible: false },
                        ]
                    });


                }

                else {
                    page.controls.grdPOItems.width("2200px");
                    page.controls.grdPOItems.height("auto");
                    page.controls.grdPOItems.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Sl No", 'rlabel': "Sl No", 'width': "70px", 'dataField': "sl_no" },
                            { 'name': "Bar Code", 'rlabel': "Barcode", 'width': "150px", 'dataField': "barcode", visible: CONTEXT.SHOW_BARCODE },
                            { 'name': "Item Name", 'rlabel': "Item Name", 'width': "120px", 'dataField': "item_name", editable: false },
                            //{ 'name': "Item No", 'width': "100px", 'dataField': "item_no", editable: false },
                            { 'name': "Item No", 'rlabel': "Item No", 'width': "100px", 'dataField': "item_code", editable: false },
                            { 'name': "Rack No", 'rlabel': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                            { 'name': "In Stock", 'rlabel': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                            { 'name': "", 'width': "0px", 'dataField': "qty", },
                            { 'name': "Qty", 'rlabel': "Qty", 'width': "70px", 'dataField': "temp_qty", editable: page.currentPO.state_text == "Created", },
                            { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Free Qty", 'rlabel': "Free Qty", 'width': "100px", 'dataField': "temp_free_qty", editable: page.currentPO.state_text == "Ordered", visible: CONTEXT.SHOW_FREE },
                            //{ 'name': "Free Item", 'width': "80px", 'dataField': "free_item", },
                            { 'name': "Delivered", 'rlabel': "Delivered", 'width': "100px", 'dataField': "qty_delivered" },

                            { 'name': "Stocked", 'rlabel': "Stocked", 'width': "100px", 'dataField': "qty_instock" },
                            { 'name': "Cancelled", 'rlabel': "Cancelled", 'width': "100px", 'dataField': "qty_returned" },
                            { 'name': "To Stock", 'rlabel': "To Stock", 'width': "100px", 'dataField': "qty_tostock", editable: page.currentPO.state_text == "Confirmed" || page.currentPO.state_text == "Delivered", visible: false },
                            { 'name': "Expiry Date", 'rlabel': 'Exp Date', 'width': "100px", 'dataField': "expiry_date", editable: page.currentPO.state_text == "Delivered" || page.currentPO.state_text == "Confirmed", visible: false }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Batch No", 'rlabel': 'Batch No', 'width': "80px", 'dataField': "batch_no", editable: page.currentPO.state_text == "Delivered" || page.currentPO.state_text == "Confirmed", visible: false },
                             { 'name': "MRP", 'rlabel': 'MRP', 'width': "70px", 'dataField': "mrp", editable: page.currentPO.state_text == "Delivered" || page.currentPO.state_text == "Confirmed", visible: false },
                             { 'name': "Selling Price", 'rlabel': 'Selling Rate', 'width': "120px", 'dataField': "selling_price", editable: page.currentPO.state_text == "Delivered" || page.currentPO.state_text == "Confirmed", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "qty_stock", editable: false },
                            { 'name': "Tray", 'rlabel': 'Tray', 'width': "80px", 'dataField': "tray_count", editable: page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_MODULE_TRAY },
                            { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                            { 'name': "Unit", 'rlabel': 'Unit', 'width': "60px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                            { 'name': "Cost", 'rlabel': 'Cost', 'width': "70px", 'dataField': "cost", editable: page.currentPO.state_text == "Ordered" },

                            { 'name': "Disc %", 'rlabel': 'Disc %', 'width': "70px", 'dataField': "disc_per", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Disc Value", 'rlabel': 'Disc Value', 'width': "80px", 'dataField': "disc_val", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Tax%", 'rlabel': 'GST', 'width': "60px", 'dataField': "tax_per", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Total", 'rlabel': 'Total', 'width': "90px", 'dataField': "total_price" },//, editable: false },
                            { 'name': "Net Rate", 'rlabel': 'Net Rate', 'width': "100px", 'dataField': "net_rate", editable: false },
                            { 'name': "Buying Cost", 'rlabel': 'Buying Cost', 'width': "90px", 'dataField': "buying_cost" },
                            { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                            { 'name': "Action", 'rlabel': 'Action', 'width': "60px", 'dataField': "item_no", editable: false, visible: page.currentPO.state_text == "Created", itemTemplate: "<input type='button' value='Delete' action='Delete' />" },
                            { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                            { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                            { 'name': "", 'width': "0px", 'dataField': "variation_data" },
                            { 'name': "", 'width': "0px", 'dataField': "var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "free_var_no" },
                        ]
                    });
                }
                page.controls.grdPOItems.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "Delete") {
                        page.controls.grdPOItems.deleteRow(rowId);
                        page.calculate();
                    }
                    if (action == "New") {
                        page.events.btnNewVariation_click();
                    }
                    if (action == "NewStock") {
                        page.stockMode = true;
                        page.selectGridBill(rowData, row);
                        page.stockMode = false;
                    }
                }
                page.controls.grdPOItems.beforeRowBound = function (row, item) {
                    //Round up or not
                    if (item.qty_type == "Integer") {
                        item.qty = parseInt(item.qty);
                        item.qty_stock = parseInt(nvl(item.qty_stock, 0));
                        item.qty_instock = parseInt(nvl(item.qty_instock, 0));
                        item.qty_delivered = parseInt(nvl(item.qty_delivered, 0));
                    } else {
                        item.qty = parseFloat(item.qty);
                        item.qty_stock = parseFloat(nvl(item.qty_stock, 0));
                        item.qty_instock = parseFloat(nvl(item.qty_instock, 0));
                        item.qty_delivered = parseFloat(nvl(item.qty_delivered, 0));
                    }

                    if (page.currentPO.state_text == "Ordered") {
                        if (item.cost == null)
                            item.cost = 0;
                        if (item.disc_per == null)
                            item.disc_per = 0;
                        if (item.disc_val == null)
                            item.disc_val = 0;
                        if (item.tax_per == null)
                            item.tax_per = 0;
                        if (item.total_price == null)
                            item.total_price = 0;
                    }
                    var price = item.qty * item.cost;
                    var discount = (item.qty * item.cost) * parseFloat(item.disc_per) / 100 + ((parseFloat(item.disc_val) * parseFloat(item.qty)));
                    //item.buying_cost = parseFloat((parseFloat(price) - parseFloat(discount)) / parseFloat(item.qty)).toFixed(5);
                    //item.qty_tostock = item.qty_delivered - item.qty_instock;
                    item.buying_cost = parseFloat((parseFloat(price) - parseFloat(discount)) / parseFloat(item.qty)).toFixed(CONTEXT.COUNT_AFTER_POINTS);

                }
                page.controls.grdPOItems.rowBound = function (row, item) {
                    $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdPOItems.allData().length);
                    if (page.stockMode == true) {
                        var attrTemplate = [];
                        if (item.var_stock_attr_key != "" && typeof item.var_stock_attr_key != "undefined" && item.var_stock_attr_key != null) {
                            if (item.var_stock_attr_key.split(",").length - 1 >= 0) {
                                if (item.attr_type1 == "exp_date" || item.attr_type1 == "man_date") {
                                    attrTemplate.push("<input type='date' dataField='attr_value1' style='width:130px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[0]) + "' >");
                                }
                                else {
                                    attrTemplate.push("<input type='text' dataField='attr_value1' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[0]) + "' >");
                                }
                            }
                            if (item.var_stock_attr_key.split(",").length - 1 >= 1) {
                                if (item.attr_type2 == "man_date") {
                                    attrTemplate.push("<input type='date' dataField='attr_value2' style='width:130px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[1]) + "' >");
                                }
                                else {
                                    attrTemplate.push("<input type='text' dataField='attr_value2' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[1]) + "' >");
                                }
                            }
                            if (item.var_stock_attr_key.split(",").length - 1 >= 2) {
                                attrTemplate.push("<input type='text' dataField='attr_value3' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[2]) + "' >");
                            }
                            if (item.var_stock_attr_key.split(",").length - 1 >= 3) {
                                attrTemplate.push("<input type='text' dataField='attr_value4' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[3]) + "' >");
                            }
                            if (item.var_stock_attr_key.split(",").length - 1 >= 4) {
                                attrTemplate.push("<input type='text' dataField='attr_value5' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[4]) + "' >");
                            }
                            if (item.var_stock_attr_key.split(",").length - 1 >= 5) {
                                attrTemplate.push("<input type='text' dataField='attr_value6' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[5]) + "' >");
                            }
                        } else {
                            item.var_stock_attr_key = "";
                            row.find("input[dataField=var_stock_attr_key]").val("");
                            item.var_stock_attribute = "";
                            row.find("input[dataField=var_stock_attribute]").val(""); 
                            item.var_attribute = "";
                            row.find("input[dataField=var_attribute]").val("");
                            item.var_attr_key = "";
                            row.find("input[dataField=var_attr_key]").val("");
                        }
                        $(row).find("[id=Attributes]").html(attrTemplate.join(""));

                        var stockTemplate = [];
                        if (row.prev().find("[datafield=item_no]").find("div").html() == item.item_no) {
                            stockTemplate.push("<input type='button' title='Remove Stock'  class='grid-button' value='' action='Delete' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />");

                            row.find("[datafield=barcode]").css("visibility", "hidden");
                            row.find("[datafield=item_name]").css("visibility", "hidden");
                            row.find("[datafield=item_no]").css("visibility", "hidden");
                            row.find("[datafield=item_code]").css("visibility", "hidden");
                            row.find("[datafield=rack_no]").css("visibility", "hidden");
                            row.find("[datafield=qty_stock]").css("visibility", "hidden");
                            row.find("[datafield=qty]").css("visibility", "hidden");
                            row.find("[datafield=temp_qty]").css("visibility", "hidden");
                            row.find("[datafield=free_qty]").css("visibility", "hidden");
                            row.find("[datafield=temp_free_qty]").css("visibility", "hidden");
                            row.find("[datafield=free_item]").css("visibility", "hidden");
                            row.find("[datafield=qty_delivered]").css("visibility", "hidden");
                            row.find("[datafield=qty_instock]").css("visibility", "hidden");
                            row.find("[datafield=qty_returned]").css("visibility", "hidden");
                            row.find("[datafield=cost]").css("visibility", "hidden");
                            row.find("[datafield=disc_per]").css("visibility", "hidden");
                            row.find("[datafield=disc_val]").css("visibility", "hidden");
                            row.find("[datafield=tax_per]").css("visibility", "hidden");
                            row.find("[datafield=total_price]").css("visibility", "hidden");
                            row.find("[datafield=net_rate]").css("visibility", "hidden");
                            row.find("[datafield=buying_cost]").css("visibility", "hidden");
                        }
                        else {
                            stockTemplate.push("<input type='button' title='New Stock'  class='grid-button' value='' action='NewStock' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/plus.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />");
                        }
                        $(row).find("[id=stockDetail]").html(stockTemplate.join(""));
                    }
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
                    
                    var htmlTemplate = [];
                    if (CONTEXT.ENABLE_ALTER_UNIT && item.state_text == "Created") {
                        if (item.alter_unit == undefined || item.alter_unit == null || item.alter_unit == "") {
                            htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</select></div>");
                        } else {
                            htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</option><option value='1'>" + item.alter_unit + "</option></select></div>");
                        }
                    }
                    else {
                        if (item.unit_identity == "1")
                            htmlTemplate.push("<div><select id='itemUnit'><option value='1'>" + item.alter_unit + "</option></select></div>");
                        else
                            htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</option></select></div>");
                    }
                    $(row).find("[id=prdDetail]").html(htmlTemplate.join(""));
                    $(row).find("[id=itemUnit]").change(function () {
                        if ($(this).val() == "0") {
                            item.qty = parseFloat(item.temp_qty);
                            $(row).find("[datafield=qty]").find("div").html(parseFloat(item.temp_qty));
                            item.free_qty = parseFloat(item.free_qty);
                            $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.free_qty));
                            item.unit_identity = 0;
                            $(row).find("[datafield=unit_identity]").find("div").html(0);
                        } else {
                            item.qty = parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=qty]").find("div").html(parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact));
                            item.free_qty = parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.free_qty) * parseFloat(item.alter_unit_fact));
                            item.unit_identity = 1;
                            $(row).find("[datafield=unit_identity]").find("div").html(1);
                        }
                        page.calculate();
                    });
                    if (item.unit_identity == "1") {
                        if (item.state_text == "Created") {
                            item.temp_qty = parseFloat(item.qty) / parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=temp_qty]").find("div").val(parseFloat(item.temp_qty));

                            item.temp_free_qty = parseFloat(item.free_qty) / parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=temp_free_qty]").find("div").val(parseFloat(item.temp_free_qty));
                        }
                        else {
                            item.temp_qty = parseFloat(item.qty) / parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=temp_qty]").find("div").html(parseFloat(item.temp_qty));

                            item.temp_free_qty = parseFloat(item.free_qty) / parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=temp_free_qty]").find("div").html(parseFloat(item.temp_free_qty));
                        }

                        item.qty_delivered = parseFloat(item.qty_delivered) / parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=qty_delivered]").find("div").html(parseFloat(item.qty_delivered));

                        item.qty_instock = parseFloat(item.qty_instock) / parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=qty_instock]").find("div").html(parseFloat(item.qty_instock));

                        item.qty_returned = parseFloat(item.qty_returned) / parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=qty_returned]").find("div").html(parseFloat(item.qty_returned));
                        
                        item.qty_infreestock = parseFloat(item.qty_infreestock) / parseFloat(item.qty_infreestock);
                        $(row).find("[datafield=qty_infreestock]").find("div").html(parseFloat(item.qty_infreestock));

                        item.unit_identity = 1;
                        $(row).find("[datafield=unit_identity]").find("div").html(1);
                    }
                    else {
                        if (item.state_text == "Created") {
                            item.temp_qty = parseFloat(item.qty);
                            $(row).find("[datafield=temp_qty]").find("div").val(parseFloat(item.temp_qty));

                            item.temp_free_qty = parseFloat(item.free_qty);
                            $(row).find("[datafield=temp_free_qty]").find("div").val(parseFloat(item.temp_free_qty));
                        }
                        else {
                            item.temp_qty = parseFloat(item.qty);
                            $(row).find("[datafield=temp_qty]").find("div").html(parseFloat(item.temp_qty));

                            item.temp_free_qty = parseFloat(item.free_qty);
                            $(row).find("[datafield=temp_free_qty]").find("div").html(parseFloat(item.temp_free_qty));
                        }

                        item.unit_identity = 0;
                        $(row).find("[datafield=unit_identity]").find("div").html(0);
                    }

                    row.on("focus", "input[datafield=expiry_date]", function () {
                        if (CONTEXT.ENABLE_DATE_FORMAT == "true")
                            row.find("input[datafield=expiry_date]").attr("placeholder", "mm-yyyy");
                        else
                            row.find("input[datafield=expiry_date]").attr("placeholder", "dd-mm-yyyy");
                    });
                    row.on("focus", "input[datafield=man_date]", function () {
                        if (CONTEXT.ENABLE_DATE_FORMAT == "true")
                            row.find("input[datafield=man_date]").attr("placeholder", "mm-yyyy");
                        else
                            row.find("input[datafield=man_date]").attr("placeholder", "dd-mm-yyyy");
                    });
                    row.on("change", "input[datafield=temp_qty]", function () {
                        if ($(row).find("[id=itemUnit]").val() == "0") {
                            item.qty = parseFloat(item.temp_qty);
                            $(row).find("[datafield=qty]").find("div").html(parseFloat(item.qty));
                            item.unit_identity = 0;
                            $(row).find("[datafield=unit_identity]").find("div").html(0);
                        } else {
                            item.qty = parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact));
                            item.unit_identity = 1;
                            $(row).find("[datafield=unit_identity]").find("div").html(1);
                        }
                        page.calculate();
                    });
                    row.on("change", "input[datafield=temp_free_qty]", function () {
                        if ($(row).find("[id=itemUnit]").val() == "0") {
                            item.free_qty = parseFloat(item.temp_free_qty);
                            $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.free_qty));
                            item.unit_identity = 0;
                            $(row).find("[datafield=unit_identity]").find("div").html(0);
                        } else {
                            item.free_qty = parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.free_qty) * parseFloat(item.alter_unit_fact));
                            item.unit_identity = 1;
                            $(row).find("[datafield=unit_identity]").find("div").html(1);
                        }
                        page.calculate();
                    });
                    row.on("focus", "input[datafield=qty]", function () {
                        $(this).select();
                    });

                    row.on("change", "input[datafield=cost]", function () {
                        page.calculate();
                    });
                    row.on("change", "input[datafield=disc_per]", function () {
                        page.calculate();
                    });
                    row.on("change", "input[datafield=disc_val]", function () {
                        page.calculate();
                    });
                    row.on("change", "input[datafield=tax_per]", function () {
                        page.calculate();
                    });
                    row.on("change", "input[datafield=qty_tostock]", function () {
                        page.check_variation(row, item);
                    });
                    row.on("keydown", "input[datafield=temp_qty]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            row.find("input[datafield=temp_free_qty]").focus().select();
                            try {
                                if (item.qty_type == "Integer" && CheckDecimal(item.temp_qty)) {
                                    throw "Incorrect Quantity Type";
                                }
                                if (item.qty_type == "Decimal" && !CheckDecimal(item.temp_qty)) {
                                    throw "Incorrect Quantity Type";
                                }
                            }
                            catch (e) {
                                alert(e);
                                row.find("input[datafield=temp_qty]").focus().select();
                            }
                        }
                    });
                    row.on("keydown", "input[datafield=temp_free_qty]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            try {
                                if (item.qty_type == "Integer" && CheckDecimal(item.temp_free_qty)) {
                                    throw "Incorrect Quantity Type";
                                }
                                if (item.qty_type == "Decimal" && !CheckDecimal(item.temp_free_qty)) {
                                    throw "Incorrect Quantity Type";
                                }
                            }
                            catch (e) {
                                alert(e);
                                row.find("input[datafield=temp_free_qty]").focus().select();
                            }
                        }
                    });
                    row.on("keydown", "input[datafield=qty_damaged]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            try {
                                if (item.qty_type == "Integer" && CheckDecimal(item.qty_damaged)) {
                                    throw "Incorrect Quantity Type";
                                }
                                if (item.qty_type == "Decimal" && !CheckDecimal(item.qty_damaged)) {
                                    throw "Incorrect Quantity Type";
                                }
                            }
                            catch (e) {
                                alert(e);
                                row.find("input[datafield=qty_damaged]").focus().select();
                            }
                        }
                    });
                    row.on("keydown", "input[datafield=qty_received]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            try {
                                if (item.qty_type == "Integer" && CheckDecimal(item.qty_received)) {
                                    throw "Incorrect Quantity Type";
                                }
                                if (item.qty_type == "Decimal" && !CheckDecimal(item.qty_received)) {
                                    throw "Incorrect Quantity Type";
                                }
                            }
                            catch (e) {
                                alert(e);
                                row.find("input[datafield=qty_received]").focus().select();
                            }
                        }
                    });
                    row.on("keydown", "input[datafield=qty_tostock]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            try {
                                if (item.qty_type == "Integer" && CheckDecimal(item.qty_tostock)) {
                                    throw "Incorrect Quantity Type";
                                }
                                if (item.qty_type == "Decimal" && !CheckDecimal(item.qty_tostock)) {
                                    throw "Incorrect Quantity Type";
                                }
                            }
                            catch (e) {
                                alert(e);
                                row.find("input[datafield=qty_tostock]").focus().select();
                            }
                        }
                    });
                    row.on("change", "input[datafield=variation_name]", function () {
                    });
                    row.on("change", "input[datafield=selling_price]", function () {
                        var profit = parseFloat(((parseFloat(item.selling_price) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        item.profit = profit;
                        row.find("input[datafield=profit]").val(profit);
                        if (item.profit == "Infinity") {
                            item.profit = "100";
                            row.find("input[datafield=profit]").val("100");
                        }
                    });
                    row.on("change", "input[datafield=profit]", function () {
                        if (item.profit.startsWith("#")) {
                            item.profit = item.profit.replace(/#/g, 0);
                            var profper = (parseFloat(item.mrp) * parseFloat(item.profit)) / 100;
                            var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                            item.selling_price = parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            row.find("input[datafield=selling_price]").val(parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                            //if (parseFloat(item.selling_price) == "0") {
                            //    item.selling_price = item.profit;
                            //    row.find("input[datafield=selling_price]").val(item.profit);
                            //}

                        }
                        else {
                            var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            item.selling_price = parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            row.find("input[datafield=selling_price]").val(parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                            //if (parseFloat(item.selling_price) == "0") {
                            //    item.selling_price = item.profit;
                            //    row.find("input[datafield=selling_price]").val(item.profit);
                            //}
                        }

                    });
                    row.on("change", "input[datafield=price1]", function () {
                        if (item.price1.startsWith("#")) {
                            item.price1 = item.price1.replace(/#/g, 0);
                            var profper = (parseFloat(item.mrp) * parseFloat(item.price1)) / 100;
                            var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                            item.alter_price_1 = parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            row.find("input[datafield=alter_price_1]").val(parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                            //if (parseFloat(item.selling_price) == "0") {
                            //    item.selling_price = item.price1;
                            //    row.find("input[datafield=alter_price_1]").val(item.price1);
                            //}

                        }
                        else {
                            var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.price1)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            item.alter_price_1 = parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            row.find("input[datafield=alter_price_1]").val(parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                            //if (parseFloat(item.selling_price) == "0") {
                            //    item.selling_price = item.price1;
                            //    row.find("input[datafield=alter_price_1]").val(item.price1);
                            //}
                        }
                    });
                    row.on("change", "input[datafield=alter_price_1]", function () {
                        var price1 = parseFloat(((parseFloat(item.alter_price_1) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        item.price1 = price1;
                        row.find("input[datafield=price1]").val(price1);
                        if (item.price1 == "Infinity") {
                            item.price1 = "100";
                            row.find("input[datafield=price1]").val("100");
                        }
                    });
                    row.on("change", "input[datafield=price2]", function () {
                        if (item.price2.startsWith("#")) {
                            item.price2 = item.price2.replace(/#/g, 0);
                            var profper = (parseFloat(item.mrp) * parseFloat(item.price2)) / 100;
                            var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                            item.alter_price_2 = parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            row.find("input[datafield=alter_price_2]").val(parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                            //if (parseFloat(item.selling_price) == "0") {
                            //    item.selling_price = item.price2;
                            //    row.find("input[datafield=alter_price_2]").val(item.price2);
                            //}
                        }
                        else {
                            var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.price2)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            item.alter_price_2 = parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            row.find("input[datafield=alter_price_2]").val(parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                            //if (parseFloat(item.selling_price) == "0") {
                            //    item.selling_price = item.price2;
                            //    row.find("input[datafield=alter_price_2]").val(item.price2);
                            //}
                        }
                    });
                    row.on("change", "input[datafield=alter_price_2]", function () {
                        var price2 = parseFloat(((parseFloat(item.alter_price_2) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        item.price2 = price2;
                        row.find("input[datafield=price2]").val(price2);
                        if (item.price2 == "Infinity") {
                            item.price2 = "100";
                            row.find("input[datafield=price2]").val("100");
                        }
                    });
                    row.on("change", "input[datafield=expiry_date]", function () {
                        page.check_variation(row, item);
                        //page.check_variation(function (data) {
                        //    if (data.length != 0) {
                        //        $(data).each(function (i, items) {
                        //            if (items.free_variation_id) {
                        //                item.free_variation_name = items.free_variation_name;
                        //                row.find("input[datafield=free_variation_name]").val(items.variation_name);
                        //                item.free_variation_id = items.free_variation_id;
                        //                row.find("input[datafield=free_variation_id]").val(items.free_variation_id);
                        //                if (parseFloat(data[0].cost) != parseFloat(item.buying_cost)) {
                        //                    row.find("input[datafield=variation_name]").val("");
                        //                    item.variation_name = "";
                        //                }
                        //            } else {
                        //                row.find("input[datafield=variation_name]").val(items.variation_name);
                        //                item.variation_name = items.variation_name;
                        //            }
                        //        })
                        //    }
                        //    else {
                        //        row.find("input[datafield=variation_name]").val("");
                        //        item.variation_name = "";
                        //        item.free_variation_name = "";
                        //        row.find("input[datafield=free_variation_name]").val("");
                        //        item.free_variation_id = false;
                        //        row.find("input[datafield=free_variation_id]").val(false);
                        //    }
                        //});

                    });
                    row.on("change", "input[datafield=man_date]", function () {
                        page.check_variation(row, item);
                        //page.check_variation(function (data) {
                        //    if (data.length != 0) {
                        //        $(data).each(function (i, items) {
                        //            if (items.free_variation_id) {
                        //                item.free_variation_name = items.free_variation_name;
                        //                row.find("input[datafield=free_variation_name]").val(items.variation_name);
                        //                item.free_variation_id = items.free_variation_id;
                        //                row.find("input[datafield=free_variation_id]").val(items.free_variation_id);
                        //                if (parseFloat(data[0].cost) != parseFloat(item.buying_cost)) {
                        //                    row.find("input[datafield=variation_name]").val("");
                        //                    item.variation_name = "";
                        //                }
                        //            } else {
                        //                row.find("input[datafield=variation_name]").val(items.variation_name);
                        //                item.variation_name = items.variation_name;
                        //            }
                        //        })
                        //    }
                        //    else {
                        //        row.find("input[datafield=variation_name]").val("");
                        //        item.variation_name = "";
                        //        item.free_variation_name = "";
                        //        row.find("input[datafield=free_variation_name]").val("");
                        //        item.free_variation_id = false;
                        //        row.find("input[datafield=free_variation_id]").val(false);
                        //    }
                        //});

                    });
                    row.on("change", "input[datafield=batch_no]", function () {
                        page.check_variation(row, item);
                        //page.check_variation(function (data) {
                        //    if (data.length != 0) {
                        //        $(data).each(function (i, items) {
                        //            if (items.free_variation_id) {
                        //                item.free_variation_name = items.free_variation_name;
                        //                row.find("input[datafield=free_variation_name]").val(items.variation_name);
                        //                item.free_variation_id = items.free_variation_id;
                        //                row.find("input[datafield=free_variation_id]").val(items.free_variation_id);
                        //                if (parseFloat(data[0].cost) != parseFloat(item.buying_cost)) {
                        //                    row.find("input[datafield=variation_name]").val("");
                        //                    item.variation_name = "";
                        //                }
                        //            } else {
                        //                row.find("input[datafield=variation_name]").val(items.variation_name);
                        //                item.variation_name = items.variation_name;
                        //            }
                        //        })
                        //    }
                        //    else {
                        //        row.find("input[datafield=variation_name]").val("");
                        //        item.variation_name = "";
                        //        item.free_variation_name = "";
                        //        row.find("input[datafield=free_variation_name]").val("");
                        //        item.free_variation_id = false;
                        //        row.find("input[datafield=free_variation_id]").val(false);
                        //    }
                        //});
                    });
                    row.on("change", "input[datafield=mrp]", function () {
                        page.check_variation(row, item);
                        //page.check_variation(function (data) {
                        //    if (data.length != 0) {
                        //        $(data).each(function (i, items) {
                        //            if (items.free_variation_id) {
                        //                item.free_variation_name = items.free_variation_name;
                        //                row.find("input[datafield=free_variation_name]").val(items.variation_name);
                        //                item.free_variation_id = items.free_variation_id;
                        //                row.find("input[datafield=free_variation_id]").val(items.free_variation_id);
                        //                if (parseFloat(data[0].cost) != parseFloat(item.buying_cost)) {
                        //                    row.find("input[datafield=variation_name]").val("");
                        //                    item.variation_name = "";
                        //                }
                        //            } else {
                        //                row.find("input[datafield=variation_name]").val(items.variation_name);
                        //                item.variation_name = items.variation_name;
                        //            }
                        //        })
                        //    }
                        //    else {
                        //        row.find("input[datafield=variation_name]").val("");
                        //        item.variation_name = "";
                        //        item.free_variation_name = "";
                        //        row.find("input[datafield=free_variation_name]").val("");
                        //        item.free_variation_id = false;
                        //        row.find("input[datafield=free_variation_id]").val(false);
                        //    }
                        //});
                    });

                    if (item.tray_id == "-1" || item.tray_id == null) {
                        row.find("div[datafield=tray_received]").css("visibility", "hidden");
                    }
                    
                    row.on("focus", "input[datafield=variation_name]", function () {
                        page.variation(row, item, function (data) {
                            row.find("input[datafield=variation_name]").autocomplete({
                                minLength: 0,
                                source: data,
                                focus: function (event, ui) {
                                    row.find("input[datafield=variation_name]").val(ui.item.label);
                                    return false;
                                },
                                select: function (event, ui) {
                                    item.mrp = ui.item.mrp;
                                    item.batch_no = ui.item.batch_no;
                                    item.expiry_date = ui.item.expiry_date;
                                    item.man_date = ui.item.man_date;
                                    item.var_cost = ui.item.cost;
                                    item.var_no = ui.item.var_no;
                                    item.variation_name = ui.item.label;
                                    if (parseFloat(ui.item.cost) == "0") {
                                        item.free_var_no = ui.item.var_no;
                                        item.free_variation_name = ui.item.label;
                                        row.find("input[datafield=free_var_no]").val(ui.item.var_no);
                                        row.find("input[datafield=free_variation_name]").val(ui.item.label);
                                    }
                                    item.disc_per = "";
                                    item.disc_val = "";
                                    row.find("input[datafield=variation_name]").val(ui.item.label);
                                    row.find("input[datafield=var_cost]").val(ui.item.cost);
                                    $(row).find("input[datafield=mrp]").val(ui.item.mrp);
                                    $(row).find("input[datafield=batch_no]").val(ui.item.batch_no);
                                    row.find("input[datafield=expiry_date]").val(ui.item.expiry_date);
                                    row.find("input[datafield=man_date]").val(ui.item.man_date);
                                    row.find("input[datafield=var_no]").val(ui.item.var_no);
                                    row.find("input[datafield=disc_per]").val("");
                                    row.find("input[datafield=disc_val]").val("");
                                    if (ui.item.active == "0")
                                        row.find("input[datafield=variation_name]").css("color", "red");
                                    else
                                        row.find("input[datafield=variation_name]").css("color", "black");
                                    if (item.expiry_date != null)
                                        $(row).find("[datafield=temp_expiry_date]").find("input").val(item.expiry_date.substring(0, 10));
                                    if (item.man_date != null)
                                        $(row).find("[datafield=temp_man_date]").find("input").val(item.man_date.substring(0, 10));

                                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                                        if (item.expiry_date != undefined && item.expiry_date != null && item.expiry_date != "") {
                                            var len = item.expiry_date.length;
                                            var month = item.expiry_date.substring(len - 7, len - 5);
                                            var year = item.expiry_date.substring(len - 4, len);
                                            item.expiry_date = month + "-" + year;
                                            row.find("input[datafield=expiry_date]").val(item.expiry_date);
                                            $(row).find("[datafield=temp_expiry_date]").find("input").val("28-" + item.expiry_date);
                                        }
                                        if (item.man_date != undefined && item.man_date != null && item.man_date != "") {
                                            var len = item.man_date.length;
                                            var month = item.man_date.substring(len - 7, len - 5);
                                            var year = item.man_date.substring(len - 4, len);
                                            item.man_date = month + "-" + year;
                                            row.find("input[datafield=man_date]").val(item.man_date);
                                            $(row).find("[datafield=temp_man_date]").find("input").val("28-" + item.man_date);
                                        }
                                    }

                                    item.free_var_no = null;
                                    item.free_variation_name = null;
                                    $(item.variation_data).each(function (i, items) {
                                        if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                                            if (items.expiry_date != undefined && items.expiry_date != null && items.expiry_date != "") {
                                                var len = items.expiry_date.length;
                                                var month = items.expiry_date.substring(len - 7, len - 5);
                                                var year = items.expiry_date.substring(len - 4, len);
                                                items.expiry_date = month + "-" + year;
                                            }
                                            if (items.man_date != undefined && items.man_date != null && items.man_date != "") {
                                                len = items.man_date.length;
                                                month = items.man_date.substring(len - 7, len - 5);
                                                year = items.man_date.substring(len - 4, len);
                                                items.man_date = month + "-" + year;
                                            }
                                        }
                                        if (!CONTEXT.ENABLE_VARIATION_VENDOR_NO) {
                                            item.vendor_no = 0;
                                            items.vendor_no = 0;
                                        }
                                        if (CONTEXT.ENABLE_FREE_VARIATION && CONTEXT.SHOW_FREE) {
                                            if (parseFloat(items.mrp) == parseFloat(item.mrp) && items.batch_no == item.batch_no &&
                                           items.vendor_no == item.vendor_no &&
                                           items.expiry_date == item.expiry_date &&
                                           items.man_date == item.man_date &&
                                           parseFloat(items.cost).toFixed(CONTEXT.COUNT_AFTER_POINTS) == parseFloat(0).toFixed(CONTEXT.COUNT_AFTER_POINTS)) {
                                                item.free_var_no = items.var_no;
                                                item.free_variation_name = items.variation_name;
                                                $(row).find("[datafield=free_variation_name]").find("div").html(item.free_variation_name);
                                            }
                                        }
                                    });
                                    //if no match founnd
                                    if (item.free_var_no == null)
                                        $(row).find("[datafield=free_variation_name]").find("div").html("");

                                    var cost = parseFloat(ui.item.cost) * (parseFloat(item.qty)) / parseFloat(item.qty);
                                    item.cost = cost;
                                    row.find("input[datafield=cost]").val(cost);

                                    var poItem = page.controls.grdPOItems.getRowData(row);
                                    row.find("[datafield=pre_selling_price]").find("div").html(ui.item.selling_price);
                                    row.find("[datafield=pre_alter_price_1]").find("div").html(ui.item.pre_alter_price_1);
                                    row.find("[datafield=pre_alter_price_2]").find("div").html(ui.item.pre_alter_price_2);
                                    poItem.pre_selling_price = ui.item.selling_price;
                                    poItem.pre_alter_price_1 = ui.item.pre_alter_price_1;
                                    poItem.pre_alter_price_2 = ui.item.pre_alter_price_2;
                                    page.calculate();
                                    return false;
                                },
                                change: function (event, ui) {
                                    if (ui.item == null) {
                                        row.find("div[datafield=btn_variation_name]").css("visibility", "true");
                                        item.chk_new_var = 1;
                                        item.var_no = null;
                                        item.free_var_no = null;
                                    }
                                }
                            })
                        });
                    });
                    if (page.currentPO.state_no == "700") {
                        var data = {
                            item_no: item.item_no,
                        }
                        //page.stockService.getAllVariationByItem(data, function (data) {
                        page.stockAPI.getSkuByItem({ item_no: item.item_no, vendor_no: page.selectedPO.vendor_no }, function (data) {
                            var length = 0;
                            var poItem = page.controls.grdPOItems.getRowData(row);
                            $(data).each(function (i, item1) {
                                item1.disc_val = 0; item1.disc_per = 0;
                                row.find("input[datafield=cost]").val(item1.avg_buying_cost);
                                row.find("input[datafield=disc_val]").val(item1.disc_val);
                                row.find("input[datafield=disc_per]").val(item1.disc_per);
                                row.find("input[datafield=cost]").html(item1.avg_buying_cost);
                                row.find("input[datafield=disc_val]").html(item1.disc_val);
                                row.find("input[datafield=disc_per]").html(item1.disc_per);
                                poItem.cost = item1.avg_buying_cost;
                                poItem.disc_val = item1.disc_val;
                                poItem.disc_per = item1.disc_per;
                            });
                            page.calculate();
                            //if (data.length != 0) {
                            //    parseInt(data[data.length - 1].cost) != 0 ? length = data.length - 1 : length = data.length - 2;
                            //    parseInt(data.length) < 2 ? length = 0 : "";
                            //    row.find("input[datafield=cost]").val(data[length].rate);
                            //    row.find("input[datafield=disc_val]").val(data[length].disc_val);
                            //    row.find("input[datafield=disc_per]").val(data[length].disc_per);
                            //    row.find("input[datafield=cost]").html(data[length].rate);
                            //    row.find("input[datafield=disc_val]").html(data[length].disc_val);
                            //    row.find("input[datafield=disc_per]").html(data[length].disc_per);
                            //    poItem.cost = data[length].rate;
                            //    poItem.disc_val = data[length].disc_val;
                            //    poItem.disc_per = data[length].disc_per;
                            //    page.calculate();
                            //}
                        });
                    }
                    if (page.stockMode) {
                        if (item.get_item_sku != "1") {
                            var data1 = {
                                item_no: item.item_no,
                                cost: item.buying_cost,
                                vendor_no: page.controls.ddlPOVendor.selectedValue(),
                            }

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
                            item.buying_cost = parseFloat(item.buying_cost).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            if (item.get_sku != "1") {
                                if (CONTEXT.PURCHASE_SKU_SEARCH != "Manual") {
                                    page.stockAPI.getSkuByItem({ item_no: item.item_no, vendor_no: data1.vendor_no, search_mode: CONTEXT.PURCHASE_SKU_SEARCH }, function (data) {
                                        if (data.length > 0) {
                                            var poItem = page.controls.grdPOItems.getRowData(row);
                                            poItem.pre_selling_price = data[0].pre_price;
                                            poItem.pre_alter_price_1 = data[0].alter_price_1;
                                            poItem.pre_alter_price_2 = data[0].alter_price_2;
                                            row.find("[datafield=pre_selling_price]").html(data[0].pre_price);
                                            row.find("[datafield=pre_alter_price_1]").html(data[0].alter_price_1);
                                            row.find("[datafield=pre_alter_price_2]").html(data[0].alter_price_2);
                                            row.find("[datafield=pre_price_limit]").html(data[0].price_limit);
                                            if (item.attr_type1 == "cost") {
                                                item.attr_value1 = item.buying_cost;
                                                row.find("input[dataField=attr_value1]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            } else {
                                                item.attr_value1 = data[0].attr_value1;
                                                row.find("input[dataField=attr_value1]").val(data[0].attr_value1).change();
                                            }
                                            if (item.attr_type2 == "cost") {
                                                item.attr_value2 = item.buying_cost;
                                                row.find("input[dataField=attr_value2]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            } else {
                                                item.attr_value2 = data[0].attr_value2;
                                                row.find("input[dataField=attr_value2]").val(data[0].attr_value2).change();
                                            }
                                            if (item.attr_type3 == "cost") {
                                                item.attr_value3 = item.buying_cost;
                                                row.find("input[dataField=attr_value3]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            } else {
                                                item.attr_value3 = data[0].attr_value3;
                                                row.find("input[dataField=attr_value3]").val(data[0].attr_value3).change();
                                            }
                                            if (item.attr_type4 == "cost") {
                                                item.attr_value4 = item.buying_cost;
                                                row.find("input[dataField=attr_value4]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            } else {
                                                item.attr_value4 = data[0].attr_value4;
                                                row.find("input[dataField=attr_value4]").val(data[0].attr_value4).change();
                                            }
                                            if (item.attr_type5 == "cost") {
                                                item.attr_value5 = item.buying_cost;
                                                row.find("input[dataField=attr_value5]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            } else {
                                                item.attr_value5 = data[0].attr_value5;
                                                row.find("input[dataField=attr_value5]").val(data[0].attr_value5).change();
                                            }
                                            if (item.attr_type6 == "cost") {
                                                item.attr_type6 = item.buying_cost;
                                                row.find("input[dataField=attr_value6]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            } else {
                                                item.attr_type6 = data[0].attr_type6;
                                                row.find("input[dataField=attr_value6]").val(data[0].attr_value6).change();
                                            }
                                            if (CONTEXT.ENABLE_EXP_DAYS_MODE) {
                                                if (item.attr_type1 == "exp_date") {
                                                    if (item.expiry_days != null && typeof item.expiry_days != "undefined" && item.expiry_days != "") {
                                                        var today = new Date();
                                                        var numberOfDaysToAdd = parseInt(item.expiry_days);
                                                        today.setDate(today.getDate() + numberOfDaysToAdd);
                                                        var year = today.getFullYear();
                                                        var month = (today.getMonth() + 1) < 9 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
                                                        var date = (today.getDate()) < 10 ? "0" + today.getDate() : today.getDate();
                                                        row.find("input[dataField=attr_value1]").val(year + "-" + month + "-" + date).change();
                                                    }
                                                }
                                            }
                                        }
                                        else if (false) {
                                            var poItem = page.controls.grdPOItems.getRowData(row);
                                            poItem.pre_selling_price = data[0].price;
                                            poItem.pre_alter_price_1 = data[0].alter_price_1;
                                            poItem.pre_alter_price_2 = data[0].alter_price_2;
                                            row.find("[datafield=pre_selling_price]").html(data[0].price);
                                            row.find("[datafield=pre_alter_price_1]").html(data[0].alter_price_1);
                                            row.find("[datafield=pre_alter_price_2]").html(data[0].alter_price_2);
                                            row.find("[datafield=pre_price_limit]").html(data[0].price_limit);
                                            if (item.attr_type1 == "cost") {
                                                item.attr_value1 = item.buying_cost;
                                                row.find("input[dataField=attr_value1]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            } else {
                                                item.attr_value1 = data[0].attr_value1;
                                                row.find("input[dataField=attr_value1]").val(data[0].attr_value1).change();
                                            }
                                            if (item.attr_type2 == "cost") {
                                                item.attr_value2 = item.buying_cost;
                                                row.find("input[dataField=attr_value2]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            } else {
                                                item.attr_value2 = data[0].attr_value2;
                                                row.find("input[dataField=attr_value2]").val(data[0].attr_value2).change();
                                            }
                                            if (item.attr_type3 == "cost") {
                                                item.attr_value3 = item.buying_cost;
                                                row.find("input[dataField=attr_value3]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            } else {
                                                item.attr_value3 = data[0].attr_value3;
                                                row.find("input[dataField=attr_value3]").val(data[0].attr_value3).change();
                                            }
                                            if (item.attr_type4 == "cost") {
                                                item.attr_value4 = item.buying_cost;
                                                row.find("input[dataField=attr_value4]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            } else {
                                                item.attr_value4 = data[0].attr_value4;
                                                row.find("input[dataField=attr_value4]").val(data[0].attr_value4).change();
                                            }
                                            if (item.attr_type5 == "cost") {
                                                item.attr_value5 = item.buying_cost;
                                                row.find("input[dataField=attr_value5]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            } else {
                                                item.attr_value5 = data[0].attr_value5;
                                                row.find("input[dataField=attr_value5]").val(data[0].attr_value5).change();
                                            }
                                            if (item.attr_type6 == "cost") {
                                                item.attr_type6 = item.buying_cost;
                                                row.find("input[dataField=attr_value6]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            } else {
                                                item.attr_type6 = data[0].attr_type6;
                                                row.find("input[dataField=attr_value6]").val(data[0].attr_value6).change();
                                            }
                                            if (CONTEXT.ENABLE_EXP_DAYS_MODE) {
                                                if (item.attr_type1 == "exp_date") {
                                                    if (item.expiry_days != null && typeof item.expiry_days != "undefined" && item.expiry_days != "") {
                                                        var today = new Date();
                                                        var numberOfDaysToAdd = parseInt(item.expiry_days);
                                                        today.setDate(today.getDate() + numberOfDaysToAdd);
                                                        var year = today.getFullYear();
                                                        var month = (today.getMonth() + 1) < 9 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
                                                        var date = (today.getDate()) < 10 ? "0" + today.getDate() : today.getDate();
                                                        row.find("input[dataField=attr_value1]").val(year + "-" + month + "-" + date).change();
                                                    }
                                                }
                                            }
                                            $(data).each(function (i, item1) {
                                                if (i > 0) {
                                                    var item_data = item;
                                                    item_data.attr_type1 = item1.attr_type1;
                                                    item_data.attr_type2 = item1.attr_type2;
                                                    item_data.attr_type3 = item1.attr_type3;
                                                    item_data.attr_type4 = item1.attr_type4;
                                                    item_data.attr_type5 = item1.attr_type5;
                                                    item_data.attr_type6 = item1.attr_type6;
                                                    item_data.attr_value1 = (item1.attr_value1 == null || typeof item1.attr_value1 == "undefined") ? "" : item1.attr_value1;
                                                    item_data.attr_value2 = (item1.attr_value2 == null || typeof item1.attr_value2 == "undefined") ? "" : item1.attr_value2;
                                                    item_data.attr_value3 = (item1.attr_value3 == null || typeof item1.attr_value3 == "undefined") ? "" : item1.attr_value3;
                                                    item_data.attr_value4 = (item1.attr_value4 == null || typeof item1.attr_value4 == "undefined") ? "" : item1.attr_value4;
                                                    item_data.attr_value5 = (item1.attr_value5 == null || typeof item1.attr_value5 == "undefined") ? "" : item1.attr_value5;
                                                    item_data.attr_value6 = (item1.attr_value6 == null || typeof item1.attr_value6 == "undefined") ? "" : item1.attr_value6;
                                                    item_data.cost = item1.avg_buying_cost;
                                                    item_data.temp_cost = item1.avg_buying_cost;
                                                    item_data.pre_selling_price = item1.pre_price;
                                                    item_data.pre_alter_price_1 = item1.alter_price_1;
                                                    item_data.pre_alter_price_2 = item1.alter_price_2;
                                                    item_data.pre_price_limit = item1.price_limit;
                                                    item_data.get_sku = "0"

                                                    if (CONTEXT.ENABLE_EXP_DAYS_MODE) {
                                                        if (item.attr_type1 == "exp_date") {
                                                            if (item.expiry_days != null && typeof item.expiry_days != "undefined" && item.expiry_days != "" && item.expiry_days != "0") {
                                                                var today = new Date();
                                                                var numberOfDaysToAdd = parseInt(item.expiry_days);
                                                                today.setDate(today.getDate() + numberOfDaysToAdd);
                                                                var year = today.getFullYear();
                                                                var month = (today.getMonth() + 1) < 9 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1;
                                                                var date = (today.getDate()) < 10 ? "0" + today.getDate() : today.getDate();
                                                                item_data.attr_value1 = year + "-" + month + "-" + date;
                                                            }
                                                        }
                                                    }
                                                    page.controls.grdPOItems.createRow(item_data);
                                                }
                                            });
                                        }
                                        else {
                                            if (item.attr_type1 == "cost") {
                                                item.attr_value1 = item.buying_cost;
                                                row.find("input[dataField=attr_value1]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            }
                                            if (item.attr_type2 == "cost") {
                                                item.attr_value2 = item.buying_cost;
                                                row.find("input[dataField=attr_value2]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            }
                                            if (item.attr_type3 == "cost") {
                                                item.attr_value3 = item.buying_cost;
                                                row.find("input[dataField=attr_value3]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            }
                                            if (item.attr_type4 == "cost") {
                                                item.attr_value4 = item.buying_cost;
                                                row.find("input[dataField=attr_value4]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            }
                                            if (item.attr_type5 == "cost") {
                                                item.attr_value5 = item.buying_cost;
                                                row.find("input[dataField=attr_value5]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            }
                                            if (item.attr_type6 == "cost") {
                                                item.attr_type6 = item.buying_cost;
                                                row.find("input[dataField=attr_value6]").val(item.buying_cost).change();
                                                item.cost = item.buying_cost;
                                                row.find("input[dataField=cost]").val(item.buying_cost).change();
                                            }
                                        }
                                        page.setAttributes(row, item);
                                        if (data[0].pre_price != "" && data[0].pre_price != null && typeof data[0].pre_price != "undefined") {
                                            var profit = parseFloat(((parseFloat(data[0].pre_price) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                                            profit = (isNaN(profit) || profit == "Infinity") ? "100" : profit;
                                            $(row).find("[datafield=pre_selling_price]").html(data[0].pre_price + " (" + profit + "%)");
                                        }
                                        if (data[0].alter_price_1 != "" && data[0].alter_price_1 != null && typeof data[0].alter_price_1 != "undefined") {
                                            profit = parseFloat(((parseFloat(data[0].alter_price_1) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                                            profit = (isNaN(profit) || profit == "Infinity") ? "100" : profit;
                                            $(row).find("[datafield=pre_alter_price_1]").html(data[0].alter_price_1 + " (" + profit + "%)");
                                        }
                                        if (data[0].alter_price_2 != "" && data[0].alter_price_2 != null && typeof data[0].alter_price_2 != "undefined") {
                                            profit = parseFloat(((parseFloat(data[0].alter_price_2) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                                            profit = (isNaN(profit) || profit == "Infinity") ? "100" : profit;
                                            $(row).find("[datafield=pre_alter_price_2]").html(data[0].alter_price_2 + " (" + profit + "%)");
                                        }
                                    });
                                }
                            }
                            else {
                                if (item.attr_type1 == "cost") {
                                    item.attr_value1 = item.buying_cost;
                                    row.find("input[dataField=attr_value1]").val(item.buying_cost).change();
                                    item.cost = item.buying_cost;
                                    row.find("input[dataField=cost]").val(item.buying_cost).change();
                                }
                                if (item.attr_type2 == "cost") {
                                    item.attr_value2 = item.buying_cost;
                                    row.find("input[dataField=attr_value2]").val(item.buying_cost).change();
                                    item.cost = item.buying_cost;
                                    row.find("input[dataField=cost]").val(item.buying_cost).change();
                                }
                                if (item.attr_type3 == "cost") {
                                    item.attr_value3 = item.buying_cost;
                                    row.find("input[dataField=attr_value3]").val(item.buying_cost).change();
                                    item.cost = item.buying_cost;
                                    row.find("input[dataField=cost]").val(item.buying_cost).change();
                                }
                                if (item.attr_type4 == "cost") {
                                    item.attr_value4 = item.buying_cost;
                                    row.find("input[dataField=attr_value4]").val(item.buying_cost).change();
                                    item.cost = item.buying_cost;
                                    row.find("input[dataField=cost]").val(item.buying_cost).change();
                                }
                                if (item.attr_type5 == "cost") {
                                    item.attr_value5 = item.buying_cost;
                                    row.find("input[dataField=attr_value5]").val(item.buying_cost).change();
                                    item.cost = item.buying_cost;
                                    row.find("input[dataField=cost]").val(item.buying_cost).change();
                                }
                                if (item.attr_type6 == "cost") {
                                    item.attr_type6 = item.buying_cost;
                                    row.find("input[dataField=attr_value6]").val(item.buying_cost).change();
                                    item.cost = item.buying_cost;
                                    row.find("input[dataField=cost]").val(item.buying_cost).change();
                                }
                                page.setAttributes(row, item);
                            }
                        }
                    }

                    
                    row.on("keydown", "input[datafield=temp_free_qty]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            var nextRow = $(this).closest("grid_row").next();
                            if (nextRow.length == 0) {
                                page.controls.txtItemSearch.selectedObject.focus().select();
                            } else {
                                row.find("input[datafield=temp_free_qty]").focus().select();
                            }
                        }
                    });

                    page.calculate();
                };
                
                page.controls.grdPOItems.dataBind(data);
                page.calculateDelivery();
                page.controls.grdPOItems.edit(true);
            },
            selectedReturnPOItems: function (data) {
                $$("grdReturnPOItems").width("110%");
                $$("grdReturnPOItems").height("350px");
                $$("grdReturnPOItems").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no" },
                        { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "160px", 'dataField': "item_name", editable: false },
                        { 'name': "Ordered", 'rlabel': 'Ordered', 'width': "90px", 'dataField': "ordered_qty",visible:false },//, editable: false },
                        { 'name': "Returned", 'rlabel': 'Returned', 'width': "90px", 'dataField': "qty_returned" },//, editable: false },
                        { 'name': "Stocked", 'rlabel': 'Stocked', 'width': "80px", 'dataField': "qty", editable: false, },
                        { 'name': "Delivered", 'rlabel': 'Delivered', 'width': "100px", 'dataField': "delivered", editable: false, visible: false },
                        { 'name': "Unit", 'rlabel': 'Unit', 'width': "80px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                        { 'name': "Attributes", 'rlabel': 'Attributes', 'width': "350px", itemTemplate: "<div  id='Attributes'></div>" },
                        { 'name': "To Return", 'rlabel': 'To Return', 'width': "100px", 'dataField': "ret_qty", editable: true },
                        
                        { 'name': "Item No", 'rlabel': 'Item No', 'width': "60px", 'dataField': "item_no", editable: false },
                        { 'name': "Rack No", 'rlabel': 'Rack No', 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                        { 'name': "Buying Cost", 'rlabel': 'Buying Cost', 'width': "90px", 'dataField': "buying_cost" },//, editable: false },
                        { 'name': "Tax(%)", 'rlabel': 'GST', 'width': "120px", 'dataField': "tax_per", },
                        
                        { 'name': "Tray", 'rlabel': 'Tray', 'width': "80px", 'dataField': "tray_count", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                        { 'name': "", 'width': "0px", 'dataField': "cost" },
                        { 'name': "", 'width': "0px", 'dataField': "tax_per" },
                        
                        { 'name': "", 'width': "0px", 'dataField': "tax_class_no", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "attr_type1", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "attr_type2", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "attr_type3", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "attr_type4", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "attr_type5", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "attr_type6", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "sku_no", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "var_attr_key", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "var_stock_attr_key", visible: false },


                    ]
                });

                page.controls.grdReturnPOItems.rowBound = function (row, item) {
                    $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdReturnPOItems.allData().length);
                    item.unit_identity = "0";
                    var attrTemplate = [];
                    if (item.var_stock_attr_key.split != "" && item.var_stock_attr_key.split != null && typeof item.var_stock_attr_key.split != "undefined") {
                        if (item.var_stock_attr_key.split(",").length - 1 >= 0) {
                            if (item.attr_type1 == "exp_date" || item.attr_type1 == "man_date") {
                                attrTemplate.push("<input type='date' dataField='attr_value1' style='width:130px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[0]) + "' >");
                            }
                            else {
                                attrTemplate.push("<input type='text' dataField='attr_value1' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[0]) + "' >");
                            }
                        }
                        if (item.var_stock_attr_key.split(",").length - 1 >= 1) {
                            if (item.attr_type2 == "man_date") {
                                attrTemplate.push("<input type='date' dataField='attr_value2' style='width:130px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[1]) + "' >");
                            }
                            else {
                                attrTemplate.push("<input type='text' dataField='attr_value2' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[1]) + "' >");
                            }
                        }
                        if (item.var_stock_attr_key.split(",").length - 1 >= 2) {
                            attrTemplate.push("<input type='text' dataField='attr_value3' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[2]) + "' >");
                        }
                        if (item.var_stock_attr_key.split(",").length - 1 >= 3) {
                            attrTemplate.push("<input type='text' dataField='attr_value4' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[3]) + "' >");
                        }
                        if (item.var_stock_attr_key.split(",").length - 1 >= 4) {
                            attrTemplate.push("<input type='text' dataField='attr_value5' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[4]) + "' >");
                        }
                        if (item.var_stock_attr_key.split(",").length - 1 >= 5) {
                            attrTemplate.push("<input type='text' dataField='attr_value6' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[5]) + "' >");
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
                    }

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

                    $(row).find("[id=itemUnit]").change(function () {
                        if ($(this).val() == "0") {
                            item.ordered_qty = parseFloat(item.ordered_qty) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=ordered_qty]").find("div").html(parseFloat(item.ordered_qty));

                            item.qty_returned = parseFloat(item.qty_returned) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=qty_returned]").find("div").html(parseFloat(item.qty_returned));

                            item.qty = parseFloat(item.qty) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=qty]").find("div").html(parseFloat(item.qty));

                            item.delivered = parseFloat(item.delivered) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=delivered]").find("div").html(parseFloat(item.delivered));

                            $(row).find("[id=itemUnit]").val(0);
                            item.unit_identity = 0;
                            $(row).find("[datafield=unit_identity]").find("div").html(0);
                        }
                        else {
                            item.ordered_qty = parseFloat(item.ordered_qty) / parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=ordered_qty]").find("div").html(parseFloat(item.ordered_qty));

                            item.qty_returned = parseFloat(item.qty_returned) / parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=qty_returned]").find("div").html(parseFloat(item.qty_returned));

                            item.qty = parseFloat(item.qty) / parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=qty]").find("div").html(parseFloat(item.qty));

                            item.delivered = parseFloat(item.delivered) / parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=delivered]").find("div").html(parseFloat(item.delivered));

                            $(row).find("[id=itemUnit]").val(1);
                            item.unit_identity = 1;
                            $(row).find("[datafield=unit_identity]").find("div").html(1);
                        }
                        var txtAmount = $(row).find("[datafield=total_price]").find("div");
                        var txtAmountVal = $(row).find("[datafield=total_price_const]").find("div").html();
                        var ret_qty = $(row).find("[datafield=ret_qty]").find("div").html();
                        var qty = $(row).find("[datafield=qty_const]").find("div").html();
                        item.total_price = parseFloat(row.find("[datafield=total_price]").text());
                        var total = 0;
                        var paidAmt = 0;
                        var remAmt = 0;
                        total = ((item.total_price_const) / item.qty_const) * item.ret_qty;
                        paidAmt = parseFloat(paidAmt) + parseFloat(total);
                        remAmt = page.controls.lblTotal.value() - total;
                        txtAmount.html(parseFloat(paidAmt).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                    });

                    //if (item.unit_identity == "1") {
                    //    item.ordered_qty = parseFloat(item.ordered_qty) / parseFloat(item.alter_unit_fact);
                    //    $(row).find("[datafield=ordered_qty]").find("div").html(parseFloat(item.ordered_qty));

                    //    item.qty_returned = parseFloat(item.qty_returned) / parseFloat(item.alter_unit_fact);
                    //    $(row).find("[datafield=qty_returned]").find("div").html(parseFloat(item.qty_returned));

                    //    item.qty = parseFloat(item.qty) / parseFloat(item.alter_unit_fact);
                    //    $(row).find("[datafield=qty]").find("div").html(parseFloat(item.qty));

                    //    item.delivered = parseFloat(item.delivered) / parseFloat(item.alter_unit_fact);
                    //    $(row).find("[datafield=delivered]").find("div").html(parseFloat(item.delivered));

                    //    $(row).find("[id=itemUnit]").val(1);
                    //}
                    row.on("change", "input[datafield=ret_qty]", function () {
                        var txtAmount = $(row).find("[datafield=total_price]").find("div");
                        var txtAmountVal = $(row).find("[datafield=total_price_const]").find("div").html();
                        var ret_qty = $(row).find("[datafield=ret_qty]").find("div").html();
                        var qty = $(row).find("[datafield=qty_const]").find("div").html();
                        item.total_price = parseFloat(row.find("[datafield=total_price]").text());
                        var total = 0;
                        var paidAmt = 0;
                        var remAmt = 0;
                        total = ((item.total_price_const) / item.qty_const) * item.ret_qty;
                        paidAmt = parseFloat(paidAmt) + parseFloat(total);
                        remAmt = page.controls.lblTotal.value() - total;
                        txtAmount.html(parseFloat(paidAmt).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                    });
                    row.on("keydown", "input[datafield=ret_qty]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            try {
                                if (item.qty_type == "Integer" && CheckDecimal(item.ret_qty)) {
                                    throw "Incorrect Quantity Type";
                                }
                                if (item.qty_type == "Decimal" && !CheckDecimal(item.ret_qty)) {
                                    throw "Incorrect Quantity Type";
                                }
                            }
                            catch (e) {
                                alert(e);
                                row.find("input[datafield=ret_qty]").focus().select();
                            }
                        }
                    });
                }
                /*$$("grdReturnPOItems").selectionChanged = function (row, rowId) {
                    var total = 0;
                    var sub_total = 0;
                    var discount = 0;
                    var tax = 0;
                    var paidAmt = 0;
                    var remAmt = 0;
                    $(page.controls.grdReturnPOItems.selectedData()).each(function (i, item) {
                        total = parseFloat(parseFloat(total) + (parseFloat(item.ret_qty)*parseFloat(item.cost))).toFixed(5);
                        //sub_total = parseFloat(parseFloat(sub_total) + parseFloat(item.cost)).toFixed(5);
                       // discount = parseFloat(parseFloat(discount) + parseFloat(item.discount)).toFixed(5);

                       // tax = parseFloat(parseFloat(tax) + (parseFloat(item.cost) * parseFloat(item.qty) - parseFloat(item.total_price) - parseFloat(item.discount))).toFixed(5);
                    });
                    paidAmt = parseFloat(paidAmt) + parseFloat(total);
                    remAmt = page.controls.lblTotalAmtRemaining.html() - total;
                    page.controls.lblTotalAmtPaid.html(paidAmt);
                    page.controls.lblTotalAmtRemaining.html(remAmt);
                    //page.interface.setBillAmount(total);
                   // page.controls.lblDiscount.value(discount);
                    //page.controls.lblTax.value(Math.abs(tax));
                };*/
                page.controls.grdReturnPOItems.dataBind(data);
                $$("grdReturnPOItems").edit(true);
            },
            selectedReturnedPOItems: function (data) {
                $$("grdReturnedPOItems").width("100%");
                $$("grdReturnedPOItems").height("220px");
                $$("grdReturnedPOItems").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Item No", 'width': "60px", 'dataField': "item_no", editable: false },
                        { 'name': "Bill No", 'width': "60px", 'dataField': "bill_no", editable: false },
                        { 'name': "Item Name", 'width': "120px", 'dataField': "item_name", editable: false },
                        { 'name': "Max Qty", 'width': "60px", 'dataField': "qty", editable: true, },
                        { 'name': "Return Qty", 'width': "100px", 'dataField': "qty_returned", editable: true },
                        { 'name': "Expiry Date", 'width': "100px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                        { 'name': "Batch No", 'width': "80px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO },
                        { 'name': "Unit", 'width': "60px", 'dataField': "unit", editable: false },
                    //    { 'name': "Cost", 'width': "70px", 'dataField': "price", },
                        { 'name': "MRP", 'width': "70px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP },
                        { 'name': "Total", 'width': "90px", 'dataField': "total_price" },//, editable: false },

                    ]
                });
                page.controls.grdReturnedPOItems.dataBind(data);
            },
            selectedPendingPayment: function (data) {
                $$("grdPendingPayment").width("100%");
                $$("grdPendingPayment").height("220px");
                $$("grdPendingPayment").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "PO No", 'rlabel': 'PO No', 'width': "100px", 'dataField': "po_no" },
                        { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "80px", 'dataField': "bill_no", visible: false },
                        { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "120px", 'dataField': "bill_code" },
                        { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "120px", 'dataField': "bill_type" },
                        { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "120px", 'dataField': "bill_date" },
                        { 'name': "Total Amount", 'rlabel': 'Total Amount', 'width': "120px", 'dataField': "total" },

                        { 'name': "Payment Date", 'rlabel': 'Payment Date', 'width': "130px", 'dataField': "pay_date", visible: $$("ddlBillView").selectedValue() == "Payment View" },
                        { 'name': "Total Paid", 'rlabel': 'Paid', 'width': "130px", 'dataField': "total_paid", visible: $$("ddlBillView").selectedValue() == "Payment View" },
                        { 'name': "Amount ", 'rlabel': 'Amount', 'width': "100px", 'dataField': "amount", visible: $$("ddlBillView").selectedValue() == "Payment View" },

                        { 'name': "Paid", 'rlabel': 'Paid', 'width': "120px", 'dataField': "total_paid_amount", visible: $$("ddlBillView").selectedValue() != "Payment View" },
                        { 'name': "Balance", 'rlabel': 'Balance', 'width': "120px", 'dataField': "balance", visible: $$("ddlBillView").selectedValue() != "Payment View" },
                        { 'name': "Amount Pay", 'rlabel': 'Amount Pay', 'width': "120px", 'dataField': "amount_pay", editable: true, visible: $$("ddlBillView").selectedValue() != "Payment View" },
                        { 'name': "", 'width': "40px", 'dataField': "", itemTemplate: "<input type='button'  class='grid-button' value='' action='Delete' style='background-image: url(cancel.png);    background-size: contain;    background-color: transparent;    width: auto;background-repeat: no-repeat;    width: 15px;    border: none;    cursor: pointer;'/>" },

                    ]
                });
                page.controls.grdPendingPayment.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "Delete") {
                        page.controls.grdPendingPayment.deleteRow(rowId);
                    }
                }
                page.controls.grdPendingPayment.dataBind(data);
                page.controls.grdPendingPayment.edit(true);
            },
            selectedReturnDeliveryPOItems: function (data) {
                $$("grdReturnDeliveryPOItems").width("1250px");
                $$("grdReturnDeliveryPOItems").height("220px");
                $$("grdReturnDeliveryPOItems").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Item No", 'width': "100px", 'dataField': "item_no", editable: false },
                        { 'name': "Item Name", 'width': "120px", 'dataField': "item_name", editable: false },
                        { 'name': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                        { 'name': "Cancelled", 'width': "90px", 'dataField': "qty_cancelled", editable: false, },
                        { 'name': "Delivered", 'width': "90px", 'dataField': "qty_delivered", editable: false },
                        { 'name': "Stocked", 'width': "90px", 'dataField': "qty_stocked", editable: false, },

                        { 'name': "To Return", 'width': "100px", 'dataField': "ret_qty", editable: true },
                         { 'name': "Buying Cost", 'width': "90px", 'dataField': "buying_cost", visible: false },
                         { 'name': "Variation", 'width': "120px", 'dataField': "variation_name", visible: false },
                        { 'name': "MRP", 'width': "70px", 'dataField': "mrp", visible: false },
                        { 'name': "Expiry Date", 'width': "100px", 'dataField': "expiry_date", visible: false }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                        { 'name': "Batch No", 'width': "80px", 'dataField': "batch_no", visible: false },
                       // { 'name': "Price to return", 'width': "160px", 'dataField': "item_price" },
                        { 'name': "Tray", 'width': "80px", 'dataField': "tray_count", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                        { 'name': "", 'width': "0px", 'dataField': "var_no" },
                    ]
                });
                page.controls.grdReturnDeliveryPOItems.rowBound = function (row, item) {

                    if (item.unit_identity == "1") {
                        item.qty_cancelled = parseFloat(item.qty_cancelled) / parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=qty_cancelled]").find("div").html(parseFloat(item.qty_cancelled));

                        item.qty_delivered = parseFloat(item.qty_delivered) / parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=qty_delivered]").find("div").html(parseFloat(item.qty_delivered));

                        item.qty_stocked = parseFloat(item.qty_stocked) / parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=qty_stocked]").find("div").html(parseFloat(item.qty_stocked));

                        $(row).find("[id=itemUnit]").val(1);
                    }

                    row.on("change", "input[datafield=ret_qty]", function () {
                        // var tot_price = item.ret_qty * item.cost;
                        var txtAmount = $(row).find("[datafield=total_price]").find("div");
                        var txtAmountVal = $(row).find("[datafield=total_price_const]").find("div").html();
                        var ret_qty = $(row).find("[datafield=ret_qty]").find("div").html();
                        var qty = $(row).find("[datafield=qty_const]").find("div").html();
                        //txtAmount.html(parseFloat(tot_price).toFixed(5));
                        item.total_price = parseFloat(row.find("[datafield=total_price]").text());
                        var total = 0;
                        var paidAmt = 0;
                        var remAmt = 0;
                        //total = (txtAmountVal / qty) * ret_qty;
                        total = ((item.total_price_const) / item.qty_const) * item.ret_qty;
                        //$(page.controls.grdReturnPOItems.selectedData()).each(function (i, item) {
                        //total = parseFloat(parseFloat(total) + ((parseFloat(item.total_price_const)/parseFloat(item.qty))*parseFloat(item.ret_qty))).toFixed(5);
                        // });
                        paidAmt = parseFloat(paidAmt) + parseFloat(total);
                        remAmt = page.controls.lblTotal.value() - total;
                        txtAmount.html(parseFloat(paidAmt).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        // page.controls.lblTotalAmtPaid.html(paidAmt);
                        // page.controls.lblTotalAmtRemaining.html(remAmt);
                    });
                }
                page.controls.grdReturnDeliveryPOItems.dataBind(data);
                $$("grdReturnDeliveryPOItems").edit(true);
            },
            UIState: function (state) {
                if (state == "Load") {
                    $$("btnOrderPO").hide();
                    $$("btnDeliveredPO").hide();
                    $$("btnCompletedPO").hide();
                    $$("btnInvoiceMatchedPO").hide();
                    $$("btnAddToStock").hide();
                    page.controls.btnAddToStock.selectedObject.next().hide();
                    $$("btnAddPartialToStock").hide();
                    $$("btnInvoiceConfirmedPO").hide();
                    $$("btnReturnPOItem").hide();
                    $$("btnCompleteReturnPOItem").hide();
                    page.controls.btnCompleteReturnPOItem.selectedObject.prev().hide();

                    //  $$("btnAddItemToPO").hide();
                    $$("btnSavePO").hide();
                    $$("btnRemovePO").hide();
                    page.controls.btnRemovePO.selectedObject.next().hide();
                    $$("btnReturnPO").hide();
                    page.controls.btnReturnPO.selectedObject.next().hide();
                    $$("btnPayInvoiceAmount").hide();
                    $$("btnPickReorder").hide();
                    $$("btnAddNewItem").hide();
                    $("#lblCancelDisplay").show();
                    $("#lblCompletedDisplay").show();
                    $("#lblOrderedDisplay").css('color', "Black");
                    $("#lblInvoiceMatchedDisplay").css('color', "Black");
                    $("#lblConfirmedDisplay").css('color', "Black");
                    $("#lblCreatedDisplay").css('color', "Black");
                    $("#lblDeliveredDisplay").css('color', "Black");
                    $("#lblCancelDisplay").css('color', "Black");
                    $("#lblReturnDisplay").css('color', "Black");
                    $("#lblCompletedDisplay").css('color', "Black");
                    $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(true);
                    $$("dsPODueDate").disable(true);
                    $$("pnlBillSummary").hide();
                    $$("pnlTransaction").hide();
                    $$("pnlBillTransaction").hide();
                    $$("pnlItemActions").hide();
                    $$("btnStocked").hide();
                    $$("btnSavePOItem").hide();
                    $$("btnReceivePayment").hide();
                    page.controls.btnReceivePayment.selectedObject.next().hide();
                    $$("btnRecreatePO").hide();
                    page.controls.btnRecreatePO.selectedObject.next().hide();

                }
                if (state == "Created") {

                    $$("btnOrderPO").show();
                    $$("btnDeliveredPO").hide();
                    $$("btnCompletedPO").hide();
                    $$("btnAddToStock").hide();
                    page.controls.btnAddToStock.selectedObject.next().hide();
                    $$("btnAddPartialToStock").hide();
                    page.controls.btnAddPartialToStock.selectedObject.next().hide();
                    $$("btnInvoiceConfirmedPO").hide();
                    $$("btnReturnPO").hide();
                    page.controls.btnReturnPO.selectedObject.next().hide();
                    $$("btnSavePO").show();
                    $$("btnInvoiceMatchedPO").hide();
                    $$("btnInvoicePO").hide();
                    page.controls.btnInvoicePO.selectedObject.next().hide();

                    $$("btnRemovePO").show();
                    page.controls.btnRemovePO.selectedObject.next().show();
                    $$("btnPayInvoiceAmount").hide();
                    page.controls.btnPayInvoiceAmount.selectedObject.next().hide();
                    $$("btnPickReorder").show();
                    $$("btnAddNewItem").show();
                    $$("btnReturnPOItem").hide();
                    $$("btnCompleteReturnPOItem").hide();
                    page.controls.btnCompleteReturnPOItem.selectedObject.prev().hide();

                    $$("ddlPOVendor").disable(false);
                    $$("dsPOExpectedDate").disable(false);
                    $("#lblCancelDisplay").show();
                    $("#lblCompletedDisplay").show();
                    $("#lblCreatedDisplay").css('color', "lightgreen");
                    $("#lblOrderedDisplay").css('color', "Black");
                    $("#lblDeliveredDisplay").css('color', "Black");
                    $("#lblCancelDisplay").css('color', "Black");
                    $("#lblReturnDisplay").css('color', "Black");
                    $("#lblInvoiceMatchedDisplay").css('color', "Black");
                    $("#lblConfirmedDisplay").css('color', "Black");
                    $("#lblCompletedDisplay").css('color', "Black");
                    $("#lblStockedDisplay").css('color', "Black");
                    $$("pnlItemSearch").show();

                    $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(true);
                    $$("dsPODueDate").disable(true);
                    $$("pnlBillSummary").hide();
                    $$("pnlTransaction").hide();
                    $$("pnlBillTransaction").hide();
                    $$("pnlOrderDate").hide();
                    $$("pnlDeliDate").hide();
                    $$("pnlItemActions").hide();
                    $$("btnStocked").hide();
                    $$("btnSavePOItem").hide();
                    $$("btnReceivePayment").hide();
                    page.controls.btnReceivePayment.selectedObject.next().hide();
                    page.controls.btnReturnPO.selectedObject.next().hide();
                    $$("btnRecreatePO").hide();
                    page.controls.btnRecreatePO.selectedObject.next().hide();

                }
                if (state == "Ordered") {
                    $$("btnOrderPO").hide();
                    $$("btnDeliveredPO").hide();
                    $$("btnCompletedPO").hide();
                    $$("btnAddToStock").hide();
                    page.controls.btnAddToStock.selectedObject.next().hide();
                    $$("btnAddPartialToStock").hide();
                    $$("btnInvoiceMatchedPO").hide();
                    $$("btnInvoiceConfirmedPO").show();
                    $$("btnReturnPOItem").hide();
                    $$("btnCompleteReturnPOItem").hide();
                    page.controls.btnCompleteReturnPOItem.selectedObject.prev().hide();
                    //  $$("btnAddItemToPO").hide();
                    $$("btnSavePO").hide();
                    $$("btnRemovePO").show();
                    page.controls.btnRemovePO.selectedObject.next().show();
                    $$("btnPayInvoiceAmount").hide();
                    $("#lblCancelDisplay").show();
                    $("#lblCompletedDisplay").show();
                    $("#lblCreatedDisplay").css('color', "lightgreen");
                    $("#lblOrderedDisplay").css('color', "lightgreen");
                    $("#lblDeliveredDisplay").css('color', "Black");
                    $("#lblCancelDisplay").css('color', "Black");
                    $("#lblInvoiceMatchedDisplay").css('color', "Black");
                    $("#lblReturnDisplay").css('color', "Black");
                    $("#lblCompletedDisplay").css('color', "Black");
                    $("#lblConfirmedDisplay").css('color', "Black");
                    $("#lblStockedDisplay").css('color', "Black");
                    $$("btnReturnPO").hide();
                    page.controls.btnReturnPO.selectedObject.next().hide();
                    $$("pnlItemSearch").hide();
                    $$("btnPickReorder").hide();
                    $$("btnInvoicePO").show();
                    $$("btnAddNewItem").hide();
                    page.controls.btnInvoicePO.selectedObject.next().show();

                    $$("ddlPOVendor").disable(true);
                    $$("dsPOExpectedDate").disable(true);

                    $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(false);
                    $$("dsPODueDate").disable(false);
                    $$("pnlOrderDate").show();
                    $$("pnlBillSummary").show();
                    $$("pnlTransaction").hide();
                    $$("pnlBillTransaction").hide();
                    $$("pnlItemActions").hide();
                    $$("btnStocked").hide();
                    $$("btnSavePOItem").hide();
                    $$("btnReceivePayment").hide();
                    page.controls.btnReceivePayment.selectedObject.next().hide();
                    page.controls.btnPayInvoiceAmount.selectedObject.next().hide();
                    $$("btnRecreatePO").show();
                    page.controls.btnRecreatePO.selectedObject.next().hide();

                }

                if (state == "Confirmed") {
                    $$("btnOrderPO").hide();
                    $$("btnDeliveredPO").show();
                    $$("btnCompletedPO").hide();
                    $$("btnAddToStock").show();
                    page.controls.btnAddToStock.selectedObject.next().show();
                    $$("btnAddPartialToStock").hide();
                    $$("btnInvoiceMatchedPO").hide();
                    $$("btnInvoiceConfirmedPO").hide();
                    $$("btnReturnPOItem").hide();
                    page.controls.btnReturnPOItem.selectedObject.prev().hide();
                    $$("btnCompleteReturnPOItem").hide();
                    page.controls.btnCompleteReturnPOItem.selectedObject.prev().hide();
                    page.controls.btnReturnPO.selectedObject.next().show();
                    // $$("btnAddItemToPO").hide();
                    $$("btnSavePO").hide();
                    $$("btnRemovePO").hide();
                    page.controls.btnRemovePO.selectedObject.next().hide();
                    $$("btnPayInvoiceAmount").show();
                    page.controls.btnPayInvoiceAmount.selectedObject.next().show();
                    $("#lblCancelDisplay").show();
                    $("#lblReturnDisplay").hide();
                    $("#lblCompletedDisplay").show();
                    $("#lblCreatedDisplay").css('color', "lightgreen");
                    $("#lblOrderedDisplay").css('color', "lightgreen");
                    $("#lblDeliveredDisplay").css('color', "Black");
                    $("#lblCancelDisplay").css('color', "Black");
                    $("#lblInvoiceMatchedDisplay").css('color', "Black");
                    $("#lblReturnDisplay").css('color', "Black");
                    $("#lblCompletedDisplay").css('color', "Black");
                    $("#lblConfirmedDisplay").css('color', "lightgreen");
                    $("#lblStockedDisplay").css('color', "Black");
                    $$("btnReturnPO").show();
                    $$("pnlItemSearch").hide();
                    $$("btnPickReorder").hide();
                    $$("btnAddNewItem").hide();
                    $$("btnInvoicePO").show();
                    page.controls.btnInvoicePO.selectedObject.next().show();

                    $$("ddlPOVendor").disable(true);
                    $$("dsPOExpectedDate").disable(true);

                    $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(true);
                    $$("dsPODueDate").disable(true);
                    $$("pnlBillSummary").show();
                    $$("pnlTransaction").show();
                    $$("pnlBillTransaction").show();

                    $$("btnStocked").hide();
                    $$("btnSavePOItem").hide();
                    $$("btnReceivePayment").show();
                    page.controls.btnAddPartialToStock.selectedObject.next().show();
                    $$("pnlOrderDate").show();

                    $$("pnlItemActions").show();

                    $$("btnReceiveDelivery").show();
                    page.controls.btnReceiveDelivery.selectedObject.next().show();
                    $$("btnReturnDelivery").show();
                    //page.controls.btnReturnDelivery.selectedObject.next().show();
                    $$("btnAddToStock").show();
                    page.controls.btnAddToStock.selectedObject.next().show();
                    
                    if (CONTEXT.ENABLE_MODULE_TRAY == false) {
                        $$("btnReceiveTray").hide();
                        page.controls.btnReceiveTray.selectedObject.next().hide();
                        $$("btnReturnTray").hide();
                        page.controls.btnReturnTray.selectedObject.prev().hide();
                    }
                    $$("btnRecreatePO").hide();
                    page.controls.btnRecreatePO.selectedObject.next().hide();
                }


                if (state == "Delivered") {
                    $$("btnOrderPO").hide();
                    $$("btnDeliveredPO").hide();
                    $$("btnCompletedPO").hide();

                    $$("btnAddPartialToStock").hide();
                    $$("btnPayInvoiceAmount").show();
                    page.controls.btnPayInvoiceAmount.selectedObject.next().show();
                    $$("btnReturnPO").show();
                    page.controls.btnReturnPO.selectedObject.next().show();
                    $$("btnInvoiceMatchedPO").hide();
                    $$("btnInvoiceConfirmedPO").hide();

                    $$("btnInvoicePO").show();
                    page.controls.btnInvoicePO.selectedObject.next().show();

                    $$("btnAddItemToPO").hide();
                    $$("btnSavePO").hide();
                    $$("btnRemovePO").hide();
                    page.controls.btnRemovePO.selectedObject.next().hide();
                    $("#lblCancelDisplay").show();
                    $("#lblCompletedDisplay").show();
                    $$("ddlPOVendor").disable(true);
                    $$("dsPOExpectedDate").disable(true);
                    $("#lblCreatedDisplay").css('color', "lightgreen");
                    $("#lblOrderedDisplay").css('color', "lightgreen");
                    $("#lblDeliveredDisplay").css('color', "lightgreen");
                    $("#lblCancelDisplay").css('color', "Black");
                    $("#lblInvoiceMatchedDisplay").css('color', "Black");
                    $("#lblReturnDisplay").css('color', "Black");
                    $("#lblCompletedDisplay").css('color', "Black");
                    $$("pnlItemSearch").hide();
                    $$("btnPickReorder").hide();
                    $$("btnAddNewItem").hide();
                    $("#lblConfirmedDisplay").css('color', "lightgreen");
                    $("#lblStockedDisplay").css('color', "Black");

                    $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(true);
                    $$("dsPODueDate").disable(true);
                    $$("pnlDeliDate").show();

                    $$("pnlItemActions").show();

                    //Show the enabled action
                    $$("btnReceiveDelivery").hide();
                    $$("btnReceiveDelivery").selectedObject.next().hide();
                    $$("btnAddToStock").show();
                    page.controls.btnAddToStock.selectedObject.next().show();
                    $$("btnReturnDelivery").hide();
                    page.controls.btnReturnDelivery.selectedObject.next().hide();
                    $$("btnReturnPOItem").hide();
                    page.controls.btnReturnPOItem.selectedObject.prev().hide();
                    $$("btnCompleteReturnPOItem").hide();
                    page.controls.btnCompleteReturnPOItem.selectedObject.prev().hide();

                    $$("btnStocked").show();
                    $$("btnSavePOItem").hide();
                    $$("pnlBillSummary").show();
                    $$("pnlTransaction").show();
                    $$("pnlBillTransaction").show();
                    $$("btnReceivePayment").show();
                    // page.controls.btnAddPartialToStock.selectedObject.next().show();
                    $$("pnlOrderDate").show();

                    if (CONTEXT.ENABLE_MODULE_TRAY == false) {
                        $$("btnReceiveTray").hide();
                        page.controls.btnReceiveTray.selectedObject.next().hide();
                        $$("btnReturnTray").hide();
                        page.controls.btnReturnTray.selectedObject.prev().hide();
                    }
                    $$("btnRecreatePO").hide();
                    page.controls.btnRecreatePO.selectedObject.next().hide();
                }
                if (state == "Stocked") {
                    $$("btnOrderPO").hide();
                    $$("btnDeliveredPO").hide();
                    $$("btnCompletedPO").show();

                    $$("btnAddPartialToStock").hide();
                    $$("btnPayInvoiceAmount").show();
                    page.controls.btnPayInvoiceAmount.selectedObject.next().show();
                    $$("btnReturnPO").show();
                    page.controls.btnReturnPO.selectedObject.next().show();
                    $$("btnInvoiceMatchedPO").hide();
                    $$("btnInvoiceConfirmedPO").hide();
                    $$("btnReturnPOItem").show();
                    page.controls.btnReturnPOItem.selectedObject.prev().show();
                    $$("btnCompleteReturnPOItem").show();
                    page.controls.btnCompleteReturnPOItem.selectedObject.prev().show();
                    $$("btnInvoicePO").show();
                    page.controls.btnInvoicePO.selectedObject.next().show();

                    $$("btnAddItemToPO").hide();
                    $$("btnSavePO").hide();
                    $$("btnRemovePO").hide();
                    page.controls.btnRemovePO.selectedObject.next().hide();
                    $("#lblCancelDisplay").hide();
                    $("#lblCompletedDisplay").show();
                    $$("ddlPOVendor").disable(true);
                    $$("dsPOExpectedDate").disable(true);
                    $("#lblCreatedDisplay").css('color', "lightgreen");
                    $("#lblOrderedDisplay").css('color', "lightgreen");
                    $("#lblDeliveredDisplay").css('color', "lightgreen");
                    $("#lblCancelDisplay").css('color', "Black");
                    $("#lblInvoiceMatchedDisplay").css('color', "Black");
                    $("#lblReturnDisplay").css('color', "Black");
                    $("#lblCompletedDisplay").css('color', "Black");
                    $$("pnlItemSearch").hide();
                    $$("btnPickReorder").hide();
                    $$("btnAddNewItem").hide();
                    $("#lblConfirmedDisplay").css('color', "lightgreen");
                    $("#lblStockedDisplay").css('color', "lightgreen");

                    $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(true);
                    $$("dsPODueDate").disable(true);
                    $$("pnlDeliDate").show();
                    // $$("pnlItemActions").hide();
                    $$("btnStocked").hide();
                    $$("btnSavePOItem").hide();
                    $$("pnlBillSummary").show();
                    $$("pnlTransaction").show();
                    $$("pnlBillTransaction").show();
                    $$("btnReceivePayment").show();
                    //  page.controls.btnReceivePayment.selectedObject.next().show();

                    $$("pnlItemActions").show();
                    $$("btnAddToStock").hide();
                    page.controls.btnAddToStock.selectedObject.next().hide();
                    $$("btnReceiveDelivery").selectedObject.next().hide();
                    $$("btnReceiveDelivery").hide();
                    $$("btnReceiveDelivery").selectedObject.next().hide();
                    $$("pnlOrderDate").show();

                    //Show Enable Action
                    $$("btnAddToStock").hide();
                    page.controls.btnAddToStock.selectedObject.next().hide();
                    $$("btnReturnDelivery").hide();
                    page.controls.btnReturnDelivery.selectedObject.next().hide();

                    if (CONTEXT.ENABLE_MODULE_TRAY == false) {
                        $$("btnReceiveTray").hide();
                        page.controls.btnReceiveTray.selectedObject.next().hide();
                        $$("btnReturnTray").hide();
                        page.controls.btnReturnTray.selectedObject.prev().hide();
                    }
                    $$("btnRecreatePO").hide();
                    page.controls.btnRecreatePO.selectedObject.next().hide();
                }
                if (state == "Completed") {
                    $$("btnOrderPO").hide();
                    $$("btnDeliveredPO").hide();
                    $$("btnCompletedPO").hide();
                    $$("btnAddToStock").hide();
                    page.controls.btnAddToStock.selectedObject.next().hide();
                    $$("btnAddPartialToStock").hide();
                    $$("btnAddItemToPO").hide();
                    $$("btnSavePO").hide();
                    $$("btnRemovePO").hide();
                    page.controls.btnRemovePO.selectedObject.next().hide();
                    $$("btnPayInvoiceAmount").hide();
                    page.controls.btnPayInvoiceAmount.selectedObject.next().hide();
                    $$("btnInvoiceConfirmedPO").hide();

                    $$("btnInvoicePO").show();
                    page.controls.btnInvoicePO.selectedObject.next().show();

                    $$("btnReturnPO").hide();
                    page.controls.btnReturnPO.selectedObject.next().hide();
                    $("#lblCompletedDisplay").show();
                    $("#lblCreatedDisplay").css('color', "lightgreen");
                    $("#lblOrderedDisplay").css('color', "lightgreen");
                    $("#lblInvoiceMatchedDisplay").css('color', "lightgreen");
                    $("#lblDeliveredDisplay").css('color', "lightgreen");
                    $("#lblReturnDisplay").css('color', "Black");
                    $("#lblCancelDisplay").hide();
                    $("#lblReturnDisplay").hide();

                    $("#lblCompletedDisplay").css('color', "lightgreen");
                    $("#lblConfirmedDisplay").css('color', "lightgreen");
                    $("#lblStockedDisplay").css('color', "lightgreen");

                    $$("pnlItemSearch").hide();
                    $$("ddlPOVendor").disable(true);
                    $$("dsPOExpectedDate").disable(true);
                    $$("btnPickReorder").hide();
                    $$("btnAddNewItem").hide();

                    $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(true);
                    $$("dsPODueDate").disable(true);

                    $$("btnStocked").hide();
                    $$("btnSavePOItem").hide();
                    $$("pnlBillSummary").show();
                    $$("pnlTransaction").show();
                    $$("pnlBillTransaction").show();
                    $$("btnReceivePayment").show();
                    page.controls.btnReceivePayment.selectedObject.next().hide();
                    $$("pnlOrderDate").show();

                    $$("pnlItemActions").show();
                    $$("btnReceiveDelivery").hide();
                    page.controls.btnReceiveDelivery.selectedObject.next().hide();
                    $$("btnAddToStock").hide();
                    page.controls.btnAddToStock.selectedObject.next().hide();
                    $$("btnReturnPOItem").show();
                    page.controls.btnReturnPOItem.selectedObject.prev().show();
                    $$("btnCompleteReturnPOItem").show();
                    page.controls.btnCompleteReturnPOItem.selectedObject.prev().show();
                    $$("btnReturnDelivery").hide();
                    page.controls.btnReturnDelivery.selectedObject.next().hide();

                    if (CONTEXT.ENABLE_MODULE_TRAY == false) {
                        $$("btnReceiveTray").hide();
                        page.controls.btnReceiveTray.selectedObject.next().hide();
                        $$("btnReturnTray").hide();
                        page.controls.btnReturnTray.selectedObject.next().hide();
                    }
                    $$("btnRecreatePO").hide();
                    page.controls.btnRecreatePO.selectedObject.next().hide();
                }
                if (state == "Partial Delivered") { //Todo
                    $$("btnOrderPO").hide();
                    $$("btnDeliveredPO").show();
                    $$("btnCompletedPO").hide();
                    $$("btnAddToStock").show();
                    page.controls.btnAddToStock.selectedObject.next().show();
                    $$("btnAddPartialToStock").hide();
                    $$("btnAddItemToPO").hide();
                    $$("btnSavePO").hide();
                    $$("btnRemovePO").hide();
                    page.controls.btnRemovePO.selectedObject.next().hide();
                    $$("btnPayInvoiceAmount").show();
                    page.controls.btnPayInvoiceAmount.selectedObject.next().show();
                    $("#lblCancelDisplay").show();
                    $("#lblCompletedDisplay").show();
                    $$("btnReturnPOItem").show();

                    $$("pnlItemSearch").hide();
                    $$("ddlPOVendor").disable(true);
                    $$("dsPOExpectedDate").disable(true);
                    $$("btnPickReorder").hide();
                    $$("btnAddNewItem").hide();

                    //   $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(true);
                    $$("dsPODueDate").disable(true);
                    $$("btnInvoicePO").show();
                    page.controls.btnInvoicePO.selectedObject.next().show();
                    $$("pnlItemActions").show();
                    $$("btnStocked").hide();
                    $$("btnSavePOItem").hide();
                    $$("pnlBillSummary").show();
                    $$("pnlTransaction").show();
                    $$("pnlBillTransaction").show();
                    $$("btnReceivePayment").show();
                    page.controls.btnReceivePayment.selectedObject.next().show();
                    $$("pnlOrderDate").show();

                    if (CONTEXT.ENABLE_MODULE_TRAY == false) {
                        $$("btnReceiveTray").hide();
                        page.controls.btnReceiveTray.selectedObject.next().hide();
                        $$("btnReturnTray").hide();
                        page.controls.btnReturnTray.selectedObject.next().hide();
                    }
                }
                if (state == "Cancel") {
                    $$("btnOrderPO").hide();
                    $$("btnDeliveredPO").hide();
                    $$("btnCompletedPO").hide();
                    $$("btnAddToStock").hide();
                    page.controls.btnAddToStock.selectedObject.next().hide();
                    $$("btnAddPartialToStock").hide();
                    page.controls.btnAddPartialToStock.selectedObject.next().show();
                    $$("btnAddItemToPO").hide();
                    $$("btnInvoiceConfirmedPO").hide();
                    $$("btnReturnPOItem").hide();
                    $$("btnCompleteReturnPOItem").hide();
                    page.controls.btnCompleteReturnPOItem.selectedObject.prev().hide();

                    $$("btnSavePO").hide();
                    $$("btnPayInvoiceAmount").hide();
                    page.controls.btnPayInvoiceAmount.selectedObject.next().hide();
                    $$("btnInvoicePO").hide();
                    page.controls.btnInvoicePO.selectedObject.next().hide();

                    $$("btnRemovePO").hide();
                    page.controls.btnRemovePO.selectedObject.next().hide();
                    $$("btnReturnPO").hide();
                    page.controls.btnReturnPO.selectedObject.next().hide();
                    $("#lblCancelDisplay").show();
                    $("#lblCreatedDisplay").css('color', "lightgreen");
                    $("#lblOrderedDisplay").css('color', "lightgreen");
                    $("#lblDeliveredDisplay").css('color', "lightgreen");
                    $("#lblCancelDisplay").css('color', "lightgreen");
                    $("#lblConfirmedDisplay").css('color', "lightgreen");
                    $("#lblInvoiceMatchedDisplay").css('color', "Black");

                    $("#lblCompletedDisplay").css('color', "Black");
                    $("#lblCompletedDisplay").hide();
                    $$("pnlItemSearch").hide();
                    $$("btnPickReorder").hide();
                    $$("btnAddNewItem").hide();

                    //   $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(true);
                    $$("dsPODueDate").disable(true);
                    $$("pnlItemActions").hide();
                    $$("btnStocked").hide();
                    $$("btnSavePOItem").hide();
                    $$("pnlBillSummary").show();
                    $$("pnlTransaction").show();
                    $$("pnlBillTransaction").show();
                    $$("btnReceivePayment").show();
                    page.controls.btnReceivePayment.selectedObject.next().hide();
                    $$("pnlOrderDate").show();

                    if (CONTEXT.ENABLE_MODULE_TRAY == false) {
                        $$("btnReceiveTray").hide();
                        page.controls.btnReceiveTray.selectedObject.next().hide();
                        $$("btnReturnTray").hide();
                        page.controls.btnReturnTray.selectedObject.next().hide();
                    }
                    $$("btnRecreatePO").hide();
                    page.controls.btnRecreatePO.selectedObject.next().hide();
                }

                if (state == "Return") {
                    $$("btnOrderPO").hide();
                    $$("btnDeliveredPO").hide();
                    $$("btnCompletedPO").hide();
                    $$("btnPayInvoiceAmount").show();
                    page.controls.btnPayInvoiceAmount.selectedObject.next().show();
                    $$("btnInvoiceConfirmedPO").hide();
                    $$("btnReturnPOItem").show();
                    $$("btnCompleteReturnPOItem").hide();
                    page.controls.btnCompleteReturnPOItem.selectedObject.prev().hide();
                    $$("btnInvoicePO").hide();
                    page.controls.btnInvoicePO.selectedObject.next().hide();

                    $$("btnAddToStock").hide();
                    page.controls.btnAddToStock.selectedObject.next().hide();
                    $$("btnAddPartialToStock").hide();
                    $$("btnAddItemToPO").hide();
                    $$("btnSavePO").hide();
                    $$("btnRemovePO").hide();
                    page.controls.btnRemovePO.selectedObject.next().hide();
                    //$$("btnPayInvoiceAmount").hide();
                    $$("btnReturnPO").show();
                    page.controls.btnReturnPO.selectedObject.next().show();
                    $("#lblCancelDisplay").show();
                    $("#lblCreatedDisplay").css('color', "lightgreen");
                    $("#lblOrderedDisplay").css('color', "lightgreen");
                    $("#lblDeliveredDisplay").css('color', "lightgreen");
                    $("#lblCancelDisplay").css('color', "Black");
                    $("#lblReturnDisplay").css('color', "lightgreen");
                    $("#lblInvoiceMatchedDisplay").css('color', "Black");
                    $("#lblConfirmedDisplay").css('color', "lightgreen");
                    $("#lblCompletedDisplay").css('color', "Black");
                    $("#lblCompletedDisplay").show();
                    $$("pnlItemSearch").hide();
                    $$("btnPickReorder").hide();
                    $$("btnAddNewItem").hide();

                    //    $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(true);
                    $$("dsPODueDate").disable(true);
                    $$("pnlItemActions").hide();
                    $$("btnStocked").hide();
                    $$("btnSavePOItem").hide();
                    $$("pnlBillSummary").show();
                    $$("pnlTransaction").show();
                    $$("pnlBillTransaction").show();
                    $$("btnReceivePayment").show();
                    page.controls.btnReceivePayment.selectedObject.next().show();
                    $$("pnlOrderDate").show();

                    if (CONTEXT.ENABLE_MODULE_TRAY == false) {
                        $$("btnReceiveTray").hide();
                        page.controls.btnReceiveTray.selectedObject.next().hide();
                        $$("btnReturnTray").hide();
                        page.controls.btnReturnTray.selectedObject.next().hide();
                    }
                }


            }
        }
        function doneProfitCalculate(e) {
            if ($$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice]").val() != "" && $$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice]").val() != null && typeof $$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice]").val() != "undefined") {
                $(page.controls.grdPOItems.getAllRows()).each(function (i, row) {
                    var poItem = page.controls.grdPOItems.getRowData(row);
                    poItem.profit = $$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice]").val();
                    
                    var selling_price = parseFloat(parseFloat(poItem.net_rate) * ((100 + parseFloat($$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice]").val())) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                    poItem.selling_price = parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                    $(row).find("input[datafield=selling_price]").val(parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                });
            }
        }
        function donePrice1ProfitCalculate(e) {
            if ($$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice1]").val() != "" && $$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice1]").val() != null && typeof $$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice1]").val() != "undefined") {
                $(page.controls.grdPOItems.getAllRows()).each(function (i, row) {
                    var poItem = page.controls.grdPOItems.getRowData(row);
                    poItem.profit = $$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice1]").val();

                    var selling_price = parseFloat(parseFloat(poItem.net_rate) * ((100 + parseFloat($$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice1]").val())) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                    poItem.alter_price_1 = parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                    $(row).find("input[datafield=alter_price_1]").val(parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                });
            }
        }
        function donePrice2ProfitCalculate(e) {
            if ($$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice2]").val() != "" && $$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice2]").val() != null && typeof $$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice2]").val() != "undefined") {
                $(page.controls.grdPOItems.getAllRows()).each(function (i, row) {
                    var poItem = page.controls.grdPOItems.getRowData(row);
                    poItem.profit = $$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice2]").val();

                    var selling_price = parseFloat(parseFloat(poItem.net_rate) * ((100 + parseFloat($$("grdPOItems").selectedObject.find(".grid_header [id=profitPrice2]").val())) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                    poItem.alter_price_2 = parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                    $(row).find("input[datafield=alter_price_2]").val(parseFloat(selling_price).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                });
            }
        }
        page.check_variation = function (row, billItem) {
            billItem.vendor_no = $$("ddlPOVendor").selectedValue();
            //billItem.var_no = null;
            //billItem.variation_name = null;
            //billItem.free_var_no = null;
            //billItem.free_variation_name = null;


            $(billItem.variation_data).each(function (i, item) {
                // $(vari_item).each(function (j, item) {
                if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                    if (item.expiry_date != undefined && item.expiry_date != null && item.expiry_date != "") {
                        var len = item.expiry_date.length;
                        var month = item.expiry_date.substring(len - 7, len - 5);
                        var year = item.expiry_date.substring(len - 4, len);
                        item.expiry_date = month + "-" + year;
                    }
                    if (billItem.expiry_date != undefined && billItem.expiry_date != null && billItem.expiry_date != "") {
                        len = billItem.expiry_date.length;
                        month = billItem.expiry_date.substring(len - 7, len - 5);
                        year = billItem.expiry_date.substring(len - 4, len);
                        billItem.expiry_date = month + "-" + year;
                    }
                    if (item.man_date != undefined && item.man_date != null && item.man_date != "") {
                        len = item.man_date.length;
                        month = item.man_date.substring(len - 7, len - 5);
                        year = item.man_date.substring(len - 4, len);
                        item.man_date = month + "-" + year;
                    }
                    if (billItem.man_date != undefined && billItem.man_date != null && billItem.man_date != "") {
                        len = billItem.man_date.length;
                        month = billItem.man_date.substring(len - 7, len - 5);
                        year = billItem.man_date.substring(len - 4, len);
                        billItem.man_date = month + "-" + year;
                    }
                }
                if (typeof item.expiry_date == "undefined" || item.expiry_date == null || item.expiry_date == "") {
                    item.expiry_date = "";
                }
                if (typeof item.man_date == "undefined" || item.man_date == null || item.man_date == "") {
                    item.man_date = "";
                }
                if (typeof billItem.expiry_date == "undefined" || billItem.expiry_date == null || billItem.expiry_date == "") {
                    billItem.expiry_date = "";
                }
                if (typeof billItem.man_date == "undefined" || billItem.man_date == null || billItem.man_date == "") {
                    billItem.man_date = "";
                }
                if (!CONTEXT.ENABLE_VARIATION_VENDOR_NO) {
                    billItem.vendor_no = 0;
                    item.vendor_no = 0;
                }
                var billItem_mrp = isNaN(parseFloat(billItem.mrp)) ? 0 : billItem.mrp;
                var item_mrp = isNaN(parseFloat(item.mrp)) ? 0 : item.mrp;
                if (parseFloat(billItem_mrp) == parseFloat(item_mrp) && billItem.batch_no == item.batch_no &&
                    billItem.vendor_no == item.vendor_no &&
                    billItem.expiry_date.substring(0, 10) == item.expiry_date.substring(0, 10) && billItem.man_date.substring(0, 10) == item.man_date.substring(0, 10) &&
                        parseFloat(billItem.buying_cost) == parseFloat(item.cost)) {
                    billItem.buying_cost = item.cost;
                    billItem.var_no = item.var_no;
                    billItem.variation_name = item.variation_name;
                    row.find("input[datafield=variation_name]").val(billItem.variation_name);
                    if (item.active == "0")
                        row.find("input[datafield=variation_name]").css("color", "red");
                    else
                        row.find("input[datafield=variation_name]").css("color", "black");
                }
                if (CONTEXT.ENABLE_FREE_VARIATION && CONTEXT.SHOW_FREE) {
                    if (parseFloat(billItem.mrp) == parseFloat(item.mrp) && billItem.batch_no == item.batch_no &&
                   billItem.vendor_no == item.vendor_no &&
                   billItem.expiry_date.substring(0, 10) == item.expiry_date.substring(0, 10) &&
                   billItem.man_date.substring(0, 10) == item.man_date.substring(0, 10) &&
                   parseFloat(item.cost).toFixed(CONTEXT.COUNT_AFTER_POINTS) == parseFloat(0).toFixed(CONTEXT.COUNT_AFTER_POINTS)) {
                        billItem.buying_cost = 0;
                        billItem.free_var_no = item.var_no;
                        billItem.free_variation_name = item.variation_name;
                        $(row).find("[datafield=free_variation_name]").find("div").html(billItem.free_variation_name);
                        if (item.active == "0")
                            $(row).find("[datafield=free_variation_name]").find("div").css("color", "red");
                        else
                            $(row).find("[datafield=free_variation_name]").find("div").css("color", "black");
                    }
                }
            });
            //if no match founnd
            if (billItem.var_no == null)
                row.find("input[datafield=variation_name]").val("");
            if (billItem.free_var_no == null)
                $(row).find("[datafield=free_variation_name]").find("div").html("");
        }
        //page.check_variation = function (callback) {
        //    $(page.controls.grdBill.selectedData()).each(function (i, items) {
        //        var data = {
        //            item_no: items.item_no,
        //            mrp: items.mrp,
        //            batch_no: items.batch_no,
        //            expiry_date: items.expiry_date,
        //            buying_cost: items.buying_cost,
        //            man_date: items.man_date,
        //        }
        //        var che_data = [];
        //        $(page.variation_data).each(function (i, item) {
        //            // $(vari_item).each(function (j, item) {
        //            if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
        //                if (item.expiry_date != undefined && item.expiry_date != null && item.expiry_date != "") {
        //                    var len = item.expiry_date.length;
        //                    var month = item.expiry_date.substring(len - 7, len - 5);
        //                    var year = item.expiry_date.substring(len - 4, len);
        //                    item.expiry_date = month + "-" + year;
        //                }
        //                if (data.expiry_date != undefined && data.expiry_date != null && data.expiry_date != "") {
        //                    len = data.expiry_date.length;
        //                    month = data.expiry_date.substring(len - 7, len - 5);
        //                    year = data.expiry_date.substring(len - 4, len);
        //                    data.expiry_date = month + "-" + year;
        //                }
        //                if (item.man_date != undefined && item.man_date != null && item.man_date != "") {
        //                    len = item.man_date.length;
        //                    month = item.man_date.substring(len - 7, len - 5);
        //                    year = item.man_date.substring(len - 4, len);
        //                    item.man_date = month + "-" + year;
        //                }
        //                if (data.man_date != undefined && data.man_date != null && data.man_date != "") {
        //                    len = data.man_date.length;
        //                    month = data.man_date.substring(len - 7, len - 5);
        //                    year = data.man_date.substring(len - 4, len);
        //                    data.man_date = month + "-" + year;
        //                }
        //                if (parseFloat(data.mrp) == parseFloat(item.mrp) && data.batch_no == item.batch_no && data.expiry_date == item.expiry_date && data.man_date == item.man_date && parseFloat(data.buying_cost) == parseFloat(item.cost)) {
        //                    che_data.push({
        //                        batch_no: item.batch_no,
        //                        expiry_date: item.expiry_date,
        //                        man_date: item.man_date,
        //                        mrp: item.mrp,
        //                        variation_name: item.variation_name,
        //                        free_variation_id: false,
        //                        cost: item.cost
        //                    });
        //                }
        //                if (parseFloat(data.mrp) == parseFloat(item.mrp) && data.batch_no == item.batch_no && data.expiry_date == item.expiry_date && data.man_date == item.man_date && parseFloat(data.buying_cost).toFixed(5) == parseFloat(0).toFixed(5)) {
        //                    var free_variation_name = item.variation_name;
        //                    var ori_variation_name = item.variation_name.split("-free");
        //                    che_data.push({
        //                        batch_no: item.batch_no,
        //                        expiry_date: item.expiry_date,
        //                        man_date: item.man_date,
        //                        mrp: item.mrp,
        //                        variation_name: ori_variation_name[0],
        //                        free_variation_id: true,
        //                        cost: item.cost,
        //                        free_variation_name: free_variation_name
        //                    });
        //                }
        //            } else {
        //                if (parseFloat(data.mrp) == parseFloat(item.mrp) && data.batch_no == item.batch_no && data.expiry_date == item.expiry_date && data.man_date == item.man_date && parseFloat(data.buying_cost) == parseFloat(item.cost)) {
        //                    che_data.push({
        //                        batch_no: item.batch_no,
        //                        expiry_date: item.expiry_date,
        //                        man_date: item.man_date,
        //                        mrp: item.mrp,
        //                        variation_name: item.variation_name,
        //                        free_variation_id: false,
        //                        cost: item.cost
        //                    });
        //                }
        //                if (parseFloat(data.mrp) == parseFloat(item.mrp) && data.batch_no == item.batch_no && data.expiry_date == item.expiry_date && data.man_date == item.man_date && parseFloat(data.buying_cost).toFixed(5) == parseFloat(0).toFixed(5)) {
        //                    var free_variation_name = item.variation_name;
        //                    var ori_variation_name = item.variation_name.split("-free");
        //                    che_data.push({
        //                        batch_no: item.batch_no,
        //                        expiry_date: item.expiry_date,
        //                        man_date: item.man_date,
        //                        mrp: item.mrp,
        //                        variation_name: ori_variation_name[0],
        //                        free_variation_id: true,
        //                        cost: item.cost,
        //                        free_variation_name: free_variation_name
        //                    });
        //                }
        //            }

        //            //  })
        //        })
        //        callback(che_data);
        //    });
        //}

        page.events = {

            btnNewPO_click: function () {

                $("#lblOrderedDisplay").css('color', "Black");
                $("#lblCreatedDisplay").css('color', "Black");
                $("#lblDeliveredDisplay").css('color', "Black");
                $("#lblReturnDisplay").css('color', "Black");
                $("#lblCancelDisplay").css('color', "Black");
                $("#lblCompletedDisplay").css('color', "Black");

                page.controls.pnlNewPOPopup.open();
                page.controls.pnlNewPOPopup.title("Create new purchase order.");
                page.controls.pnlNewPOPopup.rlabel("Create new purchase order.");
                page.controls.pnlNewPOPopup.width(540);
                page.controls.pnlNewPOPopup.height(200);

                page.controls.txtInvoiceNo.val('');
                page.controls.lblPOBillNo.value('');
                page.controls.lblTempPOBillNo.value('');
                $$("dsExpectedDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));

                $$("btnAddPOOK").disable(false);
            },
            btnAddNewVendor_click: function () {
                page.controls.pnlNewVendor.open();
                page.controls.pnlNewVendor.title("New Supplier");
                page.controls.pnlNewVendor.rlabel("Supplier");
                page.controls.pnlNewVendor.width(550);
                page.controls.pnlNewVendor.height(600);

                page.controls.ucVendorEdit.select({});
            },
            btnSaveVendor_click: function () {
                page.controls.ucVendorEdit.save(function (data1) {
                    page.inventoryService.getAllVendors(function (data) {
                        $$("ddlVendorNos").dataBind(data, "vendor_no", "vendor_name");
                        $$("ddlPOVendor").dataBind(data, "vendor_no", "vendor_name");
                        $$("ddlAddInventVendor").dataBind(data, "vendor_no", "vendor_name");
                        $$("ddlVendorNos").selectedValue(data1[0].vendor_no);
                        page.controls.pnlNewVendor.close();

                    });
                });
            },
            btnGetPendingPayVendor_click: function () {
                page.controls.pnlPayPending.open();
                page.controls.pnlPayPending.title("Pending Payment Panel");
                page.controls.pnlPayPending.rlabel("Pending Payment Panel");
                page.controls.pnlPayPending.width(1300);
                page.controls.pnlPayPending.height(500);

                $$("txtPendingPayDesc").value("CurrentPO");
                $$("dsPendingPayDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));  // Load Current PO when click Pay
                $$("btnPayPending").disable(false);
                page.view.selectedPendingPayment([]);
                $$("ddlPayBillType").selectedValue("Select");
                $$("txtSearchBillNo").value("");

                /*var filter = {
                    viewMode: "SupplierWise",
                    fromDate: "",
                    toDate: "",
                    vendor_no: "",
                    item_no: "",
                    state_no: "",
                    bill_type: ""
                };

                var vendor_data = [];
                page.dynaReportService.getPurchaseReport(filter, function (data) {
                    $(data).each(function (i, items) {
                        //if (parseFloat(items.total_paid_amount) != parseFloat(items.total_price)) {
                            vendor_data.push(items);
                        //}
                    });
                    $$("ddlPendingVendorName").dataBind(vendor_data, "vendor_no", "vendor_name", "Select");
                });*/
                page.vendorAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlPendingVendorName").dataBind(data, "value", "label", "All");
                });
                $$("ddlPendingVendorName").selectionChange(function () {
                    if ($$("ddlBillView").selectedValue() == "Payment View") {
                        var loan_data = {};
                        loan_data.vendor_no = ($$("ddlPendingVendorName").selectedValue() == "-1" || $$("ddlPendingVendorName").selectedValue() == "All") ? "" : $$("ddlPendingVendorName").selectedValue();
                        loan_data.store_no = localStorage.getItem("user_store_no");
                        loan_data.bill_type = $$("ddlPayBillType").selectedValue() == "Select" ? "" : $$("ddlPayBillType").selectedValue(); //$$("ddlPayBillType").selectedValue();
                        loan_data.bill_no = $$("txtSearchBillNo").value();
                        page.purchaseBillService.getPaymentWise(loan_data, function (data) {
                            var pay_data = [];
                            $(data).each(function (i, item) {
                                if (item.po_no != null && item.po_no != "") {
                                    pay_data.push(item);
                                }
                                page.view.selectedPendingPayment(pay_data);
                            })
                        });
                    }
                    else {
                        if ($$("ddlPayBillType").selectedValue() == "Purchase") {
                            var vendor_pay_data = [];
                            var filter = {
                                viewMode: "Standard",
                                fromDate: "",
                                toDate: "",
                                vendor_no: ($$("ddlPendingVendorName").selectedValue() == "-1") ? "" : $$("ddlPendingVendorName").selectedValue(),
                                item_no: "",
                                state_no: "",
                                bill_type: "Purchase"
                            };
                            page.purchaseBillService.getPendingReport(filter, function (data) {
                                $(data).each(function (i, items) {
                                    if (parseFloat(items.total) - parseFloat(items.total_paid_amount) != 0) {
                                        if (items.po_no != null && typeof items.po_no != "undefined" && items.po_no != "") {
                                            vendor_pay_data.push({
                                                po_no: items.po_no,
                                                bill_no: items.bill_no,
                                                bill_code: items.bill_code,
                                                bill_date: items.bill_date,
                                                bill_type: items.bill_type,
                                                total_paid_amount: items.total_paid_amount,
                                                total: items.total,
                                                vendor_name: items.vendor_name,
                                                vendor_no: items.vendor_no,
                                                balance: parseFloat(parseFloat(items.total) - parseFloat(items.total_paid_amount)).toFixed(CONTEXT.COUNT_AFTER_POINTS)
                                            });
                                        }
                                    }
                                });
                                page.view.selectedPendingPayment(vendor_pay_data);
                            });
                        }
                        else if ($$("ddlPayBillType").selectedValue() == "PurchaseReturn") {
                            var vendor_pay_data = [];
                            var filter = {
                                viewMode: "Standard",
                                fromDate: "",
                                toDate: "",
                                vendor_no: ($$("ddlPendingVendorName").selectedValue() == "-1") ? "" : $$("ddlPendingVendorName").selectedValue(),
                                item_no: "",
                                state_no: "",
                                bill_type: "PurchaseReturn"
                            };
                            page.purchaseBillService.getPendingReport(filter, function (data) {
                                $(data).each(function (i, items) {
                                    if (parseFloat(items.total) - parseFloat(items.total_paid_amount) != 0) {
                                        if (items.po_no != null && typeof items.po_no != "undefined" && items.po_no != "") {
                                            vendor_pay_data.push({
                                                po_no: items.po_no,
                                                bill_no: items.bill_no,
                                                bill_date: items.bill_date,
                                                bill_type: items.bill_type,
                                                total_paid_amount: items.total_paid_amount,
                                                total: items.total,
                                                vendor_name: items.vendor_name,
                                                vendor_no: items.vendor_no,
                                                balance: parseFloat(items.total) - parseFloat(items.total_paid_amount)
                                            });
                                        }
                                    }
                                });
                                page.view.selectedPendingPayment(vendor_pay_data);
                            });
                        } else {
                            page.view.selectedPendingPayment([]);
                        }
                    }
                })
                $$("ddlPayBillType").selectionChange(function () {
                    if ($$("ddlBillView").selectedValue() == "Payment View") {
                        var loan_data = {};
                        loan_data.vendor_no = ($$("ddlPendingVendorName").selectedValue() == "-1" || $$("ddlPendingVendorName").selectedValue() == "All") ? "" : $$("ddlPendingVendorName").selectedValue();
                        loan_data.store_no = localStorage.getItem("user_store_no");
                        loan_data.bill_type = $$("ddlPayBillType").selectedValue() == "Select" ? "" : $$("ddlPayBillType").selectedValue(); //$$("ddlPayBillType").selectedValue();
                        loan_data.bill_no = $$("txtSearchBillNo").value();
                        page.purchaseBillService.getPaymentWise(loan_data, function (data) {
                            var pay_data = [];
                            $(data).each(function (i, item) {
                                if (item.po_no != null && item.po_no != "") {
                                    pay_data.push(item);
                                }
                                page.view.selectedPendingPayment(pay_data);
                            })
                        });
                    }
                    else {
                        if ($$("ddlPayBillType").selectedValue() != "Select") {
                            if ($$("ddlPayBillType").selectedValue() == "Purchase") {
                                var vendor_pay_data = [];
                                var filter = {
                                    viewMode: "Standard",
                                    fromDate: "",
                                    toDate: "",
                                    vendor_no: ($$("ddlPendingVendorName").selectedValue() == "-1") ? "" : $$("ddlPendingVendorName").selectedValue(),
                                    item_no: "",
                                    state_no: "",
                                    bill_type: "Purchase"
                                };
                                page.purchaseBillService.getPendingReport(filter, function (data) {
                                    $(data).each(function (i, items) {
                                        if (parseFloat(items.total) - parseFloat(items.total_paid_amount) != 0) {
                                            if (items.po_no != null && typeof items.po_no != "undefined" && items.po_no != "") {
                                                vendor_pay_data.push({
                                                    po_no: items.po_no,
                                                    bill_no: items.bill_no,
                                                    bill_code: items.bill_code,
                                                    bill_date: items.bill_date,
                                                    bill_type: items.bill_type,
                                                    total_paid_amount: items.total_paid_amount,
                                                    total: items.total,
                                                    vendor_name: items.vendor_name,
                                                    vendor_no: items.vendor_no,
                                                    balance: parseFloat(parseFloat(items.total) - parseFloat(items.total_paid_amount)).toFixed(CONTEXT.COUNT_AFTER_POINTS)
                                                });
                                            }
                                        }
                                    });
                                    page.view.selectedPendingPayment(vendor_pay_data);
                                });
                            }
                            else if ($$("ddlPayBillType").selectedValue() == "PurchaseReturn") {
                                var vendor_pay_data = [];
                                var filter = {
                                    viewMode: "Standard",
                                    fromDate: "",
                                    toDate: "",
                                    vendor_no: ($$("ddlPendingVendorName").selectedValue() == "-1") ? "" : $$("ddlPendingVendorName").selectedValue(),
                                    item_no: "",
                                    state_no: "",
                                    bill_type: "PurchaseReturn"
                                };
                                page.purchaseBillService.getPendingReport(filter, function (data) {
                                    $(data).each(function (i, items) {
                                        if (parseFloat(items.total) - parseFloat(items.total_paid_amount) != 0) {
                                            if (items.po_no != null && typeof items.po_no != "undefined" && items.po_no != "") {
                                                vendor_pay_data.push({
                                                    po_no: items.po_no,
                                                    bill_no: items.bill_no,
                                                    bill_date: items.bill_date,
                                                    bill_type: items.bill_type,
                                                    total_paid_amount: items.total_paid_amount,
                                                    total: items.total,
                                                    vendor_name: items.vendor_name,
                                                    vendor_no: items.vendor_no,
                                                    balance: parseFloat(items.total) - parseFloat(items.total_paid_amount)
                                                });
                                            }
                                        }
                                    });
                                    page.view.selectedPendingPayment(vendor_pay_data);
                                });
                            } else {
                                page.view.selectedPendingPayment([]);
                            }
                        }
                    }
                })
                $$("ddlBillView").selectionChange(function () {
                    if ($$("ddlBillView").selectedValue() == "Payment View") {
                        var loan_data = {};
                        loan_data.vendor_no = ($$("ddlPendingVendorName").selectedValue() == "-1" || $$("ddlPendingVendorName").selectedValue() == "All") ? "" : $$("ddlPendingVendorName").selectedValue();
                        loan_data.store_no = localStorage.getItem("user_store_no");
                        loan_data.bill_type = $$("ddlPayBillType").selectedValue() == "Select" ? "" : $$("ddlPayBillType").selectedValue(); //$$("ddlPayBillType").selectedValue();
                        loan_data.bill_no = $$("txtSearchBillNo").value();
                        page.purchaseBillService.getPaymentWise(loan_data, function (data) {
                            var pay_data = [];
                            $(data).each(function (i, item) {
                                if (item.po_no != null && item.po_no != "") {
                                    pay_data.push(item);
                                }
                                page.view.selectedPendingPayment(pay_data);
                            })
                        });
                    }
                    else {
                        var vendor_pay_data = [];
                        var filter = {
                            viewMode: "Standard",
                            fromDate: "",
                            toDate: "",
                            vendor_no: "",
                            item_no: "",
                            state_no: "",
                            bill_type: "",
                            search_filter: $$("txtSearchBillNo").value()
                        };
                        page.purchaseBillService.getPendingReport(filter, function (data) {
                            $(data).each(function (i, items) {
                                if (parseFloat(items.total) - parseFloat(items.total_paid_amount) != 0) {
                                    if (items.po_no != null && typeof items.po_no != "undefined" && items.po_no != "") {
                                        vendor_pay_data.push({
                                            po_no: items.po_no,
                                            bill_no: items.bill_no,
                                            bill_code: items.bill_code,
                                            bill_date: items.bill_date,
                                            bill_type: items.bill_type,
                                            total_paid_amount: items.total_paid_amount,
                                            total: items.total,
                                            vendor_name: items.vendor_name,
                                            vendor_no: items.vendor_no,
                                            balance: parseFloat(parseFloat(items.total) - parseFloat(items.total_paid_amount)).toFixed(CONTEXT.COUNT_AFTER_POINTS)
                                        });
                                    }
                                }
                            });
                            page.view.selectedPendingPayment(vendor_pay_data);
                        });
                    }
                })
                $$("txtSearchBillNo").focus();
            },
            btnPrintNewBarcode_click: function () {
                page.controls.pnlPrintNewBarcodePopup.open();
                page.controls.pnlPrintNewBarcodePopup.title("Print Bill Panel");
                page.controls.pnlPrintNewBarcodePopup.rlabel("Print Bill Panel");
                page.controls.pnlPrintNewBarcodePopup.width("80%");
                page.controls.pnlPrintNewBarcodePopup.height(500);
                page.controls.ucBarcodePrint.select({});
            },
            btnSearchPending_click: function () {
                if ($$("ddlBillView").selectedValue() == "Payment View") {
                    var loan_data = {};
                    loan_data.vendor_no = ($$("ddlPendingVendorName").selectedValue() == "-1" || $$("ddlPendingVendorName").selectedValue() == "All") ? "" : $$("ddlPendingVendorName").selectedValue();
                    loan_data.store_no = localStorage.getItem("user_store_no");
                    loan_data.bill_type = $$("ddlPayBillType").selectedValue() == "Select" ? "" : $$("ddlPayBillType").selectedValue(); //$$("ddlPayBillType").selectedValue();
                    loan_data.bill_no = $$("txtSearchBillNo").value();
                    page.purchaseBillService.getPaymentWise(loan_data, function (data) {
                        var pay_data = [];
                        $(data).each(function (i, item) {
                            if (item.po_no != null && item.po_no != "") {
                                pay_data.push(item);
                            }
                            page.view.selectedPendingPayment(pay_data);
                        })
                    });
                }
                else {
                    var vendor_pay_data = [];
                    var filter = {
                        viewMode: "Standard",
                        fromDate: "",
                        toDate: "",
                        vendor_no: ($$("ddlPendingVendorName").selectedValue() == "-1" || $$("ddlPendingVendorName").selectedValue() == "All") ? "" : $$("ddlPendingVendorName").selectedValue(),
                        item_no: "",
                        state_no: "",
                        bill_type: $$("ddlPayBillType").selectedValue() == "Select" ? "" : $$("ddlPayBillType").selectedValue(),
                        search_filter: $$("txtSearchBillNo").value()
                    };
                    page.purchaseBillService.getPendingReport(filter, function (data) {
                        $(data).each(function (i, items) {
                            if (parseFloat(items.total) - parseFloat(items.total_paid_amount) != 0) {
                                if (items.po_no != null && typeof items.po_no != "undefined" && items.po_no != "") {
                                    vendor_pay_data.push({
                                        po_no: items.po_no,
                                        bill_no: items.bill_no,
                                        bill_code: items.bill_code,
                                        bill_date: items.bill_date,
                                        bill_type: items.bill_type,
                                        total_paid_amount: items.total_paid_amount,
                                        total: items.total,
                                        vendor_name: items.vendor_name,
                                        vendor_no: items.vendor_no,
                                        balance: parseFloat(parseFloat(items.total) - parseFloat(items.total_paid_amount)).toFixed(CONTEXT.COUNT_AFTER_POINTS)
                                    });
                                }
                            }
                        });
                        page.view.selectedPendingPayment(vendor_pay_data);
                        $$("txtSearchBillNo").value("");
                    });
                }
            },
            btnPayPending_click: function () {
                $$("btnPayPending").disable(true);
                var billSO = [], billSO1 = [];
                var data1 = [];
                var data2 = [];
                try{
                    if (page.controls.grdPendingPayment.allData().length == 0)
                        throw "Pending Order Is Empty";
                    var countNoAmount = 0;
                    $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                        if (item.amount_pay != 0 && item.amount_pay != "" && item.amount_pay != undefined) {
                            countNoAmount = countNoAmount + 1;
                        }
                    });
                    if (countNoAmount < 1)
                        throw "Please check the amount...!";
                    if (confirm("Are you sure to pay the Amount") == true) {
                        $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                            if (parseFloat(item.amount_pay) > 0) {
                                if (parseFloat(item.balance) < parseFloat(item.amount_pay))
                                    throw "Pay amount should be lesser or equal to the balance";
                                if (item.bill_type == "Purchase") {
                                    billSO.push({
                                        bill_no: item.bill_no,
                                        collector_id: page.controls.ddlPendingCollectorName.selectedValue(),
                                        pay_desc: page.controls.txtPendingPayDesc.value(),
                                        amount: parseFloat(item.amount_pay),
                                        po_no: item.po_no,
                                        pay_date: dbDateTime(page.controls.dsPendingPayDate.getDate()),
                                        pay_type: "Purchase",
                                        pay_mode: $$("ddlPaymentReturnBillType").selectedValue(),
                                        cheque_no: "",
                                        cheque_bank_name: "",
                                        cheque_date: "",
                                        store_no: localStorage.getItem("user_store_no"),
                                        comp_id: localStorage.getItem("user_company_id"),
                                        bill_type: item.bill_type

                                    });
                                    data1.push({
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                                        //amount: parseFloat(item.amount_pay),
                                        paid_amount: parseFloat(item.amount_pay),
                                        key_1: item.po_no,
                                        description: "Purchase Order-" + item.po_no,
                                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                    });
                                }
                                else {
                                    billSO.push({
                                        bill_no: item.bill_no,
                                        collector_id: page.controls.ddlPendingCollectorName.selectedValue(),
                                        pay_desc: page.controls.txtPendingPayDesc.value(),
                                        amount: parseFloat(item.amount_pay),
                                        po_no: item.po_no,
                                        pay_date: dbDateTime(page.controls.dsPendingPayDate.getDate()),
                                        pay_type: "Return",
                                        pay_mode: $$("ddlPaymentReturnBillType").selectedValue(),
                                        cheque_no: "",
                                        cheque_bank_name: "",
                                        cheque_date: "",
                                        store_no: localStorage.getItem("user_store_no"),
                                        comp_id: localStorage.getItem("user_company_id"),
                                        bill_type: item.bill_type
                                    });
                                    data2.push({
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                                        //amount: parseFloat(item.amount_pay),
                                        paid_amount: parseFloat(item.amount_pay),
                                        key_1: item.po_no,
                                        description: "Purchase Order-" + item.po_no,
                                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                    });
                                }
                            }
                        });
                        var data = {
                            payment_data: billSO,
                            finfacts_purchase_data: data1,
                            finfacts_return_data: data2,
                        }
                        page.purchaseBillPaymentAPI.postAllValue(data, function (data) {
                        //page.purchaseService.payAllPendingPayments(0, billSO, function (data) {
                            $$("btnPayPending").disable(false);
                            //page.finfactsEntry.allcreditPurchasePayment(0, data1, function (response) { });
                            //page.finfactsEntry.allcreditReturnPurchasePayment(0, data2, function (response) { });
                            $$("msgPanel").flash("Payment made successfully");
                            page.events.btnSearch_click();
                            page.controls.pnlPayPending.close();
                        });
                    }
                }
                catch (e) {
                    alert(e);
                }
                //if ($$("ddlPayBillType").selectedValue() == "Purchase") {
                //    try {
                //        var countNoAmount = 0;
                //        $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                //            if (item.amount_pay != 0 && item.amount_pay != "" && item.amount_pay != undefined) {
                //                countNoAmount = countNoAmount + 1;
                //            }
                //        });
                //        if (countNoAmount < 1)
                //            throw "Please check the amount...!";
                //        //Confirm the payment
                //        if (confirm("Are you sure to pay the Amount") == true) {
                //            $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                //                if (parseFloat(item.amount_pay) > 0) {
                //                    if (parseFloat(item.balance) < parseFloat(item.amount_pay))
                //                        throw "Pay amount should be lesser or equal to the balance";
                //                    billSO.push({
                //                        bill_no: item.bill_no,
                //                        collector_id: page.controls.ddlPendingCollectorName.selectedValue(),
                //                        pay_desc: page.controls.txtPendingPayDesc.value(),
                //                        amount: parseFloat(item.amount_pay),
                //                        po_no: item.po_no,
                //                        pay_date: page.controls.dsPendingPayDate.getDate(),
                //                        pay_type: page.controls.ddlPayBillType.selectedValue(),
                //                        pay_mode: $$("ddlPaymentReturnBillType").selectedValue()

                //                    });
                //                    data1.push({
                //                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                //                        target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                //                        //amount: parseFloat(item.amount_pay),
                //                        paid_amount: parseFloat(item.amount_pay),
                //                        key_1: item.po_no,
                //                        description: "Purchase Order-" + item.po_no,
                //                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                //                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                //                    });
                //                }
                //            })

                //            page.purchaseService.payAllPendingPayments(0, billSO, function (data) {
                //                $$("btnPayPending").disable(false);
                //                if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                //                    //page.finfactsService.insertAllCreditPayment(0, data1, function (response) {
                //                    page.finfactsEntry.allcreditPurchasePayment(0, data1, function (response) {
                //                        alert("Your payment is succcessful");
                //                        //ShowDialogBox('Message', 'Your payment is succcessful...!', 'Ok', '', null);
                //                        page.events.btnGetPendingPayVendor_click();
                //                        $$("ddlPayBillType").selectedValue("Select");
                //                        page.events.btnSearch_click();
                //                    });
                //                }
                //                else {
                //                    page.events.btnSearch_click();
                //                }
                //            });
                //        }
                //    } catch (e) {
                //        alert(e);
                //        //ShowDialogBox('Message', e, 'Ok', '', null);
                //        $$("btnPayPending").disable(false);
                //    }
                //}
                //if ($$("ddlPayBillType").selectedValue() == "PurchaseReturn") {
                //    try {
                //        var countNoAmount = 0;
                //        $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                //            if (item.amount_pay != 0 && item.amount_pay != "" && item.amount_pay != undefined) {
                //                countNoAmount = countNoAmount + 1;
                //            }
                //        });
                //        if (countNoAmount < 1)
                //            throw "Please check the amount...!";
                //        //Confirm the payment
                //        if (confirm("Are you sure to pay the Amount") == true) {
                //            $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                //                if (parseFloat(item.amount_pay) > 0) {
                //                    if (parseFloat(item.balance) < parseFloat(item.amount_pay))
                //                        throw "Pay amount should be lesser or equal to the balance";
                //                    billSO.push({
                //                        bill_no: item.bill_no,
                //                        collector_id: page.controls.ddlPendingCollectorName.selectedValue(),
                //                        pay_desc: page.controls.txtPendingPayDesc.value(),
                //                        amount: parseFloat(item.amount_pay),
                //                        po_no: item.po_no,
                //                        pay_date: page.controls.dsPendingPayDate.getDate(),
                //                        pay_type: page.controls.ddlPayBillType.selectedValue()

                //                    });
                //                    data1.push({
                //                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                //                        target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                //                        //amount: parseFloat(item.amount_pay),
                //                        paid_amount: parseFloat(item.amount_pay),
                //                        key_1: item.po_no,
                //                        description: "Purchase Order-" + item.po_no,
                //                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                //                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                //                    });
                //                }
                //            })
                //            page.purchaseService.payAllInvoiceBillSalesOrder(0, billSO, function (data) {
                //                $$("btnPayPending").disable(false);
                //                if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                //                    //page.finfactsService.insertAllCreditReturnPayment(0, data1, function (response) {
                //                    page.finfactsEntry.allcreditReturnPurchasePayment(0, data1, function (response) {
                //                        alert("Payment made successfully");
                //                        //ShowDialogBox('Message', 'Payment made successfully...!', 'Ok', '', null);
                //                        page.events.btnGetPendingPayVendor_click();
                //                        $$("ddlPayBillType").selectedValue("Select");
                //                    });
                //                }
                //            });
                //        }
                //    } catch (e) {
                //        alert(e);
                //        //ShowDialogBox('Message', e, 'Ok', '', null);
                //        $$("btnPayPending").disable(false);
                //    }
                //}
            },

            // Advance Search
            btnTouchAdvaSearchItem_click: function () {

                $("div.touch").show();
                $$("txtAdvVendor").val('');
                $$("txtAdvManufacturer").val('');
                $$("txtAdvVendor").focus();
                page.advanceItemSearch($$("txtAdvVendor").val(), $$("txtAdvManufacturer").val());
                page.controls.grdAdvSearchItem.hide();
                //page.advanceItemSearch($$("txtAdvVendor").val(), $$("txtAdvManufacturer").val());
            },

            btnAdvSearchItem_click: function () {
                $("div.touch").hide();
                page.controls.pnlAdvSearchItemPopup.open();
                page.controls.pnlAdvSearchItemPopup.title("Item Advance Search");
                page.controls.pnlAdvSearchItemPopup.width(1300);
                page.controls.pnlAdvSearchItemPopup.height(600);
                $$("txtAdvItemSearch").val('');
                page.controls.grdAdvSearchItem.hide();
            },
            btnAdvaSearchItem_click: function () {
                $("div.touch").hide();
                page.controls.grdAdvSearchItem.show();
                //var data = {
                //    "term": $$("txtAdvItemSearch").val(),
                //    "sales_tax_no":undefined
                //};
                //"%", function (data) {
                page.itemService.getItemAdvanceSearchPO($$("txtAdvItemSearch").val(), function (data) {

                    page.controls.grdAdvSearchItem.width("100%");
                    //page.controls.grdAdvSearchItem.height("220px");
                    page.controls.grdAdvSearchItem.setTemplate({
                        selection: "Multiple",
                        columns: [
                            { 'name': "Item No", 'width': "60px", 'dataField': "item_no" },
                            { 'name': "Item Name", 'width': "120px", 'dataField': "item_name" },
                            { 'name': "Item Code", 'width': "75px", 'dataField': "item_code" },
                            { 'name': "Default Vendor", 'width': "130px", 'dataField': "vendor_name" },
                            { 'name': "Manufacturer", 'width': "100px", 'dataField': "man_name" },
                            { 'name': "Tax", 'width': "60px", 'dataField': "tax" },
                            { 'name': "Price", 'width': "80px", 'dataField': "price" },
                            { 'name': "MRP", 'width': "80px", 'dataField': "mrp" },

                        ]
                    });
                    page.controls.grdAdvSearchItem.dataBind(data);

                });
            },
            btnAddAdvaSearchItem_click: function () {
                var data = {};
                if ($('div.touch').css('display') == 'none') {
                    data = page.controls.grdAdvSearchItem.selectedData();
                }
                else {
                    data = page.controls.grdTouchAdvSearchItem.selectedData();
                }
                page.events.advSearchItemSelect(data);
                page.controls.pnlAdvSearchItemPopup.close();
            },
            //#endregion
            advSearchItemSelect: function (item) {
                if (item != null) {
                    $(item).each(function (i, item) {
                        if (typeof item.item_no != "undefined") {

                            var newitem = {
                                po_no: page.selectedPO.po_no,
                                item_no: item.item_no,
                                item_name: item.item_name,
                                unit: item.unit,
                                qty: 1,
                                qty_type: item.qty_type,
                                tray_id: item.tray_no,

                                //qty_stock: '',
                                //stock: item.qty_stock,
                                //cost: '',
                                ////total_price: '',

                                //tray_id: item.tray_id,
                                //tray_count: 1,
                                //mrp: '',
                                //selling_price: '',
                                //expiry_date: '',
                                //batch_no: '',
                                //disc_per: 0,
                                //disc_val: 0,
                                //tax_per: 0

                            };

                            //Populate 
                            var rows = page.controls.grdPOItems.getRow({
                                item_no: newitem.item_no
                            });


                            if (rows.length == 0) {
                                page.controls.grdPOItems.createRow(newitem);
                                page.controls.grdPOItems.edit(true);
                                rows = page.controls.grdPOItems.getRow({
                                    item_no: newitem.item_no
                                });
                                rows[0].find("[datafield=qty]").find("input").focus();
                            } else {
                                var txtQty = rows[0].find("[datafield=qty]").find("input");
                                txtQty.val(parseInt(txtQty.val()) + 1);
                                txtQty.trigger('change');
                                txtQty.focus();
                            }
                            page.controls.txtItemSearch.customText("");
                            //page.calculate();
                        }
                    });
                }

            },

            btnAddPOOK_click: function () {
                $$("btnAddPOOK").disable(true);
                $$("pnlNewPOPopup").close();

                $$("msgPanel").show("Creating purchase order...");
                var data = {
                    table_name: "po_t",
                    column_name:"po_id"
                }
                page.maximumIdAPI.getStoreValue(data, function (id) {
                    page.purchaseService.insertPO({
                        vendor_no: $$("ddlVendorNos").selectedValue(),
                        expected_date: $$("dsExpectedDate").getDate(),
                        po_id:id[0].key_value
                    }, function (data) {

                        $$("msgPanel").show("Purchase order is successfully created...");
                        $$("btnAddPOOK").disable(false);
                        //Get vendor details
                        page.inventoryService.getVendorById($$("ddlVendorNos").selectedValue(), function (data) {
                            $$("lblPOVendorAddress").html(data[0].vendor_address);
                            $$("lblPOVendorPhone").html(data[0].vendor_phone);
                            $$("lblPOVendorEmail").html(data[0].vendor_email);
                            $$("lblPOVendorGst").html(data[0].gst_no);
                        });
                        //Get PO Details
                        page.purchaseService.getPOByNo(data[0].key_value, function (data) {
                            page.view.searchResult(data);
                            page.controls.grdPOResult.getAllRows()[0].click();
                            page.sales_tax_no = CONTEXT.DEFAULT_SALES_TAX;
                            $$("msgPanel").hide();
                        });
                    });
                });

            },
            btnSavePO_click: function () {
                try {

                    page.savePurchaseOrder(function () {
                        $$("msgPanel").show("Purchase order is successfully updated...");
                        page.purchaseService.getPOItems(page.currentPO.po_no, function (data) {
                            page.view.selectedPOItems(data);
                            page.currentPOItem = $.util.clone(data);
                            $$("msgPanel").hide();

                        });
                    });
                } catch (e) {
                    $$("msgPanel").flash(e);
                }
            },
            btnSavePOItem_click: function () {
                //TODO remove this button and use one save
                page.events.btnSavePO_click();
            },
            btnOrderPO_click: function () {
                try {
                    page.savePurchaseOrder(function () {
                        $$("msgPanel").show("Purchase order is successfully updated...");
                        page.purchaseService.orderPO(page.currentPO.po_no, function (data2) {
                            $$("msgPanel").show("Purchase order is changed to ordered state...");

                            page.purchaseService.getPOByNo(page.currentPO.po_no, function (data) {

                                //update search grid
                                var row = page.controls.grdPOResult.selectedRows()[0];
                                page.controls.grdPOResult.updateRow(row.attr("row_id"), data[0])

                                //reload
                                row.click();

                                page.sales_tax_no = CONTEXT.DEFAULT_SALES_TAX;
                                page.billService.getSalesTaxClass(page.sales_tax_no, function (data) {
                                    page.sales_tax = data;
                                    page.calculate();
                                });

                                $$("msgPanel").hide();
                                $$("txtInvoiceNo").focus();
                            });
                        });
                    });
                } catch (e) {
                    $$("msgPanel").flash(e);
                }

            },
            btnRecreatePO_click: function () {
                try {
                    if (confirm("If You Recreate The Order The Existing Bill Is Deleted With All The Items And Payment The New Bill Is Generated, Are You Sure To Continue?")) {
                        $$("msgPanel").show("Changing the state...");
                        page.purchaseService.recreatePO(page.currentPO.po_no, function (data2) {
                            $$("msgPanel").show("Purchase order is changed to ordered state...");
                            page.purchaseService.getPOByNo(page.currentPO.po_no, function (data) {
                                //update search grid
                                var row = page.controls.grdPOResult.selectedRows()[0];
                                page.controls.grdPOResult.updateRow(row.attr("row_id"), data[0]);
                                //reload
                                row.click();
                                page.sales_tax_no = CONTEXT.DEFAULT_SALES_TAX;
                                page.billService.getSalesTaxClass(page.sales_tax_no, function (data) {
                                    page.sales_tax = data;
                                    page.calculate();
                                });
                                $$("msgPanel").hide();
                            });
                        });
                    }
                } catch (e) {
                    $$("msgPanel").flash(e);
                }

            },
            btnConfirmPO_click: function () {
                try {
                    //GET THE BILL TOTAL QTY IN WORDS
                    var result = "";
                    if (CONTEXT.ENABLE_TOTAL_QTY_IN_BILL) {
                        var alldataqty = page.controls.grdPOItems.allData();
                        var temp = {};
                        var obj = null;
                        for (var i = 0; i < alldataqty.length; i++) {
                            obj = alldataqty[i];

                            if (!temp[obj.unit]) {
                                if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                                    temp[obj.unit] = obj.temp_qty;
                            } else {
                                if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                                    temp[obj.unit] = parseFloat(temp[obj.unit]) + parseFloat(obj.temp_qty);
                            }
                            if (!temp[obj.alter_unit]) {
                                if (parseInt(obj.unit_identity) == 1)
                                    temp[obj.alter_unit] = obj.temp_qty;
                            } else {
                                if (parseInt(obj.unit_identity) == 1)
                                    temp[obj.alter_unit] = parseFloat(temp[obj.alter_unit]) + parseFloat(obj.temp_qty);
                            }
                        }
                        for (var i in temp) {
                            result = result + temp[i] + ":" + i + "/";
                        }
                    }
                    //Validate invoice no
                    if ($$("txtInvoiceNo").value() == "")
                        throw "Vendor invoice no is mantatory";
                    if ($$("dsPODueDate").getDate() == "" || $$("dsPODueDate").getDate() == null || typeof $$("dsPODueDate").getDate() == "undefined")
                        throw "Due Date is mantatory";
                    var isNoCost = false;
                    $(page.controls.grdPOItems.allData()).each(function (i, item) {
                        if (item.cost == 0 || item.cost == "" || item.cost == undefined) {
                            //isNoCost = true;
                            item.cost = 0;
                        }
                    });
                    //if (isNoCost == true)
                    //    throw "Please check the cost";
                    page.savePurchaseOrder(function () {
                        $$("msgPanel").show("Purchase order is successfully updated...");
                        var data = {
                            due_date: $$("dsPODueDate").getDate(),
                            po_no:page.currentPO.po_no
                        }
                        page.purchaseService.invoiceConfirmedPO(data, function (data2) {

                            $$("msgPanel").show("Purchase order is changed to confirmed state...");
                            var newBill = {
                                po_no: page.currentPO.po_no,
                                bill_no: ($$("lblPOBillNo").value() == undefined || $$("lblPOBillNo").value() == "" || $$("lblPOBillNo").value() == null) ? "0" : $$("lblPOBillNo").value(),
                                bill_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                store_no: getCookie("user_store_id"),
                                fulfillment_store_no: localStorage.getItem("user_fulfillment_store_no"),
                                storewise_bill: CONTEXT.STOREWISE_BILL_NO,
                                reg_no: localStorage.getItem("user_register_id"),
                                user_no: localStorage.getItem("app_user_id"),
                                sub_total: isNaN(page.controls.lblSubTotal.value()) ? 0 : page.controls.lblSubTotal.value(),
                                total: parseFloat(page.controls.lblTotal.value()),
                                discount: page.controls.lblTotalDiscounts.value(),
                                tax: page.controls.lblTotalTax.value(),
                                due_date: dbDateTime($$("dsPODueDate").getDate()),
                                bill_type: "Purchase",
                                state_no: 904, //904 is purchase 
                                pay_mode: "Loan",
                                invoice_no: page.controls.txtInvoiceNo.val(),//$$("txtInvoiceNo").value(),

                                round_off: page.controls.lblRndOff.value(),
                                sales_tax_no: page.sales_tax_no,
                                mobile_no: page.controls.lblPOVendorPhone.val(),
                                email_id: page.controls.lblPOVendorEmail.val(),
                                gst_no: page.controls.lblPOVendorGst.val(),

                                tot_qty_words: result,
                                bill_no_par: "",
                                vendor_no: page.controls.ddlPOVendor.selectedValue(),
                                vendor_name: $$("ddlPOVendor").selectedData().vendor_name,
                                vendor_address: page.controls.lblPOVendorAddress.val(),

                            };
                            var rbillItems = [];
                            $(page.controls.grdPOItems.allData()).each(function (i, billItem) {
                                rbillItems.push({
                                    sl_no:i+1,
                                    qty: billItem.qty,
                                    free_qty: billItem.free_qty,
                                    unit_identity: billItem.unit_identity,
                                    price: billItem.cost,
                                    disc_val: billItem.disc_val,
                                    disc_per: billItem.disc_per,
                                    taxable_value: (parseFloat(billItem.total_price) * parseFloat(billItem.tax_per)) / 100,
                                    tax_per: billItem.tax_per,
                                    total_price: billItem.total_price,
                                    bill_type: "Purchase",

                                    store_no: getCookie("user_store_id"),
                                    item_no: billItem.item_no,
                                    cost: billItem.buying_cost,

                                    vendor_no: page.controls.ddlPOVendor.selectedValue(),
                                    active: "1",
                                    tax_class_no: (billItem.tax_class_no == null || billItem.tax_class_no == "" || typeof billItem.tax_class_no == "undefined") ? "" : billItem.tax_class_no,
                                    amount: parseFloat(billItem.cost) * parseFloat(billItem.qty),

                                    rate: billItem.cost,
                                    user_no: CONTEXT.user_no,

                                    tray_mode: "Custom",
                                    tray_id: "0"

                                });
                            });

                            $$("msgPanel").show("Generating a invoice for the purchase order ...");
                            newBill.bill_items = rbillItems;
                            //page.purchaseBillService.insertBill(newBill, function (data) {
                            page.stockAPI.insertBill(newBill, function (data) {
                                page.currentBillNo = data.bill_no;

                                //Update bill no in sales order
                                page.purchaseBillService.updatePurchaseBillNo({ po_no: page.currentPO.po_no, po_bill_no: page.currentBillNo }, function () {
                                    $$("msgPanel").show("A new invoice is successfully generated with id : " + page.currentBillNo + " ...");

                                    page.purchaseService.getPOByNo(page.currentPO.po_no, function (data) {
                                        var row = page.controls.grdPOResult.selectedRows()[0];

                                        page.controls.grdPOResult.updateRow(row.attr("row_id"), data[0])
                                        row.click();
                                    });
                                });
                                if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                    var p_with_tax = (parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblTotalDiscounts").value())) //- parseFloat($$("lblRndOff").value());
                                    var data1 = {
                                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                        description: "Purchase Order-" + page.currentBillNo,
                                        pur_with_out_tax: parseFloat(p_with_tax).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                                        tax_amt: parseFloat(page.controls.lblTotalTax.value()).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                                        rnd_off: parseFloat($$("lblRndOff").value()),
                                        key_1: page.currentBillNo,
                                        key_2: $$("ddlPOVendor").selectedValue(),
                                    };
                                    page.finfactsEntry.creditPurchase(data1, function (response) {
                                        $$("msgPanel").flash("Finfacts Entry can be added successfully....");
                                    });
                                }
                                $$("msgPanel").hide();
                            });



                        });
                    });
                } catch (e) {
                    $$("msgPanel").flash(e);
                }

            },

            btnReceiveDeliveryCancel_click: function () {
                $$("pnlReturnTrayActions").hide();
                $$("pnlReceiveDeliveryActions").hide();
                $$("pnlReturnDeliveryActions").hide();
                $$("pnlAddToStockActions").hide();
                $$("pnlItemActions").show();
                page.view.selectedPOItems(page.currentPOItems);
            },
            btnReceiveDelivery_click: function () {
                $$("pnlReceiveDeliveryActions").show();
                $$("pnlReturnDeliveryActions").hide();
                $$("pnlAddToStockActions").hide();
                $$("pnlItemActions").hide();
                $$("pnlReturnTrayActions").hide();

                page.receiveMode = true;
                page.view.selectedPOItems(page.currentPOItems);
                page.receiveMode = false;
            },
            btnReceiveTray_click: function () {
                $$("pnlAddToTrayActions").show();
                $$("pnlReceiveDeliveryActions").hide();
                $$("pnlReturnDeliveryActions").hide();
                $$("pnlAddToStockActions").hide();
                $$("pnlItemActions").hide();
                $$("pnlReturnTrayActions").hide();

                page.trayMode = true;
                page.view.selectedPOItems(page.currentPOItems);
                page.trayMode = false;
            },
            btnReturnTray_click: function () {
                $$("pnlReturnTrayActions").show();
                $$("pnlAddToTrayActions").hide();
                $$("pnlReceiveDeliveryActions").hide();
                $$("pnlReturnDeliveryActions").hide();
                $$("pnlAddToStockActions").hide();
                $$("pnlItemActions").hide();

                page.trayMode = true;
                page.view.selectedPOItems(page.currentPOItems);
                page.trayMode = false;
            },
            btnReturnDelivery_click: function () {
                page.controls.pnlReturnDeliveryPOPopup.open();
                page.controls.pnlReturnDeliveryPOPopup.title("Return Delivery Items");
                page.controls.pnlReturnDeliveryPOPopup.width(920);
                page.controls.pnlReturnDeliveryPOPopup.height(400);
                page.purchaseBillService.getReturnDeliveryBillByNo(page.currentPO.po_no, page.currentPO.po_bill_no, function (rdata) {

                    page.view.selectedReturnDeliveryPOItems(rdata);

                });
                /*$$("pnlReceiveDeliveryActions").hide();
                $$("pnlReturnDeliveryActions").show();
                $$("pnlAddToStockActions").hide();
                $$("pnlItemActions").hide();

                page.damageMode = true;
                page.view.selectedPOItems(page.currentPOItems);
                page.damageMode = false;*/
            },
            btnReceiveDeliveryConfirm_click: function () {
                try {
                    var flag = false;
                    var deliverItems = [];
                    $(page.controls.grdPOItems.allData()).each(function (i, item) {
                        //If empty input is given assume as 0
                        if (item.qty_received == null || item.qty_received == "" || typeof item.qty_received == "undefined") {
                            item.qty_received = 0;
                        }
                        //If empty qty_delivered exists assume as 0
                        if (item.qty_delivered == null || item.qty_delivered == "" || typeof item.qty_delivered == "undefined") {
                            item.qty_delivered = 0;
                        }

                        if (isNaN(item.qty_received) || parseFloat(item.qty_received) < 0) //If not a number or negative set flag=1
                            throw "Received quantity should be a number and non negative.";
                        else if (parseFloat(parseFloat(item.temp_qty) + parseFloat(item.temp_free_qty)) < (parseFloat(item.qty_received) + parseFloat(item.qty_delivered) + parseFloat(item.qty_returned))) {
                            throw "Total received quantity cannot be greater than actual ordered quantity";
                        }
                        //Insert delivery quantity only when it is greater than 0. 
                        if (item.qty_received > 0) {
                            flag = true;
                            if (item.unit_identity == "1") {
                                item.qty_received = parseFloat(item.qty_received) * parseFloat(item.alter_unit_fact);
                                item.qty_delivered = parseFloat(item.qty_delivered) * parseFloat(item.alter_unit_fact);
                            }
                            if (item.qty_type == "Integer") {
                                deliverItems.push({
                                    po_no: item.po_no,
                                    item_no: item.item_no,
                                    qty_delivered: parseInt(item.qty_received) + parseInt(item.qty_delivered)
                                });
                            }
                            else {
                                deliverItems.push({
                                    po_no: item.po_no,
                                    item_no: item.item_no,
                                    qty_delivered: parseFloat(item.qty_received) + parseFloat(item.qty_delivered)
                                });
                            }
                        }
                    });

                    if (flag == false)
                        throw "No items ahould be delivered";

                    //Update PO Item with qty delivered
                    $$("msgPanel").show("Updating purchase order with delivered quantity...");
                    page.purchaseService.updatePOItems(0, deliverItems, function () {

                        $$("msgPanel").show("Delivered items are successfully updated in purchase order...");
                        //Reload item grid with new data
                        page.purchaseService.getPOItems(page.currentPO.po_no, function (data) {


                            page.view.selectedPOItems(data);
                            page.currentPOItem = $.util.clone(data);

                            $$("pnlReceiveDeliveryActions").hide();
                            $$("pnlAddToStockActions").hide();
                            $$("pnlAddToTrayActions").hide();
                            $$("pnlReturnDeliveryActions").hide();
                            $$("pnlReturnTrayActions").hide();
                            $$("pnlItemActions").show();

                            // $$("msgPanel").hide()

                        });

                    });


                } catch (e) {
                    $$("msgPanel").show(e);

                }


            },

            //btnReturnDeliveryConfirm_click: function () {
            //    try {
            //        var items = [];
            //        var inventItems = [];
            //        $(page.controls.grdPOItems.allData()).each(function (i, item) {
            //            //If empty input is given assume as 0
            //            if (item.qty_damaged == null || item.qty_damaged == "" || typeof item.qty_damaged == "undefined") {
            //                item.qty_damaged = 0;
            //            }
            //            //If empty qty_delivered exists assume as 0
            //            if (item.qty_instock == null || item.qty_instock == "" || typeof item.qty_instock == "undefined") {
            //                item.qty_instock = 0;
            //            }


            //            if (isNaN(item.qty_damaged) || parseFloat(item.qty_damaged) < 0) //If not a number or negative set flag=1
            //                throw "Damage quantity should be a number and non negative.";
            //            else if (parseFloat(item.qty_instock) < parseFloat(item.qty_damaged)) {
            //                throw "Total damage quantity cannot be greater than actual stocked quantity";
            //            }
            //            //Insert delivery quantity only when it is greater than 0. 
            //            if (item.qty_damaged > 0) {
            //                inventItems.push({
            //                    item_no: item.item_no,
            //                    cost: item.cost,  //why needed
            //                    qty: item.qty_damaged,
            //                    vendor_no: $$("ddlPOVendor").selectedValue(),

            //                    invent_type: "PurchaseReturn",
            //                    key1: page.currentPO.po_bill_no,

            //                    batch_no: item.batch_no,
            //                    expiry_date: item.expiry_date,
            //                    mrp: item.mrp,
            //                });
            //                items.push({
            //                    item_no: item.item_no,
            //                    po_no: page.currentPO.po_no,
            //                    qty_delivered: parseFloat(item.qty_delivered) - parseFloat(item.qty_damaged)
            //                });
            //            }

            //        });

            //        //Note : TODO : We cannot return delivery that is delivered but not added to stock.

            //        $$("msgPanel").show("Adjusting delivery to reduce the returned quantity...");
            //        page.purchaseService.updatePOItems(0, items, function () {
            //            //Make inventory entry
            //            $$("msgPanel").show("Adjusting inventory to add the returned quantity...");
            //            page.inventoryService.insertInventoryItems(0, inventItems, function (data) {
            //                $$("msgPanel").show("Return delivery is sucessfull...");
            //                alert("Return delivery is sucessfull...");
            //                //Reload item grid with new data
            //                page.purchaseService.getPOItems(page.currentPO.po_no, function (data) {
            //                    page.view.selectedPOItems(data);
            //                    page.currentPOItem = $.util.clone(data);

            //                    $$("pnlReceiveDeliveryActions").hide();
            //                    $$("pnlReturnDeliveryActions").hide();
            //                    $$("pnlAddToStockActions").hide();
            //                    $$("pnlItemActions").show();
            //                    $$("msgPanel").hide();
            //                });
            //            });
            //        });

            //    } catch (e) {
            //        alert(e);
            //    }
            //},
            btnReturnDeliveryPOItemPopup_click: function () {
                try {
                    var items = [];
                    //var inventItems = [];
                    var lastItem = null;
                    $(page.controls.grdReturnDeliveryPOItems.allData()).each(function (i, item) {
                        //If empty input is given assume as 0
                        if (item.ret_qty == null || item.ret_qty == "" || typeof item.ret_qty == "undefined") {
                            item.ret_qty = 0;
                        }
                        //If empty qty_delivered exists assume as 0
                        if (item.qty_stocked == null || item.qty_stocked == "" || typeof item.qty_stocked == "undefined") {
                            item.qty_stocked = 0;
                        }
                        //If empty qty_delivered exists assume as 0
                        if (item.qty_delivered == null || item.qty_delivered == "" || typeof item.qty_delivered == "undefined") {
                            item.qty_delivered = 0;
                        }

                        if (isNaN(item.ret_qty) || parseFloat(item.ret_qty) < 0) //If not a number or negative set flag=1
                            throw "Damage quantity should be a number and non negative.";
                        else if (parseFloat(item.qty_delivered) < (parseFloat(item.ret_qty) + parseFloat(item.qty_stocked) + parseFloat(item.qty_cancelled))) {
                            throw "Total damage quantity cannot be greater than actual stocked quantity";
                        }
                        //Insert delivery quantity only when it is greater than 0. 
                        if (item.ret_qty > 0) {
                            if (item.unit_identity == "1") {
                                item.ret_qty = parseFloat(item.ret_qty) * parseFloat(item.alter_unit_fact);
                                item.qty_delivered = parseFloat(item.qty_delivered) * parseFloat(item.alter_unit_fact);
                            }
                            if (lastItem == null || lastItem.item_no != item.item_no) {
                                var poItem = {
                                    item_no: item.item_no,
                                    po_no: page.currentPO.po_no,
                                    qty_delivered: parseFloat(item.qty_delivered) - parseFloat(item.ret_qty)
                                }
                                items.push(poItem);
                                lastItem = poItem;
                            }
                            else
                                lastItem.qty_delivered = lastItem.qty_delivered - parseFloat(item.ret_qty);
                        }
                    });

                    //if (inventItems.length == 0)
                    //    throw "No item is selected for return.";
                    //Note : TODO : We cannot return delivery that is delivered but not added to stock.

                    //$$("msgPanel").show("Adjusting delivery to reduce the returned quantity...");

                    page.purchaseService.updatePOItems(0, items, function () {
                        //Make inventory entry
                        //$$("msgPanel").show("Adjusting inventory to add the returned quantity...");
                        //page.inventoryService.insertInventoryItems(0, inventItems, function (data) {
                        //page.stockAPI.insertAllStockVar(0, inventItems, function (data) {
                        $$("msgPanel").show("Return delivery is successfully...");
                        alert("Return delivery is successfully...");
                        //ShowDialogBox('Message', 'Return delivery is successfully...!', 'Ok', '', null);
                        //Reload item grid with new data
                        page.purchaseService.getPOItems(page.currentPO.po_no, function (data) {
                            page.view.selectedPOItems(data);
                            page.currentPOItem = $.util.clone(data);

                            page.controls.pnlReturnDeliveryPOPopup.close();
                            $$("pnlReceiveDeliveryActions").hide();
                            $$("pnlReturnDeliveryActions").hide();
                            $$("pnlAddToStockActions").hide();
                            $$("pnlAddToTrayActions").hide();
                            $$("pnlReturnTrayActions").hide();
                            $$("pnlItemActions").show();
                            $$("msgPanel").hide();
                        });
                        // });
                    });

                } catch (e) {
                    alert(e);
                    //ShowDialogBox('Message', e, 'Ok', '', null);
                }
            },
            btnDeliveredPO_click: function () {
                var count = 0;

                try {
                    $(page.controls.grdPOItems.allData()).each(function (i, item) {
                        if (item.unit_identity == "1") {
                            item.qty_returned = parseFloat(item.qty_returned) * parseFloat(item.alter_unit_fact);
                            item.qty_delivered = parseFloat(item.qty_delivered) * parseFloat(item.alter_unit_fact);
                        }
                        if (parseFloat(parseFloat(item.qty) + parseFloat(item.free_qty)) != (parseFloat(item.qty_delivered) + parseFloat(item.qty_returned)))
                            throw "All ordered quantity are not yet delivered.";
                    });


                    page.purchaseService.deliverPO(page.currentPO.po_no, function (data2) {
                        $$("msgPanel").show("Purchase order is changed to delivered state...");

                        page.purchaseService.getPOByNo(page.currentPO.po_no, function (data) {
                            var row = page.controls.grdPOResult.selectedRows()[0];
                            page.controls.grdPOResult.updateRow(row.attr("row_id"), data[0])
                            row.click();
                            $$("msgPanel").hide();

                        });
                    });

                    //TODO : move logic to stocked
                    //var alldata = page.controls.grdPOItems.allData();
                    //$(alldata).each(function (index, item) {

                    //    var trans = {

                    //        tray_count: item.tray_count,

                    //        trans_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                    //        trans_type: 'Vendor Purchase',
                    //        tray_id: item.tray_id,

                    //        cust_id: $$("ddlVendorNos").selectedValue(),
                    //        bill_id: page.currentPO.po_bill_no,
                    //    };

                    //if (trans.tray_id != '' && trans.tray_id != undefined && CONTEXT.ENABLE_MODULE_TRAY == true && item.tray_id != null) {
                    //    page.trayService.insertEggTrayTransaction(trans, function (data1) {
                    //        //    alert('Egg Tray Transaction details saved successfully for item:' + item.item_name);
                    //        page.purchaseService.getPOByNo(page.currentPO.po_no, function (data2) {
                    //            var row = page.controls.grdPOResult.selectedRows()[0];
                    //            page.currentPO.state_no = 800;
                    //            page.currentPO.state_text = "Delivered";
                    //            page.controls.grdPOResult.updateRow(row.attr("row_id"), data2[0])
                    //            row.click();

                    //        });
                    //    });

                    //} else {
                    //    $$("msgPanel").show("Please note tray transaction is not saved for the item:'" + item.item_name + "' since it is not having the tray mapping!");
                    //    //alert('Please note tray transaction is not saved for the item:' + item.item_name + " since it is not having the tray mapping");
                    //}

                    //});

                } catch (e) {
                    $$("msgPanel").flash(e);
                }
            },
            btnAddToStockCancel_click: function () {
                $$("pnlAddToStockActions").hide();
                $$("pnlReceiveDeliveryActions").hide();
                $$("pnlAddToTrayActions").hide();
                $$("pnlReturnDeliveryActions").hide();
                $$("pnlReturnTrayActions").hide();
                $$("pnlItemActions").show();
                page.view.selectedPOItems(page.currentPOItems);
            },
            btnAddToTrayCancel_click: function () {
                $$("pnlAddToTrayActions").hide();
                $$("pnlAddToStockActions").hide();
                $$("pnlReceiveDeliveryActions").hide();
                $$("pnlAddToTrayActions").hide();
                $$("pnlReturnDeliveryActions").hide();
                $$("pnlReturnTrayActions").hide();
                $$("pnlItemActions").show();
                page.view.selectedPOItems(page.currentPOItems);
            },
            btnReturnTrayCancel_click: function () {
                $$("pnlAddToTrayActions").hide();
                $$("pnlAddToStockActions").hide();
                $$("pnlReceiveDeliveryActions").hide();
                $$("pnlAddToTrayActions").hide();
                $$("pnlReturnDeliveryActions").hide();
                $$("pnlReturnTrayActions").hide();
                $$("pnlItemActions").show();
                page.view.selectedPOItems(page.currentPOItems);
            },
            btnAddToStock_click: function () {
                $$("pnlAddToStockActions").show();
                $$("pnlReceiveDeliveryActions").hide();
                $$("pnlAddToTrayActions").hide();
                $$("pnlReturnDeliveryActions").hide();
                $$("pnlReturnTrayActions").hide();
                $$("pnlItemActions").hide();

                page.stockMode = true;
                var data1 = [];
                $(page.currentPOItems).each(function (i, item) {
                    var data = item;
                    data.attr_value1 = "";
                    data.attr_value2 = "";
                    data.attr_value3 = "";
                    data.attr_value4 = "";
                    data.attr_value5 = "";
                    data.attr_value6 = "";
                    data1.push(data);
                });
                page.view.selectedPOItems(data1);
                //page.view.selectedPOItems(page.currentPOItems);
                page.stockMode = false;
            },
            btnAddToFreeStockConfirm_click: function () {
                page.events.btnAddToStockConfirm_click("true");
            },
            btnAddToStockConfirm_click: function (free) {
                if (typeof free == "undefined")
                    free = "false";
                try {
                    var flag = false;
                    var inventItems = [];
                    var priceItems = [];
                    var tot_buying_cost = 0;
                    var newBill = {
                        bill_type: "Purchase",
                        po_no: page.currentPO.po_no,
                    }
                    $(page.controls.grdPOItems.allData()).each(function (i, item) {
                        if (item.qty_tostock == null || item.qty_tostock == "" || typeof item.qty_tostock == "undefined") {
                            item.qty_tostock = 0;
                        }
                        if (item.qty_tostock > 0) {
                            page.tot_qty(item, function (tot) {
                                var tot_qty = tot;

                                if (item.qty_tostock == null || item.qty_tostock == "" || typeof item.qty_tostock == "undefined") {
                                    item.qty_tostock = 0;
                                }
                                //If empty qty_delivered exists assume as 0
                                if (item.qty_delivered == null || item.qty_delivered == "" || typeof item.qty_delivered == "undefined") {
                                    item.qty_delivered = 0;
                                }

                                //If empty qty stocked exists assume as 0
                                if (item.qty_instock == null || item.qty_instock == "" || typeof item.qty_instock == "undefined") {
                                    item.qty_instock = 0;
                                }
                                if (item.qty_infreestock == null || item.qty_infreestock == "" || typeof item.qty_infreestock == "undefined") {
                                    item.qty_infreestock = 0;
                                }

                                //If empty qty stocked exists assume as 0
                                if (item.selling_price == null || item.selling_price == "" || typeof item.selling_price == "undefined") {
                                    item.selling_price = null;
                                }
                                if (item.alter_price_1 == null || item.alter_price_1 == "" || typeof item.alter_price_1 == "undefined") {
                                    item.alter_price_1 = null;
                                }
                                if (item.alter_price_2 == null || item.alter_price_2 == "" || typeof item.alter_price_2 == "undefined") {
                                    item.alter_price_2 = null;
                                }
                                if (isNaN(item.qty_tostock) || parseFloat(item.qty_tostock) < 0) //If not a number or negative set flag=1
                                    throw "Stock quantity should be a number and non negative.";


                                if (free == "true") {
                                    if (parseFloat(item.free_qty) < (parseFloat(tot_qty) + parseFloat(item.qty_infreestock)))
                                        throw "Total non free quantty cannot be greater than actual quantity.";
                                }
                                else {
                                    if (parseFloat(item.qty) < (parseFloat(tot_qty) + parseFloat(item.qty_instock)))
                                        throw "Total non free quantty cannot be greater than actual quantity.";
                                }
                                //Insert delivery quantity only when it is greater than 0. 
                                if (item.qty_tostock > 0) {
                                    if (item.variation_name == undefined || item.variation_name == null || item.variation_name == "")
                                        item.variation_name == item.item_no + "" + item.item_name;
                                    //throw "Variation name Cannot be empty";
                                    if (item.unit_identity == "1") {
                                        var unit_qty_tostock = parseFloat(item.qty_tostock) * parseFloat(item.alter_unit_fact);
                                    }
                                    else {
                                        var unit_qty_tostock = parseFloat(item.qty_tostock);
                                    }
                                    item.buying_cost = (isNaN(item.buying_cost) || item.buying_cost == "Infinity") ? 0 : item.buying_cost;
                                    flag = true;
                                    var create_free_sku = "false";
                                    if (item.attr_type1 == "cost" || item.attr_type2 == "cost" || item.attr_type3 == "cost" || item.attr_type4 == "cost" || item.attr_type5 == "cost" || item.attr_type6 == "cost")
                                        create_free_sku = "true";
                                    inventItems.push({
                                        var_no: free == "true" ? item.free_var_no : item.var_no,
                                        variation_name: free == "true" ? item.free_variation_name : item.variation_name,
                                        store_no: getCookie("user_store_id"),
                                        fulfillment_store_no: localStorage.getItem("user_fulfillment_store_no"),
                                        item_no: item.item_no,
                                        item_name: item.item_name,
                                        cost: free == "true" ? (create_free_sku == "true") ? "0.00" : parseFloat(item.cost).toFixed(CONTEXT.COUNT_AFTER_POINTS) : parseFloat(item.cost).toFixed(CONTEXT.COUNT_AFTER_POINTS),//parseFloat(item.buying_cost).toFixed(5),

                                        //qty: parseFloat(unit_qty_tostock),
                                        qty: parseFloat(unit_qty_tostock),
                                        free_qty: "0",
                                        trans_type: "Purchase",
                                        trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                        key1: page.currentPO.po_bill_no,
                                        key2: item.item_no,
                                        key3: item.item_no,
                                        //FINFACTS ENTRY DATA
                                        invent_type: "PurchaseCredit",
                                        finfacts_comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                        amount: free == "true" ? "0" : (parseFloat(item.buying_cost) * parseFloat(item.qty_tostock)),
                                        //Get Price Details
                                        selling_price: item.selling_price,
                                        alter_price_1: item.alter_price_1,
                                        alter_price_2: item.alter_price_2,
                                        valid_from: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                        vendor_no: page.controls.ddlPOVendor.selectedValue(),
                                        active: "1",
                                        comp_id1: localStorage.getItem("user_company_id"),

                                        //Additional Values
                                        rate: item.cost,
                                        disc_val: item.disc_val,
                                        disc_per: item.disc_per,
                                        user_no: CONTEXT.user_no,
                                        //Attributes Values
                                        attr_type1: (item.var_stock_attr_key.split(",").length - 1 >= 0) ? (typeof item.attr_type1 == "undefined" || item.attr_type1 == null || item.attr_type1 == "") ? "" : item.attr_type1 : "",
                                        attr_value1: (item.var_stock_attr_key.split(",").length - 1 >= 0) ? (typeof item.attr_value1 == "undefined" || item.attr_value1 == null || item.attr_value1 == "") ? "" : item.attr_value1 : "",
                                        attr_type2: (item.var_stock_attr_key.split(",").length - 1 >= 1) ? (typeof item.attr_type2 == "undefined" || item.attr_type2 == null || item.attr_type2 == "") ? "" : item.attr_type2 : "",
                                        attr_value2: (item.var_stock_attr_key.split(",").length - 1 >= 1) ? (typeof item.attr_value2 == "undefined" || item.attr_value2 == null || item.attr_value2 == "") ? "" : item.attr_value2 : "",
                                        attr_type3: (item.var_stock_attr_key.split(",").length - 1 >= 2) ? (typeof item.attr_type3 == "undefined" || item.attr_type3 == null || item.attr_type3 == "") ? "" : item.attr_type3 : "",
                                        attr_value3: (item.var_stock_attr_key.split(",").length - 1 >= 2) ? (typeof item.attr_value3 == "undefined" || item.attr_value3 == null || item.attr_value3 == "") ? "" : item.attr_value3 : "",
                                        attr_type4: (item.var_stock_attr_key.split(",").length - 1 >= 3) ? (typeof item.attr_type4 == "undefined" || item.attr_type4 == null || item.attr_type4 == "") ? "" : item.attr_type4 : "",
                                        attr_value4: (item.var_stock_attr_key.split(",").length - 1 >= 3) ? (typeof item.attr_value4 == "undefined" || item.attr_value4 == null || item.attr_value4 == "") ? "" : item.attr_value4 : "",
                                        attr_type5: (item.var_stock_attr_key.split(",").length - 1 >= 4) ? (typeof item.attr_type5 == "undefined" || item.attr_type5 == null || item.attr_type5 == "") ? "" : item.attr_type5 : "",
                                        attr_value5: (item.var_stock_attr_key.split(",").length - 1 >= 4) ? (typeof item.attr_value5 == "undefined" || item.attr_value5 == null || item.attr_value5 == "") ? "" : item.attr_value5 : "",
                                        attr_type6: (item.var_stock_attr_key.split(",").length - 1 >= 5) ? (typeof item.attr_type6 == "undefined" || item.attr_type6 == null || item.attr_type6 == "") ? "" : item.attr_type6 : "",
                                        attr_value6: (item.var_stock_attr_key.split(",").length - 1 >= 5) ? (typeof item.attr_value6 == "undefined" || item.attr_value6 == null || item.attr_value6 == "") ? "" : item.attr_value6 : "",
                                        var_attr_key: item.var_attr_key,
                                        var_stock_attr_key: item.var_stock_attr_key,
                                        //Bill Item Table Entries
                                        unit_identity: item.unit_identity,
                                        price: item.buying_cost,
                                        taxable_value: ((parseFloat(item.buying_cost) * parseFloat(item.qty_tostock)) * parseFloat(item.tax_per)) / 100,
                                        tax_per: item.tax_per,
                                        total_price: parseFloat(item.buying_cost) * parseFloat(item.qty_tostock),
                                        tax_class_no: (item.tax_class_no == null || item.tax_class_no == "" || typeof item.tax_class_no == "undefined") ? "" : item.tax_class_no,

                                        tray_id: "0",
                                        tray_mode: "Custom",
                                        create_free_sku: create_free_sku,
                                        free_qty_check: free == "true" ? "true" : "false",
                                    });
                                    if (typeof item.selling_price != "undefined" && item.selling_price != "" && item.selling_price != null && parseInt(item.selling_price) != 0) {
                                        inventItems[inventItems.length - 1].selling_price = item.selling_price;
                                        inventItems[inventItems.length - 1].valid_from = dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date()));
                                        inventItems[inventItems.length - 1].free_selling_price = item.free_selling_price;
                                        //Rate Price Configuration
                                        if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                                            if (item.alter_price_1 == 0 && item.alter_price_1 == null || typeof item.alter_price_1 == "undefined") {
                                                item.alter_price_1 = 0;
                                            }
                                            inventItems[inventItems.length - 1].alter_price_1 = item.alter_price_1;
                                        }
                                        if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                                            if (item.alter_price_2 == 0 && item.alter_price_2 == null || typeof item.alter_price_2 == "undefined") {
                                                item.alter_price_2 = 0;
                                            }
                                            inventItems[inventItems.length - 1].alter_price_2 = item.alter_price_2;
                                        }
                                        if (item.price_limit == 0 && item.price_limit == null || typeof item.price_limit == "undefined") {
                                            item.price_limit = 0;
                                        }
                                        inventItems[inventItems.length - 1].price_limit = item.price_limit;
                                    }
                                }
                            });
                        }
                        
                    });
                    if (flag == false)
                        throw "No items qty is entered";
                    $$("msgPanel").show("Adding items to inventory...");
                    newBill.bill_items = inventItems;
                    page.stockAPI.insertStock(newBill, function (data) {

                        $$("msgPanel").flash("Items are successfully stocked...");
                        //Reload item grid with new data
                        page.purchaseService.getPOItems(page.currentPO.po_no, function (data) {
                            page.view.selectedPOItems(data);
                            page.currentPOItem = $.util.clone(data);

                            $$("pnlReceiveDeliveryActions").hide();
                            $$("pnlAddToStockActions").hide();
                            $$("pnlAddToTrayActions").hide();
                            $$("pnlReturnDeliveryActions").hide();
                            $$("pnlReturnTrayActions").hide();
                            $$("pnlItemActions").show();
                        });
                    });
                } catch (e) {
                    $$("msgPanel").flash(e);

                }

            },
            btnAddToTrayConfirm_click: function () {
                try {
                    var trayItems = [];
                    $(page.controls.grdPOItems.allData()).each(function (i, item) {
                        if (item.tray_received == undefined || item.tray_received == null || item.tray_received == "")
                            item.tray_received = 0;
                        if (parseFloat(item.tray_received) < 0 || isNaN(item.tray_received))
                            throw "Tray qty should be number and positive";
                        if (parseFloat(item.tray_received) > 0)
                            if (item.tray_id != null)
                                trayItems.push({
                                    tray_id: item.tray_id,
                                    tray_count: parseInt(item.tray_received),
                                    trans_type: "Vendor Purchase",
                                    trans_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                    cust_id: page.controls.ddlPOVendor.selectedValue(),
                                    bill_id: page.controls.lblPOBillNo.value(),
                                    store_no: localStorage.getItem("user_store_no")
                                });
                    });
                    page.trayService.insertEggTrayTransactions(0, trayItems, function (data) {
                        page.purchaseService.getPOItems(page.currentPO.po_no, function (data) {
                            page.view.selectedPOItems(data);
                            page.currentPOItem = $.util.clone(data);
                            $$("msgPanel").show("Tray details added successfully...!");
                            $$("pnlItemActions").show();
                            $$("pnlAddToTrayActions").hide();
                            $$("pnlAddToStockActions").hide();
                            $$("pnlReturnDeliveryActions").hide();
                            $$("pnlReceiveDeliveryActions").hide();
                            $$("pnlReturnTrayActions").hide();

                        });
                    });

                } catch (e) {
                    $$("msgPanel").flash(e);
                }
            },
            btnReturnTrayConfirm_click: function () {
                try {
                    var trayItems = [];
                    $(page.controls.grdPOItems.allData()).each(function (i, item) {
                        if (item.tray_received == undefined || item.tray_received == null || item.tray_received == "")
                            item.tray_received = 0;
                        if (parseFloat(item.tray_received) < 0 || isNaN(item.tray_received))
                            throw "Tray qty should be number and positive";
                        if (parseFloat(item.tray_received) > 0)
                            if (item.tray_id != null)
                                trayItems.push({
                                    tray_id: item.tray_id,
                                    tray_count: parseInt(item.tray_received),
                                    trans_type: "Vendor Return",
                                    trans_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                    cust_id: page.controls.ddlPOVendor.selectedValue(),
                                    bill_id: page.controls.lblPOBillNo.value()
                                });
                    });
                    page.trayService.insertEggTrayTransactions(0, trayItems, function (data) {
                        page.purchaseService.getPOItems(page.currentPO.po_no, function (data) {
                            page.view.selectedPOItems(data);
                            page.currentPOItem = $.util.clone(data);
                            $$("msgPanel").show("Tray details added successfully");
                            $$("pnlItemActions").show();
                            $$("pnlAddToTrayActions").hide();
                            $$("pnlAddToStockActions").hide();
                            $$("pnlReturnDeliveryActions").hide();
                            $$("pnlReceiveDeliveryActions").hide();
                            $$("pnlReturnTrayActions").hide();

                        });
                    });

                } catch (e) {
                    $$("msgPanel").flash(e);
                }
            },
            btnStocked_click: function () {

                try {
                    $(page.controls.grdPOItems.allData()).each(function (i, item) {
                        if (item.unit_identity == "1") {
                            item.qty_returned = parseFloat(item.qty_returned) * parseFloat(item.alter_unit_fact);
                            item.qty_instock = parseFloat(item.qty_instock) * parseFloat(item.alter_unit_fact);
                        }
                        if ((parseFloat(item.qty_instock) + parseFloat(item.qty_returned)) != parseFloat(parseFloat(item.qty) + parseFloat(item.free_qty)))
                            throw "All ordered quantity are not yet stocked."
                    });
                    page.purchaseService.stockedPO(page.currentPO.po_no, function (data2) {
                        $$("msgPanel").show("Purchase order is changed to stocked state...");

                        page.purchaseService.getPOByNo(page.currentPO.po_no, function (data) {
                            var row = page.controls.grdPOResult.selectedRows()[0];
                            page.controls.grdPOResult.updateRow(row.attr("row_id"), data[0])
                            row.click();

                            $$("msgPanel").hide();

                        });
                    });

                } catch (e) {
                    $$("msgPanel").flash(e);
                }

            },

            btnPayInvoiceAmount_click: function () {
                if (parseFloat($$("lblTotalAmtRemaining").value()) == 0 || (parseFloat($$("lblTotalAmtRemaining").value()) < parseFloat($$("lblReturnsBalance").value()))) {
                    page.controls.pnlPaymentAlert.open();
                    page.controls.pnlPaymentAlert.title("Payment Alert");
                    page.controls.pnlPaymentAlert.rlabel("Payment Alert");
                    page.controls.pnlPaymentAlert.width(550);
                    page.controls.pnlPaymentAlert.height(170);
                }
                else {
                    page.controls.pnlBillPayPopup.open();
                    page.controls.pnlBillPayPopup.title("Pay for your purchase order");
                    page.controls.pnlBillPayPopup.rlabel("Pay for your purchase order");
                    page.controls.pnlBillPayPopup.width(340);
                    page.controls.pnlBillPayPopup.height(350);
                    $$("dsBillPayDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));  // Load Current PO when click Pay
                    $$("txtPayDesc").value("CurrentPO");
                    //var remainingAmount = parseFloat(page.controls.lblTotal.value()) - parseFloat(page.controls.lblTotalAmtPaid.html());
                    var remainingAmount = parseFloat(page.controls.lblTotalAmtRemaining.value()) - parseFloat(page.controls.lblReturnsBalance.value());
                    // page.controls.lblTotalAmtRemaining.html(remainingAmount);
                    $$("txtPayAmount").value(remainingAmount);
                    $$("btnBillPaySOOK").disable(false);
                }
            },
            btnClosePaymentPopup_click: function () {
                page.controls.pnlPaymentAlert.close();
            },
            btnCloseSettlementPopup_click: function () {
                page.controls.pnlSettlementAlert.close();
            },
            btnReturnAlertPopup_click: function () {
                page.controls.pnlReturnAlert.close();
            },
            btnBillPaySOOK_click: function () {
                $$("btnBillPaySOOK").disable(true);
                try {
                    //Confirm the payment
                    if (confirm("Are you sure to pay the Amount") == true) {
                        //var billSO = {
                        //    bill_no: page.controls.lblPOBillNo.value(),
                        //    collector_id: page.controls.ddlCollectorName.selectedValue(),
                        //    pay_desc: page.controls.txtPayDesc.value(),
                        //    amount: parseFloat(page.controls.txtPayAmount.value()),
                        //    po_no: page.currentPO.po_no,
                        //    pay_date: page.controls.dsBillPayDate.getDate(),
                        //    pay_type: page.controls.ddlPayType.selectedValue(),
                        //    pay_mode: $$("ddlPaymentBillType").selectedValue()
                        //};

                        if (isNaN(page.controls.txtPayAmount.value()) || page.controls.txtPayAmount.value() == 0)
                            throw ('Amount shoud be a number and non negative.');

                        if ((parseFloat(page.controls.lblTotalAmtPaid.html()) + parseFloat(page.controls.txtPayAmount.value())) > parseFloat(page.controls.lblTotal.value()))
                            throw ('Amount Exceeds total due amount:' + page.controls.lblTotal.value() + '--Total Paid amount is : ' + page.controls.lblTotalAmtPaid.html());

                        //if (!(billSO.collector_id != '' && billSO.amount != '' && billSO.pay_date != '' && billSO.pay_type != ''))
                        //    throw ('Please Enter Collector name, Amount, Pay date and pay type!');

                        var allBillSO = [], allBillSO1 = [];
                        var data1 = [], data2 = [];
                        var total_paid_amount = parseFloat($$("txtPayAmount").val());
                        $(page.controls.grdBillTransactions.allData()).each(function (i, item) {
                            if (parseFloat(total_paid_amount) > 0) {
                                if (parseFloat(item.balance) > 0) {
                                    if (item.bill_type == "PurchaseReturn") {
                                        allBillSO.push({
                                            bill_no: item.bill_no,
                                            collector_id: localStorage.getItem("user_register_id"),//$$("ddlCollectorName").selectedValue(),
                                            pay_desc: "Purchase Bill Payment",
                                            amount: item.balance,
                                            pay_date: dbDateTime(page.controls.dsBillPayDate.getDate()),
                                            pay_type: item.bill_type,
                                            pay_mode: page.controls.ddlPaymentBillType.selectedValue(),
                                            cheque_no: "",
                                            cheque_bank_name: "",
                                            cheque_date: "",
                                            store_no: localStorage.getItem("user_store_no"),
                                            comp_id: localStorage.getItem("user_company_id"),
                                            bill_type: item.bill_type
                                        });
                                        data2.push({
                                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                            target_acc_id: ($$("ddlPaymentBillType").selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : ($$("ddlPaymentBillType").selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : ($$("ddlPaymentBillType").selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : ($$("ddlPaymentBillType").selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                            paid_amount: item.balance,
                                            description: "Purchase Order Bill Return-" + item.bill_code,
                                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                            key_1: item.bill_no,
                                            key_2: page.selectedPO.vendor_no,
                                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                        });
                                    }
                                }
                            }
                        });
                        var data = {
                            payment_data: allBillSO,
                            finfacts_purchase_data: [],
                            finfacts_return_data: data2,
                        }
                        page.purchaseBillPaymentAPI.postAllValue(data, function (data) { });
                        if (parseFloat(total_paid_amount) > 0) {
                            allBillSO1.push({
                                bill_no: $$("lblPOBillNo").value(),
                                po_no: page.selectedPO.po_no,
                                collector_id: localStorage.getItem("user_register_id"),//$$("ddlCollectorName").selectedValue(),
                                pay_desc: "Purchase Order Bill Payment",
                                amount: parseFloat(total_paid_amount) + parseFloat($$("lblReturnsBalance").value()),
                                pay_date: dbDateTime(page.controls.dsBillPayDate.getDate()),
                                pay_type: page.controls.ddlPayType.selectedValue(),
                                pay_mode: page.controls.ddlPaymentBillType.selectedValue(),
                                cheque_no: "",
                                cheque_bank_name: "",
                                cheque_date: "",
                                store_no: localStorage.getItem("user_store_no"),
                                comp_id: localStorage.getItem("user_company_id"),
                                bill_type: "Purchase"
                            });
                            data1.push({
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                target_acc_id: ($$("ddlPaymentBillType").selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : ($$("ddlPaymentBillType").selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : ($$("ddlPaymentBillType").selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : ($$("ddlPaymentBillType").selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                paid_amount: parseFloat(total_paid_amount) + parseFloat($$("lblReturnsBalance").value()),
                                description: "Purchase Order Bill - " + $$("lblTempPOBillNo").html(),
                                jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                key_1: $$("lblPOBillNo").value(),
                                key_2: page.selectedPO.vendor_no,
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            });
                        }
                        var data11 = {
                            payment_data: allBillSO1,
                            finfacts_purchase_data: data1,
                            finfacts_return_data: [],
                        }
                        page.purchaseBillPaymentAPI.postAllValue(data11, function (data) {
                            page.purchaseService.getPOByNo(page.currentPO.po_no, function (data) {
                                var row = page.controls.grdPOResult.selectedRows()[0];
                                page.controls.grdPOResult.updateRow(row.attr("row_id"), data[0])
                                row.click();
                            });
                            page.controls.pnlBillPayPopup.close();
                            $$("msgPanel").flash("Your payment is successful...!");
                            $$("btnBillPaySOOK").disable(false);
                        });
                        //page.purchaseBillPaymentAPI.postAllValue(0, allBillSO, function (data) {
                        //    page.finfactsEntryAPI.allcreditPurchasePayment(0, data1, function (response) { });
                        //    page.finfactsEntryAPI.allcreditReturnPurchasePayment(0, data2, function (response) { });
                        //    page.purchaseService.getPOByNo(page.currentPO.po_no, function (data) {
                        //        var row = page.controls.grdPOResult.selectedRows()[0];
                        //        page.controls.grdPOResult.updateRow(row.attr("row_id"), data[0])
                        //        row.click();
                        //    });
                        //    page.controls.pnlBillPayPopup.close();
                        //    $$("msgPanel").flash("Your payment is successful...!");
                        //    $$("btnBillPaySOOK").disable(false);
                        //});


                        //page.purchaseService.payInvoiceBillSalesOrder(billSO, function (data) {

                        //    var data1 = {
                        //        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                        //        target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                        //        paid_amount: billSO.amount,
                        //        key_1: page.currentPO.po_no,
                        //        description: "Purchase Order-" + page.currentPO.po_no,
                        //        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                        //        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                
                        //    };
                        //    if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                        //        page.finfactsEntry.creditPurchasePayment(data1, function (response) {
                        //        });
                        //    }

                        //    page.purchaseService.getPOByNo(page.currentPO.po_no, function (data) {
                        //        var row = page.controls.grdPOResult.selectedRows()[0];
                        //        page.controls.grdPOResult.updateRow(row.attr("row_id"), data[0])
                        //        row.click();
                        //    });
                        //    page.controls.pnlBillPayPopup.close();
                        //    $$("msgPanel").flash("Your payment is successful...!");
                        //    $$("btnBillPaySOOK").disable(false);
                        //});
                    }
                } catch (e) {
                    alert(e);
                    //ShowDialogBox('Warning', e, 'Ok', '', null);
                    $$("btnBillPaySOOK").disable(false);
                }
            },
            btnCompletedPO_click: function () {

                try {

                    if (parseFloat(page.controls.lblTotalAmtPaid.html()) != parseFloat(page.controls.lblTotal.value())) {
                        var remainingAmount = parseFloat(page.controls.lblTotal.value()) - parseFloat(page.controls.lblTotalAmtPaid.html());
                        throw ('Purchase order cannot be marked as complete until full payment for the order is made!. Total amount paid till date is: ' + page.controls.lblTotalAmtPaid.html() + '--Please pay remaining amount:' + remainingAmount);

                    }

                    var voiceNo = $$("txtInvoiceNo").value();
                    if (voiceNo == '' || voiceNo == undefined) {
                        throw ("Vendor invoice number is mandatory!!");
                    }

                    page.purchaseService.completePO(page.currentPO.po_no, function (data2) {

                        $$("msgPanel").show("Purchase order is changed to completed state...");

                        page.purchaseService.getPOByNo(page.currentPO.po_no, function (data) {

                            var row = page.controls.grdPOResult.selectedRows()[0];
                            page.controls.grdPOResult.updateRow(row.attr("row_id"), data[0])
                            row.click();

                            $$("msgPanel").hide();;

                        })
                    });

                } catch (e) {
                    $$("msgPanel").flash(e);
                }

            },

            btnReturnPOItem_click: function () {
                $$("btnReturnPOItemPopup").show();
                page.controls.pnlReturnPOPopup.open();
                page.controls.pnlReturnPOPopup.title("Return Items");
                page.controls.pnlReturnPOPopup.rlabel("Return Items");
                page.controls.pnlReturnPOPopup.width("95%");
                page.controls.pnlReturnPOPopup.height(550);
                $$("btnReturnPOItemPopup").disable(false);
                page.purchaseBillService.getReturnedBillByNo(page.currentPO.po_no, page.currentPO.po_bill_no, function (rdata) {
                    page.view.selectedReturnPOItems(rdata);
                });

            },
            btnReturnPOItemPopup_click: function (overrideItems) {
                $$("btnReturnPOItemPopup").disable(true);
                $$("btnReturnPOItemPopup").hide();
                try {
                    var itemlList = page.controls.grdReturnPOItems.allData();
                    if (typeof overrideItems != "undefined")
                        itemlList = overrideItems;

                    var returnItems = [];
                    var inventItems = [];
                    var newBill = {
                        po_no: page.currentPO.po_no,
                        bill_no: "0",
                        bill_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        store_no: getCookie("user_store_id"),
                        fulfillment_store_no: localStorage.getItem("user_fulfillment_store_no"),
                        storewise_bill: CONTEXT.STOREWISE_BILL_NO,
                        reg_no: localStorage.getItem("user_register_id"),
                        user_no: localStorage.getItem("app_user_id"),

                        sub_total: 0,
                        total: 0,
                        discount: 0,
                        tax: 0,
                        pay_mode:"Loan",
                        bill_type: "PurchaseReturn",
                        state_no: 300,
                        round_off: 0,
                        sales_tax_no: page.sales_tax_no,
                        tax: 0,
                        mobile_no: page.controls.lblPOVendorPhone.val(),
                        email_id: page.controls.lblPOVendorEmail.val(),
                        gst_no: page.controls.lblPOVendorGst.val(),
                        bill_no_par: $$("lblPOBillNo").value(),
                        invoice_no: page.controls.txtInvoiceNo.val(),

                        vendor_no: page.controls.ddlPOVendor.selectedValue(),
                        vendor_name: $$("ddlPOVendor").selectedData().vendor_name,
                        vendor_address: page.controls.lblPOVendorAddress.val(),

                        //FINFACTS ENTRY DATA
                        invent_type: "PurchaseReturnCredit",
                        finfacts_comp_id: localStorage.getItem("user_finfacts_comp_id"),
                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),

                    };
                    var items = [];


                    var flag = false;
                    var stockItems = [];
                    var lastItemNo = "";
                    var lastItem = null;
                    var buying_cost = 0;
                    var fin_tot_price = 0;
                    $(itemlList).each(function (i, item) {
                        if (item.unit_identity == "1") {
                            item.delivered = parseFloat(item.delivered) * parseFloat(item.alter_unit_fact);
                            item.ret_qty = parseFloat(item.ret_qty) * parseFloat(item.alter_unit_fact);
                            item.qty = parseFloat(item.qty) * parseFloat(item.alter_unit_fact);
                        }
                        item.qty_returned = (item.qty_returned == null || item.qty_returned == "" || typeof item.qty_returned == "undefined") ? "0" : item.qty_returned;
                        if (typeof overrideItems != "undefined")
                            item.ret_qty = parseFloat(item.qty) - parseFloat(item.qty_returned);

                        if (item.ret_qty == null || item.ret_qty == "" || typeof item.ret_qty == "undefined") {
                            item.ret_qty = 0;
                        }
                        //Validate number and non negative
                        if (isNaN(item.ret_qty) || parseFloat(item.ret_qty) < 0) //If not a number or negative set flag=1
                            throw "Quantity to return should be a number and non negative.";

                        if (parseFloat(item.ret_qty) > 0) {
                            flag = true;
                            if (parseFloat(item.qty) < (parseFloat(item.ret_qty))) //If not a number or negative set flag=1
                                throw "Total return quantity cannot be greater than stocked quantity.";

                            //Add list for inventory transaction
                            stockItems.push(item);

                            var tax = (parseFloat(item.ret_qty) * parseFloat(item.buying_cost)) * (item.tax_per / 100);
                            newBill.tax = parseFloat(newBill.tax)+parseFloat(tax);
                            buying_cost = buying_cost + parseFloat(parseFloat(item.ret_qty) * parseFloat(item.buying_cost)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            //Add list for return bill with total item returned (when multiple mrp exists)
                            if (lastItemNo != item.item_no) {
                                lastItem = item;

                                if (item.buying_cost == 0) {
                                    lastItem.fin_ret_free = parseFloat(item.ret_qty);
                                    lastItem.fin_ret_qty = 0;
                                }
                                else {
                                    lastItem.fin_ret_qty = parseFloat(item.ret_qty);
                                    lastItem.fin_ret_free = 0;
                                }

                                lastItem.fin_total_price = parseFloat(item.ret_qty) * parseFloat(item.buying_cost);
                                fin_tot_price = lastItem.fin_total_price;
                                lastItem.sum_qty_returned = parseFloat(item.qty_returned);
                                returnItems.push(item);
                                lastItemNo = item.item_no;
                            }
                            else {
                                if (item.buying_cost == 0)
                                    lastItem.fin_ret_free = parseFloat(lastItem.fin_ret_free) + parseFloat(item.ret_qty);
                                else
                                    lastItem.fin_ret_qty = parseFloat(lastItem.fin_ret_qty) + parseFloat(item.ret_qty);


                                lastItem.fin_total_price = lastItem.fin_total_price + parseFloat(lastItem.fin_ret_qty) * parseFloat(item.buying_cost);
                                fin_tot_price = lastItem.fin_total_price;
                                lastItem.sum_qty_returned = lastItem.sum_qty_returned + parseFloat(item.qty_returned);

                                returnItems.push(item);
                            }

                            if (typeof overrideItems != "undefined") {
                                //For bill overriding. Return all item bill but Destock only stocked item
                                if (item.buying_cost == 0)
                                    lastItem.fin_ret_qty = parseFloat(lastItem.ordered_qty) - parseFloat(lastItem.sum_qty_returned);
                                else
                                    lastItem.fin_ret_free = parseFloat(lastItem.free_qty) - parseFloat(lastItem.sum_qty_returned);


                                lastItem.fin_total_price = parseFloat(lastItem.fin_ret_qty) * parseFloat(lastItem.buying_cost);
                                fin_tot_price = lastItem.fin_total_price;
                                //Calculate bill total value
                                newBill.sub_total = newBill.sub_total + parseFloat(lastItem.fin_ret_qty) * parseFloat(lastItem.buying_cost);
                                newBill.total = parseFloat(newBill.sub_total) + parseFloat(newBill.tax);
                                var total_after_Rnd_off = Math.round(parseFloat(newBill.total));
                                var round_off = parseFloat(parseFloat(newBill.total) - parseFloat(total_after_Rnd_off)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                                newBill.total = total_after_Rnd_off;
                                newBill.round_off = round_off;
                            } else {
                                //Calculate bill total value
                                newBill.sub_total = newBill.sub_total + parseFloat(item.ret_qty) * parseFloat(item.buying_cost);
                                newBill.total = parseFloat(newBill.sub_total) + parseFloat(newBill.tax);
                                var total_after_Rnd_off = Math.round(parseFloat(newBill.total));
                                var round_off = parseFloat(parseFloat(newBill.total) - parseFloat(total_after_Rnd_off)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                                newBill.total = total_after_Rnd_off;
                                newBill.round_off = round_off;
                            }
                            var poItem = {
                                item_no: item.item_no,
                                po_no: page.currentPO.po_no,
                                qty_delivered: parseFloat(item.delivered) - parseFloat(item.ret_qty),
                                qty_ret: parseFloat(item.ret_qty)
                            }
                            items.push(poItem);
                            var retqty = 0;
                            $(items).each(function (i, item1) {
                                if (item1.item_no == item.item_no)
                                    retqty = retqty + item1.qty_ret;
                            });
                            $(items).each(function (i, sitem) {
                                if (sitem.item_no == item.item_no)
                                    sitem.qty_delivered = parseFloat(item.delivered) - retqty;
                            });
                        }
                    });
                    if (flag == false)
                        if (typeof overrideItems == "undefined")
                            throw "No items cannot have returned qty";

                    if (confirm("Are you return the item(s)") == true) {
                        //Insert the Bill
                        $$("msgPanel").show("Generating a return bill..");
                        var rbillItems = [];

                        $(returnItems).each(function (i, billItem) {
                            //if (billItem.unit_identity == "1") {
                            //    billItem.ret_qty = parseFloat(billItem.ret_qty) * parseFloat(billItem.alter_unit_fact);
                            //}
                            var create_free_sku = "false";
                            if (billItem.attr_type1 == "cost" || billItem.attr_type2 == "cost" || billItem.attr_type3 == "cost" || billItem.attr_type4 == "cost" || billItem.attr_type5 == "cost" || billItem.attr_type6 == "cost")
                                create_free_sku = "true";
                            rbillItems.push({
                                sl_no: i + 1,
                                qty: billItem.ret_qty,
                                free_qty: billItem.fin_ret_free,
                                unit_identity: billItem.unit_identity,
                                price: billItem.buying_cost,
                                disc_val: 0,
                                disc_per: 0,
                                taxable_value: (parseFloat(billItem.fin_tot_price) * parseFloat(billItem.tax_per)) / 100,
                                tax_per: billItem.tax_per,
                                total_price: (parseFloat(billItem.buying_cost) == "0") ? "0" : fin_tot_price,//billItem.fin_total_price,
                                bill_type: "PurchaseReturn",

                                store_no: getCookie("user_store_id"),
                                item_no: billItem.item_no,
                                cost: (billItem.buying_cost == 0) ? "0.00" : billItem.buying_cost,

                                vendor_no: page.controls.ddlPOVendor.selectedValue(),
                                active: "1",
                                tax_class_no: (billItem.tax_class_no == null || billItem.tax_class_no == "" || typeof billItem.tax_class_no == "undefined") ? "" : billItem.tax_class_no,
                                amount: parseFloat(billItem.buying_cost) * parseFloat(billItem.qty),

                                var_no: billItem.var_no,
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
                                var_stock_attr_key: billItem.var_stock_attr_key,

                                tray_id: "0",
                                create_free_sku: create_free_sku
                            });
                            inventItems.push({
                                var_no: billItem.var_no,
                                qty: billItem.ret_qty,
                                trans_type: "PurchaseReturn",
                                trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                key1: page.currentPO.po_bill_no,
                                key2: billItem.item_no,

                                //FINFACTS ENTRY DATA
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                invent_type: "PurchaseReturnCredit",
                                description: "PurchaseReturn" + page.currentPO.po_bill_no,
                                amount: parseFloat(billItem.buying_cost) * parseFloat(billItem.ret_qty),
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                cost: (billItem.buying_cost == 0) ? "0.00" : billItem.buying_cost,

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
                                var_stock_attr_key: billItem.var_stock_attr_key,

                                tray_mode: "Custom",
                                tray_id: "0",
                                create_free_sku: create_free_sku
                            });
                        });
                        newBill.bill_items = rbillItems;
                        if (typeof overrideItems != "undefined") {
                            if (overrideItems.length == 0) {
                                newBill.sub_total = page.controls.lblSubTotal.value();
                                newBill.total = page.controls.lblTotal.value();
                                newBill.discount = page.controls.lblTotalDiscounts.value();
                                newBill.tax = page.controls.lblTotalTax.value();
                                newBill.round_off = parseFloat(page.controls.lblRndOff.value());
                            }
                        }
                        page.stockAPI.insertBill(newBill, function (data) {
                            page.currentReturnBillNo = data.bill_no;
                            page.purchaseService.updatePOItems(0, items, function () {
                                $(inventItems).each(function (i, item) {
                                    item.key1 = page.currentReturnBillNo;
                                });
                                page.stockAPI.insertAllStockVar(0, inventItems, function (data) {
                                    //ShowDialogBox('Message', 'Return bill is successfully created and stock is updated...!', 'Ok', '', null);
                                    alert("Return bill is successfully created and stock is updated...!");
                                    //page.events.btnReturnPOItem_click();
                                    if (typeof overrideItems == "undefined")
                                        page.controls.pnlReturnPOPopup.close();
                                    var round_off = (parseFloat(newBill.sub_total) - parseFloat(newBill.discount) + parseFloat(newBill.tax))
                                    var p_with_tax = (parseFloat(newBill.sub_total) - parseFloat(newBill.discount));//- parseFloat($$("lblRndOff").value());
                                    var data1 = {
                                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        description: "Purchase Order Return-" + page.currentPO.po_no,
                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                        pur_with_out_tax: parseFloat(p_with_tax).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                                        tax_amt: parseFloat(newBill.tax).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                                        buying_cost: parseFloat(buying_cost).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                                        round_off: parseFloat(Math.round(parseFloat(round_off)) - parseFloat(round_off)).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                                        key_1: page.currentReturnBillNo,
                                        key_2: $$("ddlVendorNos").selectedValue()

                                    };
                                    if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {

                                        page.finfactsEntry.creditReturnPurchase(data1, function (response) {
                                        });
                                    }
                                    page.purchaseBillService.getBillByPO(page.currentPO.po_no, function (data) {
                                        page.controls.grdBillTransactions.dataBind(data);
                                        $$("msgPanel").hide();
                                        page.purchaseService.getPOItems(page.currentPO.po_no, function (data) {
                                            page.view.selectedPOItems(data);
                                            page.currentPOItem = $.util.clone(data);
                                        });
                                    });
                                    page.view.purchaseHistory();
                                    //Reload item grid with new data
                                });
                            });
                        });
                    }

                } catch (e) {
                    alert(e);
                    //ShowDialogBox('Message', e, 'Ok', '', null);
                }

            },
            btnReceivePayment_click: function () {
                if ($$("lblReturns").html() == 0) {
                    page.controls.pnlReturnAlert.open();
                    page.controls.pnlReturnAlert.title("Return Alert");
                    page.controls.pnlReturnAlert.rlabel("Return Alert");
                    page.controls.pnlReturnAlert.width(550);
                    page.controls.pnlReturnAlert.height(150);
                }
                else if ($$("lblReturnsBalance").value() == 0) {
                    page.controls.pnlSettlementAlert.open();
                    page.controls.pnlSettlementAlert.title("Settlement Alert");
                    page.controls.pnlSettlementAlert.rlabel("Settlement Alert");
                    page.controls.pnlSettlementAlert.width(550);
                    page.controls.pnlSettlementAlert.height(150);
                }
                else {
                    try {
                        if (parseFloat(page.controls.lblTotalAmtRemaining.value()) == parseFloat(page.controls.lblTotal.value()))
                            throw "Payment not yet started";
                        $$("txtReceiveBillAmount").value('');
                        $$("txtReceivePayAmount").value('');
                        page.purchaseBillService.getReturnedActiveBillByNo(page.currentPO.po_no, function (data) {
                            $$("ddlReturnBillNo").dataBind(data, "bill_no", "bill_code", "select");
                        });

                        $$("ddlReturnBillNo").selectionChange(function () {
                            var data = {
                                po_no: page.currentPO.po_no,
                                bill_no: $$("ddlReturnBillNo").selectedValue()
                            };
                            page.purchaseBillService.getReturnedBillAmtByNo(data, function (data) {
                                $$("txtReceiveBillAmount").value(data[0].total);
                                $$("txtReceivePayAmount").value(data[0].total)
                            });
                        });
                        page.controls.pnlReceiveBillPayPopup.open();
                        page.controls.pnlReceiveBillPayPopup.title("Pay for your return order");
                        page.controls.pnlReceiveBillPayPopup.rlabel("Pay for your return order");
                        page.controls.pnlReceiveBillPayPopup.width(340);
                        page.controls.pnlReceiveBillPayPopup.height(500);
                        $$("dsReceiveBillPayDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));  // Load Current PO when click Pay
                        $$("txtReceivePayDesc").value("CurrentPO");
                        $$("btnReceiveBillPaySOOK").disable(false);
                    } catch (e) {
                        $$("msgPanel").flash(e);
                    }
                }
            },
            btnReceiveBillPaySOOK_click: function () {
                $$("btnReceiveBillPaySOOK").disable(true);
                try {
                    if ($$("ddlReturnBillNo").selectedValue() == -1) {
                        throw ("No Bill Is Selected");
                    }
                    if (parseFloat(page.controls.txtReceivePayAmount.value()) <= 0 || page.controls.txtReceivePayAmount.value() == "" || page.controls.txtReceivePayAmount.value() == null || isNaN(page.controls.txtReceivePayAmount.value())) {
                        throw ("Payment Amount Is Number And Non Negative");
                    }
                    if (parseFloat(page.controls.txtReceivePayAmount.value()) > parseFloat(page.controls.txtReceiveBillAmount.value())) {
                        throw "Payment Amount Should Not Exceed Than The Actual Ammount";
                    }
                    if (confirm("Are you Pay the amount") == true) {

                        var billSO = {
                            bill_no: $$("ddlReturnBillNo").selectedValue(),
                            collector_id: page.controls.ddlReceiveCollectorName.selectedValue(),
                            pay_desc: page.controls.txtReceivePayDesc.value(),
                            amount: parseFloat(page.controls.txtReceivePayAmount.value()),
                            po_no: page.currentPO.po_no,
                            pay_date: page.controls.dsReceiveBillPayDate.getDate(),
                            pay_type: page.controls.ddlRetPayType.selectedValue(),
                            pay_mode:$$("ddlReturnPaymentBillType").selectedValue(),
                        };


                        var trans_type1 = "Return";
                        var data1 = {
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                            //amount: billSO.amount,
                            paid_amount: billSO.amount,
                            key_1: page.currentPO.po_no,
                            description: "Purchase Order Return-" + page.currentPO.po_no,
                            jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                        };
                        page.controls.pnlReceiveBillPayPopup.close();
                        $$("btnReceiveBillPaySOOK").disable(false);

                        if (isNaN(billSO.amount) || billSO.amount == 0)
                            throw ('Please Enter only digits greater than 0 for amount!');

                        if (!(billSO.collector_id != '' && billSO.amount != '' && billSO.pay_date != '' && billSO.pay_type != ''))
                            throw ('Please Enter Collector name, Amount, Pay date and pay type!');

                        $$("msgPanel").show('Updating payment details..');
                        page.purchaseService.payInvoiceBillSalesOrder(billSO, function (data) {
                            data1.key_3 = data[0].key_value;
                            $$("msgPanel").show('Payment detail is saved successfully...!');
                            page.controls.txtReceivePayDesc.value('');
                            page.controls.txtReceiveBillAmount.value('');
                            page.controls.txtReceivePayAmount.value('');
                            page.controls.dsReceiveBillPayDate.setDate('');

                            page.controls.ddlReceiveCollectorName.selectedValue('');

                            if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                //page.finfactsService.insertCreditReturnPayment(data1, function (response) {
                                page.finfactsEntry.creditReturnPurchasePayment(data1, function (response) {
                                });
                            }
                            page.purchaseService.getInvoiceBillDetails(page.currentPO.po_no, function (data) {
                                page.controls.grdTransactions.dataBind(data);
                                page.view.purchaseHistory();

                            });
                        });


                    }
                    else {
                        $$("btnReceiveBillPaySOOK").disable(false);
                    }
                } catch (e) { alert(e); }

            },

            btnBack_click: function () {
                if (page.selectedPO.state_text == "Created") {
                    page.controls.pnlConformClosing.open();
                    page.controls.pnlConformClosing.title("Confirmation Panel");
                    page.controls.pnlConformClosing.rlabel("Confirmation Panel");
                    page.controls.pnlConformClosing.width(550);
                    page.controls.pnlConformClosing.height(220);
                    $$("btnClosePopup").focus();
                }
                else {
                    $$("pnlDetail").hide();
                    $$("pnlSearch").show();
                    page.events.btnSearch_click();
                }
            },
            btnConfirmPopup_click: function () {
                page.controls.pnlConformClosing.close();
                $$("pnlDetail").hide();
                $$("pnlSearch").show();
                page.events.btnSearch_click();
            },
            btnClosePopup_click: function () {
                page.controls.pnlConformClosing.close();
            },
            btnRemovePO_click: function () {
                try {
                    if (confirm("Are you sure want to delete the Purchase Order!")) {

                        page.purchaseService.deletePO(page.currentPO.po_no, function (data) {

                            $$("msgPanel").flash("PO is succcessfully removed");
                            page.events.btnSearch_click();
                            $$("pnlDetail").hide();
                            $$("pnlSearch").show();
                            page.controls.pnlContainerPage.hide();
                            page.view.UIState("Load");
                            //$$("msgPanel").hide();
                        });

                    }

                } catch (e) {
                    $$("msgPanel").flash(e);
                }

            },
            btnCancelPO_click: function () {
                if (confirm("Are You Sure Want To Cancel This Order")) {
                    page.purchaseBillService.getReturnedBillByNo(page.currentPO.po_no, page.currentPO.po_bill_no, function (rdata) {
                        page.events.btnReturnPOItemPopup_click(rdata);
                        page.purchaseService.returnPurchaseOrder(page.currentPO.po_no, function (data1) {
                            page.purchaseService.getPOByNo(page.currentPO.po_no, function (data) {
                                var row = page.controls.grdPOResult.selectedRows()[0];
                                page.controls.grdPOResult.updateRow(row.attr("row_id"), data[0])
                                row.click();
                            });
                        });
                    });
                }
            },


            btnSearch_click: function () {
                page.purchaseService.getPOs("", "", page.view.searchInput(), $$("ddlState").selectedValue(), $$("ddlOrderState").selectedValue(), function (data) {
                    page.view.searchResult(data);
                });
                //$$("grdPOResult").dataBind({
                //    getData: function (start, end, sortExpression, filterExpression, callback) {
                //        page.purchaseService.getPOs("", "", page.view.searchInput(), $$("ddlState").selectedValue(), $$("ddlOrderState").selectedValue(), function (data) {
                //            var totalRecord = data.length;
                //            page.purchaseService.getPOs(start, end, page.view.searchInput(), $$("ddlState").selectedValue(), $$("ddlOrderState").selectedValue(), function (data) {
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
            },
            grdPOResult_select: function (item) {
                $$("pnlDetail").show();
                $$("pnlSearch").hide();

                $$("pnlReceiveDeliveryActions").hide();
                $$("pnlReturnDeliveryActions").hide();
                $$("pnlAddToStockActions").hide();
                $$("pnlAddToTrayActions").hide();
                $$("pnlReturnTrayActions").hide();


                page.currentPO = item;
                page.currentPOItem = [];

                page.controls.pnlContainerPage.show();
                //Load selected PO and its items
                page.view.selectedPO(item);
                page.purchaseService.getPOItems(item.po_no, function (data) {
                    page.view.selectedPOItems(data);
                    page.currentPOItem = $.util.clone(data);
                    page.calculate();
                    setTimeout(function () { $$("txtItemSearch").selectedObject.focus(); }, 100);

                });
                //Load change state action dropdown
                page.view.UIState(item.state_text);
                page.sales_tax_no = CONTEXT.DEFAULT_SALES_TAX;
                page.billService.getSalesTaxClass(page.sales_tax_no, function (data) {
                    page.sales_tax = data;
                    page.calculate();
                });
                (CONTEXT.ENABLE_QR_CODE) ? $$("btnQrScan").show() : $$("btnQrScan").hide();
            },


            btnInvoicePO_click: function () {
                page.controls.pnlInvoicePOPopup.open();
                page.controls.pnlInvoicePOPopup.title("Invoice");
                page.controls.pnlInvoicePOPopup.rlabel("Invoice");
                page.controls.pnlInvoicePOPopup.width(200);
                page.controls.pnlInvoicePOPopup.height(200);
                if (CONTEXT.ENABLE_SMS_IN_PURCHASE) {
                    $$("pnlPurchaseSMS").show();
                }
                else {
                    $$("pnlPurchaseSMS").hide();
                }
                if (CONTEXT.ENABLE_PURCHASE_EMAIL) {
                    $$("pnlPurchaseEmail").show();
                }
                else {
                    $$("pnlPurchaseEmail").hide();
                }
            },
            btnPrintJasperBill_click: function () {
                var exp_type = $$("ddlExportType").selectedValue();
                if (exp_type == "" || exp_type == undefined || exp_type == null)
                    $$("msgPanel").show("Please select export type");
                page.printJasper(page.PrintBillNo, exp_type);
            },
            btnInvoicePrintJasperBill_click: function () {
                var exp_type = $$("ddlInvoiceExportType").selectedValue();
                if (exp_type == "" || exp_type == undefined || exp_type == null)
                    $$("msgPanel").show("Please select export type");
                page.printJasper(page.controls.lblPOBillNo.value(), exp_type);
            },
            btnPrintPO_click: function () {
                page.controls.pnlInvoicePOPopup.close();

                page.controls.pnlPrintInvoicePopup.open();
                page.controls.pnlPrintInvoicePopup.title("Select Export Type");
                page.controls.pnlPrintInvoicePopup.width("500");
                page.controls.pnlPrintInvoicePopup.height("200");
            },
            btnSendsms_click: function () {
                if (CONTEXT.ENABLE_SMS_IN_PURCHASE) {
                    page.controls.pnlInvoicePOPopup.close();
                    var purchasedetails = page.selectedPO;
                    var items = "";
                    $(page.controls.grdPOItems.allData()).each(function (i, item) {
                        items = (items == "") ? "Item Name: " + item.item_name + "- Qty: " + item.qty + "- Unit: " + item.unit : items + ", " + "Item Name: " + item.item_name + "- Qty: " + item.qty + "- Unit: " + item.unit;
                    });
                    try {
                        if (purchasedetails.vendor_phone == undefined || purchasedetails.vendor_phone == null || purchasedetails.vendor_phone == "")
                            throw "Customer cannot have the mobile no";
                        var ajaxInfo = {
                            "appName": CONTEXT.COMPANY_NAME,//CONTEXT.SMS_APPNAME,
                            "senderNumber": CONTEXT.SMS_SENDER_NO,
                            "companyId": CONTEXT.SMS_COMPANY_ID,
                            "receiverNumber": "+91" + purchasedetails.vendor_phone,
                            "message":
                                "Dear " + $$("ddlPOVendor").selectedData().vendor_name + "," + "\n" +
                                "Please Supply This Items " + items + " ,\n" +
                                "Regards as" + CONTEXT.COMPANY_NAME + "",
                        };
                        sendSMS(ajaxInfo, function (response) {
                            console.log("Order SMS has been sent..!");
                            $$("msgPanel").show("Order SMS has been sent..!");
                        }, function (errorResponse) {
                            console.log("Error while sending SMS : " + errorResponse);
                            $$("msgPanel").show("Error while sending SMS : " + errorResponse);
                        });
                    }
                    catch (e) {
                        alert(e);
                    }
                    //var accountInfo =
                    //{
                    //    "appName": CONTEXT.COMPANY_NAME,

                    //    "senderNumber": CONTEXT.SMS_SENDER_NO,
                    //    "companyId": CONTEXT.SMS_COMPANY_ID,
                    //    "message": //"Hai",
                    //        "Dear " + $$("ddlPOVendor").selectedData().vendor_name + "," + "\n" +
                    //        "Please Order This Items " + items + " ,\n" +
                    //        //"Your Total Amount is Rs. " + page.controls.lblTotal.value() + "\n" +
                    //        "Regards as " + CONTEXT.COMPANY_NAME + "",
                    //    "receiverNumber": "+91" + purchasedetails.vendor_phone,
                    //};

                    //var accountInfoJson = JSON.stringify(accountInfo);

                    //$.ajax({
                    //    type: "POST",
                    //    //url: "http://104.251.218.116:8080/woto-utility-rest/rest/sendSMS/text-message",
                    //    url: CONTEXT.SMSURL,
                    //    headers: {
                    //        'Content-Type': 'application/json'
                    //    },
                    //    crossDomain: false,
                    //    data: JSON.stringify(accountInfo),
                    //    dataType: 'json',
                    //    success: function (responseData, status, xhr) {
                    //        console.log(responseData);

                    //        $$("msgPanel").flash("SMS sent successfully...");
                    //    },
                    //    error: function (request, status, error) {
                    //        console.log(request.responseText);

                    //        $$("msgPanel").show("SMS sent failed...");
                    //    }
                    //});
                } else {
                    //alert("Sorry!.. your settings block sending messages");
                    ShowDialogBox('Message', 'Sorry!.. your settings block sending messages...!', 'Ok', '', null);
                }
            },
            btnSendMail_click: function () {
                if (CONTEXT.ENABLE_PURCHASE_EMAIL) {
                    page.controls.pnlInvoicePOPopup.close();
                    //page.controls.grdPOResult
                    var purchasedetails = page.selectedPO;
                    var itemLists = [];
                    $(page.controls.grdPOItems.allData()).each(function (i, item) {
                        itemLists.push({ "itemNo": item.item_no, "itemName": item.item_name, "qty": item.qty, "unit": item.unit, "price": item.cost, "discount": item.disc_val, "totalPrice": item.total_price });
                    });
                    //page.controls.grdPOItems.allData()
                    //page.controls.grdPOItems.allData()
                    //page.purchaseService.getCustomerByAll($$("ddlmyrewardplans").selectedValue(), function (itemList) {
                    //  $(itemList).each(function (i, item) {
                    var accountInfom = {
                        "appName": CONTEXT.COMPANY_NAME,
                        "companyId": localStorage.getItem("user_company_id"),
                        "orderedDate": purchasedetails.ordered_date,
                        //$$("lblPOOrderedDate").html(),
                        //new Date(page.selectedPO.ordered_date),
                        "deliveredDate": purchasedetails.delivered_date,
                        //$$("lblPODeliveredDate").html(),
                        //new Date(page.selectedPO.expected_date),
                        "expectedDate": purchasedetails.expected_date,
                        //new Date(page.selectedPO.delivered_date),
                        "purchaseOrderNo": purchasedetails.po_id,
                        "purchaseOrderStatus": purchasedetails.state_text,
                        "shippingAddress": $$("lblPOVendorAddress").html(),
                        "deliveryAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + ", " + CONTEXT.COMPANY_ADDRESS_LINE2,
                        "clientAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + ", " + CONTEXT.COMPANY_ADDRESS_LINE2,
                        "vendorNumber": $$("ddlPOVendor").selectedData().vendor_id,
                        "vendorName": $$("ddlPOVendor").selectedData().vendor_name,
                        "tax": page.controls.lblTotalTax.value(),
                        "subTotal": page.controls.lblTotal.value(),
                        "discount": page.controls.lblTotalDiscounts.value(),
                        "totalPaid": purchasedetails.total_paid_amount,
                        "emailAddressList": [purchasedetails.vendor_email],
                        "billItemList": itemLists,
                    };
                    var accountInfopoJson = JSON.stringify(accountInfom);

                    $.ajax({
                        type: "POST",
                        url: CONTEXT.POEmailURL,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        crossDomain: false,
                        data: JSON.stringify(accountInfom),
                        dataType: 'json',
                        success: function (responseData, status, xhr) {
                            console.log(responseData);
                            $$("msgPanel").flash("Email sent successfully..." + purchasedetails.vendor_name + " " + purchasedetails.vendor_email + " " + CONTEXT.COMPANY_NAME);
                        },
                        error: function (request, status, error) {
                            console.log(request.responseText);

                            $$("msgPanel").show("Email sent failed..." + purchasedetails.vendor_name + " " + purchasedetails.vendor_email + " " + CONTEXT.COMPANY_NAME);

                        }
                    });

                } else {
                    //alert("Sorry!.. Your settings blocks email sending");
                    ShowDialogBox('Message', 'Sorry!.. Your settings blocks email sending...!', 'Ok', '', null);
                }

            },
            //TODO : Remove this method
            //btnAddPartialToStock_click: function () {
            //    var count = 0;
            //    $(page.controls.grdPOItems.allData()).each(function (i, item) {
            //        if (item.addStock == null)
            //            count++;
            //    });
            //    if (count == 0)
            //        page.purchaseService.getPurchaseStock(page.currentPO.po_no, function (stockList) {
            //            var stockQty;
            //            $(page.controls.grdPOItems.allData()).each(function (i, data) {
            //                
            //                var val = prompt("Please enter partial stock quanity for item:" + data.item_name, 1);
            //                if (val != null && !isNaN(val) && parseInt(val) > 0) {
            //                    var result = $.grep(stockList, function (e) { return e.item_no == data.item_no; });
            //                    if (result.length == 0) {
            //                        stockQty = parseInt(val);
            //                    }
            //                    else {
            //                        stockQty = parseInt(data.qty) - parseInt(result[0].qty);
            //                    }
            //                    if (parseInt(val) <= parseInt(data.qty) && parseInt(val) <= parseInt(stockQty)) {
            //                        if (data.expiry_date != null) {
            //                            var oridate = (data.expiry_date).split("-");
            //                            var exdate = oridate[2] + "-" + oridate[1] + "-" + oridate[0];
            //                        } else {
            //                            exdate = null;
            //                        }
            //                        var data3 = {
            //                            item_no: data.item_no,
            //                            cost: data.cost,
            //                            qty: val,
            //                            mrp: data.mrp,
            //                            vendor_no: $$("ddlPOVendor").selectedValue(),
            //                            selling_price: data.selling_price,
            //                            batch_no: data.batch_no,
            //                            expiry_date: data.expiry_date,
            //                            invent_type: "Purchase",
            //                            key1: page.currentPO.po_no
            //                        }
            //                        page.inventoryService.insertInventory(data3, function (data1) {
            //                            $$("msgPanel").show("Partial Stock added to the inventory successfully for the item: " + data.item_name);
            //                           
            //                            page.purchaseService.getPOByNo(page.currentPO.po_no, function (data) {
            //                                var row = page.controls.grdPOResult.selectedRows()[0];
            //                                page.controls.grdPOResult.updateRow(row.attr("row_id"), data[0]);
            //                                row.click();
            //                            });
            //                        });
            //                        page.itemService.insertItemPrice({
            //                            item_no: data.item_no,
            //                            price: data.cost,
            //                            mrp: data.mrp,
            //                            selling_price: data.selling_price,
            //                            batch_no: data.batch_no,
            //                            valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
            //                            expiry_date: data.expiry_date,
            //                        }, function (data) { });
            //                    }
            //                    else {
            //                        $$("msgPanel").show("Stock exceeds the Purchas Order and it cannot be added into inventory for item:" + data.item_name);
            //                       
            //                    }
            //                }
            //                else {
            //                    $$("msgPanel").show("Stock quantity cannot be null and it should be a valid digits!!");
            //                   
            //                }
            //            });
            //        });
            //    else
            //        alert("Stock is Mantatory");
            //},



            btnPickReorder_click: function () {
                var ven_No = $$("ddlPOVendor").selectedValue();
                page.itemService.getReorderItems(ven_No, function (data) {
                    $(data).each(function (i, item) {
                        if (item != null) {
                            if (typeof item.item_no != "undefined") {

                                var newitem = {
                                    item_no: item.item_no,
                                    item_code: item.item_code,
                                    item_name: item.item_name,
                                    qty: item.reorder_qty,
                                    temp_qty:item.reorder_qty,
                                    temp_free_qty:0,
                                    free_qty:0,
                                    qty_stock: 0,
                                    stock: item.qty_stock,
                                    cost: 0,
                                    total_price: 0,
                                    unit: item.unit,
                                    tray_id: item.tray_id,
                                    tray_count: 1,
                                    mrp: 0,
                                    expiry_date: '',
                                    batch_no: '',
                                    po_no: page.selectedPO.po_no,
                                    barcode: item.barcode,
                                    rack_no: item.rack_no
                                };

                                //Populate 
                                var rows = page.controls.grdPOItems.getRow({
                                    item_no: newitem.item_no
                                });


                                if (rows.length == 0) {
                                    page.controls.grdPOItems.createRow(newitem);
                                    page.controls.grdPOItems.edit(true);
                                    rows = page.controls.grdPOItems.getRow({
                                        item_no: newitem.item_no
                                    });
                                    rows[0].find("[datafield=qty]").find("input").focus();
                                } else {
                                    var txtQty = rows[0].find("[datafield=qty]").find("input");
                                    txtQty.val(parseInt(txtQty.val()) + 1);
                                    txtQty.trigger('change');
                                    txtQty.focus();
                                }
                                page.controls.txtItemSearch.customText("");
                                page.calculate();
                            }
                        }
                    });
                });
                /*    $(page.productList).each(function (index, item) {
                        var newitem = {
                            item_no: item.item_no,
                            qty_stock: item.qty_stock
                        }
                        page.purchaseService.getReorderStock(newitem.item_no, function (data) {
                            if (data[0].reorder_level >= newitem.qty_stock) {
                                $(page.productList).each(function (index, item1) {
                                    if (item1.item_no == newitem.item_no) {
                                        page.reorderList = data;
                                    }
                                });
                            }
                        });
                    });*/
            },
            btnOpenBill_click: function (bill) {
                page.controls.pnlViewer.open();
                page.controls.pnlViewer.title("Bill Details");
                page.controls.pnlViewer.rlabel("Bill Details");
                page.controls.pnlViewer.width(1150);
                page.controls.pnlViewer.height(400);
                page.controls.ucbillViewer.load(bill);
            },
            page_init: function () { },
            page_load: function () {
                page.sales_tax_no = CONTEXT.DEFAULT_SALES_TAX;
                //page.itemService.getItemsAutoComplete("%",page.sales_tax_no, function (data) {
                //    $(data).each(function (i, item) {
                //        // item.label = item.label + " <span style='margin:right:30px'><span> [MRP:" + item.price + "] <span style='margin:right:30px'><span> " + item.mrp

                //    });
                //    page.productList = data;
                //});
                $("[controlid=txtItemSearch]").bind("keypress", function (e) {
                    // access the clipboard using the api
                    var self = this;
                    setTimeout(function () {
                        var str = $(self).val();
                        if (str.startsWith("00")) {
                            $(self).val(parseInt(str.substring(0, str.length - 1)));
                            $(self).keydown();
                        }
                    }, 300)
                });
                page.controls.txtItemSearch.itemTemplate = function (item) {
                    return "<a>" + item.item_name + "_" + item.item_code + "<span style='margin:right:30px'>  <span style='margin:right:30px'><span> </a>";
                }
                page.controls.txtItemSearch.dataBind({
                    getData: function (term, callback) {
                        page.itemService.getItemsAutoComplete(term, page.sales_tax_no, function (data) {
                            callback(data);
                        });
                    }
                });
                page.controls.txtItemSearch.select(function (item) {
                    if (item != null) {
                        if (typeof item.item_no != "undefined") {

                            var newitem = {
                                po_no: page.selectedPO.po_no,
                                item_no: item.item_no,
                                item_code: item.item_code,
                                item_name: item.item_name,
                                unit: item.unit,
                                qty: 1,
                                temp_qty: 1,
                                free_qty: 0,
                                temp_free_qty:0,
                                qty_type: item.qty_type,
                                tray_id: item.tray_no,
                                tax_class_no: item.tax_class_no,
                                rack_no: item.rack_no,
                                //qty_stock: '',
                                //stock: item.qty_stock,
                                //cost: '',
                                ////total_price: '',

                                //tray_id: item.tray_id,
                                //tray_count: 1,
                                //mrp: '',
                                //selling_price: '',
                                //expiry_date: '',
                                //batch_no: '',
                                //disc_per: 0,
                                //disc_val: 0,
                                tax_per: item.tax_per_val,
                                barcode: item.barcode,
                                qty_stock: item.qty_stock,
                                alter_unit: item.alter_unit,
                                unit_identity: 0,
                                alter_unit_fact: item.alter_unit_fact,
                                state_text: "Created",
                                var_attribute: item.var_attribute,
                                var_stock_attribute: item.var_stock_attribute,
                                var_attr_key: item.var_attr_key,
                                var_stock_attr_key: item.var_stock_attr_key,

                                attr_type1: item.attr_type1,
                                attr_value1: "",
                                attr_type2: item.attr_type2,
                                attr_value2: "",
                                attr_type3: item.attr_type3,
                                attr_value3: "",
                                attr_type4: item.attr_type4,
                                attr_value4: "",
                                attr_type5: item.attr_type5,
                                attr_value5: "",
                                attr_type6: item.attr_type6,
                                attr_value6: "",
                            };

                            //Populate 
                            var rows = page.controls.grdPOItems.getRow({
                                item_no: newitem.item_no
                            });


                            if (rows.length == 0) {
                                page.controls.grdPOItems.createRow(newitem);
                                page.controls.grdPOItems.edit(true);
                                rows = page.controls.grdPOItems.getRow({
                                    item_no: newitem.item_no
                                });
                                rows[0].find("[datafield=temp_qty]").find("input").focus().select();
                            } else {
                                var txtQty = rows[0].find("[datafield=temp_qty]").find("input");
                                txtQty.val(parseInt(txtQty.val()) + 1);
                                txtQty.trigger('change');
                                txtQty.focus();
                            }
                            page.controls.txtItemSearch.customText("");
                            //page.calculate();
                        }
                    }

                });


                page.view.UIState("Load");
                page.view.searchResult([]);
                
                page.printJasper = function (bill_no, exp_type) {
                    var billdata = {
                        bill_no: bill_no,
                        po_no: $$("lblPONo").html()
                    }
                    page.purchaseBillService.getPurchasePrint(billdata, function (data) {
                        page.events.btnprintInvoiceJson_click(data, exp_type);
                    });
                }
                page.events.btnprintInvoiceJson_click = function (billItem, exp_type) {
                    var data = billItem[0];
                    var bill_item = [];
                    var s_no = 0;
                    var lastItem;
                    $(billItem).each(function (i, item) {
                        s_no = s_no + 1;
                        //if (lastItem == null || lastItem.var_no != item.var_no) {
                        bill_item.push({
                            "BillItemNo": s_no,
                            "ProductName": item.item_name,	// nonstandard unquoted field name
                            "Pack": item.packing,	// nonstandard single-quoted field name
                            "Mfr": item.man_name,
                            "Batch": item.batch_no,	// standard double-quoted field name
                            "Exp": item.expiry_date,
                            "Qty": (parseFloat(item.price) == 0)?"0":item.qty,
                            "FreeQty": (parseFloat(item.price) == 0) ? item.qty : "0",
                            "Rate": parseFloat(item.price).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            "PDis": parseFloat(item.discount).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            "MRP": parseFloat(item.mrp).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            "CGST": (parseFloat(item.tax_per) / 2).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            "SGST": (parseFloat(item.tax_per) / 2).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            "GValue": parseFloat(item.total_price).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            "TotalPrice": parseFloat(item.total_price).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                        });
                        lastItem = item;
                        // }
                    });
                    var accountInfo =
                                {
                                    "BillType": "INVOICE",
                                    //"SupplierName": data.vendor_name,	// standard double-quoted field name
                                    //"Phone": data.phone_no,
                                    //"SuppAddress": data.address,
                                    //"SuppCityStreetZipCode": "",
                                    //"DLNo": "",
                                    //"GST": "",
                                    //"TIN": "",
                                    "SupplierName": CONTEXT.COMPANY_NAME,
                                    "Phone": CONTEXT.COMPANY_PHONE_NO,
                                    "SuppAddress": CONTEXT.COMPANY_ADDRESS_LINE1,
                                    "SuppCityStreetZipCode": CONTEXT.COMPANY_ADDRESS_LINE2,
                                    "DLNo": CONTEXT.COMPANY_DL_NO,
                                    "GST": CONTEXT.COMPANY_GST_NO,
                                    "TIN": CONTEXT.COMPANY_TIN_NO,
                                    //"BillNo": data.bill_no,
                                    "BillNo": data.bill_code,
                                    "BillDate": data.bill_date,
                                    "NoofItems": data.no_of_items,
                                    "Quantity": data.no_of_qty,
                                    "BSubTotal": parseFloat(data.sub_total).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                                    "DiscountAmount": parseFloat(data.tot_discount).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                                    "BCGST": parseFloat(data.tot_gst_tax).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                                    "BSGST": parseFloat(data.tot_gst_tax).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                                    "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                                    "BillAmount": parseFloat(data.total).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                                    //"ApplicaName": CONTEXT.AppName,
                                    //"ApplsName": CONTEXT.AppName.toUpperCase(),
                                    //"CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                    //"CompanyCityStreetPincode": "",
                                    //"CompanyPhoneNoEtc": CONTEXT.PhoneNo,
                                    //"CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                                    //"CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                                    //"CompanyGST": CONTEXT.COMPANY_GST_NO,
                                    "ApplicaName": data.vendor_name,
                                    "ApplsName": data.vendor_name.toUpperCase(),
                                    "CompanyAddress": data.address,
                                    "CompanyCityStreetPincode": "",
                                    "CompanyPhoneNoEtc": data.phone_no,
                                    "CompanyDLNo": "",
                                    "CompanyTINNo": "",
                                    "CompanyGST": "",
                                    "SSSS": "ORIGINAL",
                                    "Original": "ORIGINAL",
                                    "RoundAmount": parseFloat(data.round_off).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                                    "Order Name": "Order No",
                                    "Order No": data.order_no,
                                    "Order Status Name": "Status",
                                    "Order Staus": data.status,
                                    "Invoice No Name": "Invoice No",
                                    "Invoice No": data.invoice_no,
                                    "BillItem": bill_item
                                };
                    page.PrintBillType = (typeof page.PrintBillType == "undefined") ? "Purchase" : page.PrintBillType;
                    accountInfo.BillName = page.PrintBillType;
                    GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-bill.jrxml", accountInfo, exp_type);
                    //if (page.PrintBillType == "PurchaseReturn") {
                    //    accountInfo.BillName = "PURCHASE RETURN BILL";
                    //    GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-return-bill.jrxml", accountInfo, exp_type);
                    //}
                    //else {
                    //    accountInfo.BillName = "PURCHASE BILL";
                    //    GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-bill.jrxml", accountInfo, exp_type);
                    //}

                }
                page.purchaseService.getAllPaymentCollector(function (data) {
                    $$("ddlCollectorName").dataBind(data, "collector_id", "collector_name");
                    $$("ddlReceiveCollectorName").dataBind(data, "collector_id", "collector_name");
                    $$("ddlPendingCollectorName").dataBind(data, "collector_id", "collector_name");
                });

                page.inventoryService.getAllVendors(function (data) {
                    $$("ddlVendorNos").dataBind(data, "vendor_no", "vendor_name");
                    $$("ddlPOVendor").dataBind(data, "vendor_no", "vendor_name");
                    $$("ddlAddInventVendor").dataBind(data, "vendor_no", "vendor_name");

                });

                $$("ddlVendorNos").selectionChange(function () {
                    page.inventoryService.getVendorById($$("ddlVendorNos").selectedValue(), function (data) {

                        $$("lblPOVendorAddress").html(data[0].vendor_address);
                        $$("lblPOVendorPhone").html(data[0].vendor_phone);
                        $$("lblPOVendorEmail").html(data[0].vendor_email);
                        $$("lblPOVendorGst").html(data[0].gst_no);
                    });

                });


                page.purchaseService.getState(function (data) {
                    $$("ddlState").dataBind(data, "state_no", "state_name", "All");
                });
                $$("ddlState").selectionChange(function () {
                    page.controls.grdPOResult.dataBind([]);
                    //page.purchaseService.getPOs("", $$("ddlState").selectedValue(), function (data) {
                    //    if ($$("ddlState").selectedValue() == -1)
                    //        page.view.searchResult(data);
                    //    else
                    //        $(data).each(function (i, items) {
                    //            if (items.state_no == $$("ddlState").selectedValue())
                    //                page.controls.grdPOResult.createRow(items);
                    //        });
                    //})
                    var state = $$("ddlState").selectedValue() == "-1" ? "" : $$("ddlState").selectedValue();
                    //$$("grdPOResult").dataBind({
                    //    getData: function (start, end, sortExpression, filterExpression, callback) {
                    //        page.purchaseService.getPOs("", "", page.view.searchInput(), state, $$("ddlOrderState").selectedValue(), function (data) {
                    //            var totalRecord = data.length;
                    //            page.purchaseService.getPOs(start, end, page.view.searchInput(), state, $$("ddlOrderState").selectedValue(), function (data) {
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
                    page.purchaseService.getPOs("", "", page.view.searchInput(), state, $$("ddlOrderState").selectedValue(), function (data) {
                        page.view.searchResult(data);
                    });
                    
                });

                var searchViewData = [];
                searchViewData.push({ view_no: "-1", view_name: "All" }, { view_no: "1", view_name: "Today's Order" }, { view_no: "2", view_name: "Weekly Order" }, { view_no: "3", view_name: "Monthly Order" });
                $$("ddlOrderState").dataBind(searchViewData, "view_no", "view_name");
                $$("ddlOrderState").selectedValue("1");
                $$("ddlOrderState").selectionChange(function () {
                    page.controls.grdPOResult.dataBind([]);
                    var state = $$("ddlState").selectedValue() == "-1" ? "" : $$("ddlState").selectedValue();
                    page.purchaseService.getPOs("", "", page.view.searchInput(), state, $$("ddlOrderState").selectedValue(), function (data) {
                        page.view.searchResult(data);
                    });
                    //$$("grdPOResult").dataBind({
                    //    getData: function (start, end, sortExpression, filterExpression, callback) {
                    //        page.purchaseService.getPOs("", "", page.view.searchInput(), state, $$("ddlOrderState").selectedValue(), function (data) {
                    //            var totalRecord = data.length;
                    //            page.purchaseService.getPOs(start, end, page.view.searchInput(), state, $$("ddlOrderState").selectedValue(), function (data) {
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
                });

                $$("grdPOResult").dataBind({
                    getData: function (start, end, sortExpression, filterExpression, callback) {
                        page.purchaseService.getPOs("", "", page.view.searchInput(), -1, $$("ddlOrderState").selectedValue(), function (data) {
                            var totalRecord = data.length;
                            page.purchaseService.getPOs(start, end, page.view.searchInput(), -1, $$("ddlOrderState").selectedValue(), function (data) {
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
                $$("txtReceiveBillAmount").disable(true);
                $$("ddlPOVendor").disable(true);

                $$("ddlPayFor").selectionChange(function () {
                    //   var remainingAmount1;
                    if ($$("ddlPayFor").selectedValue() == "Current SalesOrder") {

                        $$("txtPayAmount").value(page.controls.lblTotalAmtRemaining.html());
                    }
                    else if ($$("ddlPayFor").selectedValue() == "All Pending Payments") {
                        $$("txtPayAmount").value(page.pendingAmount);

                    }
                });

                page.billService.getAllSalestax(function (data) {
                    page.controls.ddlSalesTax.dataBind(data, "sales_tax_no", "sales_tax_name", "None");
                });

                //Show popup to set tax
                $$("lblTaxLabel").selectedObject.click(function () {
                    page.controls.pnlTaxPopup.open();
                    page.controls.pnlTaxPopup.title("Tax Selection");
                    page.controls.pnlTaxPopup.width(650);
                    page.controls.pnlTaxPopup.height(150);

                    $$("ddlSalesTax").selectedValue(page.sales_tax_no);
                    if (page.selectedPO.state_text != "Ordered") {
                        $$("btnTaxOK").hide();
                    }
                    else {
                        $$("btnTaxOK").show();
                    }
                });

                page.itemAttributeAPI.searchValue(0, "", "", "", "", function (data) {
                    page.attr_list = data;
                });
                if (CONTEXT.SHOW_BARCODE) {
                    $("#barcodePrint").show();
                    $$("btnPrintBarcode").show();
                }
                else {
                    $("#barcodePrint").hide();
                    $$("btnPrintBarcode").hide();
                }
            },
            btnNewVariation_click: function () {
                var searchViewData = [];
                page.controls.pnlNewVariation.open();
                page.controls.pnlNewVariation.title("New Variation");
                page.controls.pnlNewVariation.width("900");
                page.controls.pnlNewVariation.height(300);
                $$("txtNewVariation").focus();
                $$("ddlAddInventVendor").selectedValue(page.controls.ddlPOVendor.selectedValue());
                $$("ddlAddInventVendor").disable(true);
                //$$("txtAddInventCost").value(page.controls.grdPOItems.selectedData()[0].buying_cost);
                //$$("txtAddInventCost").disable(true);
                searchViewData.push({ view_no: page.controls.grdPOItems.selectedData()[0].buying_cost, view_name: page.controls.grdPOItems.selectedData()[0].buying_cost }, { view_no: 0, view_name: 0 })
                $$("ddlAddInventCost").dataBind(searchViewData, "view_no", "view_name");
            },
            btnAddVariation_click: function () {

                var count = 0;
                var vari_data = {
                    store_no: getCookie("user_store_id"),
                    item_no: page.controls.grdPOItems.selectedData()[0].item_no,
                    cost: $$("ddlAddInventCost").selectedValue(),
                    vendor_no: $$("ddlAddInventVendor").selectedValue(),
                    user_no: getCookie("user_id"),
                    mrp: $$("txtAddMrp").value(),
                    // expiry_date: $$("dsAddExpiryDate").getDate(),
                    batch_no: $$("txtAddBatchNo").value(),
                    variation_name: $$("txtNewVariation").value(),
                    active: 1,
                    // man_date: $$("dsAddManufactureDate").getDate(),
                    rate: page.controls.grdPOItems.selectedData()[0].cost,
                    disc_val: page.controls.grdPOItems.selectedData()[0].disc_val,
                    disc_per: page.controls.grdPOItems.selectedData()[0].disc_per
                }
                if ($$("dsAddExpiryDate").selectedObject.val() == "" || $$("dsAddExpiryDate").selectedObject.val() == null || typeof $$("dsAddExpiryDate").selectedObject.val() == "undefined") {
                    vari_data.expiry_date = "";
                }
                else {
                    vari_data.expiry_date = CONTEXT.ENABLE_VARIATION_EX_DATE ? dbDateTime($$("dsAddExpiryDate").getDate()) : "";
                }
                if ($$("dsAddManufactureDate").selectedObject.val() == "" || $$("dsAddManufactureDate").selectedObject.val() == null || typeof $$("dsAddManufactureDate").selectedObject.val() == "undefined") {
                    vari_data.man_date = "";
                }
                else {
                    vari_data.man_date = CONTEXT.ENABLE_VARIATION_MAN_DATE ? dbDateTime($$("dsAddManufactureDate").getDate()) : "";
                }
                if ($$("txtNewVariation").value() == "") {
                    //alert("Enter variation name...!");
                    ShowDialogBox('Message', 'Enter variation name...!', 'Ok', '', null);
                    $$("txtNewVariation").focus();
                }
                else {
                    page.stockService.getStockVarByItemNo(vari_data.item_no, function (data) {
                        try {
                            $(data).each(function (i, item) {
                                if (vari_data.variation_name == item.variation_name && parseFloat(vari_data.mrp) == parseFloat(item.mrp) && vari_data.batch_no == item.batch_no && vari_data.expiry_date == item.expiry_date && parseFloat(vari_data.cost) == parseFloat(item.cost)) {
                                    throw "Duplicate entry not accepted";
                                    count++;
                                }
                                if (vari_data.variation_name == item.variation_name) {
                                    throw "Variation name is not duplicated";
                                }
                            })
                            if (count == 0) {
                                $(".detail-info").progressBar("show")
                                $$("msgPanel").flash("Inserting inventory...");
                                //page.inventoryService.insertStockVariation(vari_data, function (data) {
                                page.stockAPI.insertVariation(vari_data, function (data) {
                                    //alert("Variation Added Successfully");
                                    ShowDialogBox('Message', 'Variation Added Successfully...!', 'Ok', '', null);
                                    page.controls.pnlNewVariation.close();
                                    $$("msgPanel").flash("Inventory inserted...");
                                    $$("txtNewVariation").value("");
                                    $$("txtAddMrp").value("");
                                    $$("txtAddBatchNo").value("");
                                    $$("dsAddExpiryDate").setDate("");
                                    page.events.btnAddToStock_click();
                                });
                            } else {
                                throw "Sorry same variation can be used";
                            }
                        } catch (e) {
                            //alert(e);
                            ShowDialogBox('Message', e, 'Ok', '', null);
                        }
                    });
                }
            },
            btnAddNewItem_click: function () {
                page.taxclassAPI.searchValues("", "", "", "", function (data) {
                    page.controls.ddlNewTax.dataBind(data, "tax_class_no", "tax_class_name", "None");
                });
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
                    });
                });
                page.productTypeAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlProductType").dataBind(data, "ptype_no", "ptype_name", "None");
                });
                $$("txtNewItemCode").value("");
                $$("txtNewItemName").selectedObject.val("");
                $$("itemNewUnit").selectedValue("-1");
                $$("txtNewBarcode").value("");
                if (CONTEXT.ENABLE_TAX_INCLUSIVE) {
                    $$("chkNewInclusive").prop("checked", true);
                }
                else {
                    $$("chkNewInclusive").prop("checked", false);
                }
                $$("txtAlterUnit").selectedValue("-1");
                $$("txtAlterUnitFact").value("");
                page.controls.txtNewBarcode.value(page.controls.txtItemSearch.selectedValue());
                page.controls.pnlNewItem.open();
                page.controls.pnlNewItem.title("New Item");
                page.controls.pnlNewItem.rlabel("New Item");
                page.controls.pnlNewItem.width("75%");
                page.controls.pnlNewItem.height(470);

                if (CONTEXT.ENABLE_ALTER_UNIT) {
                    $$("pnlAlternativeUnit").show();
                    $$("pnlAlternativeUnitFactor").show();
                } else {
                    $$("pnlAlternativeUnit").hide();
                    $$("pnlAlternativeUnitFactor").hide();
                }
                $$("txtNewItemCode").focus();

                //if (CONTEXT.showItemCode) {
                //    $$("pnltemCode").show();
                //}
                //else {
                //    $$("pnltemCode").hide();
                //}
                if (CONTEXT.SHOW_BARCODE) {
                    $$("pnlBarCode").show();
                } else {
                    $$("pnlBarCode").hide();
                }
                if (CONTEXT.ENABLE_PRODUCT_TYPE) {
                    $$("pnlMainProductType").show();
                    $$("pnlProductType").show();
                }
                else {
                    $$("pnlMainProductType").hide();
                    $$("pnlProductType").hide();
                }
                $$("txtNewItemName").selectedObject.focus();
                //page.controls.txtNewItemName.dataBind({
                //    getData: function (term, callback) {
                //        callback(page.itemList);
                //    }
                //});
                //page.controls.txtNewItemName.selectedObject.val(page.controls.txtItemSearch.selectedObject.val());
                //page.controls.txtNewItemName.select(function (item) {
                //    if (item != null) {
                //        $$("txtNewItemCode").value(item.item_code);
                //        $$("itemNewUnit").selectedValue(item.unit);
                //        $$("txtNewBarcode").value("");
                //        $$("itemNewUnit").selectedValue(item.unit);
                //        $$("ddlNewTax").selectedValue(item.tax_class_no);
                //        if (item.tax_inclusive == 1) {
                //            $$("chkNewInclusive").prop('checked', true);
                //        }
                //        else {
                //            $$("chkNewInclusive").prop('checked', false);
                //        }
                //    }
                //});
                //page.controls.txtNewItemName.noRecordFound(function () {
                //    $$("txtNewItemCode").value("");
                //    $$("itemNewUnit").selectedValue("");
                //    $$("txtNewBarcode").value("");
                //    $$("itemNewUnit").selectedValue("");
                //    $$("ddlNewTax").selectedValue("None");
                //    $$("chkNewInclusive").prop('checked', false);
                //});
                //page.controls.txtNewItemName.allowCustomText(function (item) {
                //    page.controls.txtNewItemName.selectedObject.val(item.val());
                //});

                page.controls.grdItemVariation.width("100%");
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

                $$("grdItemVariation").dataBind(page.attr_list);
                $$("grdItemStockVariation").dataBind(page.attr_list);
            },
            btnSaveNewItem_click: function () {
                try {
                    var active;
                    if ($$("chkNewInclusive").prop("checked"))
                        active = 1;
                    else
                        active = 0;
                    var data = {
                        item_name: $$("txtNewItemName").value(),
                        item_code: $$("txtNewItemCode").value(),
                        barcode: $$("txtNewBarcode").value(),
                        unit: $$("itemNewUnit").selectedValue(),
                        tax_class_no: ($$("ddlNewTax").selectedValue() == null) ? "-1" : $$("ddlNewTax").selectedValue(),
                        tax_inclusive: active,
                        comp_id: localStorage.getItem("user_company_id"),
                        alter_unit: $$("txtAlterUnit").selectedValue(),
                        alter_unit_fact: $$("txtAlterUnitFact").value(),
                        var_attribute: "",
                        var_stock_attribute: "",
                        var_attr_key: "",
                        var_stock_attr_key: "",
                        mpt_no: ($$("ddlMainProductType").selectedValue() == null) ? "-1" : $$("ddlMainProductType").selectedValue(),
                        ptype_no: ($$("ddlProductType").selectedValue() == null) ? "-1" : $$("ddlProductType").selectedValue(),
                    }
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
                    if (data.item_name == "" || data.item_name == null || typeof data.item_name == "undefined") {
                        throw "Item Name Should Not Be Empty";
                    }
                    if ((parseInt($$("grdItemVariation").selectedData().length) + parseInt($$("grdItemStockVariation").selectedData().length)) > 6) {
                        throw "Maximum 6 variations only choosen";
                    }
                    page.itemAPI.postValue(data, function (data1) {
                        var term = $$("txtNewItemName").value() + "%";
                        page.itemService.getItemsAutoComplete(term, page.sales_tax_no, function (data) {
                            var item = data[0];
                            if (item != null) {
                                if (typeof item.item_no != "undefined") {
                                    var newitem = {
                                        po_no: page.selectedPO.po_no,
                                        item_no: item.item_no,
                                        item_code: item.item_code,
                                        item_name: item.item_name,
                                        unit: item.unit,
                                        qty: 1,
                                        temp_qty: 1,
                                        free_qty: 0,
                                        temp_free_qty: 0,
                                        qty_type: item.qty_type,
                                        tray_id: item.tray_no,
                                        tax_class_no: item.tax_class_no,
                                        rack_no: item.rack_no,
                                        tax_per: item.tax_per_val,
                                        barcode: item.barcode,
                                        qty_stock: item.qty_stock,
                                        alter_unit: item.alter_unit,
                                        unit_identity: 0,
                                        alter_unit_fact: item.alter_unit_fact,
                                        state_text: "Created",
                                        var_attribute: item.var_attribute,
                                        var_stock_attribute: item.var_stock_attribute,
                                        var_attr_key: item.var_attr_key,
                                        var_stock_attr_key: item.var_stock_attr_key,

                                        attr_type1: item.attr_type1,
                                        attr_value1: "",
                                        attr_type2: item.attr_type2,
                                        attr_value2: "",
                                        attr_type3: item.attr_type3,
                                        attr_value3: "",
                                        attr_type4: item.attr_type4,
                                        attr_value4: "",
                                        attr_type5: item.attr_type5,
                                        attr_value5: "",
                                        attr_type6: item.attr_type6,
                                        attr_value6: "",
                                    };

                                    var rows = page.controls.grdPOItems.getRow({
                                        item_no: newitem.item_no
                                    });

                                    if (rows.length == 0) {
                                        page.controls.grdPOItems.createRow(newitem);
                                        page.controls.grdPOItems.edit(true);
                                        rows = page.controls.grdPOItems.getRow({
                                            item_no: newitem.item_no
                                        });
                                        rows[0].find("[datafield=temp_qty]").find("input").focus().select();
                                    } else {
                                        var txtQty = rows[0].find("[datafield=temp_qty]").find("input");
                                        txtQty.val(parseInt(txtQty.val()) + 1);
                                        txtQty.trigger('change');
                                        txtQty.focus();
                                    }
                                    page.controls.txtItemSearch.customText("");
                                    page.controls.pnlNewItem.close();
                                }
                            }
                        });
                    })
                }
                catch (e) {
                    alert(e);
                }
            },
            btnNewMainProductType_click: function () {
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
            btnNewProductTypeSave_click:function(){
                var producttype = {
                    ptype_name: $$("txtNewProductTypeName").value(),
                    mpt_no: $$("ddlmymainproduct").selectedValue(),
                };
                try {
                    if (producttype.ptype_name == "" || producttype.ptype_name == null || producttype.ptype_name == undefined) {
                        throw "Product type name is mandatory ...!";
                    }
                    else if (producttype.ptype_name != "" && isInt(producttype.ptype_name)) {
                        throw "Product type name should only contains characters ...!";
                    }
                    else if (producttype.mpt_no == "" || producttype.mpt_no == null || producttype.mpt_no == undefined) {
                        throw "Main Product Type Is Not Choosen ...!";
                    }
                    page.productTypeAPI.postValue(producttype, function (data) {
                        var prod_type_no = data[0].key_value;
                        page.productTypeAPI.searchValues("", "", "", "", function (data) {
                            $$("ddlProductType").dataBind(data, "ptype_no", "ptype_name", "None");
                            $$("ddlProductType").selectedValue(prod_type_no);
                            alert("Product type saved successfully...!");
                            page.controls.pnlNewProductType.close();
                        });
                    });
                }
                catch (e) {
                    alert(e);
                    $$("txtNewProductTypeName").focus();
                }
            },
            btnCompleteReturnPOItem_click: function () {
                if(confirm("Are You Sure Want To Return All The Items")){
                    page.purchaseBillService.getReturnedBillByNo(page.currentPO.po_no, page.currentPO.po_bill_no, function (rdata) {
                        page.events.btnReturnPOItemPopup_click(rdata);
                        page.purchaseService.returnPurchaseOrder(page.currentPO.po_no, function (data1) {
                            page.purchaseService.getPOByNo(page.currentPO.po_no, function (data) {
                                var row = page.controls.grdPOResult.selectedRows()[0];
                                page.controls.grdPOResult.updateRow(row.attr("row_id"), data[0])
                                row.click();
                            });
                        });
                    });
                }
            }

        }
        //QR Code Scan
        page.events.btnQrScan_click = function () {
            page.controls.pnlQrScan.open();
            page.controls.pnlQrScan.title("QR Scanning Screen");
            page.controls.pnlQrScan.width(750);
            page.controls.pnlQrScan.height(550);
            let scanner = new Instascan.Scanner({ video: $(page.controls.preview.selectedObject)[0] });
            scanner.addListener('scan', function (content) {
                page.controls.pnlQrScan.close();
                page.controls.txtItemSearch.selectedText(content);
                scanner.stop();
            });
            Instascan.Camera.getCameras().then(function (cameras) {
                if (cameras.length > 0) {
                    scanner.start(cameras[0]);
                } else {
                    console.error('No cameras found.');
                }
            }).catch(function (e) {
                console.error(e);
            });
        }
        //Set the Tax to be used for current sales order.
        page.events.btnTaxOK_click = function () {
            if (page.controls.ddlSalesTax.selectedValue() == -1) {
                page.sales_tax = [];
                page.sales_tax_no = -1;
                page.calculate();
            } else {
                var data = page.controls.ddlSalesTax.selectedData();
                page.sales_tax_no = data.sales_tax_no;
                page.billService.getSalesTaxClass(data.sales_tax_no, function (data) {
                    page.sales_tax = data;
                    page.calculate();
                });
            }
            $$("msgPanel").show("Tax added in current session...");
            page.controls.pnlTaxPopup.close();

        }
        page.interface.load = function () {
            $(page.selectedObject).load("/view/pages/item-list/item-list.html");
        }

        function getAttributeName(id) {
            var value = "";
            $(page.attr_list).each(function (i, item) {
                if (item.attr_no_key == id)
                    value = item.attr_name;
            })
            return (value);
        }
    });
}




$.fn.itemSelection = function () {
    var control = $.pageController.getControlContext(this).getControl();

    if (typeof control.controlName === "undefined") { //Do the intitialisation only one time.
        control.controlName = "itemSelection";

        control.view = {
            uiState: function (currentUIState) {
                if (currentUIState == "New") {
                    control.controls.grdItemFilter.width("300px");
                    control.controls.grdItemFilter.height("260px");
                    control.controls.grdItemFilter.setTemplate({
                        selection: true,
                        columns: [
                            { 'name': "Item No", 'width': "70px", 'dataField': "item_no" },
                            { 'name': "Item Name", 'width': "140px", 'dataField': "item_name" },
                            { 'name': "", 'width': "1px", 'dataField': "price" }

                        ]
                    });
                    control.controls.grdItemFilter.rowBound = function (row, item) {
                        row.css("cursor", "pointer");
                        row.click(function () {
                            row.parent().children("div").css("background-color", "");
                            var chk = row.find("input[type=checkbox]");
                            if (chk.prop("checked")) {
                                row.css("background-color", "");
                                row.find("input[type=checkbox]").prop("checked", false);
                                control.events.grdItemFilter_select(item, false);
                            } else {
                                row.css("background-color", "lime");
                                row.find("input[type=checkbox]").prop("checked", true);
                                control.events.grdItemFilter_select(item, true);
                            }

                            //row.parent().find("input[type=checkbox]").prop("checked", false);
                        });
                        row.on("keydown", "input[datafield=qty]", function (e) {
                            if (e.which == 9) {
                                e.preventDefault();
                                var nextRow = $(this).closest("grid_row").next();
                                if (nextRow.length == 0) {
                                    page.controls.txtItemSearch.selectedObject.focus();
                                } else {
                                    nextRow.find("input[datafield=qty]").focus();
                                }

                            }
                        });
                    };
                    control.controls.grdItemFilter.dataBind([]);

                    control.controls.grdItemSelected.width("300px");
                    control.controls.grdItemSelected.height("260px");
                    control.controls.grdItemSelected.setTemplate({
                        selection: false,
                        columns: [
                            { 'name': "Item No", 'width': "70px", 'dataField': "item_no" },
                            { 'name': "Item Name", 'width': "140px", 'dataField': "item_name" },
                            { 'name': "", 'width': "1px", 'dataField': "price" }

                        ]
                    });
                    control.controls.grdItemSelected.rowBound = function (row, item) {
                        row.css("cursor", "pointer");
                        row.click(function () {
                            row.parent().children("div").css("background-color", "");
                            row.css("background-color", "lime");

                            row.parent().find("input[type=checkbox]").prop("checked", false);
                            row.find("input[type=checkbox]").prop("checked", true);
                            control.events.grdPOResult_select(item);
                        });
                    };
                    control.controls.grdItemSelected.dataBind([]);
                    //control.controls.grdItemSelected.dataSource = ds;
                }
            }
        }
        control.events = {
            page_init: function () { },
            page_load: function () {
                control.view.uiState("New");
                control.controls.txtItemSearch.val("");
                control.controls.txtItemSearch.focus();
                control.controls.grdItemFilter.dataBind([]);
                control.controls.grdItemSelected.dataBind([]);

            },
            grdItemFilter_select: function (item) {
                if (!exists(control.controls.grdItemSelected.allData(), "item_no", item.item_no))
                    control.controls.grdItemSelected.createRow(item);
            },
            txtItemSelAdd_click: function () {
                if (control.interface.select) {
                    control.interface.select(control.controls.grdItemSelected.allData());
                }
                //<<<<<<< HEAD
                control.controls.grdItemSelected.allData(null);
                //page.controls.pnlItemSelectionPopup.close();
                //=======
                control.controls.grdItemSelected.dataBind([]);
                //>>>>>>> 5c2ddfcab233f24156fc70fa2ec4ee49bb907514
            },
            txtItemSelCancel_click: function () {
                if (control.interface.select) {

                }
            }
        };

        control.interface.select = null;
        control.interface.load = function () {

            control.controls.grdItemSelected.dataBind([]);

            control.controls.txtItemSearch.selectedObject.bind('change keyup paste', function () {
                control.itemService.getItemsAutoComplete(control.controls.txtItemSearch.value(), function (data) {
                    control.controls.grdItemFilter.dataBind(data);
                });
            });
        }
        control.itemService = new ItemService();
        $.pageController.initControlAndEvents(control);
    }

    return control.interface;
}

function exists(data, column, columnValue) {
    var exists = false;
    for (var d in data) {
        if (data[d][column] == columnValue) {
            exists = true;
            break;
        }
    }
    return exists;
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