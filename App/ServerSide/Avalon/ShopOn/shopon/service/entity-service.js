function EntityService() {

    this.getEntity = function (entity_name, condition, sort_by, callback) {


        if (entity_name == "1") {

            $.server.webMethod("Entity.getBillEntity", "condition;" + condition + ",sort_by;" + sort_by , function (data) {
           // $.server.webMethod("Entity.getBillEntity", map.toString(), function (data) {

                //var data = [
                //    {
                //bill_no: "1", bill_date: "10-10-2017", cust_no: "12",
                //billItems: [
                //   { item_no: "21", qty: "3", price: "4.5" }
                //]
                //    },
                //];

                var myBill = [];
                var lastBillNo = "";
                var lastBillItems = null;
                $(data).each(function (i, bill) {
                    if (bill.bill_no != lastBillNo) {
                        lastBillItems = [];
                        myBill.push({ bill_no: bill.bill_no, bill_date: bill.bill_date, cust_no: bill.cust_no, cust_name: bill.cust_name, bill_items: lastBillItems })

                    }
                    lastBillItems.push({ item_no: bill.item_no, qty: bill.qty, price: bill.price });
                    lastBillNo = bill.bill_no;

                });
                callback(myBill);
            });




            //[
            //    {
            //        bill_no: "1", bill_date: "", cust_no: "", cust_name: "",
            //        bill_items: [
            //            { item_no: "", qty: "", price: "" },
            //             { item_no: "", qty: "", price: "" },
            //              { item_no: "", qty: "", price: "" }
            //        ]
            //    },
            //     { bill_no: "1", bill_date: "", cust_no: "", cust_name: "", bill_items: [{ item_no: "", qty: "", price: "" }] },
            //       { bill_no: "1", bill_date: "", cust_no: "", cust_name: "", bill_items: [{ item_no: "", qty: "", price: "" }] },
            //         { bill_no: "1", bill_date: "", cust_no: "", cust_name: "", bill_items: [{ item_no: "", qty: "", price: "" }] },
            //]

        }
        if (entity_name == "3") {

            $.server.webMethod("Entity.getProductEntity", "condition;" + condition + ",sort_by;" + sort_by, function (data) {
                var myBill = [];
                var lastBillNo = "";
                $(data).each(function (i, bill) {
                        myBill.push({ item_no: bill.item_no, item_name: bill.item_name })
                });
                callback(myBill);
            });
        }


    }


}





function generatePrint(template1, data, copies) {

    var tot_print = parseInt(copies);
    var st_count = 0;

    var template = [
        { StartX: 10, StartY: 0, Text: "Bill No", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },
        { StartX: 68, StartY: 0, Text: "{bill_no}", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },
        { StartX: 70, StartY: 0, Text: "Bill Date", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },
        { StartX: 130, StartY: 0, Text: "{bill_date}", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },
        { StartX: 20, StartY: 20, Text: "Customer", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },
        { StartX: 100, StartY: 15, Text: "{cust_name}", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },

        { StartX: 10, StartY: 23, Text: "Item No", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },
        { StartX: 100, StartY: 23, Text: "Qty", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },
        { StartX: 160, StartY: 23, Text: "Price", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },

          {
              loop: "bill_items", templateItems: [
                   { StartX: 10, StartY: "{index}*10 + 30", Text: "{item_no}", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },
                   { StartX: 100, StartY: "{index}*10 + 30", Text: "{qty}", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },
                   { StartX: 160, StartY: "{index}*10 + 30", Text: "{price}", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },
              ]
          },
       // { printX: 20, printY: "{lastY} + 10", text: "{company_name}" },
    ];

    //data = [
    //            {
    //                bill_no: "1", bill_date: "10-10-2017", cust_no: "1", cust_name: "abc",
    //                bill_items: [
    //                    { item_no: "1", qty: "10", price: "12" },
    //                     { item_no: "2", qty: "20", price: "13" },
    //                      { item_no: "3", qty: "30", price: "15" }
    //                ]
    //            },

    //];
   // var lastPrintY = "0";
    $(data).each(function (i, item) {

       
        var lastIndex = 0;
        var newTemplate = {

            PrinterName: "RP 3150 STAR",
            Width: 280,
            Height: 300,
            Lines: []
        };
            $(template).each(function (j, temp) {
                if (temp.loop) {

                    $(item[temp.loop]).each(function (k, nestItem) {

                        $(temp.templateItems).each(function (l, nestTemp) {
                            var genTemp = $.util.clone(nestTemp);
                            for (var prop in nestItem) {
                                genTemp.Text = genTemp.Text.replaceAll("{" + prop + "}", nestItem[prop]);
                            }
                            genTemp.StartY = eval(genTemp.StartY.replace("{index}", k));
                            newTemplate.Lines.push(genTemp);
                        });
                       
                    });

                }
                else {
                    var genTemp = $.util.clone(temp);
                    for (var prop in item) {
                        genTemp.Text = genTemp.Text.replaceAll("{" + prop + "}", item[prop]);
                    }        
                    newTemplate.Lines.push(genTemp);
                }
               

            });

        ///Call printing method with newTemplate
            for (st_count=0; parseInt(st_count) < parseInt(tot_print); st_count++)
                PrintService.PrintReceipt(newTemplate);
      
    });

}

