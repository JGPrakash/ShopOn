$.fn.gstReport = function () {
    return $.pageController.getPage(this, function (page, $$) {
        page.userAPI = new UserAPI();
        page.taxclassAPI = new TaxClassAPI();
        page.salesexecutiveAPI = new SalesExecutiveAPI();
        page.storeAPI = new StoreAPI();
        page.stockAPI = new StockAPI();
        page.invoiceService = new InvoiceService();
        page.customerAPI = new CustomerAPI();
        page.gstAPI = new GSTAPI();
        page.billAPI = new BillAPI();
        document.title = "ShopOn - GST Report";
        page.gstrb2csreport = function (callback) {
            var filter = {
                start_record: 0,
                end_record: 20,
                //filter_expression: filter_express + " and sales_tax_no is not null and (bill_type='Sale' or bill_type='SaleReturn' or bill_type='SaleCredit' or bill_type='SaleDebit')",
                filter_expression: " tax_class_no is not null and tax_class_no <> -1 ",
                sort_expression: ""
            };
            page.gstAPI.getGSTb2cs(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
                    if (callback != undefined && data.length >0)
                        callback(data);
            });
        }
        page.b2clprintjson = function () {
            var details = [];
            var details1 = [];
            var tax = 0;
            var total = 0;
            var invoice_count = 0, last_invoice_no, total_cess_value = 0;
            page.events.btnb2bprint_click(function (invoice) {
                var gstData = {
                    "gstin": CONTEXT.COMPANY_GST_NO,
                    "fp": $("#start").val().split("-")[1] + "" + $("#start").val().split("-")[0],
                    "gt": 0,
                    "cur_gt": 0,
                    "version": "GST2.2.1",
                    "hash": "hash",
                    "b2cl": []
                }
                if (invoice.length > 0) {
                    $(invoice).each(function (i, item) {
                        gstData.b2cl.push({
                            "inum": item.invoice_no,
                            "idt": item.invoice_date,
                            "val": item.invoice_value,
                            "pos": "33",
                            "rt": parseFloat(item.rate).toFixed(2),
                            "txval": parseFloat(item.tax_value).toFixed(2),
                            "csamt": parseFloat(item.cess_amount).toFixed(2),
                        });
                    });
                    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gstData));
                    var dlAnchorElem = document.getElementById('downloadJson');
                    dlAnchorElem.setAttribute("href", dataStr);
                    dlAnchorElem.setAttribute("download", "b2cl.json");
                    dlAnchorElem.click();
                    //GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "GST-Report/main-b2cl-report.jrxml", accountInfo1, "EXCEL", function (responseData) {
                    //    $$("msgPanel").hide();
                    //});
                }
            });
        }
        page.b2clprintexcel = function () {
            var details = [];
            var details1 = [];
            var tax = 0;
            var total = 0;
            var invoice_count = 0, last_invoice_no,total_cess_value = 0;
            //var invoice = $$("grdGenerate").selectedData();
            page.events.btnb2bprint_click(function (invoice) {
                if (invoice.length > 0) {
                    $(invoice).each(function (i, item) {
                        tax = parseFloat(item.tax_value) + parseFloat(tax);
                        total_cess_value = parseFloat(item.cess_amount.replace(",", "")) + parseFloat(total_cess_value);
                        details1.push({
                            "Invoice Number": item.invoice_no,
                            "Invoice date": item.invoice_date,
                            "Invoice Value": item.invoice_value,
                            "Place Of Supply": item.party_address,
                            "Rate": item.rate,
                            "Taxable Value": item.tax_value,
                            "Cess Amount": item.cess_amount,
                            "E-Commerce GSTIN": "",//"24AABCR0091C1ZZ",
                        });
                        if (last_invoice_no != item.invoice_no) {
                            invoice_count++;
                            total = parseFloat(total) + parseFloat(item.invoice_value);
                        }
                        last_invoice_no = item.invoice_no;
                    });
                    var accountInfo1 = {
                        "CompName": CONTEXT.COMPANY_NAME.toUpperCase(),
                        "ReportName": "GSTR B2C Report",
                        "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                        "No of Invoices": invoice_count,
                        "Total Invoice Value": (total).toString(),
                        "Total Taxable Value": (tax).toString(),
                        "Total Cess": total_cess_value.toFixed(2),
                        "Details": details1,
                    }
                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "GST-Report/main-b2cl-report.jrxml", accountInfo1, "EXCEL", function (responseData) {
                        $$("msgPanel").hide();
                    });
                }
            });
        }
        //page.b2bprintjson = function () {
        //    var details = [];
        //    var details1 = [];
        //    var itm_det = [];
        //    var itms = [];
        //    var inv = [];
        //    var b2b = [];
        //    var tax = 0;
        //    var total = 0;
        //    var tax_period;
        //    var current_date = moment(new Date()).format('MM-DD-YYYY hh:mm:ss');
        //    var date = new Date();
        //    var y = date.getFullYear();
        //    var m = date.getMonth();
        //    var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
        //    var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
        //    var month1 = parseFloat(month) + parseFloat(1);
        //    if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
        //        var month2 = parseFloat(month) + parseFloat(2);
        //        var month3 = parseFloat(month) + parseFloat(3);
        //        //var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "')";
        //        var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "')";
        //    }
        //    if ($$("ddlViewMode").selectedData().view_name == "Monthly") {
        //        //var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month;
        //        var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month;
        //    }
        //    if ($$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard CDN") {
        //        var filter_type = " and tax_class_no!=-1 and (invoice_type='SalesCredit' or invoice_type='SalesDebit')";
        //    }
        //    if ($$("ddlGSTR1Type").selectedData().gst_name == "B2B") {
        //        //var filter_type = " and tax_class_no!=-1 and (invoice_type='Sale' or invoice_type='SaleReturn')";
        //        var filter_type = " and tax_class_no!=-1 and (invoice_type='Sale' or invoice_type='SaleReturn')";
        //    }
        //    if ($$("ddlGSTR1Type").selectedData().gst_name == "B2CL") {
        //        //var filter_type = " and tax_class_no!=-1 and (invoice_type='Sale' or invoice_type='SaleReturn')";
        //        var filter_type = " and tax_class_no!=-1 and (invoice_type='Sale' or invoice_type='SaleReturn') and invoice_value>=250000";
        //    }
        //    if ($$("ddlGSTR1Type").selectedData().gst_name == "B2CS") {
        //        //var filter_type = " and tax_class_no!=-1 and (invoice_type='Sale' or invoice_type='SaleReturn')";
        //        var filter_type = " and tax_class_no!=-1 and (invoice_type='Sale' or invoice_type='SaleReturn') and invoice_value<=250000";
        //    }
        //    var filter = {
        //        start_record: "",
        //        end_record: "",
        //        //filter_expression: filter_express + " and sales_tax_no is not null and (bill_type='Sale' or bill_type='SaleReturn' or bill_type='SaleCredit' or bill_type='SaleDebit')",
        //        //filter_expression: filter_express + " and tax_class_no!=-1 and (invoice_type='Sale' or invoice_type='SaleReturn' or invoice_type='SalesCredit' or invoice_type='SalesDebit')",
        //        filter_expression: filter_express + filter_type,
        //        sort_expression: ""
        //    };
        //    $$("msgPanel").show("Loading...");
        //    //page.invoiceService.searchInvoice(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
        //    page.gstAPI.getGSTb2b(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data_item) {
        //        page.data_bulk = data_item.length;
        //        if (data_item.length > 0) {
        //            $(data_item).each(function (i, item) {
        //                inv.push({
        //                    "inum": item.invoice_no,
        //                    "idt": item.invoice_date,
        //                    "val": item.invoice_value,
        //                    "pos": "33",
        //                    "rchrg": "N",
        //                    "inv_typ": "R",
        //                })
        //                page.btnLoadBundleData(itm_det, itms, inv, item.invoice_no, function (inv) {
        //                    b2b.push({
        //                        "ctin": "33AACPI8502P1ZM", //gst no
        //                        "inv": inv
        //                    })
        //                    if (parseInt(page.data_bulk) == parseInt(i) + parseInt(1)) {
        //                        var accountInfo = {
        //                            "b2b": b2b
        //                        };
        //                        var fileName = "gst-report-b2b.json";
        //                        saveData(accountInfo, fileName);
        //                    }
        //                })
        //            })
        //        }
        //    });
        //}
        page.b2bprintjson = function () {
            var details = [];
            var details1 = [];
            var tax = 0;
            var total = 0;
            var cess_amt = 0;
            var tax_period;
            var bill_count = 0, last_bill_no = "";
            var gst_count = 0, last_gst_no = "";
            var invoice_value = 0;
            var gstData = {
                "gstin": CONTEXT.COMPANY_GST_NO,
                "fp": $("#start").val().split("-")[1] + "" + $("#start").val().split("-")[0],
                "gt": 0,
                "cur_gt": 0,
                "version": "GST2.2.1",
                "hash": "hash",
                "b2b": []
            }
            page.events.btnb2bprint_click(function (invoice) {
                var last_tax_class_no, last_bill_no, last_gst_no, tax_class_count = 0;;
                if (invoice.length > 0) {
                    $(invoice).each(function (i, items) {
                        if (items.gst_no != last_gst_no) {
                            var curCtin = {
                                "ctin": items.gst_no,
                                "inv": []
                            };
                            last_gst_no = items.gst_no;
                        }
                        if (items.invoice_no != last_bill_no) {
                            if (typeof curCtin == "undefined") {
                                var lastInvoice = {
                                    "inum": items.invoice_no,
                                    "idt": items.invoice_date,
                                    "val": items.invoice_value,
                                    "pos": "33",
                                    "rchrg": "N",
                                    "inv_typ": "R",
                                    "itms": []
                                };
                                var item_data = {
                                    "num": 1801,
                                    "itm_det":[]
                                }
                                lastInvoice.itms.push(item_data);
                                gstData.b2b[gstData.b2b.length - 1].inv.push(lastInvoice);
                            }
                            else {
                                var lastInvoice = {
                                    "inum": items.invoice_no,
                                    "idt": items.invoice_date,
                                    "val": items.invoice_value,
                                    "pos": "33",
                                    "rchrg": "N",
                                    "inv_typ": "R",
                                    "itms": []
                                };
                                var item_data = {
                                    "num": 1801,
                                    "itm_det": []
                                }
                                lastInvoice.itms.push(item_data);
                                curCtin.inv.push(lastInvoice);
                            }
                            last_bill_no = items.invoice_no;
                        }
                        if (items.invoice_no == last_bill_no && items.tax_class_no != last_tax_class_no) {
                            if (typeof curCtin == "undefined") {
                                var lastItem = {
                                    "txval": items.tax_value,
                                    "rt": items.rate,
                                    "camt": items.cgst_amount,
                                    "samt": items.sgst_amount,
                                    "csamt": items.cess_amount
                                }
                                gstData.b2b[gstData.b2b.length - 1].inv[gstData.b2b[gstData.b2b.length - 1].inv.length - 1].itms[gstData.b2b[gstData.b2b.length - 1].inv[gstData.b2b[gstData.b2b.length - 1].inv.length - 1].itms.length - 1].itm_det.push(lastItem);
                            }
                            else {
                                var lastItem = {
                                    "txval": items.tax_value,
                                    "rt": items.rate,
                                    "camt": items.cgst_amount,
                                    "samt": items.sgst_amount,
                                    "csamt": items.cess_amount
                                }
                                curCtin.inv[curCtin.inv.length - 1].itms[curCtin.inv[curCtin.inv.length - 1].itms.length - 1].itm_det.push(lastItem);
                            }
                            last_tax_class_no = items.tax_class_no;
                        }
                        else {
                            if (typeof curCtin == "undefined") {
                                var lastItem = {
                                    "txval": items.tax_value,
                                    "rt": items.rate,
                                    "camt": items.cgst_amount,
                                    "samt": items.sgst_amount,
                                    "csamt": items.cess_amount
                                }
                                gstData.b2b[gstData.b2b.length - 1].inv[gstData.b2b[gstData.b2b.length - 1].inv.length - 1].itms[gstData.b2b[gstData.b2b.length - 1].inv[gstData.b2b[gstData.b2b.length - 1].inv.length - 1].itms.length - 1].itm_det.push(lastItem);
                            }
                            else {
                                var lastItem = {
                                    "txval": items.tax_value,
                                    "rt": items.rate,
                                    "camt": items.cgst_amount,
                                    "samt": items.sgst_amount,
                                    "csamt": items.cess_amount
                                }
                                curCtin.inv[curCtin.inv.length - 1].itms[curCtin.inv[curCtin.inv.length - 1].itms.length - 1].itm_det.push(lastItem);
                            }
                            last_tax_class_no = items.tax_class_no;
                        }
                        if (typeof curCtin != "undefined")
                            gstData.b2b.push(curCtin);
                    });
                    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gstData));
                    var dlAnchorElem = document.getElementById('downloadJson');
                    dlAnchorElem.setAttribute("href", dataStr);
                    dlAnchorElem.setAttribute("download", "b2b.json");
                    dlAnchorElem.click();
                    //GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "GST-Report/main-b2b-report.jrxml", accountInfo, "EXCEL", function (responseData) {
                    //    $$("msgPanel").hide();
                    //});
                } else {
                    $$("msgPanel").show("No data found...!");
                }
            });
        }
        page.b2bprintexcel = function () {
            var details = [];
            var details1 = [];
            var tax = 0;
            var total = 0;
            var cess_amt = 0;
            var tax_period;
            var bill_count = 0, last_bill_no = "";
            var gst_count = 0, last_gst_no = "";
            var invoice_value = 0;
            page.events.btnb2bprint_click(function (invoice) {
                tax_period = "";
                if (invoice.length > 0) {
                    $(invoice).each(function (i, item) {
                        tax = parseFloat(item.tax_value) + parseFloat(tax);
                        total = parseFloat(item.invoice_value) + parseFloat(total);
                        cess_amt = parseFloat(item.cess_amount) + parseFloat(cess_amt);
                        if ((item.tax_period).substring(5, 8) == "01") {
                            tax_period = 1;
                        }
                        if ((item.tax_period).substring(5, 8) == "04") {
                            tax_period = 2;
                        }
                        if ((item.tax_period).substring(5, 8) == "08") {
                            tax_period = 3;
                        }
                        if ((item.tax_period).substring(5, 8) == "12") {
                            tax_period = 4;
                        }
                        details.push({
                            "GSTIN/UIN of Recipient": item.gst_no,
                            "Invoice Number": item.invoice_no,
                            "Invoice date": item.invoice_date,
                            "Invoice Value": item.invoice_value,
                            "Place Of Supply": item.party_address,
                            "Reverse Charge": "N",
                            "Invoice Type": "Regular",
                            "E-Commerce GSTIN": "",
                            "Rate": item.rate,
                            "Taxable Value": item.tax_value,
                            "Cess Amount": item.cess_amount,
                        });
                        if (last_bill_no != item.invoice_no) {
                            bill_count++;
                            invoice_value = parseFloat(invoice_value) + parseFloat(item.invoice_value);
                        }
                        last_bill_no = item.invoice_no;
                        if (last_gst_no != item.gst_no)
                            gst_count++;
                        last_gst_no = item.gst_no;
                    });
                    var accountInfo = {
                        "CompName": CONTEXT.COMPANY_NAME.toUpperCase(),
                        "ReportName": "GSTR B2B Report",
                        "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                        "No of Recipients": gst_count,
                        "No of Invoices": bill_count,
                        "Total Invoice Value": invoice_value,
                        "Total Taxable Value": parseFloat(tax).toFixed(2),
                        "Total Cess": parseFloat(cess_amt).toFixed(2),
                        "Details": details,
                    };
                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "GST-Report/main-b2b-report.jrxml", accountInfo, "EXCEL", function (responseData) {
                        $$("msgPanel").hide();
                    });
                } else {
                    $$("msgPanel").show("No data found...!");
                }
            });
        }
        page.b2csprintjson = function () {
            var details = [];
            var details1 = [];
            var tax = 0;
            var total = 0;
            var cess_amt = 0;
            var tax_period;
            page.events.btnb2bprint_click(function (invoice) {
                var gstData = {
                    "gstin": CONTEXT.COMPANY_GST_NO,
                    "fp": $("#start").val().split("-")[1] + "" + $("#start").val().split("-")[0],
                    "gt": 0,
                    "cur_gt": 0,
                    "version": "GST2.2.1",
                    "hash": "hash",
                    "b2cs": []
                }
                if (invoice.length > 0) {
                    $(invoice).each(function (i, item) {
                        gstData.b2cs.push({
                            "sply_ty": "INTRA",
                            "rt": item.rate,
                            "typ": "OE",
                            "pos": "33",
                            "txval": parseFloat(item.tax_value).toFixed(2),
                            "camt": parseFloat(item.cgst_amount).toFixed(2),
                            "samt": parseFloat(item.sgst_amount).toFixed(2),
                            "csamt": parseFloat(item.cess_amount).toFixed(2)
                        });
                    });
                    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gstData));
                    var dlAnchorElem = document.getElementById('downloadJson');
                    dlAnchorElem.setAttribute("href", dataStr);
                    dlAnchorElem.setAttribute("download", "b2cs.json");
                    dlAnchorElem.click();
                }
            });
        }
        page.b2csprintexcel = function () {
            var details = [];
            var details1 = [];
            var tax = 0;
            var total = 0;
            var cess_amt = 0;
            var tax_period;
            page.events.btnb2bprint_click(function (invoice) {
                tax_period = "";
                if (invoice.length > 0) {
                    $(invoice).each(function (i, item) {
                        tax = parseFloat(item.tax_value) + parseFloat(tax);
                        total = parseFloat(item.invoice_value) + parseFloat(total);
                        cess_amt = parseFloat(item.cess_amount) + parseFloat(cess_amt);
                        if ((item.tax_period).substring(5, 8) == "01") {
                            tax_period = 1;
                        }
                        if ((item.tax_period).substring(5, 8) == "04") {
                            tax_period = 2;
                        }
                        if ((item.tax_period).substring(5, 8) == "08") {
                            tax_period = 3;
                        }
                        if ((item.tax_period).substring(5, 8) == "12") {
                            tax_period = 4;
                        }
                        details.push({
                            "GSTIN/UIN of Recipient": item.gst_no,
                            "Invoice Number": item.invoice_no,
                            "Invoice date": item.invoice_date,
                            "Invoice Value": item.invoice_value,
                            "Place Of Supply": item.party_address,
                            "Reverse Charge": "N",
                            "Invoice Type": "Regular",
                            "E-Commerce GSTIN": "",//24AABCR0091C1ZZ
                            "Rate": item.rate,
                            "Taxable Value": item.tax_value,
                            "Cess Amount": item.cess_amount,
                            "Type":"OE"
                        });
                    });
                    var accountInfo = {
                        "CompName": CONTEXT.COMPANY_NAME.toUpperCase(),
                        "ReportName": "GSTR B2B Report",
                        "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                        "No of Recipients": invoice.length,
                        "No of Invoices": invoice.length,
                        "Total Invoice Value": total,
                        "Total Taxable Value": tax,
                        "Total Cess": cess_amt,
                        "Details": details,
                    };
                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "GST-Report/main-b2cs-report.jrxml", accountInfo, "EXCEL", function (responseData) {
                        $$("msgPanel").hide();
                    });
                } else {
                    $$("msgPanel").show("No data found...!");
                }
            });
        }
        page.hsnprintjson = function () {
            var current_date = moment(new Date()).format('MM-DD-YYYY hh:mm:ss');
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth();
            var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
            var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
            var month1 = parseFloat(month) + parseFloat(1);
            if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                var month2 = parseFloat(month) + parseFloat(2);
                var month3 = parseFloat(month) + parseFloat(3);
                var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "') and bt.comp_id = " + localStorage.getItem("user_company_id");
            }
            if ($$("ddlViewMode").selectedData().view_name == "Monthly") {
                var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month + " and bt.comp_id = " + localStorage.getItem("user_company_id");
            }
            var tax_period = "tax_period like '" + $("#start").val() + "'";
            if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                tax_period = "";
                for (var i = 0; i < 3; i++) {
                    var per_month = (parseFloat(month) + parseFloat(i)).toString();
                    per_month = (per_month.length == 1) ? "0" + per_month : per_month;
                    if (i > 0)
                        tax_period = tax_period + " or tax_period like '" + year + "-" + per_month + "'";
                    else
                        tax_period = tax_period + "tax_period like '" + year + "-" + per_month + "'";
                }
            }
            page.gstAPI.getGSTR1HSN("", "", filter_express + " and tct.tax_class_no <> -1 and (bill_type='Sale') and (" + tax_period + ") and tct.hsn_code is not null", "hsn_code", function (invoice) {
                var tot_sales = 0, tot_tax = 0, tot_taxable = 0;
                var gstData = {
                    "gstin": CONTEXT.COMPANY_GST_NO,
                    "fp": $("#start").val().split("-")[1] + "" + $("#start").val().split("-")[0],
                    "gt": 0,
                    "cur_gt": 0,
                    "version": "GST2.2.1",
                    "hash": "hash"
                }
                var data = [];
                if (invoice.length > 0) {
                    gstData.hsn = [];
                    $(invoice).each(function (i, item) {
                        data.push({
                            "num": i+1,
                            "hsn_sc": item.hsn_code,
                            "desc": item.item_name,
                            "uqc": item.unit,
                            "qty": item.tot_qty,
                            "val": item.total_price,
                            "txval": item.tax_value,
                            "iamt": item.igst,
                            "samt": item.sgst,
                            "camt": item.cgst,
                            "csamt": item.cess_amount
                        });
                    });
                    gstData.hsn.push(data);
                    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gstData));
                    var dlAnchorElem = document.getElementById('downloadJson');
                    dlAnchorElem.setAttribute("href", dataStr);
                    dlAnchorElem.setAttribute("download", "hsn.json");
                    dlAnchorElem.click();
                }
            });
        }
        page.hsnprintexcel = function () {
            var details = [];
            var details1 = [];
            var current_date = moment(new Date()).format('MM-DD-YYYY hh:mm:ss');
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth();
            var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
            var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
            var month1 = parseFloat(month) + parseFloat(1);
            if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                var month2 = parseFloat(month) + parseFloat(2);
                var month3 = parseFloat(month) + parseFloat(3);
                //var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "')";
                var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "') and bt.comp_id = " + localStorage.getItem("user_company_id");
            }
            if ($$("ddlViewMode").selectedData().view_name == "Monthly") {
                //var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month;
                var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month + " and bt.comp_id = " + localStorage.getItem("user_company_id");
            }
            var tax_period = "tax_period like '" + $("#start").val() + "'";
            if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                tax_period = "";
                for (var i = 0; i < 3; i++) {
                    var per_month = (parseFloat(month) + parseFloat(i)).toString();
                    per_month = (per_month.length == 1) ? "0" + per_month : per_month;
                    if (i > 0)
                        tax_period = tax_period + " or tax_period like '" + year + "-" + per_month + "'";
                    else
                        tax_period = tax_period + "tax_period like '" + year + "-" + per_month + "'";
                }
            }
            page.gstAPI.getGSTR1HSN("", "", filter_express + " and tct.tax_class_no <> -1 and (bill_type='Sale') and ("+tax_period+") and tct.hsn_code is not null", "hsn_code", function (invoice) {
                var no_of_hsn = 0,tot_values = 0, tot_tax_value = 0, tot_igst = 0, tot_cgst = 0, tot_sgst = 0, tot_cess = 0;
                if (invoice.length > 0) {
                    var last_no_of_hsn;
                    $(invoice).each(function (i, item) {
                        if (last_no_of_hsn != item.hsn_code)
                            no_of_hsn++;
                        else {
                            item.hsn_code = ""
                        }
                        tot_values = parseFloat(item.total_price) + parseFloat(tot_values);
                        tot_tax_value = parseFloat(item.tax_value) + parseFloat(tot_tax_value);
                        tot_igst = parseFloat(item.igst) + parseFloat(tot_igst);
                        tot_cgst = parseFloat(item.cgst) + parseFloat(tot_cgst);
                        tot_sgst = parseFloat(item.sgst) + parseFloat(tot_sgst);
                        tot_cess = parseFloat(item.cess_amount) + parseFloat(tot_cess);
                        details.push({
                            "HSN Code": item.hsn_code,
                            "Description": item.item_name,
                            "UQC": item.unit,
                            "Total Qty": item.tot_qty,
                            "Total Value": item.total_price,
                            "Taxable Value": item.tax_value,
                            "IGST": item.igst,
                            "CGST": item.cgst,
                            "SGST": item.sgst,
                            "Cess": item.cess_amount,
                        });
                    });
                    var accountInfo = {
                        "CompName": CONTEXT.COMPANY_NAME.toUpperCase(),
                        "ReportName": "Summary For HSN(2)",
                        "No of HSN": no_of_hsn,
                        "Total Value": tot_values,
                        "Total Taxable Value": tot_tax_value,
                        "Total Integrated Tax": tot_igst,
                        "Total Central Tax": tot_cgst,
                        "Total State Tax": tot_sgst,
                        "Total Cess": tot_cess,
                        "Details": details,
                    };
                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "GST-Report/main-hsn-report.jrxml", accountInfo, "EXCEL", function (responseData) {
                        $$("msgPanel").hide();
                    });
                }
                else {
                    $$("msgPanel").show("No data found...!");
                }
            });
        }
        page.docsprintjson = function () {
            var current_date = moment(new Date()).format('MM-DD-YYYY hh:mm:ss');
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth();
            var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
            var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
            var month1 = parseFloat(month) + parseFloat(1);
            if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                var month2 = parseFloat(month) + parseFloat(2);
                var month3 = parseFloat(month) + parseFloat(3);
                //var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "')";
                var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "') and comp_id = " + localStorage.getItem("user_company_id");
            }
            if ($$("ddlViewMode").selectedData().view_name == "Monthly") {
                //var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month;
                var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month + " and comp_id = " + localStorage.getItem("user_company_id");
            }
            page.billAPI.searchValues("", "", filter_express, "bill_no asc", function (invoice) {
                var tot_bills = 0, tot_sales_bill = 0, tot_return_bill = 0;
                var gstData = {
                    "gstin": CONTEXT.COMPANY_GST_NO,
                    "fp": $("#start").val().split("-")[1] + "" + $("#start").val().split("-")[0],
                    "gt": 0,
                    "cur_gt": 0,
                    "version": "GST2.2.1",
                    "hash": "hash"
                }
                if (invoice.length > 0) {
                    gstData.doc_issue = {};
                    gstData.doc_issue.doc_det = [];
                }
                var obj = {
                    "doc_num": 1,
                    "doc_typ": "Invoices for outward supply",
                    "docs": []
                }
                var item_data = {
                    "num": 1,
                    "from": invoice[0].bill_code,
                    "to": invoice[invoice.length - 1].bill_code,
                    "totnum": 0,
                    "cancel": 0,
                    "net_issue": 0
                }
                $(invoice).each(function (i, item) {
                    if (item.bill_type == "Sale")
                        tot_sales_bill++;
                    if (item.bill_type == "SaleReturn")
                        tot_return_bill++;
                    if (item.bill_type == "Sale" || item.bill_type == "SaleReturn")
                        tot_bills++;
                });
                item_data.totnum = tot_sales_bill;
                item_data.cancel = tot_return_bill;
                item_data.net_issue = parseInt(tot_sales_bill) - parseInt(tot_return_bill);
                obj.docs.push(item_data);
                gstData.doc_issue.doc_det.push(obj);
                var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gstData));
                var dlAnchorElem = document.getElementById('downloadJson');
                dlAnchorElem.setAttribute("href", dataStr);
                dlAnchorElem.setAttribute("download", "docs.json");
                dlAnchorElem.click();
            });
        }
        page.docsprintexcel = function () {
            var current_date = moment(new Date()).format('MM-DD-YYYY hh:mm:ss');
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth();
            var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
            var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
            var month1 = parseFloat(month) + parseFloat(1);
            if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                var month2 = parseFloat(month) + parseFloat(2);
                var month3 = parseFloat(month) + parseFloat(3);
                var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "') and comp_id = " + localStorage.getItem("user_company_id");
            }
            if ($$("ddlViewMode").selectedData().view_name == "Monthly") {
                var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month + " and comp_id = " + localStorage.getItem("user_company_id");
            }
            page.billAPI.searchValues("", "", filter_express, "bill_no asc", function (invoice) {
                var tot_bills = 0, tot_sales_bill = 0, tot_return_bill = 0, details = [];
                if (invoice.length > 0) {
                    var last_no_of_hsn;
                    $(invoice).each(function (i, item) {
                        if (item.bill_type == "Sale")
                            tot_sales_bill++;
                        if (item.bill_type == "SaleReturn")
                            tot_return_bill++;
                        if (item.bill_type == "Sale" || item.bill_type == "SaleReturn")
                            tot_bills++;
                    });
                    details.push({
                        "Nature Of Document": "Invoices for outward supply",
                        "Sr No From": invoice[0].bill_code,
                        "Sr No To": invoice[invoice.length - 1].bill_code,
                        "Total Number": tot_sales_bill,
                        "Cancelled": tot_return_bill,
                    });
                    details.push({
                        "Nature Of Document": "Debit Note",
                        "Sr No From": "",
                        "Sr No To": "",
                        "Total Number": "",
                        "Cancelled": "",
                    });
                    details.push({
                        "Nature Of Document": "Delivery Challan for job work",
                        "Sr No From": "",
                        "Sr No To": "",
                        "Total Number": "",
                        "Cancelled": "",
                    });
                    details.push({
                        "Nature Of Document": "Invoices for inward supply from unregistered person",
                        "Sr No From": "",
                        "Sr No To": "",
                        "Total Number": "",
                        "Cancelled": "",
                    });
                    details.push({
                        "Nature Of Document": "Refund Voucher",
                        "Sr No From": "",
                        "Sr No To": "",
                        "Total Number": "",
                        "Cancelled": "",
                    });
                    var accountInfo = {
                        "CompName": CONTEXT.COMPANY_NAME.toUpperCase(),
                        "ReportName": "Summary of document issued during the tax period",
                        "Total Number": tot_sales_bill,
                        "Total Cancelled": tot_return_bill,
                        "Details": details,
                    };
                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "GST-Report/main-doc-report.jrxml", accountInfo, "EXCEL", function (responseData) {
                        $$("msgPanel").hide();
                    });
                }
                else {
                    $$("msgPanel").show("No data found...!");
                }
            });
        }
        var saveData = (function () {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            return function (data, fileName) {
                var json = JSON.stringify(data),
                    blob = new Blob([json], { type: "octet/stream" }),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
                $$("msgPanel").hide();
            };
        }());
        page.btnLoadBundleData= function (itm_det, itms, inv, invoice_no, callback) {
            var current_date = moment(new Date()).format('MM-DD-YYYY hh:mm:ss');
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth();
            var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
            var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
            var month1 = parseFloat(month) + parseFloat(1);
            if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                var month2 = parseFloat(month) + parseFloat(2);
                var month3 = parseFloat(month) + parseFloat(3);
                //var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "')";
                var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "') and comp_id = " + localStorage.getItem("user_company_id");
            }
            if ($$("ddlViewMode").selectedData().view_name == "Monthly") {
                //var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month;
                var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month + " and comp_id = " + localStorage.getItem("user_company_id");
            }
            if (page.gst_type == "b2b") {
                var filter_type = " and tax_class_no <> -1 and (invoice_type='Sale' or invoice_type='SaleReturn')";
            }
            if (page.gst_type == "b2cs") {
                var filter_type = " and tax_class_no <> -1 and (invoice_type='Sale' or invoice_type='SaleReturn') and invoice_value<=250000";
            }
            if (page.gst_type == "b2cl") {
                var filter_type = " and tax_class_no <> -1 and (invoice_type='Sale' or invoice_type='SaleReturn') and invoice_value>250000";
            }
            var billno = " and invoice_no IN (" + invoice_no + ")";
            var filter = {
                start_record: "",
                end_record: "",
                //filter_expression: filter_express + " and sales_tax_no is not null and (bill_type='Sale' or bill_type='SaleReturn' or bill_type='SaleCredit' or bill_type='SaleDebit')",
                //filter_expression: filter_express + " and tax_class_no!=-1 and (invoice_type='SalesCredit' or invoice_type='SalesDebit')" + billno,
                filter_expression: filter_express + filter_type + billno,
                sort_expression: ""
            };
            page.gstAPI.getGSTR1Sales(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (invoice) {
                if (invoice.length > 0) {
                    $(invoice).each(function (j, item) {
                        itm_det.push({
                            "txval": item.rate,//tax_value
                            "rt": item.rate,//tax per
                            "camt": item.cgst_amount,//gst val central
                            "samt": item.sgst_amount,//gst val state
                            "csamt": 0//cess amt
                        })
                        if (parseInt(invoice.length) == parseInt(j) + parseInt(1)) {
                            itms.push({
                                "num": 1801,
                                "itm_det": itm_det
                            })
                            inv.push({
                                "itms": itms
                            })
                            if(callback!=undefined){
                                //callback(itm_det, itms, inv);
                                callback(inv);
                            }
                        }
                    })
                }
            });
        };
        page.loadGrid = function (callback) {
            $$("grdGenerate").hide();
            $$("grdGenerateB2B").hide();
            $$("pnlSummaryMode").hide();
            $$("lblTotalBills").html(0);
            $$("lblTotalBillAmount").html(0);
            $$("lblTotalTaxableAmount").html(0);
            if ($$("ddlGSTType").selectedData().gst_name == "GSTR1" && ($$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard" || $$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard CDN" || $$("ddlGSTR1Type").selectedData().gst_name == "Purchase Standard" || $$("ddlGSTR1Type").selectedData().gst_name == "Purchase Standard CDN")) {
                $$("grdGenerate").height("1000px");
                $$("grdGenerate").width("100%");
                $$("grdGenerate").setTemplate({
                    selection: "Single", paging: true, pageSize: 50, selection: "Multiple",
                    columns: [
                        { 'name': "Customer GST", 'width': "130px", 'dataField': "gst_no" },
                        { 'name': "Bill No", 'width': "100px", 'dataField': "invoice_no" },
                        { 'name': "Cust Name", 'width': "170px", 'dataField': "cust_name" },
                        { 'name': "Bill Type", 'width': "100px", 'dataField': "invoice_type" },
                        { 'name': "Bill Date", 'width': "100px", 'dataField': "invoice_date" },
                        { 'name': "Total", 'width': "120px", 'dataField': "invoice_value" },
                        { 'name': "Place of Supply", 'width': "150px", 'dataField': "party_address" },
                        //{ 'name': "Rate", 'width': "70px", 'dataField': "rate" },
                        { 'name': "Taxable Value", 'width': "130px", 'dataField': "tax_value" },
                        //{ 'name': "Paid", 'width': "100px", 'dataField': "paid" },
                        //{ 'name': "Balance", 'width': "100px", 'dataField': "balance" },
                        { 'name': "Tax Period", 'width': "120px", 'dataField': "tax_period" },
                        { 'name': "Tax Classify", 'width': "120px", 'dataField': "tax_classify" },
                        { 'name': "", 'width': "100px", 'dataField': "bill_no", editable: false, itemTemplate: "<div  id='prdHoldDetail' class='col-xs-12 col-sm-12 col-md-12 col-lg-12' style=''></div>" }
                    ]
                });
                if (callback != undefined) {
                    $$("grdGenerate").show();
                    $$("grdGenerateB2B").hide();
                    callback();
                }
            }
            else {
                if ($$("ddlGSTType").selectedData().gst_name == "GSTR1" && ($$("ddlGSTR1Type").selectedData().gst_name == "B2B" || $$("ddlGSTR1Type").selectedData().gst_name == "B2CL" || $$("ddlGSTR1Type").selectedData().gst_name == "B2CS" || $$("ddlGSTR1Type").selectedData().gst_name == "HSN" || $$("ddlGSTR1Type").selectedData().gst_name == "DocIssue")) {
                    $$("grdGenerateB2B").height("500px");
                    $$("grdGenerateB2B").width("100%");
                    $$("grdGenerateB2B").setTemplate({
                        selection: "Single", paging: true, pageSize: 50,
                        columns: [
                            { 'name': "Customer GST", 'width': "130px", 'dataField': "gst_no", visible: $$("ddlGSTR1Type").selectedData().gst_name == "B2B" },
                            { 'name': "Bill No", 'width': "100px", 'dataField': "invoice_no" },
                            { 'name': "Cust Name", 'width': "170px", 'dataField': "cust_name" },
                            { 'name': "Bill Type", 'width': "100px", 'dataField': "invoice_type" },
                            { 'name': "Bill Date", 'width': "100px", 'dataField': "invoice_date" },
                            { 'name': "Total", 'width': "120px", 'dataField': "invoice_value" },
                            { 'name': "Place of Supply", 'width': "150px", 'dataField': "party_address" },
                            //{ 'name': "Rate", 'width': "70px", 'dataField': "rate" },
                            { 'name': "Taxable Value", 'width': "130px", 'dataField': "tax_value" },
                            //{ 'name': "Paid", 'width': "100px", 'dataField': "paid" },
                            //{ 'name': "Balance", 'width': "100px", 'dataField': "balance" },
                            { 'name': "Tax Period", 'width': "120px", 'dataField': "tax_period", editable: true },
                            { 'name': "Tax Classify", 'width': "120px", 'dataField': "tax_classify" },
                            { 'name': "", 'width': "100px", 'dataField': "bill_no", editable: false, itemTemplate: "<div  id='prdHoldDetail1' class='col-xs-12 col-sm-12 col-md-12 col-lg-12' style=''></div>" }
                        ]
                    });
                    if (callback != undefined) {
                        $$("grdGenerate").hide();
                        $$("grdGenerateB2B").show();
                        $$("btnSave").show();
                        //$$("pnlSummaryMode").show();
                        callback();
                    }
                }
            }
            page.controls.grdGenerate.rowCommand = function (action, actionElement, rowId, row, rowData) {
                //page.controls.grdGenerate.rowCommand = function (action, actionElement, rowId, row, rowData) {
                if (action == "Remove") {
                    if (row.length == 0) {
                        $$("msgPanel").show("Select the invoice...!");
                    }
                    else {
                        var invoice = rowData;
                        $(invoice).each(function (i, item) {
                            var data = {
                                bill_no: item.invoice_no,
                                tax_period: "",
                            }
                            if ($$("ddlGSTType").selectedData().gst_name == "GSTR1" && ($$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard" || $$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard CDN")) {
                                page.gstAPI.updateBill(data, function (data1) {
                                    $$("msgPanel").show("Bill updated successfully...!");
                                    if (data1.length > 0) {
                                        $$("msgPanel").hide();
                                        page.events.btnGenerate_click();
                                    }
                                });
                            }
                            else if ($$("ddlGSTType").selectedData().gst_name == "GSTR1" && ($$("ddlGSTR1Type").selectedData().gst_name == "Purchase Standard" || $$("ddlGSTR1Type").selectedData().gst_name == "Purchase Standard CDN")) {
                                page.gstAPI.updatepurchaseBill(data, function (data1) {
                                    $$("msgPanel").show("Bill updated successfully...!");
                                    if (data1.length > 0) {
                                        $$("msgPanel").hide();
                                        page.events.btnGenerate_click();
                                    }
                                });
                            }
                        });
                    }
                }
            }
            page.controls.grdGenerate.beforeRowBound = function (row, item) {

            }
            $$("grdGenerate").rowBound = function (row, item) {
                if (item.tax_period != null && item.tax_period != "" && item.tax_period != undefined && $$("ddlGSTType").selectedData().gst_name == "GSTR1" && ($$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard" || $$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard CDN" || $$("ddlGSTR1Type").selectedData().gst_name == "Purchase Standard" || $$("ddlGSTR1Type").selectedData().gst_name == "Purchase Standard CDN")) {
                    var htmlTemplate = [];
                    htmlTemplate.push("<input type='button' title='Remove'  class='buttonSecondary' value='Remove' action='Remove' style='/*border: none;background-color: transparent;background-image: url(BackgroundImage/Open_file.png);background-size: contain;*/width: 70px;/*height: 25px;margin-right:10px*/' />");
                    $(row).find("[id=prdHoldDetail]").html(htmlTemplate.join(""));
                    //$('.grid_select_chk').click(0, 0)
                    //$('.grid_select_chk').attr('checked', '')
                    //$('.grid_select_chk').prop('checked', 'true')
                    //$('.grid_select_chk').prop('disable', 'false')
                }
            }
            $$("grdGenerate").selectionChanged = function (row, rowId) {

            }
            page.controls.grdGenerateB2B.rowCommand = function (action, actionElement, rowId, row, rowData) {
                //page.controls.grdGenerate.rowCommand = function (action, actionElement, rowId, row, rowData) {
                if (action == "Remove") {
                    if (row.length == 0) {
                        $$("msgPanel").show("Select the invoice...!");
                    }
                    else {
                        var invoice = rowData;
                        $(invoice).each(function (i, item) {
                            var data = {
                                bill_no: item.invoice_no,
                                tax_period: "",
                            }
                            if ($$("ddlGSTType").selectedData().gst_name == "GSTR1" && ($$("ddlGSTR1Type").selectedData().gst_name == "B2B" || $$("ddlGSTR1Type").selectedData().gst_name == "B2CL" || $$("ddlGSTR1Type").selectedData().gst_name == "B2CS")) {
                                page.gstAPI.updateBill(data, function (data1) {
                                    $$("msgPanel").show("Bill updated successfully...!");
                                    if (data1.length > 0) {
                                        $$("msgPanel").hide();
                                        page.events.btnGenerate_click();
                                    }
                                });
                            }
                        });
                    }
                }
            }
            page.controls.grdGenerateB2B.beforeRowBound = function (row, item) {

            }
            $$("grdGenerateB2B").rowBound = function (row, item) {
                if (item.tax_period != null && item.tax_period != "" && item.tax_period != undefined && $$("ddlGSTType").selectedData().gst_name == "GSTR1") {
                    var htmlTemplate = [];
                    htmlTemplate.push("<input type='button' title='Remove'  class='buttonSecondary' value='Remove' action='Remove' style='/*border: none;background-color: transparent;background-image: url(BackgroundImage/Open_file.png);background-size: contain;*/width: 70px;/*height: 25px;margin-right:10px*/' />");
                    $(row).find("[id=prdHoldDetail1]").html(htmlTemplate.join(""));
                    //$('.grid_select_chk').click(0, 0)
                    //$('.grid_select_chk').attr('checked', '')
                    //$('.grid_select_chk').prop('checked', 'true')
                    //$('.grid_select_chk').prop('disable', 'false')
                }
            }
            $$("grdGenerateB2B").selectionChanged = function (row, rowId) {

            }
        }
        page.events = {
            btnGenerate_click: function () {
                page.loadGrid(function () {
                    $$("pnlSummaryMode").show();
                    if ($$("ddlGSTType").selectedData().gst_name == "GSTR1" && ($$("ddlGSTR1Type").selectedData().gst_name == "B2B" || $$("ddlGSTR1Type").selectedData().gst_name == "B2CL" || $$("ddlGSTR1Type").selectedData().gst_name == "B2CS") || $$("ddlGSTR1Type").selectedData().gst_name == "HSN" || $$("ddlGSTR1Type").selectedData().gst_name == "DocIssue") {
                        $$("btnSave").hide();
                        $$("btnSaveB2B").show();
                        //$$("pnlSummaryMode").hide();
                        if ($$("ddlViewMode").selectedData().view_name == "Three Months" && ($("#start").val().split("-")[1] != "01" && $("#start").val().split("-")[1] != "04" && $("#start").val().split("-")[1] != "07" && $("#start").val().split("-")[1] != "10")) {
                            $$("msgPanel").show("Please select the Jan, Apr, Jul, Oct Month");
                        }
                        else {
                            var current_date = moment(new Date()).format('MM-DD-YYYY hh:mm:ss');
                            var date = new Date();
                            var y = date.getFullYear();
                            var m = date.getMonth();
                            var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
                            var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
                            var month1 = parseFloat(month) + parseFloat(1);
                            if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                                var month2 = parseFloat(month) + parseFloat(2);
                                var month3 = parseFloat(month) + parseFloat(3);
                                var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "') and comp_id = " + localStorage.getItem("user_company_id");
                            }
                            if ($$("ddlViewMode").selectedData().view_name == "Monthly") {
                                var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month +  " and comp_id = " + localStorage.getItem("user_company_id");
                            }
                            if ($$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard CDN") {
                                var filter_type = " and tax_class_no <> -1 and (bill_type='SalesCredit' or invoice_type='SalesDebit')";
                            }
                            if ($$("ddlGSTR1Type").selectedData().gst_name == "B2B") {
                                //var filter_type = " and tax_class_no!=-1 and (invoice_type='Sale' or invoice_type='SaleReturn') and (gst_no is not null) and (gst_no <> '')";
                                var filter_type = " and (bill_type='Sale' or bill_type='SaleReturn') and (gst_no is not null) and (gst_no <> '')";
                            }
                            if ($$("ddlGSTR1Type").selectedData().gst_name == "B2CL" ) {
                                var filter_type = "  and (bill_type='Sale' or bill_type='SaleReturn') and total>250000  and (gst_no is null or gst_no = '')";
                            }
                            if ($$("ddlGSTR1Type").selectedData().gst_name == "B2CS") {
                                var filter_type = "  and (bill_type='Sale' or bill_type='SaleReturn') and total<=250000 and (gst_no is null or gst_no = '')";
                            }
                            if ($$("ddlGSTR1Type").selectedData().gst_name == "HSN" || $$("ddlGSTR1Type").selectedData().gst_name == "DocIssue") {
                                var filter_type = "  and (bill_type='Sale' or bill_type='SaleReturn')";
                            }
                            var filter = {
                                start_record: "",
                                end_record: "",
                                filter_expression: filter_express + filter_type + "and tax_classify like '" + $$("ddlGSTR1Type").selectedData().gst_name + "'",
                                sort_expression: ""
                            };
                            $$("msgPanel").show("Loading...");
                            page.gstAPI.getGSTb2b(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
                                $$("grdGenerate").dataBind(data);
                                $$("grdGenerateB2B").dataBind(data);
                                $$("grdGenerateB2B").edit(true);
                                $$("msgPanel").hide();
                                page.setSummary(data);
                            });
                        }
                    }
                    else if ($$("ddlGSTType").selectedData().gst_name == "GSTR1" && ($$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard" || $$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard CDN")) {
                        $$("btnSave").show();
                        $$("btnSaveB2B").hide();
                        //$$("pnlSummaryMode").show();
                        //if ($$("ddlViewMode").selectedData().view_name == "Three Months" && ($("#start").val().split("-")[1] != "01" || $("#start").val().split("-")[1] != "04" || $("#start").val().split("-")[1] != "07" || $("#start").val().split("-")[1] != "10")) {
                        if ($$("ddlViewMode").selectedData().view_name == "Three Months" && ($("#start").val().split("-")[1] != "01" && $("#start").val().split("-")[1] != "04" && $("#start").val().split("-")[1] != "07" && $("#start").val().split("-")[1] != "10")){
                            $$("msgPanel").show("Please select the Jan, Apr, Jul, Oct Month");
                        }
                        else{
                        var current_date = moment(new Date()).format('MM-DD-YYYY hh:mm:ss');
                        var date = new Date();
                        var y = date.getFullYear();
                        var m = date.getMonth();
                        var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
                        var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
                        var month1 = parseFloat(month) + parseFloat(1);
                        if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                            var month2 = parseFloat(month) + parseFloat(2);
                            var month3 = parseFloat(month) + parseFloat(3);
                            //var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "')";
                            var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "') and comp_id = " + localStorage.getItem("user_company_id");
                        }
                        if ($$("ddlViewMode").selectedData().view_name == "Monthly") {
                            //var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month;
                            var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month + " and comp_id = " + localStorage.getItem("user_company_id");
                        }
                        if ($$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard CDN") {
                            var filter_type = " and tax_class_no <> -1 and (invoice_type='SalesCredit' or invoice_type='SalesDebit')";
                        }
                        if ($$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard") {
                            var filter_type = " and tax_class_no <> -1 and (invoice_type='Sale' or invoice_type='SaleReturn')";
                        }
                        //var filter = {
                        //    start_record: "",
                        //    end_record: "",
                        //    //filter_expression: filter_express + " and sales_tax_no is not null and (bill_type='Sale' or bill_type='SaleReturn' or bill_type='SaleCredit' or bill_type='SaleDebit')",
                        //    //filter_expression: filter_express + " and tax_class_no!=-1 and (invoice_type='Sale' or invoice_type='SaleReturn' or invoice_type='SalesCredit' or invoice_type='SalesDebit')",
                        //    filter_expression: filter_express + filter_type,
                        //    sort_expression: ""
                        //};
                        //$$("msgPanel").show("Loading...");
                        //page.invoiceService.searchInvoice(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
                        //page.gstAPI.getGSTb2b(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
                        //    //$$("grdGenerate").dataBind(data);
                        //    $$("msgPanel").hide();
                        //});
                        $$("grdGenerate").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                //page.billAPI.searchValues("", "", "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                //    var totalRecord = data.length;
                                //    page.billAPI.searchValues("", "", "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                //        callback(data, totalRecord);
                                //    });
                                //});
                                var filter = {
                                    start_record: 0,
                                    end_record: 20,
                                    //filter_expression: filter_express + " and sales_tax_no is not null and (bill_type='Sale' or bill_type='SaleReturn' or bill_type='SaleCredit' or bill_type='SaleDebit')",
                                    //filter_expression: filter_express + " and tax_class_no!=-1 and (invoice_type='Sale' or invoice_type='SaleReturn' or invoice_type='SaleCredit' or invoice_type='SaleDebit')",
                                    filter_expression: filter_express + filter_type + "and tax_classify is not null",
                                    sort_expression: ""
                                };
                                $$("msgPanel").show("Loading...");
                                    page.gstAPI.getGSTb2b(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
                                    //page.invoiceService.searchInvoice(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
                                        //$$("grdGenerate").dataBind(data);
                                        var totalRecord = data.length;
                                    page.gstAPI.getGSTb2b(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
                                    //page.invoiceService.searchInvoice(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
                                        callback(data, totalRecord);
                                        $$("msgPanel").hide();
                                        page.setSummary(data);
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
                    }
                    }
                    else if ($$("ddlGSTType").selectedData().gst_name == "GSTR1" && ($$("ddlGSTR1Type").selectedData().gst_name == "Purchase Standard" || $$("ddlGSTR1Type").selectedData().gst_name == "Purchase Standard CDN")) {
                        $$("btnSave").show();
                        $$("btnSaveB2B").hide();
                        //$$("pnlSummaryMode").show();
                        if ($$("ddlViewMode").selectedData().view_name == "Three Months" && ($("#start").val().split("-")[1] != "01" && $("#start").val().split("-")[1] != "04" && $("#start").val().split("-")[1] != "07" && $("#start").val().split("-")[1] != "10")) {
                            $$("msgPanel").show("Please select the Jan, Apr, Jul, Oct Month");
                        }
                        else {
                            var current_date = moment(new Date()).format('MM-DD-YYYY hh:mm:ss');
                            var date = new Date();
                            var y = date.getFullYear();
                            var m = date.getMonth();
                            var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
                            var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
                            var month1 = parseFloat(month) + parseFloat(1);
                            if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                                var month2 = parseFloat(month) + parseFloat(2);
                                var month3 = parseFloat(month) + parseFloat(3);
                                //var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "')";
                                var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "') and comp_id = " + localStorage.getItem("user_company_id");
                            }
                            if ($$("ddlViewMode").selectedData().view_name == "Monthly") {
                                //var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month;
                                var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month + " and comp_id = " + localStorage.getItem("user_company_id");
                            }
                            if ($$("ddlGSTR1Type").selectedData().gst_name == "Purchase Standard CDN") {
                                var filter_type = " and tax_class_no <> -1 and (invoice_type='PurchaseCredit' or invoice_type='PurchaseDebit')";
                            }
                            if ($$("ddlGSTR1Type").selectedData().gst_name == "Purchase Standard") {
                                var filter_type = " and tax_class_no <> -1 and (invoice_type='Purchase' or invoice_type='PurchaseReturn')";
                            }
                            var filter = {
                                start_record: "",
                                end_record: "",
                                //filter_expression: filter_express + " and sales_tax_no is not null and (bill_type='Sale' or bill_type='SaleReturn' or bill_type='SaleCredit' or bill_type='SaleDebit')",
                                //filter_expression: filter_express + " and tax_class_no!=-1 and (invoice_type='Sale' or invoice_type='SaleReturn' or invoice_type='SaleCredit' or invoice_type='SaleDebit')",
                                filter_expression: filter_express + filter_type + "and tax_classify is not null",
                                sort_expression: ""
                            };
                            $$("msgPanel").show("Loading...");
                            //page.invoiceService.searchInvoice(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
                            page.gstAPI.getGSTb2b(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
                                //$$("grdGenerate").dataBind(data);
                                $$("msgPanel").hide();
                            });
                            $$("grdGenerate").dataBind({
                                getData: function (start, end, sortExpression, filterExpression, callback) {
                                    //page.billAPI.searchValues("", "", "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                    //    var totalRecord = data.length;
                                    //    page.billAPI.searchValues("", "", "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                    //        callback(data, totalRecord);
                                    //    });
                                    //});
                                    var filter = {
                                        start_record: "",
                                        end_record: "",
                                        //filter_expression: filter_express + " and sales_tax_no is not null and (bill_type='Sale' or bill_type='SaleReturn' or bill_type='SaleCredit' or bill_type='SaleDebit')",
                                        filter_expression: filter_express + filter_type,
                                        //filter_expression: filter_express + " and tax_class_no!=-1 and (invoice_type='Purchase' or invoice_type='PurchaseReturn' or invoice_type='PurchaseCredit' or invoice_type='PurchaseDebit')",
                                        sort_expression: ""
                                    };
                                    $$("msgPanel").show("Loading...");
                                    page.gstAPI.getGSTR1b2b(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
                                        //page.invoiceService.searchInvoice(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
                                        //$$("grdGenerate").dataBind(data);
                                        var totalRecord = data.length;
                                        page.gstAPI.getGSTR1b2b(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
                                            //page.invoiceService.searchInvoice(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
                                            callback(data, totalRecord);
                                            $$("msgPanel").hide();
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
                        }
                    }
                    else {
                        $$("msgPanel").show("Select the GST Type...!");
                    }
                })
            },
            btnpurchaseprint_click: function (callback) {
                var current_date = moment(new Date()).format('MM-DD-YYYY hh:mm:ss');
                var date = new Date();
                var y = date.getFullYear();
                var m = date.getMonth();
                var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
                var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
                var month1 = parseFloat(month) + parseFloat(1);
                if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                    var month2 = parseFloat(month) + parseFloat(2);
                    var month3 = parseFloat(month) + parseFloat(3);
                    //var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "')";
                    var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "') and comp_id = " + localStorage.getItem("user_company_id");
                }
                if ($$("ddlViewMode").selectedData().view_name == "Monthly") {
                    //var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month;
                    var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month + " and comp_id = " + localStorage.getItem("user_company_id");
                }
                page.events.btngeneratebillprint_click(function (bill_no) {
                    if (bill_no != "" && bill_no != null && bill_no != undefined) {
                        var billno = " and invoice_no IN (" + bill_no + ")";
                    } else {
                        var billno = "";
                    }
                //var invoice = $$("grdGenerate").selectedData();
                var filter = {
                    start_record: 0,
                    end_record: 20,
                    //filter_expression: filter_express + " and sales_tax_no is not null and (bill_type='Sale' or bill_type='SaleReturn' or bill_type='SaleCredit' or bill_type='SaleDebit')",
                    filter_expression: filter_express + " and tax_class_no <> -1 and (invoice_type='Purchase' or invoice_type='PurchaseReturn' or invoice_type='PurchaseCredit' or invoice_type='PurchaseDebit')" + billno,
                    sort_expression: ""
                };
                page.gstAPI.getGSTR1Purchase(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (invoice) {
                    if (callback != undefined) {
                        callback(invoice);
                    }
                });
                });
            },
            btngeneratebillprint_click: function (callback) {
                var bill_no="";
                var invoice = $$("grdGenerate").selectedData();
                if (invoice.length > 0) {
                    $(invoice).each(function (i, item) {
                        if (invoice.length > 1 && invoice.length != (parseInt(i) + parseInt(1))) {
                            bill_no = bill_no+item.invoice_no + ",";
                        } else if (invoice.length == (parseInt(i) + parseInt(1))){
                            bill_no = bill_no + item.invoice_no;
                        }
                        else {
                            bill_no = item.invoice_no;
                        }
                        if (callback != undefined && invoice.length == (parseInt(i) + parseInt(1))) {
                            callback(bill_no);
                    }
                    });
                } else {
                    if (callback != undefined && bill_no=="") {
                        callback(bill_no);
                    }
                }
            },
            btnb2bprint_click: function (callback) {
                var current_date = moment(new Date()).format('MM-DD-YYYY hh:mm:ss');
                var date = new Date();
                var y = date.getFullYear();
                var m = date.getMonth();
                var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
                var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
                var month1 = parseFloat(month) + parseFloat(1);
                if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                    var month2 = parseFloat(month) + parseFloat(2);
                    var month3 = parseFloat(month) + parseFloat(3);
                    var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "') and comp_id = " + localStorage.getItem("user_company_id");
                }
                if ($$("ddlViewMode").selectedData().view_name == "Monthly") {
                    var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month + " and comp_id = " + localStorage.getItem("user_company_id");
                }
                page.events.btngeneratebillprint_click(function (bill_no) {
                    if (bill_no != "" && bill_no != null && bill_no != undefined) {
                        var billno = " and invoice_no IN (" + bill_no + ")";
                    } else {
                        var billno = "";
                    }
                    var tax_period = "tax_period like '" + $("#start").val() + "'";
                    if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                        tax_period = "";
                        for (var i = 0; i < 3; i++) {
                            var per_month = (parseFloat(month) + parseFloat(i)).toString();
                            per_month = (per_month.length == 1) ? "0" + per_month : per_month;
                            if (i > 0)
                                tax_period = tax_period + " or tax_period like '" + year + "-" + per_month + "'";
                            else
                                tax_period = tax_period + "tax_period like '" + year + "-" + per_month + "'";
                        }
                    }
                    var filter = {
                        start_record: "",
                        end_record: "",
                        filter_expression: filter_express + " and (invoice_type='Sale' or invoice_type='SaleReturn') and (gst_no is not null) and (gst_no <> '')  and ("+tax_period+") and tax_classify like 'B2B'",
                        sort_expression: ""
                    };
                    if (page.gst_type == "b2cs") {
                        filter.filter_expression = filter_express + " and (invoice_type='Sale' or invoice_type='SaleReturn') and invoice_value<=250000 and (gst_no is null or gst_no = '') and (" + tax_period + ") and tax_classify like 'B2CS'";
                    }
                    if (page.gst_type == "b2cl") {
                        filter.filter_expression = filter_express + " and (invoice_type='Sale' or invoice_type='SaleReturn') and invoice_value>250000  and (gst_no is null or gst_no = '') and (" + tax_period + ") and tax_classify like 'B2CL'";
                    }
                    if (page.gst_type == "hsn") {
                        filter.filter_expression = filter_express + " and (invoice_type='Sale' or invoice_type='SaleReturn') and tax_period like '" + $("#start").val() + "' and hsnorsac is not null";
                        filter.sort_expression = "hsnorsac";
                    }
                    page.gstAPI.getGSTR1Sales(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (invoice) {
                        if (callback != undefined) {
                            callback(invoice);
                        }
                    });
                });
            },
            btnb2bprintcdn_click: function (callback) {
                var current_date = moment(new Date()).format('MM-DD-YYYY hh:mm:ss');
                var date = new Date();
                var y = date.getFullYear();
                var m = date.getMonth();
                var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
                var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
                var month1 = parseFloat(month) + parseFloat(1);
                if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                    var month2 = parseFloat(month) + parseFloat(2);
                    var month3 = parseFloat(month) + parseFloat(3);
                    //var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "')";
                    var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "') and comp_id = " + localStorage.getItem("user_company_id");
                }
                if ($$("ddlViewMode").selectedData().view_name == "Monthly") {
                    //var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month;
                    var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month + " and comp_id = " + localStorage.getItem("user_company_id");
                }
                if ($$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard CDN") {
                    var filter_type = " and tax_class_no <> -1 and (invoice_type='SalesCredit' or invoice_type='SalesDebit')";
                }
                if ($$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard") {
                    var filter_type = " and tax_class_no <> -1 and (invoice_type='Sale' or invoice_type='SaleReturn')";
                }
                page.events.btngeneratebillprint_click(function (bill_no) {
                    if (bill_no != "" && bill_no != null && bill_no != undefined) {
                        var billno = " and invoice_no IN (" + bill_no + ")";
                    } else {
                        var billno = "";
                    }
                    var filter = {
                        start_record: 0,
                        end_record: 20,
                        //filter_expression: filter_express + " and sales_tax_no is not null and (bill_type='Sale' or bill_type='SaleReturn' or bill_type='SaleCredit' or bill_type='SaleDebit')",
                        //filter_expression: filter_express + " and tax_class_no!=-1 and (invoice_type='SalesCredit' or invoice_type='SalesDebit')" + billno,
                        filter_expression: filter_express + filter_type + billno,
                        sort_expression: ""
                    };
                    page.gstAPI.getGSTR1Sales(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (invoice) {
                        if (callback != undefined) {
                            callback(invoice);
                        }
                    });
                });
            },
            btnPrintMultipleBill_click: function () {
                if ($$("ddlGSTExportType").selectedValue() == "Select") {
                    alert("Select the Type..!");
                    $$("ddlGSTExportType").selectedObject.focus();
                }
                else {
                    if (page.gst_type=="b2b" && $$("ddlGSTExportType").selectedValue() == "Json") {
                        page.b2bprintjson();
                        //alert("Under construction...!");
                        //$$("ddlGSTExportType").selectedObject.focus();
                    }
                    else if (page.gst_type == "b2b" && $$("ddlGSTExportType").selectedValue() == "Excel") {
                        page.b2bprintexcel();
                    }
                    else if (page.gst_type == "b2cl" && $$("ddlGSTExportType").selectedValue() == "Json") {
                        page.b2clprintjson();
                        //alert("Under construction...!");
                        //$$("ddlGSTExportType").selectedObject.focus();
                    }
                    else if (page.gst_type == "b2cl" && $$("ddlGSTExportType").selectedValue() == "Excel") {
                        page.b2clprintexcel();
                    }
                    else if (page.gst_type == "b2cs" && $$("ddlGSTExportType").selectedValue() == "Json") {
                        page.b2csprintjson();
                        //alert("Under construction...!");
                        //$$("ddlGSTExportType").selectedObject.focus();
                    }
                    else if (page.gst_type == "b2cs" && $$("ddlGSTExportType").selectedValue() == "Excel") {
                        page.b2csprintexcel();
                    }
                    else if (page.gst_type == "hsn" && $$("ddlGSTExportType").selectedValue() == "Json") {
                        page.hsnprintjson();
                    }
                    else if (page.gst_type == "hsn" && $$("ddlGSTExportType").selectedValue() == "Excel") {
                        page.hsnprintexcel();
                    }
                    else if (page.gst_type == "docs" && $$("ddlGSTExportType").selectedValue() == "Json") {
                        page.docsprintjson();
                    }
                    else if (page.gst_type == "docs" && $$("ddlGSTExportType").selectedValue() == "Excel") {
                        page.docsprintexcel();
                    }
                }
            },
            btnDownload_click: function () {
                if ($$("grdGenerate").selectedData().length == 0 && ($$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard" || $$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard CDN" || $$("ddlGSTR1Type").selectedData().gst_name == "Purchase Standard" || $$("ddlGSTR1Type").selectedData().gst_name == "Purchase Standard CDN")) {
                    $$("msgPanel").show("Select the invoice...!");
                }
                else if ($$("ddlGSTR1Type").selectedData().gst_name == "B2B" || $$("ddlGSTR1Type").selectedData().gst_name == "B2CL" || $$("ddlGSTR1Type").selectedData().gst_name == "B2CS" || $$("ddlGSTR1Type").selectedData().gst_name == "HSN" || $$("ddlGSTR1Type").selectedData().gst_name == "DocIssue") {
                    page.downloadAll_click();
                }
                else {
                $$("msgPanel").show("Downloading...");
                if ($$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard") {
                    var details = [];
                    var details1 = [];
                    var tax = 0;
                    var total = 0;
                    var tax_period;
                    page.events.btnb2bprint_click(function (invoice) {
                        tax_period = "";
                        if (invoice.length > 0) {
                            $(invoice).each(function (i, item) {
                            tax = parseFloat(item.tax_value) + parseFloat(tax);
                            total = parseFloat(item.invoice_value) + parseFloat(total);
                            if ((item.tax_period).substring(5, 8) == "01") {
                                tax_period = 1;
                            }
                            if ((item.tax_period).substring(5, 8) == "04") {
                                tax_period = 2;
                            }
                            if ((item.tax_period).substring(5, 8) == "08") {
                                tax_period = 3;
                            }
                            if ((item.tax_period).substring(5, 8) == "12") {
                                tax_period = 4;
                            }
                            details.push({
                                //"GSTIN/UIN of Recipient": item.gst_no,
                                //"Invoice Number": item.invoice_no,
                                //"Invoice date": item.invoice_date,
                                //"Invoice Value": item.invoice_value,
                                //"Place Of Supply": item.party_address,
                                //"Reverse Charge": "N",
                                //"Invoice Type": "Regular",
                                //"E-Commerce GSTIN": "24AABCR0091C1ZZ",
                                //"Rate": item.rate,
                                //"Taxable Value": item.tax_value,
                                //"Cess Amount": "0",
                                "Invoice date": item.invoice_date,
                                "Invoice Number": item.invoice_no,
                                "Customer Name": item.cust_name,
                                "Customer GSTIN": item.gst_no,
                                "Place Of Supply": item.party_address,
                                "IsItem": "Good",
                                "Item Description": item.item_name,
                                "HSNorSAC code": item.hsnorsac,
                                "Item Quantity": item.qty,
                                "Item Unit": item.unit,
                                "Item Rate": item.price,
                                "Item Discount": item.discount,
                                "Item Taxable Value": item.tax_value,
                                "CGST Rate": item.cgst,
                                "CGST Amount": item.cgst_amount,
                                "SGST Rate": item.sgst,
                                "SGST Amount": item.sgst_amount,
                                "IGST Rate": item.igst,
                                "IGST Amount": item.igst_amount,
                                "CESS Rate": "0",
                                "CESS Amount": item.cess_amount,
                                "Bill Supply": "Y",
                                "Rated item": "Nil rated",
                                "Reverse Charge": "Y",
                                "Shipping Export Type": "Export with Payment of GST",
                                "Shipping Export Code": "123331",
                                "Shipping Bill Number": "1776822",
                                "Shipping Bill Date": "3/4/2016",
                                "isGST IDT TDS": "Y",
                                "My GSTIN": item.gst_no,
                                "Customer Billing Address": item.party_address,
                                "Customer Billing City": item.cust_city,
                                "Customer Billing State": item.cust_state,
                                "Is document": "Y",
                                "UIN registered": "Composition",
                                "Return Filing Month": item.tax_period,
                                "Return Filing Quarter": ((item.tax_period).substring(0, 1) == "q") ? tax_period:"",
                                "Original Invoice Date": item.invoice_date,
                                "Original Invoice Number": item.invoice_no,
                                "Original Customer Billing GSTIN": item.gst_no,
                                "Ecommerce GSTIN": "06ADECO9084R5Z4",
                                "Receipt Date": item.invoice_date,
                                "Receipt Voucher Number": item.invoice_no,
                                "Receipt Adjustment Amount": item.invoice_value,
                                "Total Transaction Value": item.invoice_value
                            });
                        });
                        var accountInfo = {
                            "CompName": CONTEXT.COMPANY_NAME.toUpperCase(),
                            "ReportName": "GSTR B2B Report",
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                            "No of Recipients": invoice.length,
                            "No of Invoices": invoice.length,
                            "Total Invoice Value": total,
                            "Total Taxable Value": tax,
                            "Total Cess": "0",
                            "Details": details,
                        };
                        //GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "GST-Report/main-b2b-report.jrxml", accountInfo, "EXCEL", function (responseData) {
                        GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "GST-Report/sub-GSTR-b2b-report.jrxml", accountInfo.Details, "EXCEL", function (responseData) {
                            $$("msgPanel").hide();
                        });
                        } else {
                            $$("msgPanel").show("No data found...!");
                        }
                    });
                }
                else if ($$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard CDN") {
                    var details = [];
                    var details1 = [];
                    var tax = 0;
                    var total = 0;
                    var invoice = $$("grdGenerate").selectedData();
                    var tax_period;
                    //page.gstrb2csreport(function (data) {
                    page.events.btnb2bprintcdn_click(function (invoice) {
                    //page.events.btnb2bprint_click(function (invoice) {
                        tax_period = "";
                        if (invoice.length > 0) {
                            $(invoice).each(function (i, item) {
                            //tax = parseFloat(item.tax_value) + parseFloat(tax);
                            //total = parseFloat(item.invoice_value) + parseFloat(total);
                                if ((item.tax_period).substring(5, 8) == "01") {
                                    tax_period = 1;
                                }
                                if ((item.tax_period).substring(5, 8) == "04") {
                                    tax_period = 2;
                                }
                                if ((item.tax_period).substring(5, 8) == "08") {
                                    tax_period = 3;
                                }
                                if ((item.tax_period).substring(5, 8) == "12") {
                                    tax_period = 4;
                                }
                            details1.push({
                                "Invoice date": item.invoice_date,
                                "Invoice Number": item.invoice_no,
                                "Invoice Type": item.invoice_type,
                                "Customer Name": item.cust_name,
                                "Customer GSTIN": item.gst_no,
                                "Place of Supply": item.party_address,
                                "IsItem": "Good",
                                "Item Description": item.item_name,
                                "HSNorSAC code": item.hsnorsac,
                                "Item Quantity": item.qty,
                                "Item Unit": item.unit,
                                "Item Rate": item.price,
                                "Item Discount": item.discount,
                                "Item Taxable Value": item.tax_value,
                                "CGST Rate": item.cgst,
                                "CGST Amount": item.cgst_amount,
                                "SGST Rate": item.sgst,
                                "SGST Amount": item.sgst_amount,
                                "IGST Rate": item.igst,
                                "IGST Amount": item.igst_amount,
                                "CESS Rate": "0",
                                "CESS Amount": item.cess_amount,
                                "Reverse Charge": "Y",
                                "Bill Supply": "Y",
                                "Rated item": "Nil rated",
                                "isDocCancel": "Y",
                                "isIssuingCDN": "Y",
                                "isPreGSTInvoice": "Y",
                                "isInvoiceLinkedTo": "Y",
                                "UIN registered": "Composition",
                                "Return Filing Month": item.tax_period,
                                "Return Filing Quarter": ((item.tax_period).substring(0, 1) == "q") ? tax_period : "",
                                "Original Invoice Date": item.invoice_date,
                                "Original Invoice Number": item.invoice_no,
                                "Original Customer GSTIN": item.gst_no,
                                "My GSTIN": item.gst_no,
                                "Customer Address": item.party_address,
                                "Customer City": item.cust_city,
                                "Customer State": item.cust_state,
                                "Total Transaction Value": item.invoice_value
                            });
                        })
                        var accountInfo1 = {
                            "CompName": CONTEXT.COMPANY_NAME.toUpperCase(),
                            "ReportName": "GSTR B2C Report",
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                            "Total Taxable Value": tax,
                            "Total Cess": "0",
                            "Details": details1,
                        }
                        //GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "GST-Report/main-b2cs-report.jrxml", accountInfo1, "EXCEL", function (responseData) {
                        GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "GST-Report/sub-GSTR-b2b-sales-cdn-report.jrxml", accountInfo1.Details, "EXCEL", function (responseData) {
                            $$("msgPanel").hide();
                        });
                        } else {
                            $$("msgPanel").show("No data found...!");
                        }
                    });
                }
                else if ($$("ddlGSTR1Type").selectedData().gst_name == "Purchase Standard") {
                    var details = [];
                    var details1 = [];
                    var tax = 0;
                    var total = 0;
                    var invoice = $$("grdGenerate").selectedData();
                    //page.gstrb2csreport(function (data) {
                    var tax_period;
                    page.events.btnpurchaseprint_click(function (invoice) {
                        if (invoice.length > 0) {
                            tax_period = "";
                            $(invoice).each(function (i, item) {
                            //tax = parseFloat(item.tax_value) + parseFloat(tax);
                            //total = parseFloat(item.invoice_value) + parseFloat(total);
                                if ((item.tax_period).substring(5, 8) == "01") {
                                    tax_period = 1;
                                }
                                if ((item.tax_period).substring(5, 8) == "04") {
                                    tax_period = 2;
                                }
                                if ((item.tax_period).substring(5, 8) == "08") {
                                    tax_period = 3;
                                }
                                if ((item.tax_period).substring(5, 8) == "12") {
                                    tax_period = 4;
                                }
                            details1.push({
                                //"Type": "Regular",
                                //"Place Of Supply": item.party_address,
                                //"E-Commerce GSTIN": "24AABCR0091C1ZZ",
                                //"Rate": item.rate,
                                //"Taxable Value": item.tax_value,
                                //"Cess Amount": "0",
                                "Invoice date": item.invoice_date,
                                "Invoice Number": item.invoice_no,
                                "Supplier Name": item.vendor_name,
                                "Supplier GSTIN": item.gst_no,
                                "Supplier State": item.vendor_state,
                                "IsItem": "Good",
                                "Item Description": item.item_name,
                                "HSNorSAC code": item.hsnorsac,
                                "Item Quantity": item.qty,
                                "Item Unit": item.unit,
                                "Item Rate": item.price,
                                "Item Discount": item.disc_val,
                                "Item Taxable Value": item.tax_value,
                                "CGST Rate": item.cgst,
                                "CGST Amount": item.cgst_amount,
                                "SGST Rate": item.sgst,
                                "SGST Amount": item.sgst_amount,
                                "IGST Rate": item.igst,
                                "IGST Amount": item.igst_amount,
                                "CESS Rate": "0",
                                "CESS Amount": "0",
                                "ITC Claim Type": "",
                                "CGST ITC Claim Amount": "0",
                                "SGST ITC Claim Amount": "0",
                                "IGST ITC Claim Amount": "0",
                                "CESS ITC Claim Amount": "0",
                                "Bill Supply": "Y",
                                "Rated item": "Nil rated",
                                "Reverse Charge": "Y",
                                "Type of Import": "Goods",
                                "Bill Entry Port Code": "123331",
                                "Bill Entry Number": item.invoice_no,
                                "Bill Entry Date": item.invoice_date,
                                "isDocCancel": "Y",
                                "isCompDealer": "Y",
                                "Return Filing Month": item.tax_period,
                                "Return Filing Quarter": ((item.tax_period).substring(0, 1) == "q") ? tax_period : "",
                                "My GSTIN": item.gst_no,
                                "Place of Supply": item.party_address,
                                "Supplier Address": item.party_address,
                                "Supplier City": item.party_address,
                                "Original Invoice Date": item.invoice_date,
                                "Original Invoice Number": item.invoice_no,
                                "Original Supplier GSTIN": item.gst_no,
                                "Linked Date": "2/3/2016",
                                "Voucher Number": "S008400",
                                "Adjustment Amount": "200",
                                "Receipt No": "06ADECO9084R5Z4",
                                "Receipt Date": "14/7/2017",
                                "Receipt Quantity": "AR2300",
                                "Receipt Amount": item.invoice_value,
                                "Total Transaction Value": item.invoice_value
                            });
                        })
                        var accountInfo1 = {
                            "CompName": CONTEXT.COMPANY_NAME.toUpperCase(),
                            "ReportName": "GSTR B2C Report",
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                            "Total Taxable Value": tax,
                            "Total Cess": "0",
                            "Details": details1,
                        }
                        //GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "GST-Report/main-b2cs-report.jrxml", accountInfo1, "EXCEL", function (responseData) {
                        GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "GST-Report/sub-GSTR-b2b-purchase-report.jrxml", accountInfo1.Details, "EXCEL", function (responseData) {
                            $$("msgPanel").hide();
                        });
                    } else {
                    $$("msgPanel").show("No data found...!");
                }
                    });
                }
                else if ($$("ddlGSTR1Type").selectedData().gst_name == "Purchase Standard CDN") {
                    var details = [];
                    var details1 = [];
                    var tax = 0;
                    var total = 0;
                    var invoice = $$("grdGenerate").selectedData();
                    //page.gstrb2csreport(function (data) {
                    var tax_period;
                    page.events.btnpurchaseprint_click(function (invoice) {
                        if (invoice.length > 0) {
                            tax_period = "";
                            $(invoice).each(function (i, item) {
                                if ((item.tax_period).substring(5, 8) == "01") {
                                    tax_period = 1;
                                }
                                if ((item.tax_period).substring(5, 8) == "04") {
                                    tax_period = 2;
                                }
                                if ((item.tax_period).substring(5, 8) == "08") {
                                    tax_period = 3;
                                }
                                if ((item.tax_period).substring(5, 8) == "12") {
                                    tax_period = 4;
                                }
                                //tax = parseFloat(item.tax_value) + parseFloat(tax);
                                //total = parseFloat(item.invoice_value) + parseFloat(total);
                                details1.push({
                                    //"Type": "Regular",
                                    //"Place Of Supply": item.party_address,
                                    //"E-Commerce GSTIN": "24AABCR0091C1ZZ",
                                    //"Rate": item.rate,
                                    //"Taxable Value": item.tax_value,
                                    //"Cess Amount": "0",
                                    //"Invoice date": item.invoice_date,
                                    //"Invoice Number": item.invoice_no,
                                    //"Supplier Name": item.vendor_name,
                                    //"Supplier GSTIN": item.gst_no,
                                    //"Supplier State": item.vendor_state,
                                    //"IsItem": "G",
                                    //"Item Description": item.item_name,
                                    //"HSNorSAC code": item.hsnorsac,
                                    //"Item Quantity": item.qty,
                                    //"Item Unit": item.unit,
                                    //"Item Rate": item.price,
                                    //"Item Discount": item.disc_val,
                                    //"Item Taxable Value": item.tax_value,
                                    //"CGST Rate": item.cgst,
                                    //"CGST Amount": item.cgst_amount,
                                    //"SGST Rate": item.sgst,
                                    //"SGST Amount": item.sgst_amount,
                                    //"IGST Rate": item.igst,
                                    //"IGST Amount": item.igst_amount,
                                    //"CESS Rate": "0",
                                    //"CESS Amount": "0",
                                    //"ITC Claim Type": "",
                                    //"CGST ITC Claim Amount": "0",
                                    //"SGST ITC Claim Amount": "0",
                                    //"IGST ITC Claim Amount": "0",
                                    //"CESS ITC Claim Amount": "0",
                                    //"Bill Supply": "Y",
                                    //"Rated item": "Nil rated",
                                    //"Reverse Charge": "Y",
                                    //"Type of Import": "Goods",
                                    //"Bill Entry Port Code": "123331",
                                    //"Bill Entry Number": item.invoice_no,
                                    //"Bill Entry Date": item.invoice_date,
                                    //"isDocCancel": "Y",
                                    //"isCompDealer": "Y",
                                    //"Return Filing Month": item.tax_peroid,
                                    //"Return Filing Quarter": "",
                                    //"My GSTIN": item.gst_no,
                                    //"Place of Supply": item.party_address,
                                    //"Supplier Address": item.party_address,
                                    //"Supplier City": item.party_address,
                                    //"Original Invoice Date": item.invoice_date,
                                    //"Original Invoice Number": item.invoice_no,
                                    //"Original Supplier GSTIN": item.gst_no,
                                    //"Linked Date": "2/3/2016",
                                    //"Voucher Number": "S008400",
                                    //"Adjustment Amount": "200",
                                    //"Receipt No": "06ADECO9084R5Z4",
                                    //"Receipt Date": "14/7/2017",
                                    //"Receipt Quantity": "AR2300",
                                    //"Receipt Amount": item.invoice_value,
                                    //"Total Transaction Value": item.invoice_value

                                    "Invoice date": item.invoice_date,
                                    "Invoice Number": item.invoice_no,
                                    "Invoice Type": item.invoice_type,
                                    "Supplier Name": item.vendor_name,
                                    "Supplier GSTIN": item.gst_no,
                                    "Supplier State": item.party_address,
                                    "IsItem": "Good",
                                    "Item Description": item.item_name,
                                    "HSNorSAC code": item.hsnorsac,
                                    "Item Quantity": item.qty,
                                    "Item Unit": item.qty,
                                    "Item Rate": item.price,
                                    "Item Discount": item.disc_val,
                                    "Item Taxable Value": item.tax_value,
                                    "CGST Rate": item.cgst,
                                    "CGST Amount": item.cgst_amount,
                                    "SGST Rate": item.sgst,
                                    "SGST Amount": item.sgst_amount,
                                    "IGST Rate": item.igst,
                                    "IGST Amount": item.igst_amount,
                                    "CESS Rate": "0",
                                    "CESS Amount": "0",
                                    "ITC Claim Type": "",
                                    "CGST ITC Claim Amount": "200",
                                    "SGST ITC Claim Amount": "200",
                                    "IGST ITC Claim Amount": "0",
                                    "CESS ITC Claim Amount": "0",
                                    "Bill Supply": "Y",
                                    "Rated item": "Nil rated",
                                    "Reverse Charge": "Y",
                                    "Type of Import": "Goods",
                                    "Bill Entry Port Code": "123331",
                                    "Bill Entry Number": "1776822",
                                    "Bill Entry Date": "3/4/2016",
                                    "isDocCancel": "Y",
                                    "isCompDealer": "Y",
                                    "isIssuingCDN": "Y",
                                    "isPreGSTInvoice": "Y",
                                    "isInvoiceLinkedTo": "Y",
                                    "Return Filing Month": item.tax_period,
                                    "Return Filing Quarter": ((item.tax_period).substring(0, 1) == "q") ? tax_period : "",
                                    "My GSTIN": item.gst_no,
                                    "Place of Supply": item.party_address,
                                    "Supplier Address": item.party_address,
                                    "Supplier City": item.party_address,
                                    "Original Invoice Date": item.invoice_date,
                                    "Original Invoice Number": item.invoice_no,
                                    "Original Supplier GSTIN": item.gst_no,
                                    "Total Transaction Value": item.invoice_value
                                });
                            })
                            var accountInfo1 = {
                                "CompName": CONTEXT.COMPANY_NAME.toUpperCase(),
                                "ReportName": "GSTR B2C Report",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Total Taxable Value": tax,
                                "Total Cess": "0",
                                "Details": details1,
                            }
                            //GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "GST-Report/main-b2cs-report.jrxml", accountInfo1, "EXCEL", function (responseData) {
                            GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "GST-Report/sub-GSTR-b2b-purchase-cdn-report.jrxml", accountInfo1.Details, "EXCEL", function (responseData) {
                                $$("msgPanel").hide();
                            });
                        } else {
                            $$("msgPanel").show("No data found...!");
                        }
                        });
                }
                else if ($$("ddlGSTR1Type").selectedData().gst_name == "B2CS" && page.gst_type == "b2cl") {
                    $$("ddlGSTExportType").selectedValue("Select");
                    if ($$("ddlGSTExportType").selectedValue() == "Json") {
                        page.b2csprintjson();
                    }
                    else if ($$("ddlGSTExportType").selectedValue() == "Excel") {
                        page.b2csprintexcel();
                    }
                    else {

                    }
                }
                else if ($$("ddlGSTR1Type").selectedData().gst_name == "B2CL" && page.gst_type == "b2cs") {
                    $$("ddlGSTExportType").selectedValue("Select");
                    if ($$("ddlGSTExportType").selectedValue() == "Json") {
                        page.b2clprintjson();
                    }
                    else if ($$("ddlGSTExportType").selectedValue() == "Excel") {
                        page.b2clprintexcel();
                    }
                    else {

                    }
                }
                else if ($$("ddlGSTR1Type").selectedData().gst_name == "B2B" && page.gst_type=="b2b") {
                    //page.controls.pnlPrintingPopup.open();
                    //page.controls.pnlPrintingPopup.title("Report Type");
                    //page.controls.pnlPrintingPopup.rlabel("Report Type");
                    //page.controls.pnlPrintingPopup.width(500);
                    //page.controls.pnlPrintingPopup.height(200);
                    $$("ddlGSTExportType").selectedValue("Select");
                    if ($$("ddlGSTExportType").selectedValue() == "Json") {
                        page.b2bprintjson();
                    }
                    else if ($$("ddlGSTExportType").selectedValue() == "Excel") {
                        page.b2bprintexcel();
                    }
                    else {

                    }
                }
                }
            },
            btnSave_click: function () {
                if ($$("grdGenerate").selectedData().length == 0) {
                    $$("msgPanel").show("Select the invoice...!");
                }
                else {
                    if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                        var date = new Date();
                        var y = date.getFullYear();
                        var m = date.getMonth();
                        var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
                        var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
                        var month1 = parseFloat(month) + parseFloat(1);
                        if (parseInt(month) < 10) {
                            var filter_express = "q" + year + month;
                        } else {
                            var filter_express = "q" + year + month;
                        }
                    }
                    if ($$("ddlViewMode").selectedData().view_name == "Monthly") {
                        var date = new Date();
                        var y = date.getFullYear();
                        var m = date.getMonth();
                        var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
                        var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
                        var month1 = parseFloat(month) + parseFloat(1);
                        if (parseInt(month) < 10) {
                            var filter_express = "m" + year +  month;
                        } else {
                            var filter_express = "m" + year + month;
                        }
                    }
                    var invoice = $$("grdGenerate").selectedData();
                    $(invoice).each(function (i, item) {
                        var data = {
                            bill_no: item.invoice_no,
                            tax_period: filter_express,
                        }
                        if ($$("ddlGSTType").selectedData().gst_name == "GSTR1" && ($$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard" || $$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard CDN")) {
                            page.gstAPI.updateBill(data, function (data1) {
                                $$("msgPanel").show("Bill updated successfully...!");
                                if (data1.length > 0) {
                                    $$("msgPanel").hide();
                                    page.events.btnGenerate_click();
                                }
                            });
                        }
                        else if ($$("ddlGSTType").selectedData().gst_name == "GSTR1" && ($$("ddlGSTR1Type").selectedData().gst_name == "Purchase Standard" || $$("ddlGSTR1Type").selectedData().gst_name == "Purchase Standard CDN")) {
                            page.gstAPI.updatepurchaseBill(data, function (data1) {
                                $$("msgPanel").show("Bill updated successfully...!");
                                if (data1.length > 0) {
                                    $$("msgPanel").hide();
                                    page.events.btnGenerate_click();
                                }
                            });
                        }
                        else {
                            $$("msgPanel").show("No Bill updated...!");
                        }
                    });
                }
            },
            btnSaveB2B_click: function () {
                if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                    var date = new Date();
                    var y = date.getFullYear();
                    var m = date.getMonth();
                    var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
                    var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
                    var month1 = parseFloat(month) + parseFloat(1);
                    if (parseInt(month) < 10) {
                        var filter_express = "q" + year + month;
                    } else {
                        var filter_express = "q" + year + month;
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "Monthly") {
                    var date = new Date();
                    var y = date.getFullYear();
                    var m = date.getMonth();
                    var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
                    var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
                    var month1 = parseFloat(month) + parseFloat(1);
                    if (parseInt(month) < 10) {
                        var filter_express = "m" + year + month;
                    } else {
                        var filter_express = "m" + year + month;
                    }
                }
                var invoice = $$("grdGenerateB2B").allData();
                $(invoice).each(function (i, item) {
                    if (item.tax_period != null && typeof item.tax_period != "undefined" && item.tax_period != "") {
                        var data = {
                            bill_no: item.invoice_no,
                        }
                        if (item.tax_period != null && item.tax_period != undefined && item.tax_period != "") {
                            data.tax_period = item.tax_period;
                        } else {
                            data.tax_period = filter_express;
                        }
                        if ($$("ddlGSTType").selectedData().gst_name == "GSTR1" && ($$("ddlGSTR1Type").selectedData().gst_name == "B2B" || $$("ddlGSTR1Type").selectedData().gst_name == "B2CL" || $$("ddlGSTR1Type").selectedData().gst_name == "B2CS")) {
                            page.gstAPI.updateBill(data, function (data1) {
                                $$("msgPanel").show("Bill updated successfully...!");
                                if (data1.length > 0) {
                                    $$("msgPanel").hide();
                                    page.events.btnGenerate_click();
                                }
                            });
                        }
                        else {
                            $$("msgPanel").show("No Bill updated...!");
                        }
                    }
                });
            },
            btnPreview_click: function () {
                $$("pnlgstrinvoice").show();
                $$("pnlgstrinvoiceothers").hide();

                var current_date = moment(new Date()).format('MM-DD-YYYY hh:mm:ss');
                var date = new Date();
                var y = date.getFullYear();
                var m = date.getMonth();
                var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
                var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
                var month1 = parseFloat(month) + parseFloat(1);
                var filter_hsn = "";
                if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                    var month2 = parseFloat(month) + parseFloat(2);
                    var month3 = parseFloat(month) + parseFloat(3);
                    var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "') and comp_id = " + localStorage.getItem("user_company_id");
                    filter_hsn = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "') and bt.comp_id = " + localStorage.getItem("user_company_id");
                }
                if ($$("ddlViewMode").selectedData().view_name == "Monthly") {
                    var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month + " and comp_id = " + localStorage.getItem("user_company_id");
                    filter_hsn = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month + " and bt.comp_id = " + localStorage.getItem("user_company_id");
                }
                if ($$("ddlGSTR1Type").selectedData().gst_name == "Sales Standard CDN") {
                    var filter_type = " and tax_class_no <> -1 and (invoice_type='SalesCredit' or invoice_type='SalesDebit')";
                }
                var filter_type = " and (bill_type='Sale' or bill_type='SaleReturn') and (gst_no is not null) and (gst_no <> '') and tax_period like '" + $("#start").val() + "' and tax_classify like 'B2B'";
                var filter_type1 = " and (bill_type='Sale' or bill_type='SaleReturn') and total>250000  and (gst_no is null or gst_no = '') and tax_period like '" + $("#start").val() + "' and tax_classify like 'B2CL'";
                var filter_type2 = " and (bill_type='Sale' or bill_type='SaleReturn') and total<=250000 and (gst_no is null or gst_no = '') and tax_period like '" + $("#start").val() + "' and tax_classify like 'B2CS'";
                var hsn_filter = " and tct.tax_class_no <> -1 and (bill_type='Sale') and tax_period like '" + $("#start").val() + "' and tct.hsn_code is not null";
                if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                    var tax_period = "";
                    for (var i = 0; i < 3; i++) {
                        var per_month = (parseFloat(month) + parseFloat(i)).toString();
                        per_month = (per_month.length == 1) ? "0" + per_month : per_month;
                        if(i>0)
                            tax_period = tax_period + " or tax_period like '" + year + "-" + per_month + "'";
                        else
                            tax_period = tax_period + "tax_period like '" + year + "-" + per_month + "'";
                    }
                    filter_type = " and (bill_type='Sale' or bill_type='SaleReturn') and (gst_no is not null) and (gst_no <> '') and (" + tax_period + ") and tax_classify like 'B2B' and tax_classify is not null";
                    filter_type1 = " and (bill_type='Sale' or bill_type='SaleReturn') and total>250000  and (gst_no is null or gst_no = '') and (" + tax_period + ") and tax_classify like 'B2CL' and tax_classify is not null";
                    filter_type2 = " and (bill_type='Sale' or bill_type='SaleReturn') and total<=250000 and (gst_no is null or gst_no = '') and (" + tax_period + ") and tax_classify like 'B2CS' and tax_classify is not null";
                    hsn_filter = " and tct.tax_class_no <> -1 and (bill_type='Sale') and (" + tax_period + ") and tct.hsn_code is not null and tax_classify is not null";
                }
                var filter = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: filter_express + filter_type ,
                    sort_expression: ""
                };
                page.gstAPI.getGSTb2b(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
                    var tot_sales = 0, tot_taxable = 0, tot_tax = 0;
                    $(data).each(function (i, item) {
                        if (item.invoice_type == "Sale") {
                            tot_sales = parseFloat(tot_sales) + parseFloat(item.invoice_value);
                            tot_taxable = parseFloat(tot_taxable) + parseFloat(item.tax_value);
                            tot_tax = parseFloat(tot_tax) + parseFloat(item.tax);
                        }
                        else {
                            tot_sales = parseFloat(tot_sales) - parseFloat(item.invoice_value);
                            tot_taxable = parseFloat(tot_taxable) - parseFloat(item.tax_value);
                            tot_tax = parseFloat(tot_tax) - parseFloat(item.tax);
                        }
                    });
                    $$("totB2BInvoiceValue").html("Total Invoice Value : " + tot_sales.toFixed(2));
                    $$("totB2BTaxableValue").html("Total Taxable Value : " + tot_taxable.toFixed(2));
                    $$("totB2BTaxLiabilityValue").html("Total Taxable Liability : " + tot_tax.toFixed(2));
                });
                var filter1 = {
                    start_record: 0,
                    end_record: 20,
                    filter_expression: filter_express + filter_type1,
                    sort_expression: ""
                };
                page.gstAPI.getGSTb2b(filter1.start_record, filter1.end_record, filter1.filter_expression, filter1.sort_expression, function (data) {
                    var tot_sales = 0, tot_taxable = 0, tot_tax = 0;
                    $(data).each(function (i, item) {
                        if (item.invoice_type == "Sale") {
                            tot_sales = parseFloat(tot_sales) + parseFloat(item.invoice_value);
                            tot_taxable = parseFloat(tot_taxable) + parseFloat(item.tax_value);
                            tot_tax = parseFloat(tot_tax) + parseFloat(item.tax);
                        }
                        else {
                            tot_sales = parseFloat(tot_sales) - parseFloat(item.invoice_value);
                            tot_taxable = parseFloat(tot_taxable) - parseFloat(item.tax_value);
                            tot_tax = parseFloat(tot_tax) - parseFloat(item.tax);
                        }
                    });
                    $$("totB2CLInvoiceValue").html("Total Invoice Value : " + tot_sales.toFixed(2));
                    $$("totB2CLTaxableValue").html("Total Taxable Value : " + tot_taxable.toFixed(2));
                    $$("totB2CLTaxLiabilityValue").html("Total Taxable Liability : " + tot_tax.toFixed(2));
                });
                var filter2 = {
                    start_record: 0,
                    end_record: 20,
                    filter_expression: filter_express + filter_type2,
                    sort_expression: ""
                };
                page.gstAPI.getGSTb2b(filter2.start_record, filter2.end_record, filter2.filter_expression, filter2.sort_expression, function (data) {
                    var tot_sales = 0, tot_taxable = 0, tot_tax = 0;
                    $(data).each(function (i, item) {
                        if (item.invoice_type == "Sale") {
                            tot_sales = parseFloat(tot_sales) + parseFloat(item.invoice_value);
                            tot_taxable = parseFloat(tot_taxable) + parseFloat(item.tax_value);
                            tot_tax = parseFloat(tot_tax) + parseFloat(item.tax);
                        }
                        else {
                            tot_sales = parseFloat(tot_sales) - parseFloat(item.invoice_value);
                            tot_taxable = parseFloat(tot_taxable) - parseFloat(item.tax_value);
                            tot_tax = parseFloat(tot_tax) - parseFloat(item.tax);
                        }
                    });
                    $$("totB2CSInvoiceValue").html("Total Invoice Value : " + tot_sales.toFixed(2));
                    $$("totB2CSTaxableValue").html("Total Taxable Value : " + tot_taxable.toFixed(2));
                    $$("totB2CSTaxLiabilityValue").html("Total Taxable Liability : " + tot_tax.toFixed(2));
                });
                page.gstAPI.getGSTR1HSN(filter.start_record, filter.end_record, filter_hsn + " " + hsn_filter, "hsn_code", function (data) {
                    var tot_sales = 0, tot_tax = 0, tot_taxable = 0;
                    $(data).each(function (i, item) {
                        if (item.bill_type == "Sale") {
                            tot_sales = parseFloat(tot_sales) + parseFloat(item.total_price);
                            tot_taxable = parseFloat(tot_taxable) + parseFloat(item.tax_value);
                            tot_tax = parseFloat(tot_tax) + (parseFloat(item.cess_amount) + parseFloat(item.cgst) + parseFloat(item.sgst) + parseFloat(item.igst));
                        }
                        else {
                            tot_sales = parseFloat(tot_sales) - parseFloat(item.total_price);
                            tot_taxable = parseFloat(tot_taxable) - parseFloat(item.tax_value);
                            tot_tax = parseFloat(tot_tax) - (parseFloat(item.cess_amount) + parseFloat(item.cgst) + parseFloat(item.sgst) + parseFloat(item.igst));
                        }
                    });
                    $$("totHSNInvoiceValue").html("Total Invoice Value : " + tot_sales.toFixed(2));
                    $$("totHSNTaxableValue").html("Total Taxable Value : " + tot_taxable.toFixed(2));
                    $$("totHSNTaxLiabilityValue").html("Total Taxable Liability : " + tot_tax.toFixed(2));
                });

                page.billAPI.searchValues("", "", filter_express, "bill_no asc", function (data) {
                    var tot_bills = 0, tot_sales_bill = 0, tot_return_bill = 0;
                    $(data).each(function (i, item) {
                        if (item.bill_type == "Sale") {
                            tot_bills++;
                            tot_sales_bill++;
                        }
                        if (item.bill_type == "SaleReturn") {
                            tot_bills++;
                            tot_return_bill++;
                        }
                            
                    });
                    $$("totDocBill").html("Total Bill : " + tot_bills);
                    $$("totDocSalesBill").html("Total Sales Bill : " + tot_sales_bill);
                    $$("totDocReturnBill").html("Total Cancell Bill : " + tot_return_bill);
                });
            },
            pnlgridb2b_click: function () {
                $(".gstinvoice").removeClass("gstactive");
                $$("pnlgridb2b").addClass(" gstactive");
                page.gst_type="b2b";
                page.controls.pnlPrintingPopup.open();
                page.controls.pnlPrintingPopup.title("Report Type");
                page.controls.pnlPrintingPopup.rlabel("Report Type");
                page.controls.pnlPrintingPopup.width(500);
                page.controls.pnlPrintingPopup.height(200);
                $$("ddlGSTExportType").selectedValue("Select");
            },
            pnlgridb2cs_click: function () {
                $(".gstinvoice").removeClass("gstactive");
                $$("pnlgridb2b").addClass(" gstactive");
                page.gst_type = "b2cs";
                page.controls.pnlPrintingPopup.open();
                page.controls.pnlPrintingPopup.title("Report Type");
                page.controls.pnlPrintingPopup.rlabel("Report Type");
                page.controls.pnlPrintingPopup.width(500);
                page.controls.pnlPrintingPopup.height(200);
                $$("ddlGSTExportType").selectedValue("Select");
            },
            pnlgridb2cl_click: function () {
                $(".gstinvoice").removeClass("gstactive");
                $$("pnlgridb2b").addClass(" gstactive");
                page.gst_type = "b2cl";
                page.controls.pnlPrintingPopup.open();
                page.controls.pnlPrintingPopup.title("Report Type");
                page.controls.pnlPrintingPopup.rlabel("Report Type");
                page.controls.pnlPrintingPopup.width(500);
                page.controls.pnlPrintingPopup.height(200);
                $$("ddlGSTExportType").selectedValue("Select");
            },
            pnlgridhsn_click: function(){
                $(".gstinvoice").removeClass("gstactive");
                $$("pnlgridhsn").addClass(" gstactive");
                page.gst_type = "hsn";
                page.controls.pnlPrintingPopup.open();
                page.controls.pnlPrintingPopup.title("Report Type");
                page.controls.pnlPrintingPopup.rlabel("Report Type");
                page.controls.pnlPrintingPopup.width(500);
                page.controls.pnlPrintingPopup.height(200);
                $$("ddlGSTExportType").selectedValue("Select");
            },
            pnlgriddocs_click: function () {
                $(".gstinvoice").removeClass("gstactive");
                $$("pnlgridhsn").addClass(" gstactive");
                page.gst_type = "docs";
                page.controls.pnlPrintingPopup.open();
                page.controls.pnlPrintingPopup.title("Report Type");
                page.controls.pnlPrintingPopup.rlabel("Report Type");
                page.controls.pnlPrintingPopup.width(500);
                page.controls.pnlPrintingPopup.height(200);
                $$("ddlGSTExportType").selectedValue("Select");
            },
            page_load: function () {
                $$("pnlPreparegst").show();
                $$("pnlviewmode").show();
                $$("pnlStartMonth").show();
                $$("pnlGSTType").show();
                $$("pnlDownloadType").show();
                $$("pnlgridpreparegst").show();
                $$("btnGenerate").show();
                $$("btnDownload").hide();
                $$("pnlgridb2b").click(function(){
                    $(".gstinvoice").removeClass("gstactive");
                    $$("pnlgridb2b").addClass(" gstactive");
                })
                $('#pnlmenupreparegst').click(function(){
                    $$("pnlPreparegst").show();
                    $$("pnlviewmode").show();
                    $$("pnlStartMonth").show();
                    $$("pnlGSTType").show();
                    $$("pnlDownloadType").show();
                    $$("pnlgridpreparegst").show();
                    $$("btnGenerate").show();
                    $$("btnDownload").hide();
                    $$("pnlgstrinvoice").hide();
                    $$("pnlgstrinvoiceothers").hide();
                    $$("btnPreview").hide();
                    $$("ddlGSTType").disable(false);
                    $("#start").removeAttr('disabled');
                })
                $('#pnlmenusubmitgst').click(function () {
                    $$("pnlPreparegst").show();
                    $$("pnlviewmode").hide();
                    $$("pnlStartMonth").show();
                    $$("pnlGSTType").show();
                    $$("pnlDownloadType").hide();
                    $$("pnlgridpreparegst").hide();
                    $$("btnGenerate").hide();
                    $$("btnDownload").show();
                    $$("btnSave").hide();
                    $$("btnSaveB2B").hide();
                    $$("pnlSummaryMode").hide();
                    $$("btnPreview").show();
                    $$("pnlgstrinvoice").hide();
                    $$("pnlgstrinvoiceothers").hide();
                    $$("ddlGSTType").disable(true);
                    $("#start").attr('disabled', 'disabled');

                })
                var gsttype = [];
                gsttype.push({ gst_no: "1", gst_name: "GSTR1" })//, { gst_no: "2", gst_name: "GSTR2" }
                $$("ddlGSTType").dataBind(gsttype, "gst_no", "gst_name");
                var gsttype1 = [];
                //gsttype1.push({ gst_no: "1", gst_name: "Sales Standard" }, { gst_no: "2", gst_name: "Sales Standard CDN" }, { gst_no: "3", gst_name: "Purchase Standard" }, { gst_no: "4", gst_name: "Purchase Standard CDN" }, { gst_no: "5", gst_name: "B2B" }, { gst_no: "5", gst_name: "B2CL" })
                gsttype1.push({ gst_no: "1", gst_name: "B2B" }, { gst_no: "2", gst_name: "B2CL" }, { gst_no: "3", gst_name: "B2CS" }, { gst_no: "4", gst_name: "HSN" }, { gst_no: "5", gst_name: "DocIssue" })
                $$("ddlGSTR1Type").dataBind(gsttype1, "gst_no", "gst_name");
                var viewmode = [];
                viewmode.push({ view_no: "1", view_name: "Monthly" }, { view_no: "2", view_name: "Three Months" });
                $$("ddlViewMode").dataBind(viewmode, "view_no", "view_name");
                //var MonthViewData = [];
                //MonthViewData.push({ month_no: "1", month_name: "JAN" }, { month_no: "2", month_name: "FEB" })
                //$$("ddlStartMonth").dataBind(MonthViewData, "month_no", "month_name");
                //var viewmode = [];
                //viewmode.push({ year_no: "1", year_name: "2016" }, { year_no: "2", year_name: "2017" }, { year_no: "3", year_name: "2018" }, { year_no: "4", year_name: "2019" })
                //$$("ddlStartYear").dataBind(viewmode, "view_no", "view_name");
                $$("ddlViewMode").selectionChange(function () {
                    if ($$("ddlViewMode").selectedData().gst_name == "B2B") {

                    } else {

                    }
                })
                
                var date = new Date();
                var y = date.getFullYear();
                var m = date.getMonth();
                if (parseFloat(m) < parseFloat(10)) {
                    var month = ("0" +(parseFloat(m)+ parseFloat(1)));
                }
                else {
                    var month = parseFloat(m) + parseFloat(1);
                }
                //var month = new Array();
                //month[0] = "January";
                //month[1] = "February";
                //month[2] = "March";
                //month[3] = "April";
                //month[4] = "May";
                //month[5] = "June";
                //month[6] = "July";
                //month[7] = "August";
                //month[8] = "September";
                //month[9] = "October";
                //month[10] = "November";
                //month[11] = "December";
                //var m = month[date.getMonth()];
                //$("#start").val(y + "-" + month);
                $("#start")[0].value = y + "-" + month;
                $$("ddlViewMode").selectionChange(function () {
                    
                });
                $$("ddlExportType").dataBind(CONTEXT.JASPER_SUPPORTING_FORMATS, "value", "value");
            }

        }
        page.downloadAll_click = function () {
            page.controls.pnlAllPrintingPopup.open();
            page.controls.pnlAllPrintingPopup.title("Report Type");
            page.controls.pnlAllPrintingPopup.rlabel("Report Type");
            page.controls.pnlAllPrintingPopup.width(500);
            page.controls.pnlAllPrintingPopup.height(200);
            //$$("ddlAllGSTExportType").selectedValue("Select");
        }
        page.events.btnAllPrintMultipleBill_click = function () {
            var current_date = moment(new Date()).format('MM-DD-YYYY hh:mm:ss');
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth();
            var year = ($("#start").val() == "") ? y : $("#start").val().split("-")[0];
            var month = ($("#start").val() == "") ? m : $("#start").val().split("-")[1];
            var month1 = parseFloat(month) + parseFloat(1);
            var filter_hsn = "";
            if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                var month2 = parseFloat(month) + parseFloat(2);
                var month3 = parseFloat(month) + parseFloat(3);
                var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "') and comp_id = " + localStorage.getItem("user_company_id");
                filter_hsn = " YEAR(bill_date) =" + year + " AND MONTH(bill_date) IN ('" + month + "','" + month1 + "','" + month2 + "') and bt.comp_id = " + localStorage.getItem("user_company_id");
            }
            if ($$("ddlViewMode").selectedData().view_name == "Monthly") {
                var filter_express = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month + " and comp_id = " + localStorage.getItem("user_company_id");
                filter_hsn = " YEAR(bill_date) =" + year + " AND MONTH(bill_date)=" + month + " and bt.comp_id = " + localStorage.getItem("user_company_id");
            }
            var tax_period = "tax_period like '" + $("#start").val() + "'";
            if ($$("ddlViewMode").selectedData().view_name == "Three Months") {
                tax_period = "";
                for (var i = 0; i < 3; i++) {
                    var per_month = (parseFloat(month) + parseFloat(i)).toString();
                    per_month = (per_month.length == 1) ? "0" + per_month : per_month;
                    if (i > 0)
                        tax_period = tax_period + " or tax_period like '" + year + "-" + per_month + "'";
                    else
                        tax_period = tax_period + "tax_period like '" + year + "-" + per_month + "'";
                }
            }
            var filter = {
                start_record: "",
                end_record: "",
                filter_expression: filter_express + " and (invoice_type='Sale' or invoice_type='SaleReturn') and (gst_no is not null) and (gst_no <> '')  and ("+tax_period+") and tax_classify like 'B2B'",
                sort_expression: ""
            };
            var gstData = {
                "gstin": CONTEXT.COMPANY_GST_NO,
                "fp": $("#start").val().split("-")[1] + "" + $("#start").val().split("-")[0],
                "gt": 0,
                "cur_gt": 0,
                "version": "GST2.2.1",
                "hash": "hash",
            }
            var last_gst_no, last_bill_no, last_tax_class_no;
            page.gstAPI.getGSTR1Sales(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (invoice) {
                if (invoice.length > 0)
                    gstData.b2b = [];
                $(invoice).each(function (i, items) {
                    if (items.gst_no != last_gst_no) {
                        var curCtin = {
                            "ctin": items.gst_no,
                            "inv": []
                        };
                        last_gst_no = items.gst_no;
                    }
                    if (items.invoice_no != last_bill_no) {
                        if (typeof curCtin == "undefined") {
                            var lastInvoice = {
                                "inum": items.invoice_no,
                                "idt": items.invoice_date,
                                "val": items.invoice_value,
                                "pos": "33",
                                "rchrg": "N",
                                "inv_typ": "R",
                                "itms": []
                            };
                            var item_data = {
                                "num": 1801,
                                "itm_det": []
                            }
                            lastInvoice.itms.push(item_data);
                            gstData.b2b[gstData.b2b.length - 1].inv.push(lastInvoice);
                        }
                        else {
                            var lastInvoice = {
                                "inum": items.invoice_no,
                                "idt": items.invoice_date,
                                "val": items.invoice_value,
                                "pos": "33",
                                "rchrg": "N",
                                "inv_typ": "R",
                                "itms": []
                            };
                            var item_data = {
                                "num": 1801,
                                "itm_det": []
                            }
                            lastInvoice.itms.push(item_data);
                            curCtin.inv.push(lastInvoice);
                        }
                        last_bill_no = items.invoice_no;
                    }
                    if (items.invoice_no == last_bill_no && items.tax_class_no != last_tax_class_no) {
                        if (typeof curCtin == "undefined") {
                            var lastItem = {
                                "txval": items.tax_value,
                                "rt": items.rate,
                                "camt": items.cgst_amount,
                                "samt": items.sgst_amount,
                                "csamt": items.cess_amount
                            }
                            gstData.b2b[gstData.b2b.length - 1].inv[gstData.b2b[gstData.b2b.length - 1].inv.length - 1].itms[gstData.b2b[gstData.b2b.length - 1].inv[gstData.b2b[gstData.b2b.length - 1].inv.length - 1].itms.length - 1].itm_det.push(lastItem);
                        }
                        else {
                            var lastItem = {
                                "txval": items.tax_value,
                                "rt": items.rate,
                                "camt": items.cgst_amount,
                                "samt": items.sgst_amount,
                                "csamt": items.cess_amount
                            }
                            curCtin.inv[curCtin.inv.length - 1].itms[curCtin.inv[curCtin.inv.length - 1].itms.length - 1].itm_det.push(lastItem);
                        }
                        last_tax_class_no = items.tax_class_no;
                    }
                    else {
                        if (typeof curCtin == "undefined") {
                            var lastItem = {
                                "txval": items.tax_value,
                                "rt": items.rate,
                                "camt": items.cgst_amount,
                                "samt": items.sgst_amount,
                                "csamt": items.cess_amount
                            }
                            gstData.b2b[gstData.b2b.length - 1].inv[gstData.b2b[gstData.b2b.length - 1].inv.length - 1].itms[gstData.b2b[gstData.b2b.length - 1].inv[gstData.b2b[gstData.b2b.length - 1].inv.length - 1].itms.length - 1].itm_det.push(lastItem);
                        }
                        else {
                            var lastItem = {
                                "txval": items.tax_value,
                                "rt": items.rate,
                                "camt": items.cgst_amount,
                                "samt": items.sgst_amount,
                                "csamt": items.cess_amount
                            }
                            curCtin.inv[curCtin.inv.length - 1].itms[curCtin.inv[curCtin.inv.length - 1].itms.length - 1].itm_det.push(lastItem);
                        }
                        last_tax_class_no = items.tax_class_no;
                    }
                    if (typeof curCtin != "undefined")
                        gstData.b2b.push(curCtin);
                });

                page.gstAPI.getGSTR1Sales(filter.start_record, filter.end_record, filter_express + " and (invoice_type='Sale' or invoice_type='SaleReturn') and invoice_value>250000  and (gst_no is null or gst_no = '') and (" + tax_period + ") and tax_classify like 'B2CL'", filter.sort_expression, function (invoice2) {
                    if (invoice2.length > 0)
                        gstData.b2cl = [];
                    $(invoice2).each(function (i, item) {
                        gstData.b2cl.push({
                            "inum": item.invoice_no,
                            "idt": item.invoice_date,
                            "val": item.invoice_value,
                            "pos": "33",
                            "rt": parseFloat(item.rate).toFixed(2),
                            "txval": parseFloat(item.tax_value).toFixed(2),
                            "csamt": parseFloat(item.cess_amount).toFixed(2),
                        });
                    });
                    filter.filter_expression = filter_express + " and (invoice_type='Sale' or invoice_type='SaleReturn') and invoice_value<=250000 and (gst_no is null or gst_no = '') and (" + tax_period + ") and tax_classify like 'B2CS'";
                    page.gstAPI.getGSTR1Sales(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (invoice1) {
                        if (invoice1.length > 0)
                            gstData.b2cs = [];
                        $(invoice1).each(function (i, item) {
                            gstData.b2cs.push({
                                "sply_ty": "INTRA",
                                "rt": item.rate,
                                "typ": "OE",
                                "pos": "33",
                                "txval": parseFloat(item.tax_value).toFixed(2),
                                "camt": parseFloat(item.cgst_amount).toFixed(2),
                                "samt": parseFloat(item.sgst_amount).toFixed(2),
                                "csamt": parseFloat(item.cess_amount).toFixed(2)
                            });
                        });
                        page.gstAPI.getGSTR1HSN("", "", filter_hsn + " and tct.tax_class_no <> -1 and (bill_type='Sale') and (" + tax_period + ") and tct.hsn_code is not null", "hsn_code", function (invoice) {
                            var data = [];
                            if (invoice.length > 0) {
                                gstData.hsn = [];
                                $(invoice).each(function (i, item) {
                                    data.push({
                                        "num": i + 1,
                                        "hsn_sc": item.hsn_code,
                                        "desc": item.item_name,
                                        "uqc": item.unit,
                                        "qty": item.tot_qty,
                                        "val": item.total_price,
                                        "txval": item.tax_value,
                                        "iamt": item.igst,
                                        "samt": item.sgst,
                                        "camt": item.cgst,
                                        "csamt": item.cess_amount
                                    });
                                });
                                gstData.hsn.push(data);
                            }
                            page.billAPI.searchValues("", "", filter_express, "bill_no asc", function (invoice) {
                                var tot_bills = 0, tot_sales_bill = 0, tot_return_bill = 0;
                                if (invoice.length > 0) {
                                    gstData.doc_issue = {};
                                    gstData.doc_issue.doc_det = [];
                                }
                                var obj = {
                                    "doc_num": 1,
                                    "doc_typ": "Invoices for outward supply",
                                    "docs": []
                                }
                                var item_data = {
                                    "num": 1,
                                    "from": invoice[0].bill_code,
                                    "to": invoice[invoice.length - 1].bill_code,
                                    "totnum": 0,
                                    "cancel": 0,
                                    "net_issue": 0
                                }
                                $(invoice).each(function (i, item) {
                                    if (item.bill_type == "Sale")
                                        tot_sales_bill++;
                                    if (item.bill_type == "SaleReturn")
                                        tot_return_bill++;
                                    if (item.bill_type == "Sale" || item.bill_type == "SaleReturn")
                                        tot_bills++;
                                });
                                item_data.totnum = tot_sales_bill;
                                item_data.cancel = tot_return_bill;
                                item_data.net_issue = parseInt(tot_sales_bill) - parseInt(tot_return_bill);
                                obj.docs.push(item_data);
                                gstData.doc_issue.doc_det.push(obj);

                                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                                var date = new Date();
                                var fileName = monthNames[parseInt(month)-1] + "_GSTR1" + CONTEXT.COMPANY_GST_NO + ".json";
                                var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gstData));
                                var dlAnchorElem = document.getElementById('downloadAllJson');
                                dlAnchorElem.setAttribute("href", dataStr);
                                dlAnchorElem.setAttribute("download", fileName);
                                dlAnchorElem.click();
                            });
                        });
                    });
                });
            });
        }

        page.setSummary = function (data) {
            var total_bill_amount = 0, total_taxable_value = 0;
            $(data).each(function (i, item) {
                if (item.invoice_type == "Sale") {
                    total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.invoice_value);
                    total_taxable_value = parseFloat(total_taxable_value) + parseFloat(item.tax_value);
                }
                else {
                    total_bill_amount = parseFloat(total_bill_amount) - parseFloat(item.invoice_value);
                    total_taxable_value = parseFloat(total_taxable_value) - parseFloat(item.tax_value);
                }
            });
            $$("lblTotalBills").html(data.length);
            $$("lblTotalBillAmount").html(parseFloat(total_bill_amount).toFixed(2));
            $$("lblTotalTaxableAmount").html(parseFloat(total_taxable_value).toFixed(2));
        }
    });

}
