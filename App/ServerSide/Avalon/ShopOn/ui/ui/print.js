$(document).ready(function () {
    
});


var PrintService = {};

PrintService.Print = function (printBox) {
    var array = JSON.stringify(printBox);


    $.getJSON('http://' + CONTEXT.printServerURL + ':8888/PrintService/printreceipt' + '?receiptData=' + encodeURIComponent(array) + '&sam=1&callback=?', function (data) {
        //alert('Receipt printed successfully!');
        
    }, function (error) {
        alert('Error in printing this receipt!. Configure your printer properly!');

    });
    return "success";
}

PrintService.PrintReceipt = function (printBox) {

    var printBoxString = JSON.stringify(printBox);
    //var printBox={ 
    //    PrinterName: "Microsoft Print to PDF",
    //    Width:300,
    //    Height:200,
    //    Lines:[]

    //}
    var result = "";

    $.ajax({
        type: "POST",

        url: "http://" + CONTEXT.printServerURL + ":8888/PrintService/printtest",  //CONTEXT.ReceiptPrinterURL  try now   "http://localhost:8087/printtest", //
        async: true,

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        // crossDomain: true,
        data: JSON.stringify(printBox),
        //headers: {
        //    "auth-token": getCookie("auth_token")

        //},
        success: function (items) {
            //alert("Bill Printed Successfully...");
        },
        error: function (err) {
            //alert("Sorry Error Will Occur Please Check Your Printer Configuration");
        }
    });
}
PrintService.PrintReceiptCallback = function (printBox,callback) {

    var printBoxString = JSON.stringify(printBox);
    var result = "";
    $.ajax({
        type: "POST",
        url: "http://" + CONTEXT.printServerURL + ":8888/PrintService/printtest",  //CONTEXT.ReceiptPrinterURL  try now   "http://localhost:8087/printtest", //
        async: true,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(printBox),
        success: function (items) {
            callback(items);
        },
        error: function (err) {
            callback(err);
        }
    });
}

PrintService.PrintReceiptPDF = function (printBox) {

    var printBoxString = JSON.stringify(printBox);


    $.getJSON(CONTEXT.ReceiptPrinterURL.replace("{printBox}", encodeURIComponent(printBoxString)), function (data) {
        //alert('Receipt printed successfully!');
    }, function (error) {
        alert('Error in printing this receipt!. Configure your printer properly!');

    });
    return "success";

    //var array = JSON.stringify(receipt);
    ////var url = 'http://example.com/?data=' + encodeURIComponent(array);

    //$.getJSON('http://localhost:8888/PrintService/printreceipt' + '?receiptData=' + encodeURIComponent(array) + '&sam=1&callback=?', function (data) {
    //    alert('Receipt printed successfully!');
    //}, function (error) {
    //    alert('Error in printing this receipt!. Configure your printer properly!');

    //});
    //return "success";
}