function generateBarCodePrint(template1, data, copies) {

    var tot_print = parseInt(copies);
    var st_count = 0;

    var template = [
        { StartX: 15, StartY: 13, BarcodeText: "{item_no}", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },
        { StartX: 150, StartY: 13, BarcodeText: "{item_no}", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },
        { StartX: 290, StartY: 13, BarcodeText: "{item_no}", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },

        { StartX: 15, StartY: 13, BarcodeText: "{item_no}", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },
        { StartX: 150, StartY: 13, BarcodeText: "{item_no}", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },
        { StartX: 290, StartY: 13, BarcodeText: "{item_no}", FontFamily: "Courier New", FontSize: 10, FontStyle: 0 },
    ];

    $(data).each(function (i, item) {


        var lastIndex = 0;
        var newTemplate = {

            PrinterName: "Microsoft Print to PDF",
            Width: 500,
            Height: 100,
            Lines: []
        };
        $(template).each(function (j, temp) {
            
                var genTemp = $.util.clone(temp);
                for (var prop in item) {
                    genTemp.BarcodeText = genTemp.BarcodeText.replaceAll("{" + prop + "}", item[prop]);
                }
                newTemplate.Lines.push(genTemp);
            


        });

        ///Call printing method with newTemplate
        for (st_count = 0; parseInt(st_count) < parseInt(tot_print) ; st_count++)
            PrintService.PrintBarcode(newTemplate);

    });

}



//function genratePrint(dummy_template, dummy_data) {

//    var template = [
//        { printX: "10", printY: "10", text: "{bill_no}" },
//        { printX: "60", printY: "10", text: "{bill_date}" },
//        { printX: "20", printY: "20", text: "{cust_name}" },
//          {
//              loop: "bill_items", templateItems: [
//                   { printX: "10", printY: "{index}*10 + 30", text: "{item_no}" },
//                   { printX: "60", printY: "{index}*10 + 30", text: "{qty}" },
//                   { printX: "110", printY: "{index}*10 + 30", text: "{price}" },
//              ]
//          },
//        { printX: "20", printY: "{lastY} + 10", text: "{company_name}" },
//    ];

//    data = [
//                {
//                    bill_no: "1", bill_date: "10-10-2017", cust_no: "1", cust_name: "abc",
//                    bill_items: [
//                        { item_no: "1", qty: "10", price: "12" },
//                         { item_no: "2", qty: "20", price: "13" },
//                          { item_no: "3", qty: "30", price: "15" }
//                    ]
//                },
//                {
//                    bill_no: "1", bill_date: "10-10-2017", cust_no: "1", cust_name: "abc",
//                    bill_items: [
//                        { item_no: "1", qty: "10", price: "12" },
//                         { item_no: "2", qty: "20", price: "13" },
//                          { item_no: "3", qty: "30", price: "15" }
//                    ]
//                },
//                   {
//                       bill_no: "1", bill_date: "10-10-2017", cust_no: "1", cust_name: "abc",
//                       bill_items: [
//                           { item_no: "1", qty: "10", price: "12" },
//                            { item_no: "2", qty: "20", price: "13" },
//                             { item_no: "3", qty: "30", price: "15" }
//                       ]
//                   },

//    ];
//    var lastPrintY = "0";
//    $(data).each(function (i, item) {


//        var newTemplate = [];
//        $(template).each(function (j, temp) {
//            if (temp.loop) {

//                $(item[temp.loop]).each(function (k, nestItem) {

//                    $(temp.templateItems).each(function (l, nestTemp) {
//                        var genTemp = $.util.clone(nestTemp);
//                        for (var prop in item) {
//                            genTemp.text = $.utill.replaceAll(genTemp.text, "{" + prop + "}", nestItem[prop]);
//                        }
//                        genTemp.printY = eval(genTemp.printY.replace("{index}", k));
//                        genTemp.printY = eval(genTemp.printY.replace("{lastY}", lastPrintY));
//                        newTemplate.push(genTemp);
//                        lastPrintY = genTemp.printY;
//                    });

//                });

//            } else {
//                var genTemp = $.util.clone(temp);
//                for (var prop in item) {
//                    genTemp.text = $.utill.replaceAll(genTemp.text, "{" + prop + "}", item[prop]);
//                }
//                genTemp.printY = eval(genTemp.printY.replace("{lastY}", lastPrintY));
//                newTemplate.push(genTemp);
//                lastPrintY = genTemp.printY;
//            }


//        });

//        ///Call printing method wuth newTemplate
//        PrintService.PrintReceipt(newTemplate);

//    });

//}