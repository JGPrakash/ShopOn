function TrayService() {
    var self = this;

    
    this.downloadTray = function ( callback) {
        $.server.webMethod("EggTray.downloadTray", "", callback);
    }

    this.getTrayDetailsBySearch = function(term, callback) {


            $.server.webMethod("EggTray.getTrayDetailsBySearch", "term;%" + term + "%", callback);
        



    }
    this.getTrayByNo = function(tray_id, callback) {


        var map = new Map();
        map.add("tray_id", tray_id);


        $.server.webMethod("EggTray.getTrayByNo", map.toString(), callback);
    }
    this.getTrayTransaction = function(cust_id,tray_id, callback) {


        var map = new Map();
        map.add("cust_id", cust_id);
        map.add("tray_id", tray_id);


        $.server.webMethod("EggTray.getTrayTransaction", map.toString(), callback);
    }

    this.getTrayItems = function(term, callback) {

        $.server.webMethod("EggTray.getTrayItems", "tray_id;" + term + "", callback);
    }

    this.getTrayCustItems = function(term, callback) {

        $.server.webMethod("EggTray.getTrayCustItems", "tray_id;" + term + "", callback);
    }


    this.getTrayCountByCustomer = function(term, callback) {

        if (androidApp == true) {
            AndroidProxy.execute("select * from local_customer_t where cust_id=" + term, function(data) {
                $(data).each(function(i, item) {
                    callback([{ tray_count: item.tray_total, tray_count: item.tray_total }]);
                });
            });
        } else {
            $.server.webMethod("EggTray.getTrayCountByCustomer", "cust_id;" + term + "", callback);

        }

    }


    this.getTrayDetailsCustomer = function(term, callback) {

        $.server.webMethod("EggTray.getTrayDetailsCustomer", "cust_id;" + term + "", callback);
    }



    this.getTrayDetailsByDay = function(term, callback) {
        if (androidApp == true) {
            AndroidProxy.execute("select * from local_customer_t where cust_id=" + term, function(data) {
                $(data).each(function(i, item) {
                    callback([{ tray_in: item.tray_in, tray_in: item.tray_in }]);
                    callback([{ tray_out: item.tray_out, tray_out: item.tray_out }]);
                });
            });
        } else {
            $.server.webMethod("EggTray.getTrayDetailsByDay", "cust_id;" + term + "", callback);

        }


    }

    this.getTrayDetailsDownload = function(term, callback) {
        $.server.webMethod("EggTray.getTrayDetailsDownload", "cust_id;" + term + "", callback);
    }



    /* this.changeState = function (poNo, stateNo, callback) {
     $.server.webMethod("SalesOrder.changeState", "order_id;" + stateNo + "",callback);
     }*/

    this.insertEggTray = function(data, callback, error) {
        var map = new Map();
        map.add("tray_name", data.tray_name, 'Text');
        map.add("tray_desc", data.tray_desc, 'Text');
        //  map.add("item_no", data.item_no);

        return $.server.webMethod("EggTray.insertEggTray", map.toString(), callback, error);
    }

    this.insertEggTrayTransaction = function(data, callback) {
        var map = new Map();
        map.add("tray_id", data.tray_id);
        map.add("tray_count", data.tray_count);
        map.add("trans_type", data.trans_type, 'Text');

        map.add("trans_date", data.trans_date, "Date");
        if (data.trans_type == "Customer Sales" || data.trans_type == "Customer Return" || data.trans_type == "Vendor Purchase" || data.trans_type == "Vendor Return") {
            if(data.cust_id != "")
                map.add("cust_id", data.cust_id);
            if (data.bill_id != "")
                map.add("bill_id", data.bill_id);
        }
        map.add("store_no", localStorage.getItem("user_store_no"));


        return $.server.webMethod("EggTray.insertEggTrayTransaction", map.toString(), callback);
    }


    this.insertEggTrayTransactions = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.insertEggTrayTransaction(billItem, function () {
                self.insertEggTrayTransactions(i + 1, billItems, callback);
            });
        }
    }


    this.insertEggTrayItem = function(data, callback) {
        var map = new Map();
        map.add("tray_id", data.tray_id);
        map.add("item_no", data.item_no);

        return $.server.webMethod("EggTray.insertEggTrayItem", map.toString(), callback);
    }
    this.updateTray = function(data, callback) {
        var map = new Map();

        map.add("tray_name", data.tray_name, 'Text');
        map.add("tray_id", data.tray_id);
        map.add("tray_desc", data.tray_desc, 'Text');


        $.server.webMethod("EggTray.updateEggTray", map.toString(), callback);

    }
    this.deleteTray = function(tray_id, callback) {
        var map = new Map();
        map.add("tray_id", tray_id);
        $.server.webMethod("EggTray.deleteEggTray", map.toString(), callback);

    }
    this.deleteTrayTransaction = function(tray_id, callback) {
        var map = new Map();
        map.add("trans_id", tray_id);
        $.server.webMethod("EggTray.deleteEggTrayTransaction", map.toString(), callback);

    }
    this.getAllTray = function(callback) {
        var map = new Map();

        $.server.webMethod("EggTray.getAllTray", map.toString(), callback);

    };

}