PrintService.PrintFile = function (jrxml,printData) {

    //printData = { "root": { "BillType": "INVOICE", "CustomerName": "", "Phone": "", "CustAddress": "", "CustCityStreetZipCode": "", "DLNo": "", "isSalesExe": "false", "GST": "", "TIN": "", "Area": "", "SalesExecutiveName": "", "VehicleNo": "", "BillNo": "145", "Abdeen": "Abdeen:", "AbdeenMobile": "9443463089", "Off": "Off:", "OffMobile": "9944410350", "Home": "PH:", "HomeMobile": "04639-245478", "BillDate": "31-08-2017", "NoofItems": "1", "Quantity": "1.00", "BSubTotal": "60.00", "DiscountAmount": "0.00", "BCGST": "3.60", "BSGST": "3.60", "TaxAmount": "7.20", "BillAmount": "67.00", "ApplicaName": "Shop On 3.0", "ApplsName": "SHOP ON 3.0", "CompanyAddress": "VEERAPANDIYAPATNA", "CompanyCityStreetPincode": "", "CompanyPhoneNoEtc": "9944410350", "CompanyDLNo": "TNT/161/20B-TNT/149/21B", "CompanyTINNo": "33586450443", "CompanyGST": "33CCKPS9949CIZ4", "SSSS": "DUPLICATE", "Original": "ORIGINAL", "RoundAmount": "-0.20", "BillItem": [{ "BillItemNo": 1, "ProductName": "Bag", "Pack": "", "Batch": "", "Exp": "", "Qty": "1.00", "Per": "No", "Qty_unit": "1.00", "FreeQty": "0.00", "Rate": "60.00", "PDis": "0.00", "MRP": "60.00", "CGST": "3.60@6.00", "SGST": "3.60@6.00", "GValue": "67.20" }], "BillName": "SALES BILL" } };
    if (CONTEXT.PRINT_PAPER_SIZE.toUpperCase() == "A5") {
        //CONTEXT.BarcodePrinterURL11 = "http://localhost:8888/PrintService/printfile?printData={printData}&appName=ShopOnDev&templateURI=sales-bill-print/main-sales-bill-short-new1.jrxml&exportType=PDF"
        CONTEXT.BarcodePrinterURL11 = "http://" + CONTEXT.printServerURL + ":8888/PrintService/printfile?printData={printData}&appName=ShopOnDev&templateURI=" + jrxml + "&exportType=PDF"
    }
    if (CONTEXT.PRINT_PAPER_SIZE.toUpperCase() == "A4") {
        CONTEXT.BarcodePrinterURL11 = "http://" + CONTEXT.printServerURL + ":8888/PrintService/printdocument?printData={printData}&appName=ShopOnDev&templateURI=" + jrxml + "&exportType=PDF"
    }
    var printBoxString = JSON.stringify({ root: printData });


    $.getJSON(CONTEXT.BarcodePrinterURL11.replace("{printData}", encodeURIComponent(printBoxString)), function (data) {
        //alert('Jasper printed successfully!');
    }, function (error) {
        alert('Error in printing this receipt!. Configure your printer properly!');

    });
    return "success";

    //// Get the JsonP data

    //var array = JSON.stringify(barCode);
    ////var url = 'http://example.com/?data=' + encodeURIComponent(array);


    //$.getJSON('http://localhost:8888/PrintService/printbarcode' + '?barcodeData=' + encodeURIComponent(array) + '&sam=1&callback=?', function (data) {
    //    alert('Barcode printed successfully for this item!');
    //}, function (error) {
    //    alert('Error in printing this item barcode !. Configure your printer properly!');

    //});
    //return "success";
}

PrintService.PrintFileCallback = function (jrxml, printData,callback) {

    //printData = { "root": { "BillType": "INVOICE", "CustomerName": "", "Phone": "", "CustAddress": "", "CustCityStreetZipCode": "", "DLNo": "", "isSalesExe": "false", "GST": "", "TIN": "", "Area": "", "SalesExecutiveName": "", "VehicleNo": "", "BillNo": "145", "Abdeen": "Abdeen:", "AbdeenMobile": "9443463089", "Off": "Off:", "OffMobile": "9944410350", "Home": "PH:", "HomeMobile": "04639-245478", "BillDate": "31-08-2017", "NoofItems": "1", "Quantity": "1.00", "BSubTotal": "60.00", "DiscountAmount": "0.00", "BCGST": "3.60", "BSGST": "3.60", "TaxAmount": "7.20", "BillAmount": "67.00", "ApplicaName": "Shop On 3.0", "ApplsName": "SHOP ON 3.0", "CompanyAddress": "VEERAPANDIYAPATNA", "CompanyCityStreetPincode": "", "CompanyPhoneNoEtc": "9944410350", "CompanyDLNo": "TNT/161/20B-TNT/149/21B", "CompanyTINNo": "33586450443", "CompanyGST": "33CCKPS9949CIZ4", "SSSS": "DUPLICATE", "Original": "ORIGINAL", "RoundAmount": "-0.20", "BillItem": [{ "BillItemNo": 1, "ProductName": "Bag", "Pack": "", "Batch": "", "Exp": "", "Qty": "1.00", "Per": "No", "Qty_unit": "1.00", "FreeQty": "0.00", "Rate": "60.00", "PDis": "0.00", "MRP": "60.00", "CGST": "3.60@6.00", "SGST": "3.60@6.00", "GValue": "67.20" }], "BillName": "SALES BILL" } };
    if (CONTEXT.PRINT_PAPER_SIZE.toUpperCase() == "A5") {
        //CONTEXT.BarcodePrinterURL11 = "http://localhost:8888/PrintService/printfile?printData={printData}&appName=ShopOnDev&templateURI=sales-bill-print/main-sales-bill-short-new1.jrxml&exportType=PDF"
        CONTEXT.BarcodePrinterURL11 = "http://" + CONTEXT.printServerURL + ":8888/PrintService/printfile?printData={printData}&appName=ShopOnDev&templateURI=" + jrxml + "&exportType=PDF"
    }
    if (CONTEXT.PRINT_PAPER_SIZE.toUpperCase() == "A4") {
        CONTEXT.BarcodePrinterURL11 = "http://" + CONTEXT.printServerURL + ":8888/PrintService/printdocument?printData={printData}&appName=ShopOnDev&templateURI=" + jrxml + "&exportType=PDF"
    }
    var printBoxString = JSON.stringify({ root: printData });


    $.getJSON(CONTEXT.BarcodePrinterURL11.replace("{printData}", encodeURIComponent(printBoxString)), function (data) {
        callback([]);
    }, function (error) {
        alert('Error in printing this receipt!. Configure your printer properly!');

    });
    return "success";
}

