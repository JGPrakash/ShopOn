
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

        page.receiveMode = false;
        page.stockMode = false;
        page.damageMode = false;
        page.trayMode = false;

        page.sales_tax = [];
        page.sales_tax_no = -1;

        function PrintingOD(data) {
            var r = window.open(null, "_blank");
            var doc = r.document;
            var head = false;

            doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; } #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td  {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;} </style><div class='col-lg-12'>");
            doc.write("<span style='float:right;font-size:17px;'>ORIGINAL</span><br>");
            doc.write("<div><h1><center>" + CONTEXT.COMPANY_NAME.toUpperCase() + "</center></h1></div>");
            doc.write("<center><div style='width:600px;'>" + '' + CONTEXT.COMPANY_ADDRESS + '' + "</center>");
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
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Mrp).toFixed(2) + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Price).toFixed(2) + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Disc).toFixed(2) + "</td>");

                //doc.write("<td  class='col' style=' width: 90px; height: auto;'>" + parseFloat(item.tax_per) + "%</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(tax_cgst).toFixed(2) + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(tax_sgst).toFixed(2) + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Tot_Price).toFixed(2) + "</td>");
                doc.write("</tr>");

                no_of_prd = no_of_prd + 1;
                s_no = s_no + 1;
                tot_Qty = parseInt(tot_Qty) + parseInt(item.qty);
                tot_tax_cgst = parseFloat(tot_tax_cgst) + parseFloat(tax_cgst);
                tot_tax_sgst = parseFloat(tot_tax_sgst) + parseFloat(tax_sgst);
            });
            doc.write("<tr><td colspan='9' style=''><div> No.of.Items :  " + no_of_prd + "</div></td><td colspan='4'> <div ><b>SubTotal: </b><span style='float:right'>" + parseFloat(page.controls.lblSubTotal.value()).toFixed(2) + "</span> </div></td> </tr>");
            doc.write("<tr><td colspan='9' style=''><div> Quantity : " + tot_Qty + "</div></td><td colspan='4'> <div ><b>Discount Amount: </b><span style='float:right'>" + parseFloat(page.controls.lblTotalDiscounts.value()).toFixed(2) + "</span> </div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>CGST: </b><span style='float:right'>" + parseFloat(tot_tax_cgst).toFixed(2) + " </span></div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>SGST: </b><span style='float:right'>" + parseFloat(tot_tax_sgst).toFixed(2) + "</span> </div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>Tax Amount: </b><span style='float:right'>" + parseFloat(page.controls.lblTotalTax.value()).toFixed(2) + " </span></div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>Bill Amount: </b><span style='float:right'>" + parseFloat(page.controls.lblTotal.value()).toFixed(2) + "</span> </div> </td></tr>");
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
                    if (item.qty == null || isNaN(item.qty) || parseFloat(item.qty) < 0 || item.qty == "" || item.qty == 0) //If not a number or negative set flag=1
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
                    var result = compareContents(page.currentPOItem, poItems, "po_no,item_no", "po_no,item_no,qty,tax_per,barcode,alter_unit_fact,unit_identity");

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
                        throw "Quantity should be a number and non negative.";

                    if (item.free_qty == null || isNaN(item.free_qty) || parseFloat(item.free_qty) < 0) //If not a number or negative set flag=1
                        throw "Free Quantity should be a number and non negative.";

                    if (item.cost == null || isNaN(item.cost) || parseFloat(item.cost) < 0 || (item.cost == "" && item.cost != 0)) //If not a number or negative set flag=1
                        throw "Cost should be a number greater than zero and non negative.";

                    if (item.disc_per == null || isNaN(item.disc_per) || parseFloat(item.disc_per) < 0) //If not a number or negative set flag=1
                        throw "Discount percentage should be a number and non negative.";

                    if (item.disc_val == null || isNaN(item.disc_val) || parseFloat(item.disc_val) < 0) //If not a number or negative set flag=1
                        throw "Discount value should be a number and non negative.";

                    if (item.tax_per == null || isNaN(item.tax_per) || parseFloat(item.tax_per) < 0) //If not a number or negative set flag=1
                        throw "Tax percentage should be a number and non negative.";

                    poItems.push({
                        po_no: item.po_no,
                        item_no: item.item_no,
                        free_qty: item.free_qty,
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
                //function getTaxIgst(tax_class_no) {
                //    var rdata = 0;
                //    $(page.sales_tax).each(function (i, item) {
                //        if (tax_class_no == item.tax_class_no) {
                //            rdata = item.igst;
                //        }
                //    });
                //    return rdata;
                //}
                //var tax_per = getTaxPercent(poItem.tax_class_no);
                poItem.tax_per = getTaxPercent(poItem.tax_class_no);
               // var isgt = getTaxIgst(tax_class_no);

                //poItem.tax_per = parseFloat(tax_per);
                //poItem.sgst = parseFloat(tax_per)/2 +"%";
                //poItem.cgst = parseFloat(tax_per) / 2 + "%";
                //poItem.igst = parseFloat(isgt);

                //var tax = (subtotal - discount) * parseFloat(poItem.tax_per) / 100;
                var tax = (subtotal - discount) * parseFloat(poItem.tax_per) / 100;
                var total = (subtotal - discount) + tax;
                var buyingCost = (subtotal - discount) / poItem.qty;

                if (CONTEXT.enableFreeVariation) {
                   // var buying_cost = (subtotal - discount) / (parseFloat(poItem.qty));
                    net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(2);
                } else {
                   // var buying_cost = (subtotal - discount) / (parseFloat(poItem.qty) + parseFloat(poItem.free_qty));
                    net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(2);
                }

                $(row).find("[datafield=tax_per]").find("div").html(poItem.tax_per);
                $(row).find("[datafield=total_price]").find("div").html(total.toFixed(2));
                $(row).find("[datafield=buying_cost]").find("div").html(buyingCost.toFixed(2));
                $(row).find("[datafield=net_rate]").find("div").html(net_rate);
                poItem.net_rate = net_rate;
                poItem.total_price = total;
                finalsubtotal = finalsubtotal + subtotal;
                finaldiscount = finaldiscount + discount;
                finaltax = finaltax + tax;
                finaltotal = finaltotal + total;

            });
            //var item_no = parseFloat($(row).find("[datafield=item_no]").find("div").html());
            ////var price = parseFloat($(row).find("[datafield=cost]").find("div").html());

            //var price;

            //var alldata = page.controls.grdPOItems.allData();
            //var qty; // = parseFloat($(row).find("[datafield=quantity]").find("input").val());
            //var dis_val;
            //var dis_per;
            //var tax_val;
            //var tot_disc = 0.00;
            //var tot_tax = 0;
            //var dis_val_cal = 0;

            //$(alldata).each(function (index, item) {
            //    if (i == index) {
            //        qty = parseFloat(item.qty);
            //        price = parseFloat(item.cost);
            //        dis_per = parseFloat(item.disc_per);
            //        dis_val = parseFloat(item.disc_val);
            //        dis_val_cal = parseFloat(item.disc_val);
            //        tax_val = parseFloat(item.tax_per);
            //    }
            //});

            //$(alldata).each(function (index, item) {
            //    tot_disc = tot_disc + parseFloat(item.disc_val);
            //    tot_tax = tot_tax + ((item.qty * item.cost * item.tax_per) / 100);
            //    //tot_tax = tot_tax + item.tax_per;
            //});
            //page.controls.lblTotalDiscounts.html(tot_disc);
            //page.controls.lblTotalTax.html(tot_tax);


            //var txtAmount = $(row).find("[datafield=total_price]").find("div");


            //if (isNaN(qty)) {
            //    qty = 1;
            //}

            //if (isNaN(price)) {
            //    price = 0;
            //}

            //if (isNaN(dis_per)) {
            //    dis_per = 0;
            //}

            //if (isNaN(dis_val)) {
            //    dis_val = 0;
            //}
            //if (isNaN(dis_val_cal)) {
            //    dis_val_cal = 0;
            //}

            //if (isNaN(tax_val)) {
            //    tax_val = 0;
            //}

            //if (dis_per != 0) {
            //    dis_val = (qty * price * dis_per) / 100;
            //}
            //if (dis_val != 0) {
            //    dis_val = parseFloat(dis_val) + parseFloat(dis_val_cal);
            //}
            //if (tax_val != 0) {
            //    tax_val = (((qty * price) - dis_val) * tax_val) / 100;
            //}

            //var qty_price = (price * qty) - dis_val + tax_val;

            //sub_total = sub_total + qty_price;


            //txtAmount.html(parseFloat(qty_price).toFixed(2));

            //var currentData = page.controls.grdPOItems.getRowData(row); //set the grid value



            var total_after_Rnd_off = Math.round(parseFloat(finaltotal));
            var round_off = parseFloat(parseFloat(finaltotal) - parseFloat(total_after_Rnd_off)).toFixed(2);

            page.controls.lblRndOff.value(parseFloat(round_off).toFixed(2));
            page.controls.lblTotal.value(parseFloat(total_after_Rnd_off).toFixed(2));
            //page.controls.lblTotal.value(parseFloat(finaltotal).toFixed(2));
            page.controls.lblSubTotal.value(parseFloat(finalsubtotal).toFixed(2));
            page.controls.lblTotalDiscounts.value(parseFloat(finaldiscount).toFixed(2));
            page.controls.lblTotalTax.value(parseFloat(finaltax).toFixed(2));

            var remainingAmount = parseFloat(page.controls.lblTotal.value()) - parseFloat(page.controls.lblTotalAmtPaid.html());
            // page.controls.lblTotalAmtRemaining.html(remainingAmount);
            page.controls.lblTotalAmtRemaining.value(parseFloat(remainingAmount).toFixed(2));

        }
        page.variation = function (row, billItem, callback) {
            var var_data = [];
            $(billItem.variation_data).each(function (i, item) {
                if (item.variation_name != null) {
                    if (parseInt(item.cost) != 0) {
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
                        });
                    }
                }
            })
            callback(var_data);
        }

        page.view = {
            searchInput: function () {
                return page.controls.txtPOSearch.val();
            },
            searchResult: function (data) {
                page.controls.grdPOResult.width("100%");
                page.controls.grdPOResult.height("380px");
                page.controls.grdPOResult.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "PO No", 'width': "100px", 'dataField': "po_no" },
                           { 'name': "Supplier", 'width': "200px", 'dataField': "vendor_name" },
                        { 'name': "State", 'width': "150px", 'dataField': "state_text" },
                        { 'name': "Expected Date", 'width': "150px", 'dataField': "expected_date" },
                        { 'name': "Delivered Date", 'width': "150px", 'dataField': "delivered_date" },
                        { 'name': "Amount", 'width': "100px", 'dataField': "total_paid_amount" },

                       // { 'name': "Ordered", 'width': "70px", 'dataField': "ordered_date" },
                      //  { 'name': "Expected", 'width': "80px", 'dataField': "expected_date" },
                       // { 'name': "Delivered", 'width': "70px", 'dataField': "delivered_date" },
                        { 'name': "", 'width': "0px", 'dataField': "jrn_id" }

                    ]
                });
                page.controls.grdPOResult.selectionChanged = function (rowList, dataList) {
                    page.events.grdPOResult_select(dataList);
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
                    store_no:''
                }
                page.dynaReportService.getPurchaseReport(repInput, function (data) {
                    var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                    var poSummary = { tot_ret: 0, tot_pay: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                    $(data).each(function (i, item) {
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

                    });
                    page.controls.lblTotalSales.html(parseFloat(salSummary.tot_sale).toFixed(2));
                    page.controls.lblTotalPayment.html(parseFloat(salSummary.tot_pay).toFixed(2));
                    page.controls.lblTotalReturns.html(parseFloat(salSummary.tot_ret).toFixed(2));
                    page.controls.lblTotalReturnsPayment.html(parseFloat(salSummary.tot_ret_pay).toFixed(2));
                    page.controls.lblPendingPayment.html(parseFloat(parseFloat(page.controls.lblTotalSales.html()) - parseFloat(page.controls.lblTotalPayment.html())).toFixed(2));

                    page.controls.lblTotal.value(parseFloat(poSummary.tot_sale).toFixed(2));
                    page.controls.lblTotalAmtPaid.html(isNaN(parseFloat(poSummary.tot_pay)) ? 0 : parseFloat(poSummary.tot_pay).toFixed(2));
                    page.controls.lblTotalAmtRemaining.value(parseFloat(poSummary.tot_bal).toFixed(2));

                    page.controls.lblReturns.html(parseFloat(poSummary.tot_ret).toFixed(2));
                    page.controls.lblReturnsPaid.value(parseFloat(poSummary.tot_ret_pay).toFixed(2));
                    page.controls.lblReturnsBalance.value(parseFloat(poSummary.tot_ret_bal).toFixed(2));

                });
            },
            selectedPO: function (item) {
                if (item) {
                    page.controls.lblPONo.html(item.po_no);
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
                    page.controls.lblPOOrderedDate.html(item.ordered_date);
                    page.controls.lblPOConfirmedDate.html(item.confirmed_date);
                    page.controls.dsPOExpectedDate.setDate(item.expected_date);
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
                                { 'name': "Pay Id", 'width': "80px", 'dataField': "pay_id" },
                                { 'name': "Pay Date", 'width': "120px", 'dataField': "pay_date" },
                                { 'name': "Amount", 'width': "120px", 'dataField': "amount" },
                                { 'name': "Pay Type", 'width': "120px", 'dataField': "pay_type" },
                                { 'name': "Collector", 'width': "120px", 'dataField': "collector_name" },
                            ]
                        });
                        page.controls.grdTransactions.dataBind(data);
                    });
                    page.purchaseBillService.getBillByPO(item.po_no, function (data) {
                        $$("grdBillTransactions").height("80px");
                        $$("grdBillTransactions").setTemplate({
                            selection: "Single",
                            columns: [
                                { 'name': "Bill No", 'width': "80px", 'dataField': "bill_no" },
                                { 'name': "Bill Date", 'width': "120px", 'dataField': "bill_date" },
                                { 'name': "Bill Type", 'width': "120px", 'dataField': "bill_type" },
                                { 'name': "Amount", 'width': "120px", 'dataField': "total" },
                                { 'name': "Action", 'width': "120px", 'dataField': "bill_no", editable: false, itemTemplate: "<input type='button' class='grid-button' value='' action='Open' style='    border: none;    background-color: transparent;    background-image: url(Open_file.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' /> <input type='button' title='Jasper Print'  class='grid-button' value='' action='PrintJasper' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/print.png);    background-size: contain;    width: 25px;    height: 25px;;margin-right:10px' />  " }
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
                            { 'name': "Item No", 'width': "60px", 'dataField': "item_no", editable: false },
                            { 'name': "Bar Code", 'width': "150px", 'dataField': "barcode", visible: CONTEXT.showBarCode },
                            { 'name': "Item Name", 'width': "120px", 'dataField': "item_name", editable: false },
                            { 'name': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                            { 'name': "", 'width': "0px", 'dataField': "qty", },
                            { 'name': "Qty", 'width': "70px", 'dataField': "temp_qty", editable: page.currentPO.state_text == "Created", },
                            //{ 'name': "Free Item", 'width': "80px", 'dataField': "free_item", editable: page.currentPO.state_text == "Created", },
                            //{ 'name': "Unit", 'width': "60px", 'dataField': "unit", editable: false },
                            { 'name': "Unit", 'width': "80px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },

                            { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                            { 'name': "", 'width': "1px", 'dataField': "tray_id", visible: false },
                          //  { 'name': "GST%", 'width': "60px", 'dataField': "tax_per", editable: false,visble:false },
                            { 'name': "Action", 'width': "60px", 'dataField': "item_no", editable: false, visible: page.currentPO.state_text == "Created", itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='    border: none;    background-color: transparent;    background-image: url(cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" },
                        { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                        { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                        { 'name': "", 'width': "0px", 'dataField': "variation_data" },
                        ]
                    });
                }
                else if (page.currentPO.state_text == "Ordered") {
                    page.controls.grdPOItems.width("100%");
                    page.controls.grdPOItems.height("auto");
                    page.controls.grdPOItems.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Item No", 'width': "60px", 'dataField': "item_no", editable: false },
                            { 'name': "Bar Code", 'width': "150px", 'dataField': "barcode", visible: CONTEXT.showBarCode },
                            { 'name': "Item Name", 'width': "120px", 'dataField': "item_name", editable: false },
                            { 'name': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                            { 'name': "", 'width': "0px", 'dataField': "qty", editable: page.currentPO.state_text == "Created", },
                            { 'name': "Qty", 'width': "70px", 'dataField': "temp_qty", editable: page.currentPO.state_text == "Created", },
                            //{ 'name': "Free Item", 'width': "80px", 'dataField': "free_item", editable: page.currentPO.state_text == "Created", },
                            { 'name': "", 'width': "0px", 'dataField': "qty_stock", editable: false },
                            { 'name': "Tray", 'width': "80px", 'dataField': "tray_count", editable: page.currentPO.state_text == "Created", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                            { 'name': "Unit", 'width': "60px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },//editable: false },
                            { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Free Qty", 'width': "100px", 'dataField': "temp_free_qty", editable: page.currentPO.state_text == "Ordered", visible: CONTEXT.showFree },
                            { 'name': "Cost", 'width': "70px", 'dataField': "cost", editable: page.currentPO.state_text == "Ordered" },
                           // { 'name': "MRP", 'width': "70px", 'dataField': "mrp", editable: page.currentPO.state_text == "Ordered", visible: CONTEXT.ENABLE_MRP },
                            { 'name': "Disc %", 'width': "70px", 'dataField': "disc_per", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Disc Value", 'width': "80px", 'dataField': "disc_val", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "GST%", 'width': "60px", 'dataField': "tax_per", editable: false },
                            { 'name': "Net Rate", 'width': "100px", 'dataField': "net_rate", editable: false },
                            { 'name': "Total", 'width': "90px", 'dataField': "total_price" },//, editable: false },
                            { 'name': "Buying Cost", 'width': "90px", 'dataField': "buying_cost" },

                            { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                            { 'name': "Action", 'width': "60px", 'dataField': "item_no", editable: false, visible: page.currentPO.state_text == "Created", itemTemplate: "<input type='button' value='Delete' action='Delete' />" },
                            { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                            { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                            { 'name': "", 'width': "0px", 'dataField': "variation_data" },
                            { 'name': "", 'width': "0px", 'dataField': "var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "free_var_no" },
                        ]
                    });
                }
                else if (page.damageMode == true) {
                    page.controls.grdPOItems.width("2300px");
                    page.controls.grdPOItems.height("auto");
                    page.controls.grdPOItems.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Item No", 'width': "60px", 'dataField': "item_no" },
                            { 'name': "Bar Code", 'width': "150px", 'dataField': "barcode", visible: CONTEXT.showBarCode },
                            { 'name': "Item Name", 'width': "160px", 'dataField': "item_name" },
                            { 'name': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                            { 'name': "", 'width': "0px", 'dataField': "qty" },
                            { 'name': "Qty", 'width': "70px", 'dataField': "temp_qty", editable: page.currentPO.state_text == "Created", },
                            { 'name': "", 'width': "100px", 'dataField': "free_qty", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Free Qty", 'width': "100px", 'dataField': "temp_free_qty", editable: page.currentPO.state_text == "Ordered",visible: CONTEXT.showFree },
                            //{ 'name': "Free Item", 'width': "80px", 'dataField': "free_item", editable: page.currentPO.state_text == "Created", },
                            { 'name': "Delivered", 'width': "100px", 'dataField': "qty_delivered" },

                            { 'name': "Damage", 'width': "100px", 'dataField': "qty_damaged", editable: page.currentPO.state_text == "Confirmed" },
                            { 'name': "Stocked", 'width': "100px", 'dataField': "qty_instock" },
                            { 'name': "Cancelled", 'width': "100px", 'dataField': "qty_returned" },
                            { 'name': "Tray", 'width': "80px", 'dataField': "tray_count", visible: CONTEXT.ENABLE_MODULE_TRAY },

                            { 'name': "Unit", 'width': "60px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                            { 'name': "Cost", 'width': "70px", 'dataField': "cost" },
                            { 'name': "Disc %", 'width': "70px", 'dataField': "disc_per" },
                            { 'name': "Disc Value", 'width': "80px", 'dataField': "disc_val" },
                            { 'name': "GST%", 'width': "60px", 'dataField': "tax_per" },
                            { 'name': "Total", 'width': "90px", 'dataField': "total_price" },
                            { 'name': "Net Rate", 'width': "100px", 'dataField': "net_rate", editable: false },
                            { 'name': "Buying Cost", 'width': "90px", 'dataField': "buying_cost" },
                            { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                            { 'name': "", 'width': "1px", 'dataField': "tray_id", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                            { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                            { 'name': "", 'width': "0px", 'dataField': "variation_data" },
                            { 'name': "", 'width': "0px", 'dataField': "var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "free_var_no" },
                        ]
                    });
                }
                else if (page.receiveMode == true) {
                    page.controls.grdPOItems.width("2000px");
                    page.controls.grdPOItems.height("auto");
                    page.controls.grdPOItems.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Item No", 'width': "60px", 'dataField': "item_no" },
                            { 'name': "Bar Code", 'width': "150px", 'dataField': "barcode", visible: CONTEXT.showBarCode },
                            { 'name': "Item Name", 'width': "160px", 'dataField': "item_name" },
                            { 'name': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                            { 'name': "", 'width': "0px", 'dataField': "qty" },
                            { 'name': "Qty", 'width': "70px", 'dataField': "temp_qty", },
                            { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Free Qty", 'width': "100px", 'dataField': "temp_free_qty", editable: page.currentPO.state_text == "Ordered", visible: CONTEXT.showFree },
                            //{ 'name': "Free Item", 'width': "80px", 'dataField': "free_item", editable: page.currentPO.state_text == "Created", },
                            { 'name': "Delivered", 'width': "100px", 'dataField': "qty_delivered" },

                            { 'name': "Receive", 'width': "100px", 'dataField': "qty_received", editable: page.currentPO.state_text == "Confirmed" },
                            { 'name': "Stocked", 'width': "100px", 'dataField': "qty_instock" },
                            { 'name': "Cancelled", 'width': "100px", 'dataField': "qty_returned" },
                            { 'name': "Tray", 'width': "80px", 'dataField': "tray_count", visible: CONTEXT.ENABLE_MODULE_TRAY },

                            { 'name': "Unit", 'width': "60px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                            { 'name': "Cost", 'width': "70px", 'dataField': "cost" },
                            { 'name': "Disc %", 'width': "70px", 'dataField': "disc_per" },
                            { 'name': "Disc Value", 'width': "80px", 'dataField': "disc_val" },
                            { 'name': "GST%", 'width': "60px", 'dataField': "tax_per" },
                            { 'name': "Total", 'width': "90px", 'dataField': "total_price" },
                            { 'name': "Net Rate", 'width': "100px", 'dataField': "net_rate", editable: false },
                            { 'name': "Buying Cost", 'width': "90px", 'dataField': "buying_cost" },
                            { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                            { 'name': "", 'width': "1px", 'dataField': "tray_id", visible: false },
                            { 'name': "", 'width': "1px", 'dataField': "var_cost", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                            { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                            { 'name': "", 'width': "0px", 'dataField': "variation_data" },
                            { 'name': "", 'width': "0px", 'dataField': "var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "free_var_no" },
                        ]
                    });
                }
                else if (page.trayMode == true) {
                    page.controls.grdPOItems.width("2000px");
                    page.controls.grdPOItems.height("auto");
                    page.controls.grdPOItems.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Item No", 'width': "60px", 'dataField': "item_no" },
                            { 'name': "Bar Code", 'width': "150px", 'dataField': "barcode", visible: CONTEXT.showBarCode },
                            { 'name': "Item Name", 'width': "160px", 'dataField': "item_name" },
                            { 'name': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                            { 'name': "", 'width': "0px", 'dataField': "qty" },
                            { 'name': "Qty", 'width': "70px", 'dataField': "temp_qty", },
                            { 'name': "", 'width': "100px", 'dataField': "free_qty", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Free Qty", 'width': "100px", 'dataField': "temp_free_qty", editable: page.currentPO.state_text == "Ordered", visible: CONTEXT.showFree },
                            //{ 'name': "Free Item", 'width': "80px", 'dataField': "free_item", editable: page.currentPO.state_text == "Created", },
                            { 'name': "Delivered", 'width': "100px", 'dataField': "qty_delivered" },

                            { 'name': "Stocked", 'width': "100px", 'dataField': "qty_instock" },
                            { 'name': "Cancelled", 'width': "100px", 'dataField': "qty_returned" },
                            { 'name': "Tray", 'width': "80px", 'dataField': "tray_count", visible: CONTEXT.ENABLE_MODULE_TRAY },
                            { 'name': "Receive Tray", 'width': "100px", 'dataField': "tray_received", editable: true, visible: CONTEXT.ENABLE_MODULE_TRAY },

                            { 'name': "Unit", 'width': "60px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                            { 'name': "Cost", 'width': "70px", 'dataField': "cost" },
                            { 'name': "Disc %", 'width': "70px", 'dataField': "disc_per" },
                            { 'name': "Disc Value", 'width': "80px", 'dataField': "disc_val" },
                            { 'name': "GST%", 'width': "60px", 'dataField': "tax_per" },
                            { 'name': "Total", 'width': "90px", 'dataField': "total_price" },
                            { 'name': "Net Rate", 'width': "100px", 'dataField': "net_rate", editable: false },
                            { 'name': "Buying Cost", 'width': "90px", 'dataField': "buying_cost" },
                            { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                            { 'name': "", 'width': "1px", 'dataField': "tray_id", visible: false },
                            { 'name': "", 'width': "1px", 'dataField': "var_cost", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                            { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                            { 'name': "", 'width': "0px", 'dataField': "variation_data" },
                            { 'name': "", 'width': "0px", 'dataField': "var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "free_var_no" },
                        ]
                    });
                }
                else if (page.stockMode == true) {
                    page.controls.grdPOItems.width("2800px");
                    page.controls.grdPOItems.height("auto");
                    page.controls.grdPOItems.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Item No", 'width': "60px", 'dataField': "item_no" },
                            { 'name': "Bar Code", 'width': "150px", 'dataField': "barcode", visible: CONTEXT.showBarCode },
                            { 'name': "Item Name", 'width': "160px", 'dataField': "item_name" },
                            { 'name': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                            { 'name': "", 'width': "0px", 'dataField': "qty" },
                            { 'name': "Qty", 'width': "70px", 'dataField': "temp_qty", },
                            { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Free Qty", 'width': "100px", 'dataField': "temp_free_qty", editable: page.currentPO.state_text == "Ordered", visible: CONTEXT.showFree },
                            //{ 'name': "Free Item", 'width': "80px", 'dataField': "free_item",},
                            { 'name': "Delivered", 'width': "100px", 'dataField': "qty_delivered" },
                            { 'name': "Stocked", 'width': "100px", 'dataField': "qty_instock" },
                            { 'name': "Cancelled", 'width': "100px", 'dataField': "qty_returned" },
                            //{ 'name': "Variation", 'width': "120px", 'dataField': "variation_name", editable: page.currentPO.state_text == "Confirmed" || page.currentPO.state_text == "Delivered", itemTemplate: "<input placeholder='Variation Name' controlId='txtVariationName' control='purchaseOrder.autoCompleteList' />" },
                            { 'name': "To Stock", 'width': "100px", 'dataField': "qty_tostock", editable: page.currentPO.state_text == "Confirmed" || page.currentPO.state_text == "Delivered" },
                            { 'name': "Profit %", 'width': "120px", 'dataField': "profit", editable: page.currentPO.state_text == "Delivered" || page.currentPO.state_text == "Confirmed" },
                            { 'name': "Selling Price", 'width': "120px", 'dataField': "selling_price", editable: page.currentPO.state_text == "Delivered" || page.currentPO.state_text == "Confirmed" },
                            { 'name': "Variation", 'width': "120px", 'dataField': "variation_name", editable: page.currentPO.state_text == "Confirmed" || page.currentPO.state_text == "Delivered", },// itemTemplate: "<select  id='variationGrid' style=''></select>" }, //itemTemplate: "<div id='variationGrid'></div>"},
                            { 'name': "", 'width': "50px", 'dataField': "variation_name", editable: false, itemTemplate: "<input type='button' title='Open Bill'  class='grid-button' value='' action='New' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/new-icon.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" },
                            { 'name': "MRP", 'width': "70px", 'dataField': "mrp", editable: true, visible: CONTEXT.ENABLE_MRP },
                            { 'name': "Manufacture Date", 'width': "100px", 'dataField': "man_date", editable: true, visible: CONTEXT.ENABLE_MAN_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Expiry Date", 'width': "100px", 'dataField': "expiry_date", editable: true, visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Batch No", 'width': "80px", 'dataField': "batch_no", editable: true, visible: CONTEXT.ENABLE_BAT_NO },

                            { 'name': "Unit", 'width': "60px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                            { 'name': "Cost", 'width': "70px", 'dataField': "cost" },
                            { 'name': "Disc %", 'width': "70px", 'dataField': "disc_per" },
                            { 'name': "Disc Value", 'width': "80px", 'dataField': "disc_val" },
                            { 'name': "Tax%", 'width': "60px", 'dataField': "tax_per" },
                            { 'name': "Total", 'width': "90px", 'dataField': "total_price" },
                            { 'name': "Net Rate", 'width': "100px", 'dataField': "net_rate", editable: false },
                            { 'name': "Buying Cost", 'width': "90px", 'dataField': "buying_cost" },
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
                        ]
                    });
                }
                else if (page.currentPO.state_text == "Confirmed" || page.currentPO.state_text == "Delivered" || page.currentPO.state_text == "Stocked") {



                    page.controls.grdPOItems.width("2000px");
                    page.controls.grdPOItems.height("auto");
                    page.controls.grdPOItems.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Item No", 'width': "60px", 'dataField': "item_no" },
                            { 'name': "Bar Code", 'width': "150px", 'dataField': "barcode", visible: CONTEXT.showBarCode },
                            { 'name': "Item Name", 'width': "160px", 'dataField': "item_name" },
                            { 'name': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                            { 'name': "", 'width': "0px", 'dataField': "qty" },
                            { 'name': "Qty", 'width': "70px", 'dataField': "temp_qty", },
                            { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Free Qty", 'width': "100px", 'dataField': "temp_free_qty", editable: page.currentPO.state_text == "Ordered", visible: CONTEXT.showFree },
                            //{ 'name': "Free Item", 'width': "80px", 'dataField': "free_item", },

                            { 'name': "Delivered", 'width': "80px", 'dataField': "qty_delivered" },
                            { 'name': "Stocked", 'width': "80px", 'dataField': "qty_instock" },
                            { 'name': "Cancelled", 'width': "100px", 'dataField': "qty_returned" },
                            { 'name': "Tray", 'width': "80px", 'dataField': "tray_count", visible: CONTEXT.ENABLE_MODULE_TRAY },

                            { 'name': "Unit", 'width': "60px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                            { 'name': "Cost", 'width': "70px", 'dataField': "cost" },
                            { 'name': "Disc %", 'width': "70px", 'dataField': "disc_per" },
                            { 'name': "Disc Value", 'width': "80px", 'dataField': "disc_val" },
                            { 'name': "Tax%", 'width': "60px", 'dataField': "tax_per" },
                            { 'name': "Total", 'width': "90px", 'dataField': "total_price" },
                            { 'name': "Net Rate", 'width': "100px", 'dataField': "net_rate", editable: false },
                            { 'name': "Buying Cost", 'width': "90px", 'dataField': "buying_cost" },
                             //{ 'name': "Cancelled", 'width': "80px", 'dataField': "qty_returned" },

                             { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                             { 'name': "", 'width': "1px", 'dataField': "tray_id", visible: false },
                            { 'name': "Action", 'width': "60px", 'dataField': "item_no", editable: false, visible: page.currentPO.state_text == "Created", itemTemplate: "<input type='button' value='Delete' action='Delete' />" },
                            { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                            { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                            { 'name': "", 'width': "0px", 'dataField': "variation_data" },
                            { 'name': "", 'width': "0px", 'dataField': "var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "free_var_no" },
                        ]
                    });


                }

                    //if (page.currentPO.state_text == "Delivered" || page.currentPO.state_text == "Completed" || page.currentPO.state_text == "Invoice Matched" || page.currentPO.state_text == "Return" || page.currentPO.state_text == "Cancel" || page.currentPO.state_text == "Partial Delivered") {
                else {
                    page.controls.grdPOItems.width("1800px");
                    page.controls.grdPOItems.height("auto");
                    page.controls.grdPOItems.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Item No", 'width': "60px", 'dataField': "item_no", editable: false },
                            { 'name': "Bar Code", 'width': "150px", 'dataField': "barcode", visible: CONTEXT.showBarCode },
                            { 'name': "Item Name", 'width': "120px", 'dataField': "item_name", editable: false },
                            { 'name': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                            { 'name': "", 'width': "0px", 'dataField': "qty",},
                            { 'name': "Qty", 'width': "70px", 'dataField': "temp_qty", editable: page.currentPO.state_text == "Created", },
                            { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Free Qty", 'width': "100px", 'dataField': "temp_free_qty", editable: page.currentPO.state_text == "Ordered", visible: CONTEXT.showFree },
                            //{ 'name': "Free Item", 'width': "80px", 'dataField': "free_item", },
                            { 'name': "Delivered", 'width': "100px", 'dataField': "qty_delivered" },

                            { 'name': "Stocked", 'width': "100px", 'dataField': "qty_instock" },
                            { 'name': "Cancelled", 'width': "100px", 'dataField': "qty_returned" },
                            { 'name': "To Stock", 'width': "100px", 'dataField': "qty_tostock", editable: page.currentPO.state_text == "Confirmed" || page.currentPO.state_text == "Delivered", visible: false },
                            { 'name': "Expiry Date", 'width': "100px", 'dataField': "expiry_date", editable: page.currentPO.state_text == "Delivered" || page.currentPO.state_text == "Confirmed", visible: false }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Batch No", 'width': "80px", 'dataField': "batch_no", editable: page.currentPO.state_text == "Delivered" || page.currentPO.state_text == "Confirmed", visible: false },
                             { 'name': "MRP", 'width': "70px", 'dataField': "mrp", editable: page.currentPO.state_text == "Delivered" || page.currentPO.state_text == "Confirmed", visible: false },
                             { 'name': "Selling Price", 'width': "120px", 'dataField': "selling_price", editable: page.currentPO.state_text == "Delivered" || page.currentPO.state_text == "Confirmed", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "qty_stock", editable: false },
                            { 'name': "Tray", 'width': "80px", 'dataField': "tray_count", editable: page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_MODULE_TRAY },
                            { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                            { 'name': "Unit", 'width': "60px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                            { 'name': "Cost", 'width': "70px", 'dataField': "cost", editable: page.currentPO.state_text == "Ordered" },

                            { 'name': "Disc %", 'width': "70px", 'dataField': "disc_per", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Disc Value", 'width': "80px", 'dataField': "disc_val", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Tax%", 'width': "60px", 'dataField': "tax_per", editable: page.currentPO.state_text == "Ordered" },
                            { 'name': "Total", 'width': "90px", 'dataField': "total_price" },//, editable: false },
                            { 'name': "Net Rate", 'width': "100px", 'dataField': "net_rate", editable: false },
                            { 'name': "Buying Cost", 'width': "90px", 'dataField': "buying_cost" },
                            { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                            { 'name': "Action", 'width': "60px", 'dataField': "item_no", editable: false, visible: page.currentPO.state_text == "Created", itemTemplate: "<input type='button' value='Delete' action='Delete' />" },
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
                    var discount = (item.qty * item.cost) * parseFloat(item.disc_per) / 100 + parseFloat(item.disc_val);
                    item.buying_cost = parseFloat((parseFloat(price) - parseFloat(discount)) / parseFloat(item.qty)).toFixed(2);
                    //item.qty_tostock = item.qty_delivered - item.qty_instock;


                }
                page.controls.grdPOItems.rowBound = function (row, item) {

                    var htmlTemplate = [];
                    if (CONTEXT.showAlternativeUnit && item.state_text == "Created") {
                        if (item.alter_unit == undefined || item.alter_unit == null || item.alter_unit == "") {
                            htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</select></div>");
                        } else {
                            htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</option><option value='1'>" + item.alter_unit + "</option></select></div>");
                        }
                    } else {
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
                    //row.on("change", "input[datafield=qty]", function () {
                    //    if (item.qty_type == "Integer")
                    //        $(this).val(parseInt($(this).val()));
                    //});
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
                    //row.on("keydown", "input[datafield=qty]", function (e) {
                    //    if (e.which == 9) {
                    //        e.preventDefault();
                    //        var nextRow = $(this).closest("grid_row").next();
                    //        if (nextRow.length == 0) {
                    //            page.controls.txtItemSearch.selectedObject.focus();
                    //        } else {
                    //            nextRow.find("input[datafield=qty]").focus();
                    //        }
                    row.on("change", "input[datafield=qty_tostock]", function () {
                        page.check_variation(row, item);
                    });
                    row.on("keydown", "input[datafield=temp_qty]", function (e) {
                        if (e.which == 9) {
                            e.preventDefault();
                            var nextRow = $(this).closest("grid_row").next();
                            if (nextRow.length == 0) {
                                page.controls.txtItemSearch.selectedObject.focus();
                            } else {
                                nextRow.find("input[datafield=temp_qty]").focus();
                            }
                        }
                    });
                    row.on("change", "input[datafield=variation_name]", function () {
                    });
                    row.on("change", "input[datafield=selling_price]", function () {
                        var profit = parseFloat(((parseFloat(item.selling_price) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100).toFixed(2);
                        item.profit = profit;
                        row.find("input[datafield=profit]").val(profit);
                    });
                    row.on("change", "input[datafield=profit]", function () {
                        if (item.profit.startsWith("#")) {
                            item.profit = item.profit.replace(/#/g, 0);
                            var profper = (parseFloat(item.mrp) * parseFloat(item.profit)) / 100;
                            var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                            item.selling_price = selling_price;
                            row.find("input[datafield=selling_price]").val(selling_price);

                        } else {
                            var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(2);
                            item.selling_price = selling_price;
                            row.find("input[datafield=selling_price]").val(selling_price);
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
                    //if (true) {
                    //    if (CONTEXT.enableFreeVariation) {
                    //        // var buying_cost = (subtotal - discount) / (parseFloat(poItem.qty));
                    //        net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(2);
                    //    } else {
                    //        // var buying_cost = (subtotal - discount) / (parseFloat(poItem.qty) + parseFloat(poItem.free_qty));
                    //        net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(2);
                    //    }
                    //}

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
                                    $(row).find("[datafield=temp_expiry_date]").find("input").val(dbDate(item.expiry_date));
                                    $(row).find("[datafield=temp_man_date]").find("input").val(dbDate(item.man_date));

                                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                                        if (item.expiry_date != undefined && item.expiry_date != null && item.expiry_date != "") {
                                            var len = item.expiry_date.length;
                                            var month = item.expiry_date.substring(len - 7, len - 5);
                                            var year = item.expiry_date.substring(len - 4, len);
                                            item.expiry_date = month + "-" + year;
                                            row.find("input[datafield=expiry_date]").val(item.expiry_date);
                                            $(row).find("[datafield=temp_expiry_date]").find("input").val(dbDate("28-" + item.expiry_date));
                                        }
                                        if (item.man_date != undefined && item.man_date != null && item.man_date != "") {
                                            var len = item.man_date.length;
                                            var month = item.man_date.substring(len - 7, len - 5);
                                            var year = item.man_date.substring(len - 4, len);
                                            item.man_date = month + "-" + year;
                                            row.find("input[datafield=man_date]").val(item.man_date);
                                            $(row).find("[datafield=temp_man_date]").find("input").val(dbDate("28-" + item.man_date));
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
                                        if (CONTEXT.enableFreeVariation && CONTEXT.showFree) {
                                            if (parseFloat(items.mrp) == parseFloat(item.mrp) && items.batch_no == item.batch_no &&
                                           items.vendor_no == item.vendor_no &&
                                           items.expiry_date == item.expiry_date &&
                                           items.man_date == item.man_date &&
                                           parseFloat(items.cost).toFixed(2) == parseFloat(0).toFixed(2)) {
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
                                    page.calculate();
                                    return false;
                                },
                                change: function (event, ui) {
                                    if (ui.item == null) {
                                        row.find("div[datafield=btn_variation_name]").css("visibility", "true");
                                        item.chk_new_var = 1;
                                    }
                                }
                            })
                        });
                    });
                    if (page.stockMode) {
                        var data = {
                            item_no: item.item_no,
                        }
                        if (CONTEXT.ENABLE_VARIATION_VENDOR_NO)
                            data.vendor_no = page.controls.ddlPOVendor.selectedValue();
                        page.stockService.getAllVariationByItem(data, function (data) {
                            //page.variation_data.push(data);
                            item.variation_data = data;
                            var length = 0;
                            // page.variation_data = data;
                            if (data.length != 0) {
                                parseInt(data[data.length - 1].cost) != 0 ? length = data.length - 1 : length = data.length - 2;
                                parseInt(data.length) < 2 ? length = 0 : "";
                                item.cost = data[length].cost;
                                item.variation_name = data[length].variation_name;
                                item.mrp = data[length].mrp;
                                item.batch_no = data[length].batch_no;
                                item.buying_cost = data[length].cost;
                                item.var_no = data[length].var_no;

                                row.find("input[datafield=cost]").val(data[length].cost);
                                row.find("input[datafield=buying_cost]").val(data[length].cost);
                                row.find("input[datafield=variation_name]").val(data[length].variation_name);
                                $(row).find("input[datafield=mrp]").val(data[length].mrp);
                                $(row).find("input[datafield=batch_no]").val(data[length].batch_no);
                                $(row).find("input[datafield=var_no]").val(data[length].var_no);

                                //page.calculate();
                                if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                                    if (data[length].expiry_date != undefined && data[length].expiry_date != null && data[length].expiry_date != "") {
                                        var len = data[length].expiry_date.length;
                                        var month = data[length].expiry_date.substring(len - 7, len - 5);
                                        var year = data[length].expiry_date.substring(len - 4, len);
                                        item.expiry_date = month + "-" + year;
                                        row.find("input[datafield=expiry_date]").val(item.expiry_date);
                                        $(row).find("[datafield=temp_expiry_date]").find("input").val(dbDate("28-" + item.expiry_date));
                                    }
                                    if (data[length].man_date != undefined && data[length].man_date != null && data[length].man_date != "") {
                                        var len = data[length].man_date.length;
                                        var month = data[length].man_date.substring(len - 7, len - 5);
                                        var year = data[length].man_date.substring(len - 4, len);
                                        item.man_date = month + "-" + year;
                                        row.find("input[datafield=man_date]").val(item.man_date);
                                        $(row).find("[datafield=temp_man_date]").find("input").val(dbDate("28-" + item.man_date));
                                    }
                                }
                                else {
                                    item.expiry_date = data[length].expiry_date;
                                    item.man_date = data[length].man_date;
                                    row.find("input[datafield=expiry_date]").val(data[length].expiry_date);
                                    row.find("input[datafield=man_date]").val(data[length].man_date);
                                    $(row).find("[datafield=temp_expiry_date]").find("input").val(dbDate(item.expiry_date));
                                    $(row).find("[datafield=temp_man_date]").find("input").val(dbDate(item.man_date));
                                }
                                if (data[length].active == "0")
                                    row.find("input[datafield=variation_name]").css("color", "red");
                                else
                                    row.find("input[datafield=variation_name]").css("color", "black");
                            }
                        });
                    }
                    //var get_vari_data = {
                    //    item_no: item.item_no,
                    //}
                    //if (CONTEXT.ENABLE_VARIATION_VENDOR_NO)
                    //    data.vendor_no = page.controls.ddlPOVendor.selectedValue();
                    //page.stockService.getAllVariationByItem(get_vari_data, function (vari_data) {
                    //    //var variation = [];
                    //    item.variation_data = vari_data;
                    //    $(vari_data).each(function (i, item) {
                    //        if (item.variation_name != null) {
                    //            var var_data = {
                    //                value: item.variation_name,
                    //                label: item.variation_name,
                    //                mrp: item.mrp,
                    //                batch_no: item.batch_no,
                    //                expiry_date: item.expiry_date,
                    //                cost: item.cost,
                    //                man_date: item.man_date,
                    //            }
                    //            item.variation_data.push(var_data);
                    //        }
                    //    })
                    //});

                    page.calculate();
                };



                page.controls.grdPOItems.dataBind(data);
                page.controls.grdPOItems.edit(true);
            },
            selectedReturnPOItems: function (data) {
                $$("grdReturnPOItems").width("1500px");
                $$("grdReturnPOItems").height("400px");
                $$("grdReturnPOItems").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Item No", 'width': "60px", 'dataField': "item_no", editable: false },
                        { 'name': "Item Name", 'width': "160px", 'dataField': "item_name", editable: false },
                        { 'name': "Buying Cost", 'width': "90px", 'dataField': "buying_cost" },//, editable: false },
                        { 'name': "Ordered", 'width': "90px", 'dataField': "ordered_qty" },//, editable: false },
                        { 'name': "Cancelled", 'width': "90px", 'dataField': "qty_returned" },//, editable: false },
                        { 'name': "Stocked", 'width': "80px", 'dataField': "qty", editable: false, },
                        { 'name': "Delivered", 'width': "100px", 'dataField': "delivered", editable: false,visible:false },

                        { 'name': "To Return", 'width': "100px", 'dataField': "ret_qty", editable: true },
                        //{ 'name': "Free Qty", 'width': "120px", 'dataField': "free_qty", editable: false, },
                        //{ 'name': "Return Free", 'width': "120px", 'dataField': "free_qty_return", editable: false, },
                        //{ 'name': "To Free Return", 'width': "120px", 'dataField': "ret_free", editable: true, },

                      { 'name': "Variation", 'width': "120px", 'dataField': "variation_name", },
                      { 'name': "Tax(%)", 'width': "120px", 'dataField': "tax_per", },
                        { 'name': "MRP", 'width': "80px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP },
                        { 'name': "Expiry Date", 'width': "100px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                        { 'name': "Batch No", 'width': "80px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO },

                       //{ 'name': "", 'width': "0px", 'dataField': "qty_stock", editable: false },
                        { 'name': "Tray", 'width': "80px", 'dataField': "tray_count", visible: CONTEXT.ENABLE_MODULE_TRAY },
                        { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                        { 'name': "", 'width': "0px", 'dataField': "cost" },
                        { 'name': "", 'width': "0px", 'dataField': "tax_per" },
                        //{ 'name': "Unit", 'width': "60px", 'dataField': "unit", editable: false },
                       // { 'name': "Cost", 'width': "70px", 'dataField': "cost", },

                       // { 'name': "Disc %", 'width': "70px", 'dataField': "disc_per", },
                       // { 'name': "Disc Value", 'width': "80px", 'dataField': "disc_val", },
                       // { 'name': "Tax%", 'width': "60px", 'dataField': "tax_per",},
                       //{ 'name': "", 'width': "0px", 'dataField': "total_price_const" },
                       //{ 'name': "", 'width': "0px", 'dataField': "qty_const" },


                    ]
                });

                page.controls.grdReturnPOItems.rowBound = function (row, item) {
                    if (item.unit_identity == "1") {
                        item.ordered_qty = parseFloat(item.ordered_qty) / parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=ordered_qty]").find("div").html(parseFloat(item.ordered_qty));

                        item.qty_returned = parseFloat(item.qty_returned) / parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=qty_returned]").find("div").html(parseFloat(item.qty_returned));

                        item.qty = parseFloat(item.qty) / parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=qty]").find("div").html(parseFloat(item.qty));

                        item.delivered = parseFloat(item.delivered) / parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=delivered]").find("div").html(parseFloat(item.delivered));

                        $(row).find("[id=itemUnit]").val(1);
                    }
                    row.on("change", "input[datafield=ret_qty]", function () {
                        // var tot_price = item.ret_qty * item.cost;
                        var txtAmount = $(row).find("[datafield=total_price]").find("div");
                        var txtAmountVal = $(row).find("[datafield=total_price_const]").find("div").html();
                        var ret_qty = $(row).find("[datafield=ret_qty]").find("div").html();
                        var qty = $(row).find("[datafield=qty_const]").find("div").html();
                        //txtAmount.html(parseFloat(tot_price).toFixed(2));
                        item.total_price = parseFloat(row.find("[datafield=total_price]").text());
                        var total = 0;
                        var paidAmt = 0;
                        var remAmt = 0;
                        //total = (txtAmountVal / qty) * ret_qty;
                        total = ((item.total_price_const) / item.qty_const) * item.ret_qty;
                        //$(page.controls.grdReturnPOItems.selectedData()).each(function (i, item) {
                        //total = parseFloat(parseFloat(total) + ((parseFloat(item.total_price_const)/parseFloat(item.qty))*parseFloat(item.ret_qty))).toFixed(2);
                        // });
                        paidAmt = parseFloat(paidAmt) + parseFloat(total);
                        remAmt = page.controls.lblTotal.value() - total;
                        txtAmount.html(parseFloat(paidAmt).toFixed(2));
                        // page.controls.lblTotalAmtPaid.html(paidAmt);
                        // page.controls.lblTotalAmtRemaining.html(remAmt);
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
                        total = parseFloat(parseFloat(total) + (parseFloat(item.ret_qty)*parseFloat(item.cost))).toFixed(2);
                        //sub_total = parseFloat(parseFloat(sub_total) + parseFloat(item.cost)).toFixed(2);
                       // discount = parseFloat(parseFloat(discount) + parseFloat(item.discount)).toFixed(2);

                       // tax = parseFloat(parseFloat(tax) + (parseFloat(item.cost) * parseFloat(item.qty) - parseFloat(item.total_price) - parseFloat(item.discount))).toFixed(2);
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
                        { 'name': "PO No", 'width': "80px", 'dataField': "po_no" },
                        { 'name': "Bill No", 'width': "80px", 'dataField': "bill_no" },
                        { 'name': "Bill Date", 'width': "80px", 'dataField': "bill_date" },
                        { 'name': "Total Amount", 'width': "120px", 'dataField': "total" },
                        { 'name': "Paid", 'width': "120px", 'dataField': "total_paid_amount" },
                        { 'name': "Balance", 'width': "120px", 'dataField': "balance" },
                        { 'name': "Amount Pay", 'width': "120px", 'dataField': "amount_pay", editable: true },


                    ]
                });
                page.controls.grdPendingPayment.dataBind(data);
                page.controls.grdPendingPayment.edit(true);
            },
            selectedReturnDeliveryPOItems: function (data) {
                $$("grdReturnDeliveryPOItems").width("1250px");
                $$("grdReturnDeliveryPOItems").height("220px");
                $$("grdReturnDeliveryPOItems").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Item No", 'width': "60px", 'dataField': "item_no", editable: false },
                        { 'name': "Item Name", 'width': "120px", 'dataField': "item_name", editable: false },
                        { 'name': "Cancelled", 'width': "90px", 'dataField': "qty_cancelled", editable: false, },
                        { 'name': "Delivered", 'width': "90px", 'dataField': "qty_delivered", editable: false,visible:false },
                        { 'name': "Stocked", 'width': "90px", 'dataField': "qty_stocked", editable: false, },

                        { 'name': "To Return", 'width': "100px", 'dataField': "ret_qty", editable: true },
                         { 'name': "Buying Cost", 'width': "90px", 'dataField': "buying_cost" },
                         { 'name': "Variation", 'width': "120px", 'dataField': "variation_name" },
                        { 'name': "MRP", 'width': "70px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP },
                        { 'name': "Expiry Date", 'width': "100px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                        { 'name': "Batch No", 'width': "80px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO },
                       // { 'name': "Price to return", 'width': "160px", 'dataField': "item_price" },
                        { 'name': "Tray", 'width': "80px", 'dataField': "tray_count", visible: CONTEXT.ENABLE_MODULE_TRAY },
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
                        //txtAmount.html(parseFloat(tot_price).toFixed(2));
                        item.total_price = parseFloat(row.find("[datafield=total_price]").text());
                        var total = 0;
                        var paidAmt = 0;
                        var remAmt = 0;
                        //total = (txtAmountVal / qty) * ret_qty;
                        total = ((item.total_price_const) / item.qty_const) * item.ret_qty;
                        //$(page.controls.grdReturnPOItems.selectedData()).each(function (i, item) {
                        //total = parseFloat(parseFloat(total) + ((parseFloat(item.total_price_const)/parseFloat(item.qty))*parseFloat(item.ret_qty))).toFixed(2);
                        // });
                        paidAmt = parseFloat(paidAmt) + parseFloat(total);
                        remAmt = page.controls.lblTotal.value() - total;
                        txtAmount.html(parseFloat(paidAmt).toFixed(2));
                        // page.controls.lblTotalAmtPaid.html(paidAmt);
                        // page.controls.lblTotalAmtRemaining.html(remAmt);
                    });
                }
                page.controls.grdReturnDeliveryPOItems.dataBind(data);
                $$("grdReturnDeliveryPOItems").edit(true);
            },
            //changeState: function (stateNo) {
            //    page.controls.ddlChangeState.html("<option></option><option value='10'>Ordered</option><option value='60'>Cancelled</option>");

            //    page.controls.ddlChangeState.change(function () {
            //        if (page.controls.ddlChangeState.val() == "10") {
            //            page.purchaseService.changeState(item.po_no, 10);
            //        }
            //    });
            //},
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


                    //  $$("btnAddItemToPO").hide();
                    $$("btnSavePO").hide();
                    $$("btnRemovePO").hide();
                    page.controls.btnRemovePO.selectedObject.next().hide();
                    $$("btnReturnPO").hide();
                    page.controls.btnReturnPO.selectedObject.next().hide();
                    $$("btnPayInvoiceAmount").hide();
                    $$("btnPickReorder").hide();
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
                    $$("pnlBillSummary").hide();
                    $$("pnlTransaction").hide();
                    $$("pnlBillTransaction").hide();
                    $$("pnlItemActions").hide();
                    $$("btnStocked").hide();
                    $$("btnSavePOItem").hide();
                    $$("btnReceivePayment").hide();
                    page.controls.btnReceivePayment.selectedObject.next().hide();

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
                    $$("btnReturnPOItem").hide();

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
                    page.controls.btnInvoicePO.selectedObject.next().show();

                    $$("ddlPOVendor").disable(true);
                    $$("dsPOExpectedDate").disable(true);

                    $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(false);
                    $$("pnlOrderDate").show();
                    $$("pnlBillSummary").show();
                    $$("pnlTransaction").hide();
                    $$("pnlBillTransaction").hide();
                    $$("pnlItemActions").hide();
                    $$("btnStocked").hide();
                    $$("btnSavePOItem").show();
                    $$("btnReceivePayment").hide();
                    page.controls.btnReceivePayment.selectedObject.next().hide();
                    page.controls.btnPayInvoiceAmount.selectedObject.next().hide();

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
                    $$("btnReturnPOItem").show();
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
                    $$("btnInvoicePO").show();
                    page.controls.btnInvoicePO.selectedObject.next().show();

                    $$("ddlPOVendor").disable(true);
                    $$("dsPOExpectedDate").disable(true);

                    $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(true);
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
                    page.controls.btnReturnDelivery.selectedObject.next().show();
                    $$("btnAddToStock").show();
                    page.controls.btnAddToStock.selectedObject.next().show();
                    $$("btnReturnPOItem").show();

                    if (CONTEXT.ENABLE_MODULE_TRAY == false) {
                        $$("btnReceiveTray").hide();
                        page.controls.btnReceiveTray.selectedObject.next().hide();
                        $$("btnReturnTray").hide();
                        page.controls.btnReturnTray.selectedObject.next().hide();
                    }
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
                    $("#lblConfirmedDisplay").css('color', "lightgreen");
                    $("#lblStockedDisplay").css('color', "Black");

                    $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(true);
                    $$("pnlDeliDate").show();

                    $$("pnlItemActions").show();

                    //Show the enabled action
                    $$("btnReceiveDelivery").hide();
                    $$("btnReceiveDelivery").selectedObject.next().hide();
                    $$("btnAddToStock").show();
                    page.controls.btnAddToStock.selectedObject.next().show();
                    $$("btnReturnDelivery").hide();
                    page.controls.btnReturnDelivery.selectedObject.next().hide();
                    $$("btnReturnPOItem").show();


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
                        page.controls.btnReturnTray.selectedObject.next().hide();
                    }

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
                    $("#lblConfirmedDisplay").css('color', "lightgreen");
                    $("#lblStockedDisplay").css('color', "lightgreen");

                    $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(true);
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
                        page.controls.btnReturnTray.selectedObject.next().hide();
                    }
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

                    $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(true);

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

                    $$("btnReturnDelivery").hide();
                    page.controls.btnReturnDelivery.selectedObject.next().hide();

                    if (CONTEXT.ENABLE_MODULE_TRAY == false) {
                        $$("btnReceiveTray").hide();
                        page.controls.btnReceiveTray.selectedObject.next().hide();
                        $$("btnReturnTray").hide();
                        page.controls.btnReturnTray.selectedObject.next().hide();
                    }
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

                    //   $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(true);
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

                    //   $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(true);
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
                }

                if (state == "Return") {
                    $$("btnOrderPO").hide();
                    $$("btnDeliveredPO").hide();
                    $$("btnCompletedPO").hide();
                    $$("btnPayInvoiceAmount").show();
                    page.controls.btnPayInvoiceAmount.selectedObject.next().show();
                    $$("btnInvoiceConfirmedPO").hide();
                    $$("btnReturnPOItem").show();
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

                    //    $$("btnSendMail").hide();
                    $$("txtInvoiceNo").disable(true);
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
        page.check_variation = function (row, billItem) {

            billItem.var_no = null;
            billItem.variation_name = null;
            billItem.free_var_no = null;
            billItem.free_variation_name = null;


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
                if (!CONTEXT.ENABLE_VARIATION_VENDOR_NO) {
                    billItem.vendor_no = 0;
                    item.vendor_no = 0;
                }
                var billItem_mrp = isNaN(parseFloat(billItem.mrp)) ? 0 : billItem.mrp;
                var item_mrp = isNaN(parseFloat(item.mrp)) ? 0 : item.mrp;
                if (parseFloat(billItem_mrp) == parseFloat(item_mrp) && billItem.batch_no == item.batch_no &&
                    billItem.vendor_no == item.vendor_no &&
                    billItem.expiry_date == item.expiry_date && billItem.man_date == item.man_date &&
                        parseFloat(billItem.buying_cost) == parseFloat(item.cost)) {

                    billItem.var_no = item.var_no;
                    billItem.variation_name = item.variation_name;
                    row.find("input[datafield=variation_name]").val(billItem.variation_name);
                    if (item.active == "0")
                        row.find("input[datafield=variation_name]").css("color", "red");
                    else
                        row.find("input[datafield=variation_name]").css("color", "black");
                }
                if (CONTEXT.enableFreeVariation && CONTEXT.showFree) {
                    if (parseFloat(billItem.mrp) == parseFloat(item.mrp) && billItem.batch_no == item.batch_no &&
                   billItem.vendor_no == item.vendor_no &&
                   billItem.expiry_date == item.expiry_date &&
                   billItem.man_date == item.man_date &&
                   parseFloat(item.cost).toFixed(2) == parseFloat(0).toFixed(2)) {

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
        //                if (parseFloat(data.mrp) == parseFloat(item.mrp) && data.batch_no == item.batch_no && data.expiry_date == item.expiry_date && data.man_date == item.man_date && parseFloat(data.buying_cost).toFixed(2) == parseFloat(0).toFixed(2)) {
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
        //                if (parseFloat(data.mrp) == parseFloat(item.mrp) && data.batch_no == item.batch_no && data.expiry_date == item.expiry_date && data.man_date == item.man_date && parseFloat(data.buying_cost).toFixed(2) == parseFloat(0).toFixed(2)) {
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
                page.controls.pnlNewPOPopup.width(540);
                page.controls.pnlNewPOPopup.height(200);

                page.controls.txtInvoiceNo.val('');
                page.controls.lblPOBillNo.value('');
                $$("dsExpectedDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
            },
            btnGetPendingPayVendor_click: function () {
                page.controls.pnlPayPending.open();
                page.controls.pnlPayPending.title("Pending Payment Screen");
                page.controls.pnlPayPending.width(1000);
                page.controls.pnlPayPending.height(500);

                $$("txtPendingPayDesc").value("CurrentPO");
                $$("dsPendingPayDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));  // Load Current PO when click Pay
                page.view.selectedPendingPayment([]);

                var filter = {
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
                        if (parseFloat(items.total_paid_amount) != parseFloat(items.total_price)) {
                            vendor_data.push(items);
                        }
                    });
                    $$("ddlPendingVendorName").dataBind(vendor_data, "vendor_no", "vendor_name", "Select");
                });

                $$("ddlPayBillType").selectionChange(function () {
                    if ($$("ddlPayBillType").selectedValue() == "Purchase") {
                        var vendor_pay_data = [];
                        var filter = {
                            viewMode: "Standard",
                            fromDate: "",
                            toDate: "",
                            vendor_no: $$("ddlPendingVendorName").selectedValue(),
                            item_no: "",
                            state_no: "",
                            bill_type: "Purchase"
                        };
                        page.dynaReportService.getPurchaseReport(filter, function (data) {
                            $(data).each(function (i, items) {
                                if (parseFloat(items.total) - parseFloat(items.total_paid_amount) != 0)
                                    vendor_pay_data.push({
                                        po_no: items.po_no,
                                        bill_no: items.bill_no,
                                        bill_date: items.bill_date,
                                        total_paid_amount: items.total_paid_amount,
                                        total: items.total,
                                        vendor_name: items.vendor_name,
                                        vendor_no: items.vendor_no,
                                        balance: parseFloat(items.total) - parseFloat(items.total_paid_amount)
                                    });
                            });
                            page.view.selectedPendingPayment(vendor_pay_data);
                        });
                    }
                    else if ($$("ddlPayBillType").selectedValue() == "Return") {
                        var vendor_pay_data = [];
                        var filter = {
                            viewMode: "Standard",
                            fromDate: "",
                            toDate: "",
                            vendor_no: $$("ddlPendingVendorName").selectedValue(),
                            item_no: "",
                            state_no: "",
                            bill_type: "Return"
                        };
                        page.dynaReportService.getPurchaseReport(filter, function (data) {
                            $(data).each(function (i, items) {
                                if (parseFloat(items.total) - parseFloat(items.total_paid_amount) != 0)
                                    vendor_pay_data.push({
                                        po_no: items.po_no,
                                        bill_no: items.bill_no,
                                        bill_date: items.bill_date,
                                        total_paid_amount: items.total_paid_amount,
                                        total: items.total,
                                        vendor_name: items.vendor_name,
                                        vendor_no: items.vendor_no,
                                        balance: parseFloat(items.total) - parseFloat(items.total_paid_amount)
                                    });
                            });
                            page.view.selectedPendingPayment(vendor_pay_data);
                        });
                    } else {
                        page.view.selectedPendingPayment([]);
                    }
                })


            },
            btnPayPending_click: function () {
                var billSO = [];
                var data1 = [];

                if ($$("ddlPayBillType").selectedValue() == "Purchase") {
                    try {
                        var countNoAmount = 0;
                        $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                            if (item.amount_pay != 0 &&  item.amount_pay !="" && item.amount_pay != undefined) {
                                countNoAmount = countNoAmount + 1;
                            }
                        });
                        if (countNoAmount < 1)
                            throw "Please check the amount...!";
                        //Confirm the payment
                        if (confirm("Are you sure to pay the Amount") == true) {
                            $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                                if (parseFloat(item.amount_pay) > 0) {
                                    if (parseFloat(item.balance) < parseFloat(item.amount_pay))
                                        throw "Pay amount should be lesser or equal to the balance";
                                    billSO.push({
                                        bill_no: item.bill_no,
                                        collector_id: page.controls.ddlPendingCollectorName.selectedValue(),
                                        pay_desc: page.controls.txtPendingPayDesc.value(),
                                        amount: parseFloat(item.amount_pay),
                                        po_no: item.po_no,
                                        pay_date: page.controls.dsPendingPayDate.getDate(),
                                        pay_type: page.controls.ddlPayBillType.selectedValue()

                                    });
                                    data1.push({
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                                        //amount: parseFloat(item.amount_pay),
                                        paid_amount: parseFloat(item.amount_pay),
                                        key_1: item.po_no,
                                        description: "Purchase Order-" + item.po_no,
                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                        comp_id: CONTEXT.FINFACTS_COMPANY,
                                    });
                                }
                            })

                            //if (isNaN(billSO.amount) || billSO.amount == 0)
                            //    throw ('Amount shoud be a number and non negative.');

                            //if ((parseFloat(page.controls.lblTotalAmtPaid.html()) + parseFloat(page.controls.txtPayAmount.value())) > parseFloat(page.controls.lblTotal.value()))
                            //    throw ('Amount Exceeds total due amount:' + page.controls.lblTotal.value() + '--Total Paid amount is : ' + page.controls.lblTotalAmtPaid.html());

                            //if (!(billSO.collector_id != '' && billSO.amount != '' && billSO.pay_date != '' && billSO.pay_type != ''))
                            //    throw ('Please Enter Collector name, Amount, Pay date and pay type!');


                            page.purchaseService.payAllPendingPayments(0, billSO, function (data) {

                                if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                    //page.finfactsService.insertAllCreditPayment(0, data1, function (response) {
                                    page.finfactsEntry.allcreditPurchasePayment(0, data1, function (response) {
                                        //alert("Your payment is succcessful");
                                        ShowDialogBox('Message', 'Your payment is succcessful...!', 'Ok', '', null);
                                        page.events.btnGetPendingPayVendor_click();
                                        $$("ddlPayBillType").selectedValue("Select");
                                    });
                                }
                            });
                        }
                    } catch (e) {
                        //alert(e);
                        ShowDialogBox('Message', e, 'Ok', '', null);
                    }
                }
                if ($$("ddlPayBillType").selectedValue() == "Return") {
                    try {
                        var countNoAmount = 0;
                        $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                            if (item.amount_pay != 0 && item.amount_pay != "" && item.amount_pay != undefined) {
                                countNoAmount = countNoAmount + 1;
                            }
                        });
                        if (countNoAmount < 1)
                            throw "Please check the amount...!";
                        //Confirm the payment
                        if (confirm("Are you sure to pay the Amount") == true) {
                            $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                                if (parseFloat(item.amount_pay) > 0) {
                                    if (parseFloat(item.balance) < parseFloat(item.amount_pay))
                                        throw "Pay amount should be lesser or equal to the balance";
                                    billSO.push({
                                        bill_no: item.bill_no,
                                        collector_id: page.controls.ddlPendingCollectorName.selectedValue(),
                                        pay_desc: page.controls.txtPendingPayDesc.value(),
                                        amount: parseFloat(item.amount_pay),
                                        po_no: item.po_no,
                                        pay_date: page.controls.dsPendingPayDate.getDate(),
                                        pay_type: page.controls.ddlPayBillType.selectedValue()

                                    });
                                    data1.push({
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                                        //amount: parseFloat(item.amount_pay),
                                        paid_amount: parseFloat(item.amount_pay),
                                        key_1: item.po_no,
                                        description: "Purchase Order-" + item.po_no,
                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                        comp_id: CONTEXT.FINFACTS_COMPANY,
                                    });
                                }
                            })

                            //if (isNaN(billSO.amount) || billSO.amount == 0)
                            //    throw ('Amount shoud be a number and non negative.');

                            //if ((parseFloat(page.controls.lblTotalAmtPaid.html()) + parseFloat(page.controls.txtPayAmount.value())) > parseFloat(page.controls.lblTotal.value()))
                            //    throw ('Amount Exceeds total due amount:' + page.controls.lblTotal.value() + '--Total Paid amount is : ' + page.controls.lblTotalAmtPaid.html());

                            //if (!(billSO.collector_id != '' && billSO.amount != '' && billSO.pay_date != '' && billSO.pay_type != ''))
                            //    throw ('Please Enter Collector name, Amount, Pay date and pay type!');


                            page.purchaseService.payAllInvoiceBillSalesOrder(0, billSO, function (data) {
                                if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                    //page.finfactsService.insertAllCreditReturnPayment(0, data1, function (response) {
                                    page.finfactsEntry.allcreditReturnPurchasePayment(0, data1, function (response) {
                                        //alert("Payment made successfully");
                                        ShowDialogBox('Message', 'Payment made successfully...!', 'Ok', '', null);
                                        page.events.btnGetPendingPayVendor_click();
                                        $$("ddlPayBillType").selectedValue("Select");
                                    });
                                }
                            });
                        }
                    } catch (e) {
                        //alert(e);
                        ShowDialogBox('Message', e, 'Ok', '', null);
                    }
                }
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

                $$("pnlNewPOPopup").close();

                $$("msgPanel").show("Creating purchase order...");
                page.purchaseService.insertPO({
                    vendor_no: $$("ddlVendorNos").selectedValue(),
                    expected_date: $$("dsExpectedDate").getDate()
                }, function (data) {

                    $$("msgPanel").show("Purchase order is successfully created...");

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

                            });
                        });
                    });
                } catch (e) {
                    $$("msgPanel").flash(e);
                }

            },
            btnConfirmPO_click: function () {
                try {
                    //GET THE BILL TOTAL QTY IN WORDS
                    var result = "";
                    if (CONTEXT.EnableTotalQtyInBill) {
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
                    var isNoCost = false;
                    $(page.controls.grdPOItems.allData()).each(function (i, item) {
                        if (item.cost == 0 || item.cost == "" || item.cost == undefined) {
                            isNoCost = true;
                        }
                    });
                    if (isNoCost == true)
                        throw "Please check the cost";
                    page.savePurchaseOrder(function () {
                        $$("msgPanel").show("Purchase order is successfully updated...");

                        page.purchaseService.invoiceConfirmedPO(page.currentPO.po_no, function (data2) {

                            $$("msgPanel").show("Purchase order is changed to confirmed state...");
                            var newBill = {
                                po_no: page.currentPO.po_no,
                                bill_no: ($$("lblPOBillNo").value() == undefined || $$("lblPOBillNo").value() == "" || $$("lblPOBillNo").value() == null) ? "0" : $$("lblPOBillNo").value(),
                                bill_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                store_no: getCookie("user_store_id"),
                                user_no: CONTEXT.user_no,
                                //store_no: CONTEXT.store_no,
                                //reg_no: CONTEXT.reg_no,
                                //user_no: CONTEXT.user_no,
                                sub_total: isNaN(page.controls.lblSubTotal.value()) ? 0 : page.controls.lblSubTotal.value(),
                                total: parseFloat(page.controls.lblTotal.value()),
                                discount: page.controls.lblTotalDiscounts.value(),
                                tax: page.controls.lblTotalTax.value(),

                                bill_type: "Purchase",
                                state_no: 904, //904 is purchase 

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
                                    amount: parseFloat(billItem.cost) * parseFloat(billItem.qty)

                                });
                            });

                            $$("msgPanel").show("Generating a invoice for the purchase order ...");
                            newBill.bill_items = rbillItems;
                            //page.purchaseBillService.insertBill(newBill, function (data) {
                            page.stockAPI.insertBill(newBill, function (data) {
                                page.currentBillNo = data;

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
                                            comp_id: CONTEXT.FINFACTS_COMPANY,
                                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                            jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                            description: "Purchase Order-" + page.currentBillNo,
                                            pur_with_out_tax: parseFloat(p_with_tax).toFixed(2),
                                            tax_amt: parseFloat(page.controls.lblTotalTax.value()).toFixed(2),
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
                    var inventItems = [];
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
                        else if (parseFloat(item.qty_stocked) < parseFloat(item.ret_qty)) {
                            throw "Total damage quantity cannot be greater than actual stocked quantity";
                        }
                        //Insert delivery quantity only when it is greater than 0. 
                        if (item.ret_qty > 0) {
                            if (item.unit_identity == "1") {
                                item.ret_qty = parseFloat(item.ret_qty) * parseFloat(item.alter_unit_fact);
                                item.qty_delivered = parseFloat(item.qty_delivered) * parseFloat(item.alter_unit_fact);
                            }
                            inventItems.push({
                                var_no: item.var_no,
                                qty: -(item.ret_qty),
                                trans_type: "PurchaseReturn",
                                trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                key1: page.currentPO.po_bill_no,
                                key2: item.item_no,

                                //FINFACTS ENTRY DATA
                                invent_type: "PurchaseCredit",
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                invent_type: "PurchaseCreditReturn",
                                description: "PurchaseReturn" + page.currentPO.po_bill_no,
                                amount: parseFloat(item.buying_cost) * parseFloat(item.ret_qty),
                                comp_id: getCookie("user_company_id")

                                //item_no: item.item_no,
                                //cost: item.buying_cost,
                                //vendor_no: $$("ddlPOVendor").selectedValue(),
                                //batch_no: item.batch_no,
                                //expiry_date: item.expiry_date,
                                //mrp: item.mrp,
                                //variation_name: item.variation_name,
                                //unit_identity:item.unit_identity
                            });


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

                    if (inventItems.length == 0)
                        throw "No item is selected for return.";
                    //Note : TODO : We cannot return delivery that is delivered but not added to stock.

                    $$("msgPanel").show("Adjusting delivery to reduce the returned quantity...");
                    
                    page.purchaseService.updatePOItems(0, items, function () {
                        //Make inventory entry
                        $$("msgPanel").show("Adjusting inventory to add the returned quantity...");
                        //page.inventoryService.insertInventoryItems(0, inventItems, function (data) {
                        page.stockAPI.insertAllStockVar(0, inventItems, function (data) {
                            $$("msgPanel").show("Return delivery is successfully...");
                            //alert("Return delivery is successfully...");
                            ShowDialogBox('Message', 'Return delivery is successfully...!', 'Ok', '', null);
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
                        });
                    });

                } catch (e) {
                    //alert(e);
                    ShowDialogBox('Message', e, 'Ok', '', null);
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
                page.view.selectedPOItems(page.currentPOItems);
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
                        bill_type:"Purchase"
                    }
                    $(page.controls.grdPOItems.allData()).each(function (i, item) {
                        //If empty input is given assume as 0
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

                        //If empty qty stocked exists assume as 0
                        if (item.selling_price == null || item.selling_price == "" || typeof item.selling_price == "undefined") {
                            item.selling_price = 0;
                        }
                        if (isNaN(item.qty_tostock) || parseFloat(item.qty_tostock) < 0) //If not a number or negative set flag=1
                            throw "Stock quantity should be a number and non negative.";
                        else if (parseFloat(item.qty_delivered) < (parseFloat(item.qty_tostock) + parseFloat(item.qty_instock))) {
                            throw "Total stock quantity cannot be greater than actual delivered quantity - Stocked quantiy.";
                        }

                        if (free == "true") {
                            if (parseFloat(item.temp_free_qty) < (parseFloat(item.qty_tostock) + parseFloat(item.qty_infreestock)))
                                throw "Total free quantty cannot be greater than actual free quantity.";
                            if (item.var_cost != undefined) {
                                if (parseInt(item.var_cost) != "0")
                                    throw "Variation is not for free";
                            }
                        } else {
                            if (parseFloat(item.temp_qty) < (parseFloat(item.qty_tostock) + (parseFloat(item.qty_instock) - parseFloat(item.qty_infreestock))))
                                throw "Total non free quantty cannot be greater than actual quantity.";
                            if (item.var_cost != undefined) {
                                if (parseInt(item.var_cost) == "0" && parseFloat(item.buying_cost) != "0")
                                    throw "Variation is for free";
                            }
                        }
                        if(CONTEXT.ENABLE_DATE_FORMAT == "true") {
                            if (item.expiry_date != undefined && item.expiry_date != null && item.expiry_date != "" && item.expiry_date != "--") {
                                var len = item.expiry_date.length;
                                var month = item.expiry_date.substring(len - 7, len - 5);
                                var year = item.expiry_date.substring(len - 4, len);
                                item.expiry_date = "28-"+month + "-" + year;
                            }
                            if (item.man_date != undefined && item.man_date != null && item.man_date != "" && item.man_date != "--") {
                                var len = item.man_date.length;
                                var month = item.man_date.substring(len - 7, len - 5);
                                var year = item.man_date.substring(len - 4, len);
                                item.man_date = "28-" + month + "-" + year;
                            }
                        }
                        //Insert delivery quantity only when it is greater than 0. 
                        if (item.qty_tostock > 0) {
                            if (item.variation_name == undefined || item.variation_name == null || item.variation_name == "")
                                item.variation_name == ""
                            //throw "Variation name Cannot be empty";
                            if (item.unit_identity == "1") {
                                item.qty_tostock = parseFloat(item.qty_tostock) * parseFloat(item.alter_unit_fact);
                            }
                            flag = true;
                            inventItems.push({
                                var_no: free == "true"?item.free_var_no:item.var_no,
                                variation_name: free == "true" ? item.free_variation_name : item.variation_name,
                                //man_date: (CONTEXT.ENABLE_DATE_FORMAT == "true") ? (item.man_date == "" || item.man_date == undefined || item.man_date == null || item.man_date == "--") ? "" : dbDateTime("28-" + item.man_date) : dbDateTime(item.man_date),
                                //expiry_date: (CONTEXT.ENABLE_DATE_FORMAT == "true") ? (item.expiry_date == "" || item.expiry_date == undefined || item.expiry_date == null || item.expiry_date == "--") ? "" : dbDateTime("28-" + item.expiry_date) : dbDateTime(item.expiry_date),
                                mrp: item.mrp,
                                batch_no:item.batch_no,
                                store_no: getCookie("user_store_id"),
                                item_no: item.item_no,
                                cost: free == "true" ? "0" : parseFloat(item.buying_cost).toFixed(2),

                                qty: parseFloat(item.qty_tostock),
                                trans_type: "Purchase",
                                trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                key1: page.currentPO.po_bill_no,
                                key2: item.item_no,
                                //FINFACTS ENTRY DATA
                                invent_type: "PurchaseCredit",
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                amount: free == "true" ? "0" : (parseFloat(item.buying_cost) * parseFloat(item.qty_tostock)),
                                //Get Price Details
                                selling_price: item.selling_price,
                                valid_from: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                vendor_no:page.controls.ddlPOVendor.selectedValue(),
                                active:"1",
                            });
                            if (CONTEXT.ENABLE_EXP_DATE) {
                                if (item.expiry_date == undefined || item.expiry_date == null || item.expiry_date == "" || item.expiry_date == "--") { }
                                else {
                                    inventItems[inventItems.length - 1].expiry_date = dbDateTime(item.expiry_date);
                                }
                            }
                            if (CONTEXT.ENABLE_MAN_DATE) {
                                if (item.man_date == undefined || item.man_date == null || item.man_date == "" || item.man_date == "--") { }
                                else {
                                    inventItems[inventItems.length - 1].man_date = dbDateTime(item.man_date);
                                }
                            }
                            //if (item.qty_type == "Integer") {
                            //    inventItems.push({
                            //        item_no: item.item_no,
                            //        cost: free == "true" ? 0 : item.buying_cost,
                            //        qty: parseInt(item.qty_tostock),
                            //        //free_item:item.free_item,
                            //        mrp: item.mrp,
                            //        vendor_no: $$("ddlPOVendor").selectedValue(),
                            //        //selling_price: item.selling_price,
                            //        batch_no: item.batch_no,
                            //        //expiry_date: (CONTEXT.ENABLE_DATE_FORMAT == "true") ? (item.expiry_date == "" || item.expiry_date == undefined || item.expiry_date == null) ? "" : "28-" + item.expiry_date : item.expiry_date,
                            //        expiry_date:item.expiry_date,
                            //        invent_type: "Purchase",
                            //        key1: page.currentPO.po_bill_no,
                            //        variation_name: (free == "true") ? (item.variation_name == "") ? "-free" : item.variation_name : item.variation_name,
                            //        //variation_name: free == "true"?item.variation_name+"-free":item.variation_name,
                            //        //qty_instock: item.qty_tostock
                            //        unit_identity:item.unit_identity,

                            //    });
                            //    tot_buying_cost = tot_buying_cost + (parseFloat(item.buying_cost) * parseFloat(item.qty_tostock));
                            //}
                            //else {
                            //    inventItems.push({
                            //        item_no: item.item_no,
                            //        cost: free == "true" ? 0 : item.buying_cost,
                            //        qty: item.qty_tostock,
                            //        //free_item:item.free_item,
                            //        mrp: item.mrp,
                            //        vendor_no: $$("ddlPOVendor").selectedValue(),
                            //        //selling_price: item.selling_price,
                            //        batch_no: item.batch_no,
                            //        expiry_date: (CONTEXT.ENABLE_DATE_FORMAT == "true") ? (item.expiry_date == "" || item.expiry_date == undefined || item.expiry_date == null) ? "" : "28-" + item.expiry_date : item.expiry_date,
                            //        invent_type: "Purchase",
                            //        key1: page.currentPO.po_bill_no,
                            //        variation_name: item.variation_name,
                            //        //variation_name: free == "true"?item.variation_name+"-free":item.variation_name,
                            //        //qty_instock: item.qty_tostock
                            //        unit_identity: item.unit_identity,
                            //        var_no: item.var_no,

                            //    });
                            //    tot_buying_cost = tot_buying_cost + parseFloat(item.buying_cost) * parseFloat(item.qty_tostock);
                            //}

                            //if (item.selling_price > 0) {
                            //    priceItems.push({
                            //        var_no: item.var_no,
                            //        price: item.selling_price,
                            //        mrp: item.mrp,
                            //        //selling_price: data.selling_price,
                            //        batch_no: item.batch_no,
                            //        expiry_date: (CONTEXT.ENABLE_DATE_FORMAT == "true") ? (item.expiry_date == "" || item.expiry_date == undefined || item.expiry_date == null) ? "" : "28-" + item.expiry_date : item.expiry_date,
                            //        valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
                            //        cost: free == "true" ? 0 : item.buying_cost,
                            //        variation_name: item.variation_name,
                            //        //variation_name: free == "true" ? item.variation_name + "-free" : item.variation_name,
                            //    });
                            //}
                        }
                    });
                    if (flag == false)
                        throw "No items qty is entered";
                    $$("msgPanel").show("Adding items to inventory...");
                    //page.inventoryService.insertInventoryItems(0, inventItems, function (data1) {
                    newBill.bill_items = inventItems;
                    page.stockAPI.insertStock(newBill, function (data) {

                      //  $$("msgPanel").show("Updating item price...");
                     //   page.itemService.insertPriceItems(0, priceItems, function (data) {

                            //if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                            //    var fin_data = {
                            //        per_id: CONTEXT.PeriodId,
                            //        amount: tot_buying_cost,
                            //        description: "Purchase Order-" + $$("lblPOBillNo").value(),
                            //        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                            //        key_1: $$("lblPOBillNo").value(),
                            //        comp_id: CONTEXT.FINFACTS_COMPANY,
                            //        key_2: $$("ddlPOVendor").selectedValue()
                            //    };
                            //    //page.finfactsEntry.debitPurchaseStock(fin_data, function (res) {
                            //    //    $$("msgPanel").show("A new finfacts entered successfully");
                            //    //});
                            //}

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

                                //  $$("msgPanel").hide();
                            });

                     //   });

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
                                    bill_id: page.controls.lblPOBillNo.value()
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
                //var person = prompt("Please enter amount paid", "");


                page.controls.pnlBillPayPopup.open();

                page.controls.pnlBillPayPopup.title("Pay for your purchase order");
                page.controls.pnlBillPayPopup.width(340);
                page.controls.pnlBillPayPopup.height(400);
                $$("dsBillPayDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));  // Load Current PO when click Pay
                $$("txtPayDesc").value("CurrentPO");
                var remainingAmount = parseFloat(page.controls.lblTotal.value()) - parseFloat(page.controls.lblTotalAmtPaid.html());
                // page.controls.lblTotalAmtRemaining.html(remainingAmount);
                $$("txtPayAmount").value(remainingAmount);

            },
            btnBillPaySOOK_click: function () {
                try {
                    //Confirm the payment
                    if (confirm("Are you sure to pay the Amount") == true) {
                        var billSO = {
                            bill_no: page.controls.lblPOBillNo.value(),
                            collector_id: page.controls.ddlCollectorName.selectedValue(),
                            pay_desc: page.controls.txtPayDesc.value(),
                            amount: parseFloat(page.controls.txtPayAmount.value()),
                            po_no: page.currentPO.po_no,
                            pay_date: page.controls.dsBillPayDate.getDate(),
                            pay_type: page.controls.ddlPayType.selectedValue()

                        };

                        if (isNaN(billSO.amount) || billSO.amount == 0)
                            throw ('Amount shoud be a number and non negative.');

                        if ((parseFloat(page.controls.lblTotalAmtPaid.html()) + parseFloat(page.controls.txtPayAmount.value())) > parseFloat(page.controls.lblTotal.value()))
                            throw ('Amount Exceeds total due amount:' + page.controls.lblTotal.value() + '--Total Paid amount is : ' + page.controls.lblTotalAmtPaid.html());

                        if (!(billSO.collector_id != '' && billSO.amount != '' && billSO.pay_date != '' && billSO.pay_type != ''))
                            throw ('Please Enter Collector name, Amount, Pay date and pay type!');


                        page.purchaseService.payInvoiceBillSalesOrder(billSO, function (data) {

                            var data1 = {
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                                //amount: billSO.amount,
                                paid_amount: billSO.amount,
                                key_1: page.currentPO.po_no,
                                description: "Purchase Order-" + page.currentPO.po_no,
                                jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                comp_id: CONTEXT.FINFACTS_COMPANY,
                            };
                            if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                page.finfactsEntry.creditPurchasePayment(data1, function (response) {
                                });
                            }

                            page.purchaseService.getPOByNo(page.currentPO.po_no, function (data) {
                                var row = page.controls.grdPOResult.selectedRows()[0];
                                page.controls.grdPOResult.updateRow(row.attr("row_id"), data[0])
                                row.click();



                            });

                            page.controls.pnlBillPayPopup.close();
                            $$("msgPanel").flash("Your payment is successful...!");
                        });
                    }
                } catch (e) {
                    //alert(e);
                    ShowDialogBox('Warning', e, 'Ok', '', null);
                }


                //if (confirm("Are you sure to pay the amount") == true) {




                //    var trans_type1 = "Credit";
                //    var data1 = {
                //        per_id: CONTEXT.PeriodId,
                //        target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                //        amount: billSO.amount,
                //        key_1: page.currentPO.po_no,
                //        description: "Purchase Order-" + page.currentPO.po_no,
                //        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                //        comp_id: CONTEXT.CompanyName,
                //    };
                //    page.controls.pnlBillPayPopup.close();


                //    if (isNaN(billSO.amount) || billSO.amount == 0) {
                //        $$("msgPanel").show('Please Enter only digits greater than 0 for amount!');

                //    } else if ((parseInt(page.controls.lblTotalAmtPaid.html()) + parseInt(billSO.amount)) > parseInt(page.controls.lblTotal.value())) {
                //        $$("msgPanel").show('Amount Exceeds total due amount:' + page.controls.lblTotal.value() + '--Total Paid amount is : ' + page.controls.lblTotalAmtPaid.html());


                //    } else if (billSO.collector_id != '' && billSO.amount != '' && billSO.pay_date != '' && billSO.pay_type != '') {
                //        page.purchaseService.payInvoiceBillSalesOrder(billSO, function (data) {
                //            $$("msgPanel").show('Payment details saved successfully!');
                //            page.controls.txtPayDesc.value('');
                //            page.controls.txtPayAmount.value('');
                //            page.controls.dsBillPayDate.setDate('');

                //            page.controls.ddlCollectorName.selectedValue('');


                //            page.purchaseService.getTotalPaidPO(billSO.po_no, function (data) {
                //                page.controls.lblTotalAmtPaid.html(data[0].total);
                //                var remainingAmount = page.controls.lblTotal.value() - page.controls.lblTotalAmtPaid.html();
                //                page.controls.lblTotalAmtRemaining.value(remainingAmount);
                //                $$("msgPanel").hide();
                //                if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {                                   
                //                    page.finfactsService.insertCreditPayment(data1, function (response) {                                      
                //                    });
                //                }

                //            });

                //            page.purchaseService.getInvoiceBillDetails(billSO.po_no, function (data) {
                //                page.controls.grdTransactions.dataBind(data);

                //            });

                //            page.purchaseBillService.getBillByPO(billSO.po_no, function (data) {
                //                page.controls.grdBillTransactions.dataBind(data);
                //            });
                //        });
                //    } else {
                //        $$("msgPanel").show('Please Enter Collector name, Amount, Pay date and pay type!');

                //    }

                //} else { }


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


                //var voiceNo;
                //var count = 0;
                ///* $(page.controls.grdPOItems.allData()).each(function (i, item) {
                //     if (item.expiry_date == "" || item.batch_no == null || item.addStock == null || item.addStock == undefined)
                //         count++;
                // });*/
                //if (count == 0) {
                //    if (parseInt(page.controls.lblTotalAmtPaid.html()) == parseInt(page.controls.lblTotal.value())) {

                //        voiceNo = $$("txtInvoiceNo").value();
                //        if (voiceNo != '' && voiceNo != undefined) {

                //            page.purchaseService.completePO(page.currentPO.po_no, function (data2) {
                //                page.purchaseService.getPOByNo(page.currentPO.po_no, function (data) {

                //                    //  page.purchaseService.getPOByNo(newPO.po_no, function (data) {
                //                    var row = page.controls.grdPOResult.selectedRows()[0];

                //                    page.events.grdPOResult_select(data);
                //                    page.currentPO.state_no = 900;
                //                    page.currentPO.state_text = "Completed";
                //                    page.controls.grdPOResult.updateRow(row.attr("row_id"), data[0])

                //                    row.click();
                //                    $$("msgPanel").show("Purchase order completed successfully!!");

                //                    //  });

                //                })
                //            });


                //            //var newPO = {
                //            //    po_no: page.currentPO.po_no,
                //            //    vendor_no: page.controls.ddlPOVendor.selectedValue(),
                //            //    expected_date: page.controls.dsPOExpectedDate.getDate(),
                //            //    invoice_no: page.controls.txtInvoiceNo.val()
                //            //};
                //            //page.purchaseService.updatePO(newPO, function () {
                //            //    /*var result = compareContents(page.currentPOItem, page.controls.grdPOItems.allData(), "po_no,item_no", "qty,cost,tray_count")
                //            //    page.purchaseService.deletePOItems(0, result.deletedDate, function() {
                //            //        page.purchaseService.updatePOItems(0, result.updatedData, function() {
                //            //            page.purchaseService.addPOItems(0, result.addedData, function() {
                //            //                alert("Record Saved");
                //            //            });
                //            //        });

                //            //});*/

                //            //    page.purchaseService.completePO(page.currentPO.po_no, function (data2) {
                //            //        page.purchaseService.getPOByNo(page.currentPO.po_no, function (data) {

                //            //            //  page.purchaseService.getPOByNo(newPO.po_no, function (data) {
                //            //            var row = page.controls.grdPOResult.selectedRows()[0];

                //            //            page.events.grdPOResult_select(data);
                //            //            page.currentPO.state_no = 900;
                //            //            page.currentPO.state_text = "Completed";
                //            //            page.controls.grdPOResult.updateRow(row.attr("row_id"), data[0])

                //            //            row.click();
                //            //            $$("msgPanel").show("Purchase order completed successfully!!");

                //            //            //  });

                //            //        })
                //            //    });
                //            //});




                //        } else {
                //            $$("msgPanel").show("Vendor Invoice PO number is mandatory!!");

                //        }

                //    } else {
                //        var remainingAmount = page.controls.lblTotal.value() - page.controls.lblTotalAmtPaid.html();
                //        $$("msgPanel").show('Purchase order cannot be marked as complete until full payment for the order is made!. Total amount paid till date is: ' + page.controls.lblTotalAmtPaid.html() + '--Please pay remaining amount:' + remainingAmount);

                //    }
                //} else {
                //    $$("msgPanel").show("Stock Value,Expiry Date and Batch No is Mantatory");
                //}

            },

            btnReturnPOItem_click: function () {

                page.controls.pnlReturnPOPopup.open();
                page.controls.pnlReturnPOPopup.title("Return Items");
                page.controls.pnlReturnPOPopup.width(1500);
                page.controls.pnlReturnPOPopup.height(500);
                page.purchaseBillService.getReturnedBillByNo(page.currentPO.po_no, page.currentPO.po_bill_no, function (rdata) {

                    $(rdata).each(function (i, item) {
                        if (item.free_qty_return == undefined || item.free_qty_return == null || item.free_qty_return == "")
                            item.free_qty_return = 0;
                        if (item.free_qty == undefined || item.free_qty == null || item.free_qty == "")
                            item.free_qty = 0;

                        //item.qty = parseFloat(item.qty) - parseFloat(item.free_qty);
                        //item.qty_returned = parseFloat(item.qty_returned) - parseFloat(item.free_qty_return);
                        //item.delivered = parseFloat(item.delivered) - parseFloat(item.free_qty);
                        //if (parseInt(item.delivered) > 0)
                        //  page.view.selectedReturnPOItems(rdata);
                    })

                    page.view.selectedReturnPOItems(rdata);

                });

            },
            btnReturnPOItemPopup_click: function (overrideItems) {
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
                        user_no: CONTEXT.user_no,

                        sub_total: 0,
                        total: 0,
                        discount: 0,
                        tax: 0,

                        bill_type: "PurchaseReturn",
                        state_no: 300,
                        round_off: 0,
                        sales_tax_no: page.sales_tax_no,
                        mobile_no: page.controls.lblPOVendorPhone.val(),
                        email_id: page.controls.lblPOVendorEmail.val(),
                        gst_no: page.controls.lblPOVendorGst.val(),
                        bill_no_par:$$("lblPOBillNo").value(),

                        vendor_no: page.controls.ddlPOVendor.selectedValue(),
                        vendor_name: $$("ddlPOVendor").selectedData().vendor_name,
                        vendor_address: page.controls.lblPOVendorAddress.val(),

                        //FINFACTS ENTRY DATA
                        invent_type: "PurchaseReturnCredit",
                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                         
                    };
                    var items = [];


                    var flag = false;
                    var stockItems = [];
                    var lastItemNo = "";
                    var lastItem = null;
                    var buying_cost = 0;
                    $(itemlList).each(function (i, item) {


                        if (typeof overrideItems != "undefined")
                            item.ret_qty = parseFloat(item.qty) - parseFloat(item.qty_returned);



                        //Set default value if empty
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
                            newBill.tax = newBill.tax+tax;
                            buying_cost = buying_cost + parseFloat(parseFloat(item.ret_qty) * parseFloat(item.buying_cost)).toFixed(2);
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
                                lastItem.sum_qty_returned = lastItem.sum_qty_returned + parseFloat(item.qty_returned);
                            }

                            if (typeof overrideItems != "undefined") {
                                //For bill overriding. Return all item bill but Destock only stocked item
                                if (item.buying_cost == 0)
                                    lastItem.fin_ret_qty = parseFloat(lastItem.ordered_qty) - parseFloat(lastItem.sum_qty_returned);
                                else
                                    lastItem.fin_ret_free = parseFloat(lastItem.free_qty) - parseFloat(lastItem.sum_qty_returned);


                                lastItem.fin_total_price = parseFloat(lastItem.fin_ret_qty) * parseFloat(lastItem.buying_cost);
                                //Calculate bill total value
                                newBill.sub_total = newBill.sub_total + parseFloat(lastItem.fin_ret_qty) * parseFloat(lastItem.buying_cost);
                                newBill.total = newBill.sub_total + newBill.tax;
                                var total_after_Rnd_off = Math.round(parseFloat(newBill.total));
                                var round_off = parseFloat(parseFloat(newBill.total) - parseFloat(total_after_Rnd_off)).toFixed(2);
                                newBill.total = total_after_Rnd_off;
                                newBill.round_off = round_off;
                            } else {
                                //Calculate bill total value
                                newBill.sub_total = newBill.sub_total + parseFloat(item.ret_qty) * parseFloat(item.buying_cost);
                                newBill.total = newBill.sub_total + newBill.tax;
                                var total_after_Rnd_off = Math.round(parseFloat(newBill.total));
                                var round_off = parseFloat(parseFloat(newBill.total) - parseFloat(total_after_Rnd_off)).toFixed(2);
                                newBill.total = total_after_Rnd_off;
                                newBill.round_off = round_off;
                            }
                            /*
                            if(!item[item.item_no + "ret"])
                                item[item.item_no + "ret"] = {};

                            if (!item[item.item_no + "ret"]["tot_return"])
                                item[item.item_no + "ret"]["tot_return"] = 0;
                            //item.3ret.tot_return=4

                            item[item.item_no + "ret"]["tot_return"] = item[item.item_no + "ret"]["tot_return"] + parseFloat(item.ret_qty)
                           */
                            if (item.unit_identity == "1") {
                                item.delivered = parseFloat(item.delivered) * parseFloat(item.alter_unit_fact);
                                item.ret_qty = parseFloat(item.ret_qty) * parseFloat(item.alter_unit_fact);
                            }
                            var poItem = {
                                item_no: item.item_no,
                                po_no: page.currentPO.po_no,
                                qty_delivered: parseFloat(item.delivered) - parseFloat(item.ret_qty),
                                qty_ret :  parseFloat(item.ret_qty)
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
                        throw "No items cannot have returned qty";

                    if (confirm("Are you return the item(s)") == true) {
                        //Insert the Bill
                        $$("msgPanel").show("Generating a return bill..");
                      //  page.purchaseBillService.insertBill(newBill, function (data) {
                            //page.currentReturnBillNo = data[0].key_value;

                            var rbillItems = [];
                            $(returnItems).each(function (i, billItem) {
                                if (billItem.unit_identity == "1") {
                                    billItem.fin_ret_qty = parseFloat(billItem.fin_ret_qty) * parseFloat(billItem.alter_unit_fact);
                                }
                                rbillItems.push({
                                    qty: billItem.fin_ret_qty,
                                    free_qty: billItem.fin_ret_free,
                                    unit_identity: billItem.unit_identity,
                                    price: billItem.buying_cost,
                                    disc_val: 0,
                                    disc_per: 0,
                                    taxable_value: "0",
                                    tax_per: 0,
                                    total_price: billItem.fin_total_price,
                                    bill_type: "PurchaseReturn",

                                    store_no: getCookie("user_store_id"),
                                    item_no: billItem.item_no,
                                    cost: billItem.buying_cost,

                                    vendor_no: page.controls.ddlPOVendor.selectedValue(),
                                    active: "1",
                                    tax_class_no: (billItem.tax_class_no == null || billItem.tax_class_no == "" || typeof billItem.tax_class_no == "undefined") ? "" : billItem.tax_class_no,
                                    amount: parseFloat(billItem.buying_cost) * parseFloat(billItem.qty),

                                    var_no: billItem.var_no,
                                });
                                inventItems.push({
                                    var_no: billItem.var_no,
                                    qty: billItem.fin_ret_qty,
                                    trans_type: "PurchaseReturn",
                                    trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    key1: page.currentPO.po_bill_no,
                                    key2: billItem.item_no,

                                    //FINFACTS ENTRY DATA
                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    invent_type: "PurchaseReturnCredit",
                                    description: "PurchaseReturn" + page.currentPO.po_bill_no,
                                    amount: parseFloat(billItem.buying_cost) * parseFloat(billItem.fin_ret_qty),
                                    comp_id: getCookie("user_company_id")
                                });
                            });
                            newBill.bill_items = rbillItems;
                        // page.purchaseBillService.insertAllBillItems(page.currentReturnBillNo, 0, rbillItems, function () {
                            page.stockAPI.insertBill(newBill, function (data) {
                                page.currentReturnBillNo = data;
                                page.purchaseService.updatePOItems(0, items, function () {
                                    //var inventItems = [];
                                    //$(stockItems).each(function (i, billItem) {
                                    //    inventItems.push({
                                            
                                    //        //FINFACTS ENTRY DATA
                                    //        invent_type: "PurchaseCredit",
                                    //        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    //        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    //        amount: free == "true" ? 0 : (parseFloat(item.buying_cost) * parseFloat(item.qty_tostock)),


                                    //        item_no: billItem.item_no,

                                    //        qty: parseFloat(billItem.ret_qty),
                                    //        cost: billItem.buying_cost,
                                    //        mrp: billItem.mrp,
                                    //        batch_no: billItem.batch_no,
                                    //        expiry_date: billItem.expiry_date,
                                    //        vendor_no: $$("ddlPOVendor").selectedValue(),
                                    //        //selling_price: item.selling_price,

                                    //        invent_type: "PurchaseReturn",
                                    //        key1: page.currentReturnBillNo,
                                    //        variation_name: billItem.variation_name,
                                    //        //qty_instock: item.qty_tostock

                                    //    });
                                    //});

                                    //TODO Tray entry is missing on return
                                    //Insert stock
                                    // page.inventoryService.insertInventoryItems(0, inventItems, function (data1) {
                                    page.stockAPI.insertAllStockVar(0, inventItems, function (data) {
                                       // $$("msgPanel").show("Return bill is successfully created and stock is updated...");
                                        //alert("Return bill is successfully created and stock is updated...");
                                        ShowDialogBox('Message', 'Return bill is successfully created and stock is updated...!', 'Ok', '', null);
                                        page.events.btnReturnPOItem_click();
                                        var round_off=(parseFloat(newBill.sub_total) - parseFloat(newBill.discount) + parseFloat(newBill.tax))
                                        var p_with_tax = (parseFloat(newBill.sub_total) - parseFloat(newBill.discount));//- parseFloat($$("lblRndOff").value());
                                        var data1 = {
                                            comp_id: CONTEXT.FINFACTS_COMPANY,
                                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                            description: "Purchase Order Return-" + page.currentPO.po_no,
                                            jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                            //target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                                            //amount: newBill.total,
                                            //pur_with_tax: parseFloat(newBill.total).toFixed(2),
                                            pur_with_out_tax: parseFloat(p_with_tax).toFixed(2),
                                            tax_amt: parseFloat(newBill.tax).toFixed(2),
                                            buying_cost: parseFloat(buying_cost).toFixed(2),
                                            round_off: parseFloat(Math.round(parseFloat(round_off)) - parseFloat(round_off)).toFixed(2),
                                            key_1: page.currentReturnBillNo,
                                            key_2: $$("ddlVendorNos").selectedValue()
                                            
                                        };
                                        if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {

                                            //page.finfactsService.insertCreditReturnPurchase(data1, function (response) {
                                            page.finfactsEntry.creditReturnPurchase(data1, function (response) {
                                            });
                                        }


                                  //  });

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
                    //alert(e);
                    ShowDialogBox('Message', e, 'Ok', '', null);
                }

            },
            //btnReturnPOItemPopup_click: function (overrideItems) {
            //    try {
            //        var itemlList=page.controls.grdReturnPOItems.allData();
            //        if(typeof overrideItems != "undefined")
            //            itemlList=overrideItems;

            //        var returnItems = [];
            //        var newBill = {
            //            po_no: page.currentPO.po_no,
            //            store_no: CONTEXT.store_no,
            //            reg_no: CONTEXT.reg_no,
            //            user_no: CONTEXT.user_no,

            //            sub_total: 0,
            //            total: 0,
            //            discount: 0,
            //            tax: 0,

            //            bill_type: "Return",
            //            vendor_no: page.controls.ddlPOVendor.selectedValue(),
            //            state_no: 300, //300 is Return


            //        };
            //        var flag = false;
            //        var stockItems = [];
            //        var lastItemNo = "";
            //        var lastItem = null;
            //        $(itemlList).each(function (i, item) {
            //            item.non_free_qty=parseFloat(item.qty) -  parseFloat(item.free_qty);
            //            item.non_free_qty_returned=parseFloat(item.qty_returned) -  parseFloat(item.free_qty_return);

            //            if (typeof overrideItems != "undefined")
            //                item.ret_qty= parseFloat(item.non_free_qty) -parseFloat(item.qty_returned);

            //            if (typeof overrideItems != "undefined")
            //                item.ret_free=  parseFloat(item.free_qty) -parseFloat(item.free_qty_return);

            //            //Set default value if empty
            //            if (item.ret_qty == null || item.ret_qty == "" || typeof item.ret_qty == "undefined") {
            //                item.ret_qty = 0;
            //            }

            //            //Set default value if empty
            //            if (item.ret_free == null || item.ret_free == "" || typeof item.ret_free == "undefined") {
            //                item.ret_free = 0;
            //            }

            //            //Validate number and non negative
            //            if (isNaN(item.ret_qty) || parseFloat(item.ret_qty) < 0) //If not a number or negative set flag=1
            //                throw "Quantity to return should be a number and non negative.";

            //            if (isNaN(item.ret_free) || parseFloat(item.ret_free) < 0) //If not a number or negative set flag=1
            //                throw "Free quantity to return should be a number and non negative.";

            //            if (parseFloat(item.ret_qty) > 0 || parseFloat(item.ret_free) > 0 ) {
            //                flag = true;

            //                if (parseFloat(item.qty) < (parseFloat(item.ret_qty) + parseFloat(item.qty_returned))) //If not a number or negative set flag=1
            //                    throw "Total return quantity cannot be greater than stocked quantity.";

            //                if (item.free_qty == undefined || item.free_qty == null || item.free_qty == "")
            //                    item.free_qty = 0;
            //                if (parseFloat(item.free_qty) < parseFloat(item.ret_free)+parseFloat(item.free_qty_return))
            //                    throw "Total return free qty cannot be grater then than free qty";
            //                //Add list for inventory transaction
            //                stockItems.push(item);



            //                //Add list for return bill with total item returned (when multiple mrp exists)
            //                if (lastItemNo != item.item_no) {
            //                    lastItem = item;
            //                    lastItem.fin_ret_qty = parseFloat(item.ret_qty);
            //                    lastItem.fin_ret_free = parseFloat(item.ret_free);
            //                    lastItem.fin_total_price = parseFloat(item.ret_qty) * parseFloat(item.item_price);
            //                    lastItem.sum_qty_returned=parseFloat(item.qty_returned) ;
            //                    returnItems.push(item);
            //                    lastItemNo = item.item_no;
            //                }
            //                else {
            //                    lastItem.fin_ret_qty = parseFloat(lastItem.fin_ret_qty) + parseFloat(item.ret_qty);
            //                    lastItem.fin_ret_free = parseFloat(lastItem.fin_ret_free) + parseFloat(item.ret_free);
            //                    lastItem.fin_total_price = parseFloat(lastItem.fin_ret_qty) * parseFloat(item.item_price);
            //                    lastItem.sum_qty_returned = lastItem.sum_qty_returned + parseFloat(item.qty_returned);
            //                }

            //                if (typeof overrideItems != "undefined") {
            //                    //For bill overriding. Return all item bill but Destock only stocked item
            //                    lastItem.fin_ret_qty = parseFloat(item.ordered_qty) - parseFloat(lastItem.sum_qty_returned);
            //                    lastItem.fin_ret_free = parseFloat(item.free_qty) - parseFloat(lastItem.free_qty_return);
            //                    lastItem.fin_total_price = parseFloat(item.fin_ret_qty) * parseFloat(item.item_price);
            //                    //Calculate bill total value
            //                    newBill.sub_total = newBill.sub_total + parseFloat(lastItem.fin_ret_qty) * parseFloat(item.item_price);
            //                    newBill.total = newBill.sub_total
            //                } else {
            //                    //Calculate bill total value
            //                    newBill.sub_total = newBill.sub_total + parseFloat(item.ret_qty) * parseFloat(item.item_price);
            //                    newBill.total = newBill.sub_total
            //                }

            //            }


            //        });
            //        if (flag == false)
            //            throw "No items cannot have returned qty";

            //        if (confirm("Are you return the item(s)") == true) {
            //            //Insert the Bill
            //            $$("msgPanel").show("Generating a return bill..");
            //            page.purchaseBillService.insertBill(newBill, function (data) {
            //                page.currentReturnBillNo = data[0].key_value;

            //                var rbillItems = [];
            //                $(returnItems).each(function (i, billItem) {
            //                    rbillItems.push({
            //                        bill_no: page.currentReturnBillNo,
            //                        item_no: billItem.item_no,
            //                        qty: billItem.fin_ret_qty,
            //                        price: billItem.item_price,
            //                        //tax_class_no: 0,
            //                        tax_per: 0,
            //                        disc_val: 0,
            //                        disc_per: 0,
            //                        total_price: billItem.fin_total_price,
            //                        free_qty:billItem.fin_ret_free,
            //                    });
            //                });
            //                //Insert bill items one by one
            //                page.purchaseBillService.insertAllBillItems(page.currentReturnBillNo, 0, rbillItems, function () {

            //                    var inventItems = [];
            //                    $(stockItems).each(function (i, billItem) {
            //                        inventItems.push({
            //                            item_no: billItem.item_no,
            //                            cost: billItem.item_price,
            //                            qty: parseFloat(billItem.ret_qty)+parseFloat(billItem.ret_free),
            //                            mrp: billItem.mrp,
            //                            batch_no: billItem.batch_no,
            //                            expiry_date: billItem.expiry_date,
            //                            vendor_no: $$("ddlPOVendor").selectedValue(),
            //                            //selling_price: item.selling_price,

            //                            invent_type: "PurchaseReturn",
            //                            key1: page.currentReturnBillNo,
            //                            //qty_instock: item.qty_tostock

            //                        });
            //                    });

            //                    //TODO Tray entry is missing on return
            //                    //Insert stock
            //                    page.inventoryService.insertInventoryItems(0, inventItems, function (data1) {
            //                        $$("msgPanel").show("Return bill is successfully created and stock is updated...");
            //                        alert("Return bill is successfully created and stock is updated...");

            //                        page.events.btnReturnPOItem_click();
            //                        var data1 = {
            //                            per_id: CONTEXT.PeriodId,
            //                            target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
            //                            amount: newBill.total,
            //                            key_1: page.currentReturnBillNo,
            //                            comp_id: CONTEXT.FINFACTS_COMPANY,
            //                            description: "Purchase Order Return-" + page.currentPO.po_no,
            //                            jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date())
            //                        };
            //                        if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {


            //                            page.finfactsService.insertCreditReturnPurchase(data1, function (response) {
            //                            });
            //                        }


            //                    });

            //                    page.purchaseBillService.getBillByPO(page.currentPO.po_no, function (data) {
            //                        page.controls.grdBillTransactions.dataBind(data);
            //                        $$("msgPanel").hide();
            //                        page.purchaseService.getPOItems(page.currentPO.po_no, function (data) {
            //                            page.view.selectedPOItems(data);
            //                            page.currentPOItem = $.util.clone(data);
            //                        });
            //                    });
            //                    page.view.purchaseHistory();
            //                    //Reload item grid with new data

            //                });
            //            });
            //        }

            //    } catch (e) {
            //       alert(e);
            //    }

            //},
            btnReceivePayment_click: function () {
                try {
                    if (parseFloat(page.controls.lblTotalAmtRemaining.value()) == parseFloat(page.controls.lblTotal.value()))
                        throw "Payment not yet started";

                    $$("txtReceivePayAmount").value('');
                    page.purchaseBillService.getReturnedActiveBillByNo(page.currentPO.po_no, function (data) {
                        $$("ddlReturnBillNo").dataBind(data, "bill_no", "bill_no", "select");
                    });

                    $$("ddlReturnBillNo").selectionChange(function () {
                        var data = {
                            po_no: page.currentPO.po_no,
                            bill_no: $$("ddlReturnBillNo").selectedValue()
                        };
                        page.purchaseBillService.getReturnedBillAmtByNo(data, function (data) {
                            $$("txtReceivePayAmount").value(data[0].total)
                        });
                    });
                    page.controls.pnlReceiveBillPayPopup.open();
                    page.controls.pnlReceiveBillPayPopup.title("Pay for your return order");
                    page.controls.pnlReceiveBillPayPopup.width(340);
                    page.controls.pnlReceiveBillPayPopup.height(400);
                    $$("dsReceiveBillPayDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));  // Load Current PO when click Pay
                    $$("txtReceivePayDesc").value("CurrentPO");
                } catch (e) {
                    $$("msgPanel").flash(e);
                }
            },
            btnReceiveBillPaySOOK_click: function () {
                try {
                    if ($$("ddlReturnBillNo").selectedValue() == -1) {
                        throw ("No Bill Is Selected");
                    }
                    if (confirm("Are you Pay the amount") == true) {

                        var billSO = {
                            bill_no: $$("ddlReturnBillNo").selectedValue(),
                            collector_id: page.controls.ddlReceiveCollectorName.selectedValue(),
                            pay_desc: page.controls.txtReceivePayDesc.value(),
                            amount: parseFloat(page.controls.txtReceivePayAmount.value()),
                            po_no: page.currentPO.po_no,
                            pay_date: page.controls.dsReceiveBillPayDate.getDate(),
                            pay_type: page.controls.ddlRetPayType.selectedValue()

                        };


                        var trans_type1 = "Return";
                        var data1 = {
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                            //amount: billSO.amount,
                            paid_amount: billSO.amount,
                            key_1: page.currentPO.po_no,
                            description: "Purchase Order Return-" + page.currentPO.po_no,
                            jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                            comp_id: CONTEXT.FINFACTS_COMPANY,
                        };
                        page.controls.pnlReceiveBillPayPopup.close();


                        if (isNaN(billSO.amount) || billSO.amount == 0)
                            throw ('Please Enter only digits greater than 0 for amount!');

                        if (!(billSO.collector_id != '' && billSO.amount != '' && billSO.pay_date != '' && billSO.pay_type != ''))
                            throw ('Please Enter Collector name, Amount, Pay date and pay type!');

                        $$("msgPanel").show('Updating payment details..');
                        page.purchaseService.payInvoiceBillSalesOrder(billSO, function (data) {
                            $$("msgPanel").show('Payment detail is saved successfully...!');
                            page.controls.txtReceivePayDesc.value('');
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
                } catch (e) { $$("msgPanel").flash(e); }

            },

            btnBack_click: function () {
                $$("pnlDetail").hide();
                $$("pnlSearch").show();
            },
            btnRemovePO_click: function () {
                try {
                    if (confirm("Are you sure want to delete the Purchase Order!")) {

                        page.purchaseService.deletePO(page.currentPO.po_no, function (data) {

                            $$("msgPanel").show("PO is succcessfully removed");
                            page.events.btnSearch_click();
                            page.controls.pnlContainerPage.hide();
                            page.view.UIState("Load");
                            $$("msgPanel").hide();
                        });

                    }

                } catch (e) {
                    $$("msgPanel").flash(e);
                }

            },
            btnCancelPO_click: function () {
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
            },


            btnSearch_click: function () {



                page.purchaseService.getPOs(page.view.searchInput(), $$("ddlState").selectedValue(), function (data) {
                    page.view.searchResult(data);
                });
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
            },


            btnInvoicePO_click: function () {
                page.controls.pnlInvoicePOPopup.open();
                page.controls.pnlInvoicePOPopup.title("Invoice");
                page.controls.pnlInvoicePOPopup.width(100);
                page.controls.pnlInvoicePOPopup.height(200);
            },
            btnPrintJasperBill_click: function () {
                var exp_type = $$("ddlExportType").selectedValue();
                if (exp_type == "" || exp_type == undefined || exp_type == null)
                    $$("msgPanel").show("Please select export type");
                page.printJasper(page.controls.lblPOBillNo.value(), exp_type);
            },
            btnPrintPO_click: function () {

                //  $$("pnlViewer").load(billNo, "Purchase");

                function PrintData(dataList) {

                    var r = window.open(null, "_blank");
                    var doc = r.document;



                    var totalAmount = 0;

                    $(page.controls.grdPOItems.allData()).each(function (i, data) {
                        totalAmount = parseFloat(totalAmount) + parseFloat(data.total_price);
                    });

                    var head = false;
                    doc.write("<h1 align='center'>" + CONTEXT.COMPANY_NAME + "</h1>");
                    //     doc.write("<html><style>.col{padding:5px}.hcol{padding:5px}</style><body>");
                    //     doc.write("<header align='center'> <h1>AVM Wholesale Dealer</h1></header>");
                    doc.write("<br><header align='center'> <h3>Purchase Order Receipt</h3></header>");

                    doc.write("<table style='width: 100%; ' cellpadding='0' cellspacing='0' border='1'>");
                    doc.write("<tr><td style='font-weight:bold'>PO NO</td><td>" + page.selectedPO.po_no + "</td></tr>");
                    doc.write("<tr><td style='font-weight:bold'>State</td><td>" + page.selectedPO.state_text + "</td></tr>");
                    doc.write("<tr><td style='font-weight:bold'>Ordered Date</td><td>" + page.selectedPO.ordered_date + "</td></tr>");
                    doc.write("<tr><td style='font-weight:bold'>Expected Date</td><td>" + page.selectedPO.expected_date + "</td></tr>");
                    doc.write("<tr><td style='font-weight:bold'>Delivered Date</td><td>" + page.selectedPO.delivered_date + "</td></tr>");
                    doc.write("<tr><td style='font-weight:bold'>Vendor No</td><td>" + page.controls.ddlPOVendor.selectedValue() + "</td></tr>");
                    doc.write("<tr><td style='font-weight:bold'>Vendor Name</td><td>" + $$("ddlPOVendor").selectedData().vendor_name + "</td></tr>");
                    doc.write("<tr><td style='font-weight:bold'>Vendor Address</td><td>" + $$("lblPOVendorAddress").html() + "</td></tr>");
                    doc.write("<tr><td style='font-weight:bold'>Vendor Mobile</td><td>" + $$("lblPOVendorPhone").html() + "</td></tr>");
                    doc.write("<tr><td style='font-weight:bold'>Vendor Email</td><td>" + $$("lblPOVendorEmail").html() + "</td></tr>");
                    doc.write("<tr><td style='font-weight:bold'>Invoice No</td><td>" + $$("txtInvoiceNo").value() + "</td></tr>");


                    doc.write("</table><br>");
                    doc.write("<table  style='width:100%;' cellpadding='0' cellspacing='0' border='1'>");
                    doc.write("<tr style='font-weight:bold;color: white; background-color:gray;'>");
                    doc.write("<th>Item No</th>");
                    doc.write("<th>Item Name</th>");
                    doc.write("<th>Unit</th>");
                    // doc.write("<th>PO No</th>");
                    // doc.write("<th>Ordered Date</th>");
                    doc.write("<th>Quantity</th>");
                    doc.write("<th>Return Qty</th>");
                    doc.write("<th>Tray Id</th>");
                    doc.write("<th>Cost</th>");
                    doc.write("<th>Sub Total</th></tr>");

                    $(dataList).each(function (i, data) {
                        if (head == false || head == true) {
                            doc.write("<tr><td>" + data.item_no + "</td>");
                            doc.write("<td>" + data.item_name + "</td>");
                            doc.write("<td>" + data.unit + "</td>");
                            // doc.write("<td>" + data.po_no + "</td>");
                            // doc.write("<td>" + data.ordered_date + "</td>");
                            doc.write("<td>" + data.qty + "</td>");
                            doc.write("<td>" + data.qty_returned + "</td>");
                            doc.write("<td>" + data.tray_id + "</td>");
                            doc.write("<td>" + data.cost + "</td>");
                            doc.write("<td>" + data.total_price + "</td></tr>");
                            /*   for (var prop in data) {
                                   if (prop == "cost") {
                                       prop = "Cost";
                                   } else if (prop == "ordered_date") {
                                       prop = "Ordered Date";
   
                                   } else if (prop == "qty") {
                                       prop = "Quantity";
   
                                   } else if (prop == "item_name") {
                                       prop = "Item Name";
   
                                   } else if (prop == "qty_stock") {
                                       prop = "In Stock";
   
                                   } else if (prop == "po_no") {
                                       prop = "PO No";
   
                                   } else if (prop == "item_no") {
                                       prop = "Item No";
   
                                   } else if (prop == "invoice_no") {
                                       prop = "Invoice No";
   
                                   } else if (prop == "total_price") {
                                       prop = "Total Price";
   
                                   }
   
                                   doc.write("<td class='col'>" + prop + "</td>");
                               } */
                            doc.write("</tr>");
                            head = true;
                        }
                        doc.write("<tr>");
                        for (var prop in data) {
                            //     doc.write("<td  class='col'>" + data[prop] + "</td>");
                        }
                        doc.write("</tr>");
                    });
                    doc.write("</table>");

                    doc.write("</table> <div align='right'><br><br><b>Total Amount: </b>" + totalAmount + " </div> ");
                    doc.write(" <div align='right'><br><br><b>Total Discount: </b>" + page.controls.lblTotalDiscounts.value() + " </div> ");
                    doc.write(" <div align='right'><br><br><b>Total Tax: </b>" + page.controls.lblTotalTax.value() + " </div> ");
                    doc.write(" <div align='right'><br><br><b>Total Paid: </b>" + page.controls.lblTotalAmtPaid.html() + " </div> ");
                    doc.write(" <div align='right'><br><br><b>Total Return: </b>" + page.controls.lblReturns.html() + " </div> ");
                    doc.write("<div align='right'><br><br><b>Total Return Paid: </b>" + page.controls.lblReturnsPaid.value() + " </div> <br><br><div align='right'><h3> Authorized Signature</h3></div>");


                    doc.write("<footer> <h2 align='center'>" + CONTEXT.ClientAddress + "</h2></footer><div align='center'><p>&copy; 2017 <a href='http://www.wototech.com'>www.wototech.com</a><p></div></body></html>");

                    doc.close();
                    r.focus();
                    r.print();

                }

                //pharma print
                //if (CONTEXT.ENABLE_MARKET_SHOPON == "true")
                //    PrintData(page.controls.grdPOItems.getAllRows());
                //else {
                //    page.purchaseBillService.getBillPrintPO(page.controls.lblPOBillNo.value(), function (data) {
                //        PrintingOD(data);
                //    });
                //}
                page.controls.pnlInvoicePOPopup.close();

                page.controls.pnlPrintingPopup.open();
                page.controls.pnlPrintingPopup.title("Select Export Type");
                page.controls.pnlPrintingPopup.width("500");
                page.controls.pnlPrintingPopup.height("200");
            },
            btnSendsms_click: function () {
                if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                    page.controls.pnlInvoicePOPopup.close();
                    var purchasedetails = page.selectedPO;

                    var accountInfo =
                    {
                        "appName": CONTEXT.COMPANY_NAME,

                        "senderNumber": "+91" + CONTEXT.poSMSNo,
                        //"+917338898011",
                        //"919486342575",
                        //("txtSenderNumber").val(),
                        "message": //"Hai",
                            "Dear " + $$("ddlPOVendor").selectedData().vendor_name + "," + "\n" +
                            "Your Purchase Order No is " + purchasedetails.po_no + " ,\n" +
                            "Your Total Amount is Rs. " + page.controls.lblTotal.value() + "\n" +
                            "Regards as " + CONTEXT.COMPANY_NAME + "",
                        "receiverNumber": purchasedetails.vendor_phone,
                        // "+918098453314",
                        // $$("lblPOVendorPhone").html(),
                        //"919003300929",
                        //$$("txtReceiverNumber").val(),
                        //"mobileNumber":
                        //"9486342575",
                        //"7338898011",
                    };

                    var accountInfoJson = JSON.stringify(accountInfo);

                    $.ajax({
                        type: "POST",
                        //url: "http://104.251.218.116:8080/woto-utility-rest/rest/sendSMS/text-message",
                        url: CONTEXT.SMSURL,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        crossDomain: false,
                        data: JSON.stringify(accountInfo),
                        dataType: 'json',
                        success: function (responseData, status, xhr) {
                            console.log(responseData);

                            $$("msgPanel").flash("SMS sent successfully...");
                        },
                        error: function (request, status, error) {
                            console.log(request.responseText);

                            $$("msgPanel").show("SMS sent failed...");
                        }
                    });
                } else {
                    //alert("Sorry!.. your settings block sending messages");
                    ShowDialogBox('Message', 'Sorry!.. your settings block sending messages...!', 'Ok', '', null);
                }
            },
            btnSendMail_click: function () {
                if (CONTEXT.ENABLE_EMAIL == "true") {
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
                        "companyId": CONTEXT.FINFACTS_COMPANY,
                        "orderedDate": purchasedetails.ordered_date,
                        //$$("lblPOOrderedDate").html(),
                        //new Date(page.selectedPO.ordered_date),
                        "deliveredDate": purchasedetails.delivered_date,
                        //$$("lblPODeliveredDate").html(),
                        //new Date(page.selectedPO.expected_date),
                        "expectedDate": purchasedetails.expected_date,
                        //new Date(page.selectedPO.delivered_date),
                        "purchaseOrderNo": purchasedetails.po_no,
                        "purchaseOrderStatus": purchasedetails.state_text,
                        "shippingAddress": $$("lblPOVendorAddress").html(),
                        "deliveryAddress": $$("lblPOVendorAddress").html(),
                        "clientAddress": CONTEXT.ClientAddress,
                        "vendorNumber": purchasedetails.vendor_no,
                        "vendorName": $$("ddlPOVendor").selectedData().vendor_name,
                        "tax": page.controls.lblTotalTax.value(),
                        "subTotal": page.controls.lblTotal.value(),
                        "discount": page.controls.lblTotalDiscounts.value(),
                        "totalPaid": purchasedetails.total_paid_amount,
                        "emailAddressList": [purchasedetails.vendor_email],
                        //[$$("lblPOVendorEmail").html()],
                        //["sam.info85@gmail.com"],
                        //["immanuvel.kalaiarasan@gmail.com"],
                        //["balumanoj85@gmail.com"],
                        //["sundaralingam48@gmail.com","wototech@outlook.com","balumanoj85@gmail.com"],
                        "billItemList": itemLists,
                        /*[{"itemNo":"1",
                        "itemName":"Chocolate Cookies",
                        "qty":"10",
                        "unit":"Kilogram",
                        "price":"23.00",
                        "discount":"2",
                        "totalPrice":"230"}]*/
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

                    // });

                    //});

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
                                    item_name: item.item_name,
                                    qty: item.reorder_qty,
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
                                    po_no: page.selectedPO.po_no
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
                page.controls.pnlViewer.width(850);
                page.controls.pnlViewer.height(400);
                page.controls.ucbillViewer.load(bill);
            },
            page_init: function () { },
            page_load: function () {
                page.sales_tax_no = CONTEXT.DEFAULT_SALES_TAX;
                page.itemService.getItemsAutoComplete("%",page.sales_tax_no, function (data) {
                    $(data).each(function (i, item) {
                        // item.label = item.label + " <span style='margin:right:30px'><span> [MRP:" + item.price + "] <span style='margin:right:30px'><span> " + item.mrp

                    });
                    page.productList = data;
                });
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
                    return "<a>" + item.item_name + "_" + item.item_no + "<span style='margin:right:30px'>  <span style='margin:right:30px'><span> </a>";
                }
                page.controls.txtItemSearch.dataBind({
                    getData: function (term, callback) {
                        //page.itemService.getItemAutoComplete(term, page.sales_tax_no, callback);
                        callback(page.productList);
                    }
                });
                page.controls.txtItemSearch.select(function (item) {
                    if (item != null) {
                        if (typeof item.item_no != "undefined") {

                            var newitem = {
                                po_no: page.selectedPO.po_no,
                                item_no: item.item_no,
                                item_name: item.item_name,
                                unit: item.unit,
                                qty: 1,
                                temp_qty: 1,
                                qty_type: item.qty_type,
                                tray_id: item.tray_no,
                                tax_class_no:item.tax_class_no,

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
                                state_text:"Created"
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
                //$$("txtPOSearch").enterKey(function () {
                //    page.events.btnSearch_click();
                //})

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
                        if (lastItem == null || lastItem.item_no != item.item_no) {
                            bill_item.push({
                                "BillItemNo": s_no,
                                "ProductName": item.item_name,	// nonstandard unquoted field name
                                "Pack": item.packing,	// nonstandard single-quoted field name
                                "Mfr": item.man_name,
                                "Batch": item.batch_no,	// standard double-quoted field name
                                "Exp": item.expiry_date,
                                "Qty": item.qty,
                                "FreeQty": item.free_qty,
                                "Rate": parseFloat(item.price).toFixed(2),
                                "PDis": parseFloat(item.discount).toFixed(2),
                                "MRP": parseFloat(item.mrp).toFixed(2),
                                "CGST": (parseFloat(item.tax_per) / 2).toFixed(2),
                                "SGST": (parseFloat(item.tax_per) / 2).toFixed(2),
                                "GValue": parseFloat(item.total_price).toFixed(2),
                                "TotalPrice": parseFloat(item.total_price).toFixed(2),
                            });
                            lastItem = item;
                        }
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
                                    "SuppAddress": CONTEXT.COMPANY_ADDRESS,
                                    "SuppCityStreetZipCode": "",
                                    "DLNo": CONTEXT.COMPANY_DL_NO,
                                    "GST": CONTEXT.COMPANY_GST_NO,
                                    "TIN": CONTEXT.COMPANY_TIN_NO,
                                    "BillNo": data.bill_no,
                                    "BillDate": data.bill_date,
                                    "NoofItems": data.no_of_items,
                                    "Quantity": data.no_of_qty,
                                    "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                                    "DiscountAmount": parseFloat(data.tot_discount).toFixed(2),
                                    "BCGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                    "BSGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                    "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(2),
                                    "BillAmount": parseFloat(data.total).toFixed(2),
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
                                    "RoundAmount": parseFloat(data.round_off).toFixed(2),
                                    "BillItem": bill_item
                                };
                    if (page.PrintBillType == "Return") {
                        accountInfo.BillName = "PURCHASE RETURN BILL";
                    }
                    else {
                        accountInfo.BillName = "PURCHASE BILL";
                    }

                    //GeneratePrint("ShopOnDev", "ShopOnPOS1.jrxml", accountInfo, exp_type);
                   // if (parseFloat(data.tot_returned) > 0)
                   //     GeneratePrint("ShopOnDev", "ShopOnPOR1.jrxml", accountInfo, exp_type);
                   //else
                    GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-bill.jrxml", accountInfo, exp_type);
                    //GeneratePrint("ShopOnDev", "POS.jrxml", accountInfo, exp_type);
                    //GeneratePrint("ShopOnDev", "Wood.jrxml", accountInfo, "PDF");
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
                    page.purchaseService.getPOs("", $$("ddlState").selectedValue(), function (data) {
                        if ($$("ddlState").selectedValue() == -1)
                            page.view.searchResult(data);
                        else
                            $(data).each(function (i, items) {
                                if (items.state_no == $$("ddlState").selectedValue())
                                    page.controls.grdPOResult.createRow(items);
                            });
                    })
                });

                page.purchaseService.getPOs(page.view.searchInput(), -1, function (data) {
                    page.view.searchResult(data);
                });

                $$("txtReceivePayAmount").disable(true);
                $$("ddlPOVendor").disable(true);

                // $$("ddlVendorNos").selectionChange(function () {
                //     var data = {
                //        po_no: page.controls.lblPONo.html(),
                //         vendor_no: $$("ddlVendorNos").selectedValue()
                //     }
                // page.purchaseService.update(page.view.searchInput(), -1, function (data) {
                //      page.view.searchResult(data);
                //  });
                // });

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
                    item_no: page.controls.grdPOItems.selectedData()[0].item_no,
                    cost: $$("ddlAddInventCost").selectedValue(),
                    vendor_no: $$("ddlAddInventVendor").selectedValue(),
                    mrp: $$("txtAddMrp").value(),
                    expiry_date: $$("dsAddExpiryDate").getDate(),
                    batch_no: $$("txtAddBatchNo").value(),
                    variation_name: $$("txtNewVariation").value(),
                    active: 1,
                    man_date: $$("dsAddManufactureDate").getDate(),
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
                                page.inventoryService.insertStockVariation(vari_data, function (data) {
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

            //btnInvoiceMatchedPO_click: function () {
            //    // save the item grid without use save button
            //    var count = 0;
            //    $(page.controls.grdPOItems.allData()).each(function (i, item) {
            //        if (item.addStock == null || item.expiry_date == null || item.batch_no == null)
            //            count++;
            //        if (parseFloat(item.qty) < parseFloat(item.addStock))
            //            count++;
            //    });
            //    if (count == 0)
            //        page.savePurchaseOrder(function () {

            //            page.purchaseService.invoiceMatchedPO(page.currentPO.po_no, function (data2) {
            //                page.purchaseService.getPOByNo(page.currentPO.po_no, function (data) {
            //                    var row = page.controls.grdPOResult.selectedRows()[0];
            //                    page.currentPO.state_no = 905;
            //                    page.currentPO.state_text = "Invoice Matched";
            //                    page.controls.grdPOResult.updateRow(row.attr("row_id"), data[0])
            //                    page.calculate();
            //                    $$("msgPanel").show("Order Saved successfully!");
            //                   
            //                    row.click();

            //                });

            //            });


            //        });
            //    else
            //        alert("To Stock, Expiry Date, Batch_no is Mantatory or Add Stock is greater than Qty");


            //},



            //btnPartialDeliveredPO_click: function () {
            //    page.purchaseService.deliverPartialPO(page.currentPO.po_no, function (data2) {

            //        page.purchaseService.getPOByNo(page.currentPO.po_no, function (data) {
            //            var row = page.controls.grdPOResult.selectedRows()[0];
            //            page.currentPO.state_no = 850;
            //            page.currentPO.state_text = "Partial Delivered";
            //            page.controls.grdPOResult.updateRow(row.attr("row_id"), data[0])
            //            row.click();
            //        });
            //    });

            //},

            //btnAddItemToPO_click: function () {
            //    //window.location.reload();
            //    //page.controls.pnlItemSelectionPopup.Clear();
            //    //page.controls.grdItemSelected.dataBind([]);
            //    page.controls.pnlItemSelectionPopup.open();

            //    page.controls.pnlItemSelectionPopup.title("Item Selection");
            //    page.controls.pnlItemSelectionPopup.width(800);
            //    page.controls.pnlItemSelectionPopup.height(400);

            //    page.controls.pnlItemSelection.select = function (data) {
            //        $(data).each(function (i, item) {
            //            //if (item.price != null) {

            //            var newItem = {
            //                item_no: item.item_no,
            //                item_name: item.item_name,
            //                qty: 1,
            //                qty_stock: 0,
            //                stock: item.qty_stock,
            //                cost: 0,
            //                unit: item.unit,
            //                tray_id: item.tray_id,
            //                tray_count: 1,
            //                total_price: 0,
            //                po_no: page.view.selectedPO().po_no
            //            };

            //            if (!exists(page.controls.grdPOItems.allData(), "item_no", item.item_no)) {
            //               
            //                page.controls.grdPOItems.createRow(newItem);
            //                $$("msgPanel").show("Item added successfully!");
            //               

            //                page.calculate();
            //            }


            //        });
            //        page.controls.grdPOItems.edit(true);

            //        $$("pnlItemSelectionPopup").close();

            //    };
            //    page.controls.pnlItemSelection.load();
            //    //page.controls.pnlItemSelectionPopup.close();

            //},
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