PrintService.PrintBarcode = function (printBox) {

    var printBoxString = JSON.stringify(printBox);


    $.getJSON(CONTEXT.BarcodePrinterURL.replace("{printBox}", encodeURIComponent(printBoxString)), function (data) {
        //alert('Barcode printed successfully!');
    }, function (error) {
        alert('Error in printing this receipt!. Configure your printer properly!');

    });
    return "success";

    //// Get the JsonP data

    //var array = JSON.stringify(barCode);
    ////var url = 'http://example.com/?data=' + encodeURIComponent(array);


    //$.getJSON('http://localhost:8888/PrintService/printbarcode' + '?barcodeData=' + encodeURIComponent(array) + '&sam=1&callback=?', function (data) {
    //    alert('Barcode printed successfully for this item!');
    //}, function (error) {
    //    alert('Error in printing this item barcode !. Configure your printer properly!');

    //});
    //return "success";
}

PrintService.PrintStringBarcode = function (printBox) {

    var printBoxString = JSON.stringify(printBox);

    var barcodePrinterUrl = "http://" + CONTEXT.printServerURL + ":8888/PrintService/PrintStringBarcode?printBox={printBox}&printerName=Bar%20Code%20Printer%20TT033-50&callback=?"
    $.getJSON(barcodePrinterUrl.replace("{printBox}", encodeURIComponent(printBoxString)), function (data) {
        //alert('Barcode printed successfully!');
    }, function (error) {
        alert('Error in printing this receipt!. Configure your printer properly!');

    });
    return "success";

}

PrintService.PrintQRCode = function (printBox) {

    var printBoxString = JSON.stringify(printBox);
    var result = "";

    $.ajax({
        type: "POST",

        url: "http://" + CONTEXT.printServerURL + ":8888/PrintService/printqr",  //CONTEXT.ReceiptPrinterURL  try now   "http://localhost:8087/printtest", //
        async: true,

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        // crossDomain: true,
        data: JSON.stringify(printBox),
        success: function (items) {
            //alert("Bill Printed Successfully...");
        },
        error: function (err) {
            //alert("Sorry Error Will Occur Please Check Your Printer Configuration");
        }
    });
}

PrintService.PrintPOSReceipt = function (printBox) {

    var printBoxString = JSON.stringify(printBox);
    var result = "";

    $.ajax({
        type: "POST",

        url: "http://" + CONTEXT.printServerURL + ":8888/PrintService/printposreceipt",  //CONTEXT.ReceiptPrinterURL  try now   "http://localhost:8087/printtest", //
        async: true,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(printBox),
        
        success: function (items) {
        },
        error: function (err) {
            
        }
    });
}

PrintService.PrintPOSCashReceipt = function (printBox) {

    var printBoxString = JSON.stringify(printBox);
    var result = "";

    $.ajax({
        type: "POST",

        url: "http://" + CONTEXT.printServerURL + ":8888/PrintService/printposcashreceipt",  //CONTEXT.ReceiptPrinterURL  try now   "http://localhost:8087/printtest", //
        async: true,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(printBox),

        success: function (items) {
        },
        error: function (err) {

        }
    });
}


function printBarcode(item) {

    if (parseInt(item.printRow) == 2) {
        item.printCount = item.printCount;
        if (item.printCount == null || item.printCount == "") {
            item.printCount = 1;
        }
        else {
            item.printCount = parseFloat(item.printCount) / 2;
        }
        for (var i = 0; i < item.printCount ; i++) {
            var pagePrinter1 = true;
            var pagePrinter2 = true;
            var check = item.printCount - i;
            if (check == 0.5)
                pagePrinter2 = false;
            var printBox = {
                PrinterName: CONTEXT.BARCODE_PRINTER_NAME,
                Width: 500,
                Height: 100,
                Lines: []
            };
            //Barcode Printer Code
            var item_price = "Rs: " + parseFloat(item.selling_price).toFixed(2);
            //var printBarcodeNo = (item.barcode == "" || item.barcode == null || typeof item.barcode == "undefined") ? item.item_name.substring(0, 10) : item.barcode.substring(0, 10);
            var printBarcodeNo = (item.barcode == "" || item.barcode == null || typeof item.barcode == "undefined") ? getBitByVariation(item.var_no, 13) : item.barcode.substring(0, 10);
            item.item_name = item.item_name;
            var itemNo = "#" + item.item_no + " @" + item.var_no;
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

    if (parseInt(item.printRow) == 3) {
        item.printCount = item.printCount;
        if (item.printCount == null || item.printCount == "") {
            item.printCount = 1;
        }
        else {
            item.printCount = parseFloat(item.printCount) / 3;
        }
        for (var i = 0; i < item.printCount ; i++) {
            var pagePrinter1 = true;
            var pagePrinter2 = true;
            var pagePrinter3 = true;
            var check = item.printCount - i;
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
                Lines: []
            };
            //Barcode Printer Code
            var item_price = "Rs: " + parseFloat(item.selling_price).toFixed(2);
            var printBarcodeNo = (item.barcode == "" || item.barcode == null || typeof item.barcode == "undefined") ? getBitByVariation(item.var_no, 9) : item.barcode.substring(0, 7);
            item.item_name = item.item_name;// + " #" + item.item_no + " @" + item.var_no;
            var itemNo = "#" + item.item_no + " @" + item.var_no;
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
        }
    }

    if (parseInt(item.printRow) == 4) {
        item.printCount = item.printCount;
        if (item.printCount == null || item.printCount == "")
            item.printCount = 1;
        else {
            item.printCount = parseFloat(item.printCount) / 4;
        }
        for (var i = 0; i < item.printCount ; i++) {
            var pagePrinter1 = true;
            var pagePrinter2 = true;
            var pagePrinter3 = true;
            var pagePrinter4 = true;
            var check = item.printCount - i;
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
            var item_price = "Rs: " + parseFloat(item.selling_price).toFixed(2);
            var printBarcodeNo = (item.barcode == "" || item.barcode == null || typeof item.barcode == "undefined") ? getBitByVariation(item.var_no, 5) : item.barcode.substring(0, 4);
            var itemNo = " #" + item.item_no + " @" + item.var_no;
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
    }
}

function printStockBarcode(item) {

    if (parseInt(item.printRow) == 2) {
        item.printCount = item.printCount;
        if (item.printCount == null || item.printCount == "") {
            item.printCount = 1;
        }
        else {
            item.printCount = parseFloat(item.printCount) / 2;
        }
        for (var i = 0; i < item.printCount ; i++) {
            var pagePrinter1 = true;
            var pagePrinter2 = true;
            var check = item.printCount - i;
            if (check == 0.5)
                pagePrinter2 = false;
            var printBox = {
                PrinterName: CONTEXT.BARCODE_PRINTER_NAME,
                Width: 500,
                Height: 100,
                Lines: []
            };
            //Barcode Printer Code
            var item_price = "Rs: " + parseFloat(item.selling_price).toFixed(2);
            var printBarcodeNo = (item.barcode == "" || item.barcode == null || typeof item.barcode == "undefined") ? getBitByStock(item.sku_no, 13) : item.barcode.substring(0, 10);
            if (item.barcode == "" || item.barcode == null || typeof item.barcode == "undefined") {
                barcodeLabel = "S" + item.sku_no.substring(0, 13);
            }
            else {
                barcodeLabel = item.barcode;
            }

            if (pagePrinter1)
                printBox.Lines.push({ StartX: 25, StartY: 8, Text: (CONTEXT.COMPANY_NAME), FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
            if (pagePrinter2)
                printBox.Lines.push({ StartX: 230, StartY: 8, Text: (CONTEXT.COMPANY_NAME), FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });

            if (pagePrinter1)
                printBox.Lines.push({ StartX: 25, StartY: 25, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 14, FontStyle: 1, TextHeight: 15, TextWidth: 160 });
            if (pagePrinter2)
                printBox.Lines.push({ StartX: 230, StartY: 25, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 14, FontStyle: 1, TextHeight: 15, TextWidth: 160 });

            if (pagePrinter1)
                printBox.Lines.push({ StartX: 25, StartY: 25, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 14, FontStyle: 1, TextHeight: 15, TextWidth: 160 });
            if (pagePrinter2)
                printBox.Lines.push({ StartX: 230, StartY: 25, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 14, FontStyle: 1, TextHeight: 15, TextWidth: 160 });

            if (pagePrinter1) {
                printBox.Lines.push({ StartX: 25, StartY: 40, Text: barcodeLabel, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });//(item.item_name).substring(0, 20)
                printBox.Lines.push({ StartX: 160, StartY: 40, Text: item.size.substring(0, 10), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });//(item.item_name).substring(0, 20)
            }
            if (pagePrinter2) {
                printBox.Lines.push({ StartX: 230, StartY: 40, Text: barcodeLabel, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                printBox.Lines.push({ StartX: 365, StartY: 40, Text: item.size.substring(0, 10), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });//(item.item_name).substring(0, 20)
            }
            
            if (pagePrinter1) {
                printBox.Lines.push({ StartX: 25, StartY: 53, Text: (item.product_type + "-" + item.item_name).substring(0, 16), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });//item_price
            }
            if (pagePrinter2) {
                printBox.Lines.push({ StartX: 230, StartY: 53, Text: (item.product_type + "-" + item.item_name).substring(0, 16), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            }
            
            if (pagePrinter1)
                printBox.Lines.push({ StartX: 25, StartY: 66, Text: item_price, FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
            if (pagePrinter2)
                printBox.Lines.push({ StartX: 230, StartY: 66, Text: item_price, FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
            
            if (pagePrinter1) {
                printBox.Lines.push({ StartX: 25, StartY: 86, Text: item.vendor_name.substring(0, 18), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                printBox.Lines.push({ StartX: 160, StartY: 86, Text: item.bill_no.substring(0, 6), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            }
            if (pagePrinter2) {
                printBox.Lines.push({ StartX: 230, StartY: 86, Text: item.vendor_name.substring(0, 18), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                printBox.Lines.push({ StartX: 365, StartY: 86, Text: item.bill_no.substring(0, 6), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            }
            

            PrintService.PrintBarcode(printBox);
        }

    }

    if (parseInt(item.printRow) == 3) {
        item.printCount = item.printCount;
        if (item.printCount == null || item.printCount == "") {
            item.printCount = 1;
        }
        else {
            item.printCount = parseFloat(item.printCount) / 3;
        }
        for (var i = 0; i < item.printCount ; i++) {
            var pagePrinter1 = true;
            var pagePrinter2 = true;
            var pagePrinter3 = true;
            var check = item.printCount - i;
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
                Lines: []
            };
            //Barcode Printer Code
            var item_price = "Rs: " + parseFloat(item.selling_price).toFixed(2);
            var printBarcodeNo = (item.barcode == "" || item.barcode == null || typeof item.barcode == "undefined") ? getBitByStock(item.sku_no, 10) : item.barcode.substring(0, 7);
            var barcodeLabel = "";
            if (item.barcode == "" || item.barcode == null || typeof item.barcode == "undefined") {
                barcodeLabel = "S" + item.sku_no.substring(0, 12);
            }
            else {
                barcodeLabel = item.barcode;
            }
            if (pagePrinter1)
                printBox.Lines.push({ StartX: 10, StartY: 5, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            if (pagePrinter2)
                printBox.Lines.push({ StartX: 150, StartY: 5, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            if (pagePrinter3)
                printBox.Lines.push({ StartX: 290, StartY: 5, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

            if (pagePrinter1)
                printBox.Lines.push({ StartX: 5, StartY: 18, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 12, FontStyle: 1, TextHeight: 18, TextWidth: 120 });
            if (pagePrinter2)
                printBox.Lines.push({ StartX: 145, StartY: 18, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 12, FontStyle: 1, TextHeight: 18, TextWidth: 120 });
            if (pagePrinter3)
                printBox.Lines.push({ StartX: 285, StartY: 18, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 12, FontStyle: 1, TextHeight: 18, TextWidth: 120 });

            if (pagePrinter1)
                printBox.Lines.push({ StartX: 5, StartY: 18, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 12, FontStyle: 1, TextHeight: 18, TextWidth: 120 });
            if (pagePrinter2)
                printBox.Lines.push({ StartX: 145, StartY: 18, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 12, FontStyle: 1, TextHeight: 18, TextWidth: 120 });
            if (pagePrinter3)
                printBox.Lines.push({ StartX: 285, StartY: 18, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 12, FontStyle: 1, TextHeight: 18, TextWidth: 120 });

            if (pagePrinter1) {
                printBox.Lines.push({ StartX: 10, StartY: 40, Text: barcodeLabel, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                printBox.Lines.push({ StartX: 100, StartY: 40, Text: item.size.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            }
            if (pagePrinter2) {
                printBox.Lines.push({ StartX: 150, StartY: 40, Text: barcodeLabel, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                printBox.Lines.push({ StartX: 240, StartY: 40, Text: item.size.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            }
            if (pagePrinter3) {
                printBox.Lines.push({ StartX: 290, StartY: 40, Text: barcodeLabel, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                printBox.Lines.push({ StartX: 380, StartY: 40, Text: item.size.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            }

            if (pagePrinter1)
                printBox.Lines.push({ StartX: 10, StartY: 51, Text: (item.product_type + "-" + item.item_name).substring(0, 17), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            if (pagePrinter2)
                printBox.Lines.push({ StartX: 150, StartY: 51, Text: (item.product_type + "-" + item.item_name).substring(0, 17), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            if (pagePrinter3)
                printBox.Lines.push({ StartX: 290, StartY: 51, Text: (item.product_type + "-" + item.item_name).substring(0, 17), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });


            if (pagePrinter1)
                printBox.Lines.push({ StartX: 10, StartY: 61, Text: item_price, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
            if (pagePrinter2)
                printBox.Lines.push({ StartX: 150, StartY: 61, Text: item_price, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
            if (pagePrinter3)
                printBox.Lines.push({ StartX: 290, StartY: 61, Text: item_price, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });

            if (pagePrinter1) {
                printBox.Lines.push({ StartX: 10, StartY: 75, Text: item.vendor_name.substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                printBox.Lines.push({ StartX: 100, StartY: 75, Text: item.bill_no.substring(0, 6), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            }
            if (pagePrinter2) {
                printBox.Lines.push({ StartX: 150, StartY: 75, Text: item.vendor_name.substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                printBox.Lines.push({ StartX: 240, StartY: 75, Text: item.bill_no.substring(0, 6), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            }
            if (pagePrinter3) {
                printBox.Lines.push({ StartX: 290, StartY: 75, Text: item.vendor_name.substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                printBox.Lines.push({ StartX: 380, StartY: 75, Text: item.bill_no.substring(0, 6), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            }


            PrintService.PrintBarcode(printBox);
        }
    }

    if (parseInt(item.printRow) == 4) {
        item.printCount = item.printCount;
        if (item.printCount == null || item.printCount == "")
            item.printCount = 1;
        else {
            item.printCount = parseFloat(item.printCount) / 4;
        }
        for (var i = 0; i < item.printCount ; i++) {
            var pagePrinter1 = true;
            var pagePrinter2 = true;
            var pagePrinter3 = true;
            var pagePrinter4 = true;
            var check = item.printCount - i;
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
                Height: 85,
                Lines: []
            };
            //Barcode Printer Code
            var item_price = "Rs: " + parseFloat(item.selling_price).toFixed(2);
            var printBarcodeNo = (item.barcode == "" || item.barcode == null || typeof item.barcode == "undefined") ? getBitByStock(item.sku_no, 5) : item.barcode.substring(0, 4);
            var barcodeLabel = "";
            if (item.barcode == "" || item.barcode == null || typeof item.barcode == "undefined") {
                barcodeLabel = "S" + item.sku_no.substring(0, 5);
            }
            else {
                barcodeLabel = item.barcode.substring(0, 5);
            }
            if (pagePrinter1)
                printBox.Lines.push({ StartX: 20, StartY: 0, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            if (pagePrinter2)
                printBox.Lines.push({ StartX: 120, StartY: 0, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            if (pagePrinter3)
                printBox.Lines.push({ StartX: 220, StartY: 0, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            if (pagePrinter4)
                printBox.Lines.push({ StartX: 320, StartY: 0, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

            if (pagePrinter1)
                printBox.Lines.push({ StartX: 5, StartY: 10, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
            if (pagePrinter2)
                printBox.Lines.push({ StartX: 115, StartY: 10, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
            if (pagePrinter3)
                printBox.Lines.push({ StartX: 215, StartY: 10, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
            if (pagePrinter4)
                printBox.Lines.push({ StartX: 315, StartY: 10, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });

            if (pagePrinter1)
                printBox.Lines.push({ StartX: 5, StartY: 10, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
            if (pagePrinter2)
                printBox.Lines.push({ StartX: 115, StartY: 10, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
            if (pagePrinter3)
                printBox.Lines.push({ StartX: 215, StartY: 10, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
            if (pagePrinter4)
                printBox.Lines.push({ StartX: 315, StartY: 10, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });

            if (pagePrinter1) {
                printBox.Lines.push({ StartX: 15, StartY: 27, Text: barcodeLabel, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                printBox.Lines.push({ StartX: 85, StartY: 27, Text: item.size.substring(0, 4), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            }
            if (pagePrinter2) {
                printBox.Lines.push({ StartX: 115, StartY: 27, Text: barcodeLabel, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                printBox.Lines.push({ StartX: 185, StartY: 27, Text: item.size.substring(0, 4), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            }
            if (pagePrinter3) {
                printBox.Lines.push({ StartX: 215, StartY: 27, Text: barcodeLabel, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                printBox.Lines.push({ StartX: 285, StartY: 27, Text: item.size.substring(0, 4), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            }
            if (pagePrinter4) {
                printBox.Lines.push({ StartX: 315, StartY: 27, Text: barcodeLabel, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                printBox.Lines.push({ StartX: 385, StartY: 27, Text: item.size.substring(0, 4), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            }

            if (pagePrinter1)
                printBox.Lines.push({ StartX: 15, StartY: 37, Text: item.product_type.substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            if (pagePrinter2)
                printBox.Lines.push({ StartX: 115, StartY: 37, Text: item.product_type.substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            if (pagePrinter3)
                printBox.Lines.push({ StartX: 215, StartY: 37, Text: item.product_type.substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            if (pagePrinter4)
                printBox.Lines.push({ StartX: 315, StartY: 37, Text: item.product_type.substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });


            if (pagePrinter1)
                printBox.Lines.push({ StartX: 15, StartY: 47, Text: item_price, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            if (pagePrinter2)
                printBox.Lines.push({ StartX: 115, StartY: 47, Text: item_price, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            if (pagePrinter3)
                printBox.Lines.push({ StartX: 215, StartY: 47, Text: item_price, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            if (pagePrinter4)
                printBox.Lines.push({ StartX: 315, StartY: 47, Text: item_price, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

            if (pagePrinter1) {
                printBox.Lines.push({ StartX: 15, StartY: 59, Text: item.item_name.substring(0, 8), FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                printBox.Lines.push({ StartX: 85, StartY: 59, Text: item.bill_no.substring(0, 6), FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
            }
            if (pagePrinter2) {
                printBox.Lines.push({ StartX: 115, StartY: 59, Text: item.item_name.substring(0, 8), FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                printBox.Lines.push({ StartX: 185, StartY: 59, Text: item.bill_no.substring(0, 6), FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
            }
            if (pagePrinter3) {
                printBox.Lines.push({ StartX: 215, StartY: 59, Text: item.item_name.substring(0, 8), FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                printBox.Lines.push({ StartX: 285, StartY: 59, Text: item.bill_no.substring(0, 6), FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
            }
            if (pagePrinter4) {
                printBox.Lines.push({ StartX: 315, StartY: 59, Text: item.item_name.substring(0, 8), FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                printBox.Lines.push({ StartX: 385, StartY: 59, Text: item.bill_no.substring(0, 6), FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
            }

            PrintService.PrintBarcode(printBox);
        }
    }
}

