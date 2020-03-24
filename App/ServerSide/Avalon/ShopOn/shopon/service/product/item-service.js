function ItemService() {


    this.removeItemPrice = function (item_price_no, callback) {
        $.server.webMethod("Item.removeItemPrice", "item_price_no;" + item_price_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    }

    this.removeProduct = function (item_no, callback) {
        $.server.webMethod("Item.removeProduct", "item_no;" + item_no + ",comp_id;" + getCookie("user_company_id") + ",store_no;" + getCookie("user_store_id"), callback);
    }

    this.insertItemPrice = function (data, callback, errorCallback) {
        var self = this;
        //Validate that same mrp,batchno,expry and validfrom exists 
        //if exists update else insert
        self.getItemPriceByNo(data, function (priceData) {
            var count = 0;
            $(priceData).each(function (i, items) {
                //if (nvl(items.expiry_date, "") == nvl(data.expiry_date, "")
                //    && parseFloat(nvl(items.mrp, 0)) == parseFloat(nvl(data.mrp, 0))
                //    && nvl(items.batch_no, "") == nvl(data.batch_no, "")) {
                //    data.item_price_no = items.item_price_no;
                //    count++;
                //}
                if (nvl(items.variation_name, "") == nvl(data.variation_name, "")) {
                    data.item_price_no = items.item_price_no;
                    count++;
                }
            });
            if (count == 0) {
                var map = new Map();
                map.add("var_no", data.var_no);
                map.add("price", data.price);
                map.add("valid_from", data.valid_from + " " + "00:00:00", 'Date');

                //if (typeof data.mrp != "undefined")
                //    if (data.mrp == null || data.mrp == "")
                //        map.add("mrp", "null");
                //    else
                //        map.add("mrp", data.mrp);

                //if (typeof data.cost != "undefined")
                //    if (data.cost == null || (data.cost == "" && data.cost != 0))
                //        map.add("cost", "null");
                //    else
                //        map.add("cost", data.cost);

                //if (typeof data.batch_no != "undefined")
                //    if (data.batch_no == null || data.batch_no == "")
                //        map.add("batch_no", "null");
                //    else
                //        map.add("batch_no", data.batch_no, 'Text');

                //if (typeof data.expiry_date != "undefined")
                //    if (data.expiry_date == null || data.expiry_date == "")
                //        map.add("expiry_date", "null");
                //    else
                //        map.add("expiry_date", data.expiry_date + " 23:59:59", 'Date');

                //if (typeof data.variation_name != "undefined")
                //    if (data.variation_name == null || data.variation_name == "" || data.variation_name == "-free")
                //        map.add("variation_name", data.item_no + "-" + getCookie("user_store_id") + "-" + data.cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.man_date + "-" + data.expiry_date + "" + data.variation_name, "Text");
                //    else
                //        map.add("variation_name", data.variation_name, "Text");
                //if (typeof data.variation_name != "undefined")
                //    if (data.variation_name == null || data.variation_name == "")
                //        map.add("variation_name", "null");
                //    else
                //        map.add("variation_name", data.variation_name, 'Text');

                //if (typeof data.man_date != "undefined")
                //    if (data.man_date == null || data.man_date == "")
                //        map.add("man_date", "null");
                //    else
                //        map.add("man_date", data.man_date, 'Date');
                //if (typeof getCookie("user_store_id") != "undefined")
                //    if (getCookie("user_store_id") == null || getCookie("user_store_id") == "")
                //        map.add("store_no", "null");
                //    else
                //        map.add("store_no", getCookie("user_store_id"));

                if (typeof getCookie("user_company_id") != "undefined")
                    if (getCookie("user_company_id") == null || getCookie("user_company_id") == "")
                        map.add("comp_id", "null");
                    else
                        map.add("comp_id", getCookie("user_company_id"));
                //if (typeof data.selling_price == "")
                //    map.add("selling_price", "null");
                //  else
                //    map.add("selling_price", data.selling_price);
                //if (data.selling_price != undefined)
                //    if (data.selling_price == null || data.selling_price == "")
                //        map.add("selling_price", "null");
                //    else
                //        map.add("selling_price", data.selling_price );


                //$.server.webMethod("Item.insertItemPrice", map.toString(), function(data) {
                //    $.server.webMethod("Item.getItemPriceById", "item_price_no;" + data[0].key_value, callback, errorCallback);
                //}, errorCallback);

                $.server.webMethod("Item.insertItemPrice", map.toString(), callback, errorCallback);

            }
            else {
                self.updateItemPrice(data, callback, errorCallback);
            }
        })



    }
    this.updateItemPrice = function (data, callback, errorCallback) {
        var map = new Map();
        map.add("item_price_no", data.item_price_no);
        map.add("item_no", data.item_no);
        map.add("price", data.price);
        map.add("valid_from", data.valid_from + " " + "00:00:00", 'Date');

        if (typeof data.mrp != "undefined")
            if (data.mrp == null || data.mrp == "")
                map.add("mrp", "null");
            else
                map.add("mrp", data.mrp);

        if (typeof data.batch_no != "undefined")
            if (data.batch_no == null || data.batch_no == "")
                map.add("batch_no", "null");
            else
                map.add("batch_no", data.batch_no, 'Text');

        if (typeof data.expiry_date != "undefined")
            if (data.expiry_date == null || data.expiry_date == "")
                map.add("expiry_date", "null");
            else
                map.add("expiry_date", data.expiry_date + " 23:59:59", 'Date');
        if (typeof getCookie("user_store_id") != "undefined")
            if (getCookie("user_store_id") == null || getCookie("user_store_id") == "")
                map.add("store_no", "null");
            else
                map.add("store_no", getCookie("user_store_id"));

        if (typeof getCookie("user_company_id") != "undefined")
            if (getCookie("user_company_id") == null || getCookie("user_company_id") == "")
                map.add("comp_id", "null");
            else
                map.add("comp_id", getCookie("user_company_id"));

        $.server.webMethod("Item.updateItemPrice", map.toString(), callback, errorCallback);



    }
    this.insertPriceItems = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.insertItemPrice(billItem, function () {
                self.insertPriceItems(i + 1, billItems, callback);
            });

            //var billItem = billItems[i];
            //self.getItemPriceByNo(billItem, function (data) {
            //    var count = 0;
            //    $(data).each(function (i, items) {
            //        if (nvl(items.expiry_date, "") == nvl(billItem.expiry_date, "")
            //            && nvl(items.mrp, 0) == nvl(billItem.mrp, 0)
            //            && nvl(items.batch_no, "") == nvl(billItem.batch_no), "") {
            //            count++;
            //        }  
            //    });
            //    if (count == 0) {
            //        self.insertItemPrice(billItem, function () {                      
            //            self.insertPriceItems(i + 1, billItems, callback);
            //        });
            //    } else {

            //        self.updateItemPrice(billItem, function () {                     
            //            self.insertPriceItems(i + 1, billItems, callback);
            //        });
            //    }
            //})
        }
    }

    this.getItemCurrentPrice = function (item_no, callback) {
        $.server.webMethod("Item.getItemCurrentPrice", "item_no;" + item_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);

    };
    this.getItemAllPrice = function (item_no, callback) {
        $.server.webMethod("Item.getItemAllPrice", "item_no;" + item_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);

    };
    this.getInventoryItem = function (item_no, callback) {
        $.server.webMethod("Item.getInventoryItem", "item_no;" + item_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);

    };
    this.getStockVarInventoryItem = function (item_no, callback) {
        $.server.webMethod("Item.getStockVarInventoryItem", "item_no;" + item_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);

    };
    this.getStockVarPriceByNo = function (item_no, callback) {
        $.server.webMethod("Item.getStockVarPriceByNo", "item_no;" + item_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);

    };
    this.getAllCategory = function (callback) {
        $.server.webMethod("Item.getAllCategory", "", callback);

    };
    this.getAllManufacturer = function (callback) {
        $.server.webMethod("Item.getAllManufacturer", "comp_id;" + getCookie("user_company_id"), callback);

    };
    this.getTaxClass = function (callback) {
        return $.server.webMethod("Item.getTaxClass", "comp_id;" + getCookie("user_company_id"), callback);

    };

    this.getItemAllPrice = function (item_no, callback) {
        $.server.webMethod("Item.getItemAllPrice", "item_no;" + item_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);

    };

    this.getItemAutoComplete = function (term, sales_tax_no, callback) {
        if (sales_tax_no == undefined) {
            sales_tax_no = "-1";
        }
        $.server.webMethod("Item.getItemAutoComplete", "sales_tax_no;" + sales_tax_no + ",term;" + term + "%,comp_id;" + getCookie("user_company_id") + ",store_no;" + getCookie("user_store_id"), callback);
    };
    this.getItemAutoCompleteAllData = function (term, sales_tax_no, callback) {
        if (sales_tax_no == undefined) {
            sales_tax_no = -1;
        }
        $.server.webMethod("Item.getItemAutoCompleteAllData", "sales_tax_no;" + sales_tax_no + ",term;" + term + "%,store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getItemAdvanceSearch = function (term, sales_tax_no, callback) {
        if (sales_tax_no == undefined) {
            sales_tax_no = -1;
        }
        $.server.webMethod("Item.getItemAdvanceSearch", "sales_tax_no;" + sales_tax_no + ",term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getTouchItemAdvanceSearch = function (ven_name, man_name, sales_tax_no, callback) {
        if (sales_tax_no == undefined) {
            sales_tax_no = -1;
        }
        $.server.webMethod("Item.getTouchItemAdvanceSearch", "ven_name;%" + ven_name + "%,man_name;%" + man_name + "%,sales_tax_no;" + sales_tax_no + ",comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getItemTouchAdvanceSearchPO = function (ven_name, man_name, callback) {

        $.server.webMethod("Item.getItemTouchAdvanceSearchPO", "ven_name;%" + ven_name + "%,man_name;%" + man_name + "%,comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getItemDiscountAutocomplete = function (item_no, callback) {

        $.server.webMethod("Item.getItemDiscountAutocomplete", "item_no;" + item_no + ",comp_id;" + getCookie("user_company_id"), callback);

    };

    this.getAllItem = function (term, callback) {
        if (androidApp == true) {
            callback([]);
        } else {

            $.server.webMethod("Item.getAllItem", "term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);
        }


    };
    this.getItemByNo = function (item_no, callback) {
        if (androidApp == true) {
            AndroidProxy.execute("select * from local_item_t where item_no='" + item_no + "'", function (data) {
                callback(data);
            });
        } else {
            $.server.webMethod("Item.getItemByNo", "item_no;" + item_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
        }
    };
    this.getItemPriceDownload = function (term, callback) {
        //$.server.webMethod("Item.getItemPriceDownload", callback);
        $.server.webMethod("Item.getItemPriceDownload", "term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);

    };

    this.downloadItem = function (callback) {
        //$.server.webMethod("Item.getItemPriceDownload", callback);
        $.server.webMethod("Item.getItemPriceDownload", "term;%" + "" + "%,comp_id;" + getCookie("user_company_id"), callback);

    };




    this.getItems = function (term, callback) {

        if (androidApp == true) {
            AndroidProxy.execute("select item_no,item_name from local_item_t", function (data) {
                callback(data);
            });
        } else {

            $.server.webMethod("Item.getAllItem", "term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);
        }

        // $.server.webMethod("Item.getAllItem", "term;%" + term + "%",callback);
    };



    this.getItemsAutoComplete = function (term,sales_tax_no, callback) {

        if (sales_tax_no == undefined) {
            sales_tax_no = "-1";
        }
        $.server.webMethod("Item.getItemAutoComplete", "sales_tax_no;" + sales_tax_no + ",term;" + term + "%,comp_id;" + localStorage.getItem("user_company_id") + ",store_no;" + getCookie("user_store_id"), callback);
    };
    this.getItemAdvanceSearchPO = function (term, callback) {

        $.server.webMethod("Item.getItemAdvanceSearchPO", "term;%" + term + "%,comp_id;" + getCookie("user_company_id") + ",store_no;" + getCookie("user_store_id"), callback);
    };

    this.getItemPriceMeasureDetails = function (item_no, callback) {

        $.server.webMethod("Item.getItemPriceMeasureDetails", "item_no;" + item_no + ",comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getColorCode = function (callback) {
        return $.server.webMethod("Item.getAllColor", "", callback);

    };
    this.getMeasurement = function (callback) {
        return $.server.webMethod("Item.getMeasurement", "", callback);

    };


    this.getItemMaxNo = function (callback) {
        return $.server.webMethod("Item.getMaxItem", "", callback);
    }

    //this.insertItem = function (data, callback) {
    //    $.server.webMethod("Item.insertItem", "item_no;'" + data.itemNo + "',item_name;'" + data.itemName + "'", callback);
    //    // $.server.webMethod("Item.insertItem", "item_name;'"+data.itemName+"'");

    //}
    this.insertItem = function (data, callback) {
        var map = new Map();
        if (data.item_code != undefined) {
            if (data.item_code == null || data.item_code == "")
                map.add("item_code", "null");
            else
                map.add("item_code", data.item_code, 'Text');
        }
        if (data.item_name != undefined) {
            if (data.item_name == null || data.item_name == "")
                map.add("item_name", "null");
            else
                map.add("item_name", data.item_name, 'Text');
        }
        if (data.unit != undefined) {
            if (data.unit == null || data.unit == "")
                map.add("unit", "null");
            else
                map.add("unit", data.unit, 'Text');
        }
        if (data.barcode != undefined) {
            if (data.barcode == null || data.barcode == "")
                map.add("barcode", "null");
            else
                map.add("barcode", data.barcode, 'Text');
        }
        if (data.tax_class_no != undefined) {
            if (data.tax_class_no == null || data.tax_class_no == "")
                map.add("tax_class_no", "null");
            else
                map.add("tax_class_no", data.tax_class_no == -1 ? 'null' : data.tax_class_no);
        }
        if (data.tax_inclusive != undefined) {
            if (data.tax_inclusive == null || data.tax_inclusive == "")
                map.add("tax_inclusive", "null");
            else
                map.add("tax_inclusive", data.tax_inclusive);
        }
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Item.insertItem", map.toString(), callback);
    }

    this.insertItemName = function (data, callback) {
        var map = new Map();
        map.add("item_code", data.itemCode,"Text");
        map.add("item_name", data.itemName,"Text");
        map.add("comp_id", getCookie("user_company_id"));
        //return $.server.webMethod("Item.insertItem", "item_code;'" + data.itemCode + "',item_name;'" + data.itemName + "',comp_id;'" + getCookie("user_company_id"), callback);
        return $.server.webMethod("Item.insertItem", map.toString(), callback);
    }

    this.getReorderItems = function (ven_No, callback) {
        return $.server.webMethod("Item.getReorderItems", "def_vendor_no;" + ven_No + ",comp_id;" + getCookie("user_company_id") + ",store_id;" + getCookie("user_store_id"), callback);
    }

    this.updateItem = function (data, callback) {

        var map = new Map();
        map.add("item_no", data.item_no);
        if (data.item_code != undefined) {
            if(data.item_code == null || data.item_code == "")
                map.add("item_code", "null");
            else
                map.add("item_code", data.item_code, 'Text');
        }
        if (data.item_name != undefined) {
            if (data.item_name == null || data.item_name == "")
                map.add("item_name", "null");
            else
                map.add("item_name", data.item_name, 'Text');
        }
        if (data.ptype_no != undefined) {
            if (data.ptype_no == null || data.ptype_no == "")
                map.add("ptype_no", "null");
            else
                map.add("ptype_no", data.ptype_no);
        }
        if (data.upc != undefined) {
            if (data.upc == null || data.upc == "")
                map.add("upc", "null");
            else
                map.add("upc", data.upc, 'Text');
        }
        if (data.ean != undefined) {
            if (data.ean == null || data.ean == "")
                map.add("ean", "null");
            else
                map.add("ean", data.ean, 'Text');
        }
        if (data.sku != undefined) {
            if (data.sku == null || data.sku == "")
                map.add("sku", "null");
            else
                map.add("sku", data.sku, 'Text');
        }
        if (data.mrp != undefined) {
            if (data.mrp == null || data.mrp == "")
                map.add("mrp", "null");
            else
                map.add("mrp", data.mrp, 'Text');
        }
        if (data.unit != undefined) {
            if (data.unit == null || data.unit == "")
                map.add("unit", "null");
            else
                map.add("unit", data.unit, 'Text');
        }
        if (data.barcode != undefined) {
            if (data.barcode == null || data.barcode == "")
                map.add("barcode", "null");
            else
                map.add("barcode", data.barcode, 'Text');
        }
        if (data.mansku != undefined) {
            if (data.mansku == null || data.mansku == "")
                map.add("mansku", "null");
            else
                map.add("mansku", data.mansku, 'Text');
        }
        if (data.tax_class_no != undefined) {
            if (data.tax_class_no == null || data.tax_class_no == "")
                map.add("tax_class_no", "null");
            else
                map.add("tax_class_no", data.tax_class_no == -1 ? 'null' : data.tax_class_no);
        }
        if (data.reorder_level != undefined) {
            if (data.reorder_level == null || data.reorder_level == "")
                map.add("reorder_level", "null");
            else
                map.add("reorder_level", data.reorder_level == '' ? 0 : data.reorder_level);
        }
        if (data.reorder_qty != undefined) {
            if (data.reorder_qty == null || data.reorder_qty == "")
                map.add("reorder_qty", "null");
            else
                map.add("reorder_qty", data.reorder_qty == '' ? 0 : data.reorder_qty);
        }
        if (data.cat_no != undefined) {
            if (data.cat_no == null || data.cat_no == "")
                map.add("cat_no", "null");
            else
                map.add("cat_no", data.cat_no == -1 ? 'null' : data.cat_no);
        }
        if (data.man_no != undefined) {
            if (data.man_no == null || data.man_no == "")
                map.add("man_no", "null");
            else
                map.add("man_no", data.man_no == -1 ? 'null' : data.man_no);
        }
        if (data.def_vendor_no != undefined) {
            if (data.def_vendor_no == null || data.def_vendor_no == "")
                map.add("def_vendor_no", "null");
            else
                map.add("def_vendor_no", data.def_vendor_no == -1 ? 'null' : data.def_vendor_no);
        }
        if (data.tag != undefined) {
            if (data.tag == null || data.tag == "")
                map.add("tag", "null");
            else
                map.add("tag", data.tag, 'Text');
        }
        
        
        
        
        if (data.image_name != null && data.image_name != undefined)
            map.add("image_name", data.image_name, 'Text');

        if (data.qty_type != undefined) {
            if (data.qty_type == null || data.qty_type == "")
                map.add("qty_type", "null");
            else
                map.add("qty_type", data.qty_type, 'Text');
        }
        if (data.key_word != undefined) {
            if (data.key_word == null || data.key_word == "")
                map.add("key_word", "null");
            else
                map.add("key_word", data.key_word, 'Text');
        }
        if (data.packing != undefined) {
            if (data.packing == null || data.packing == "")
                map.add("packing", "null");
            else
                map.add("packing", data.packing, 'Text');
        }
        if (data.tax_inclusive != undefined) {
            if (data.tax_inclusive == null || data.tax_inclusive == "")
                map.add("tax_inclusive", "null");
            else
                map.add("tax_inclusive", data.tax_inclusive);
        }
        if (data.discount_inclusive != undefined) {
            if (data.discount_inclusive == null || data.discount_inclusive == "")
                map.add("discount_inclusive", "null");
            else
                map.add("discount_inclusive", data.discount_inclusive);
        }
        if (data.alter_unit != undefined) {
            if (data.alter_unit == null || data.alter_unit == "")
                map.add("alter_unit", "null");
            else
                map.add("alter_unit", data.alter_unit,"Text");
        }
        if (data.alter_unit_fact != undefined) {
            if (data.alter_unit_fact == null || data.alter_unit_fact == "")
                map.add("alter_unit_fact", "null");
            else
                map.add("alter_unit_fact", data.alter_unit_fact,"Text");
        }
        if (data.expiry_days != undefined) {
            if (data.expiry_days == null || data.expiry_days == "" || isNaN(data.expiry_days))
                map.add("expiry_days", "null");
            else
                map.add("expiry_days", data.expiry_days);
        }
        if (data.expiry_alert_days != undefined) {
            if (data.expiry_alert_days == null || data.expiry_alert_days == "" || isNaN(data.expiry_alert_days))
                map.add("expiry_alert_days", "null");
            else
                map.add("expiry_alert_days", data.expiry_alert_days);
        }
        if (data.rack_no != undefined) {
            if (data.rack_no == null || data.rack_no == "")
                map.add("rack_no", "null");
            else
                map.add("rack_no", data.rack_no, 'Text');
        }
        if (data.item_description != undefined) {
            if (data.item_description == null || data.item_description == "")
                map.add("item_description", "null");
            else
                map.add("item_description", data.item_description, 'Text');
        }
        if (data.tray_no != undefined) {
            if (data.tray_no == null || data.tray_no == "")
                map.add("tray_no", "null");
            else
                map.add("tray_no", data.tray_no, 'Text');
        }
        if (data.mpt_no != undefined) {
            if (data.mpt_no == null || data.mpt_no == "")
                map.add("mpt_no", "null");
            else
                map.add("mpt_no", data.mpt_no);
        }
        map.add("comp_id", getCookie("user_company_id"));

        $.server.webMethod("Item.updateItem", map.toString(), callback);

    }
    this.updateColor = function (data, callback) {

        $.server.webMethod("Item.updateColor", "item_no;'" + data.item_no + "',last_name;'" + data.lastName + "',title;'" + data.title + "',company;'" + data.company + "',date_of_birth;'" + data.dateOfBirth + "',address1;'" + data.address1 + "',address2;'" + data.address2 + "',city;'" + data.city + "',state;'" + data.state + "',zip_code;'" + data.zip + "',country;'" + data.country + "',phone_no;'" + data.phone + "',email;'" + data.email + "',cust_type;'" + data.customerType + "',discount;'" + data.discount + "',cust_no;'" + data.custNo + "'", callback);

    }

    this.updateMeasurement = function (data, callback) {

        $.server.webMethod("Item.updateMeasurement", "item_no;'" + data.item_no + "',last_name;'" + data.lastName + "',title;'" + data.title + "',company;'" + data.company + "',date_of_birth;'" + data.dateOfBirth + "',address1;'" + data.address1 + "',address2;'" + data.address2 + "',city;'" + data.city + "',state;'" + data.state + "',zip_code;'" + data.zip + "',country;'" + data.country + "',phone_no;'" + data.phone + "',email;'" + data.email + "',cust_type;'" + data.customerType + "',discount;'" + data.discount + "',cust_no;'" + data.custNo + "'", callback);

    }


    this.getItemAttributes = function (item_no, callback) {
        return $.server.webMethod("Item.getItemAttributes", "item_no;" + item_no, callback);
    };
    this.getAttributeNames = function (callback) {
        return $.server.webMethod("ItemAttribute.getAttributeNames", "", callback);
    };
    this.getAttributeValues = function (attr_type, callback) {
        return $.server.webMethod("ItemAttribute.getAttributeValues", "attr_type;" + attr_type, callback);
    };
    this.insertAttributeValue = function (data, callback) {
        var map = new Map();
        map.add("item_no", data.item_no);
        map.add("attr_no", data.attr_no);
        if (typeof data.attr_val_no != "undefined")
            map.add("attr_val_no", data.attr_val_no);
        map.add("attr_val_name", data.attr_val_name, 'Text');

        return $.server.webMethod("ItemAttribute.insertAttributeValue", map.toString(), callback);
    };

    this.deleteAttributeValue = function (data, callback) {
        var map = new Map();
        map.add("item_no", data.item_no);
        map.add("attr_no", data.attr_no);
        map.add("attr_val_name", data.attr_val_name);

        return $.server.webMethod("ItemAttribute.deleteAttributeValue", map.toString(), callback);
    };

    this.getTrayByItemNo = function (item_no, callback) {
        var map = new Map();
        map.add("item_no", item_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Item.getTrayByItemNo", map.toString(), callback);
    };
    this.addItemTray = function (data, callback) {
        var map = new Map();
        map.add("item_no", data.item_no);
        map.add("tray_no", data.tray_no);
        map.add("comp_id", getCookie("user_company_id"));
        return $.server.webMethod("Item.addItemTray", map.toString(), callback);
    };
    this.removeItemTray = function (item_no, callback) {
        var map = new Map();

        map.add("item_no", item_no);
        //map.add()
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Item.removeItemTray", map.toString(), callback);
    };
    this.updateItemTray = function (data1, callback) {
        var map = new Map();
        map.add("item_tray_no", data1.item_tray_no);
        map.add("item_no", data1.item_no);
        map.add("tray_no", data1.tray_no);
        //map.add()

        $.server.webMethod("Item.updateItemTray", map.toString(), callback);
    };
    this.getItemStockByItemNo = function (item_no, callback) {
        $.server.webMethod("Item.getItemStockByItemNo", "item_no;" + item_no + ",comp_id;" + getCookie("user_company_id") + ",store_no;" + getCookie("user_store_id"), callback);
    };

    this.itemStopPrice = function (data, callback) {
        var map = new Map();
        map.add("item_no", data.item_no);
        if (typeof data.mrp == "undefined" || data.mrp == null || data.mrp == "")
            map.add("mrp", "null");
        else
            map.add("mrp", data.mrp);

        if (typeof data.batch_no == "undefined" || data.batch_no == null || data.batch_no == "")
            map.add("batch_no", "null");
        else
            map.add("batch_no", data.batch_no);

        //we used update instead of ma. so text or date is not neede
        if (typeof data.expiry_date == "undefined" || data.expiry_date == null || data.expiry_date == "")
            map.add("expiry_date", "null");
        else {

            var dd = data.expiry_date.substring(0, 2);
            var mm = data.expiry_date.substring(3, 5);
            var yyyy = data.expiry_date.substring(6, 10);

            data.expiry_date = yyyy + "-" + mm + "-" + dd;
            map.add("expiry_date", data.expiry_date);
        }
        if (typeof data.variation_name == "undefined" || data.variation_name == null || data.variation_name == "")
            map.add("variation_name", "null");
        else
            map.add("variation_name", data.variation_name, "Text");
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        //$.server.webMethod("Item.itemStopPrice", map.toString(), callback);
        $.server.webMethod("Item.itemStopPrice", "item_no;" + data.item_no + ",variation_name;" + data.variation_name + ",comp_id;" + getCookie("user_company_id") + ",store_no" + getCookie("user_store_id"), callback);
    };
    this.getInvertDet = function (item_no, callback) {
        var map = new Map();

        map.add("item_no", item_no);
        //map.add()
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Item.getInvertDet", map.toString(), callback);
    };
    this.getItemPriceByNo = function (data, callback) {
        var map = new Map();

        map.add("item_no", data.item_no);
        if (data.expiry_date != undefined) {
            if (data.expiry_date == "" || data.expiry_date == null)
                map.add("expiry_date", "null");
            else
                map.add("expiry_date", data.expiry_date, "Date");
        }
        if (data.mrp != undefined) {
            if (data.mrp == "" || data.mrp == null)
                map.add("mrp", "null");
            else
                map.add("mrp", parseFloat(data.mrp).toFixed(2));
        }
        if (data.batch_no != undefined) {
            if (data.batch_no == "" || data.batch_no == null)
                map.add("batch_no", "null");
            else
                map.add("batch_no", data.batch_no);
        }
        if (data.variation_name != undefined) {
            if (data.variation_name == "" || data.variation_name == null)
                map.add("variation_name", "null");
            else
                map.add("variation_name", data.variation_name);
        }
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Item.getItemPriceByNo", map.toString(), callback);
    };
    this.getMainProductByNo = function (mpt_no, callback) {
        var map = new Map();
        map.add("mpt_no", mpt_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Item.getMainProductByNo", map.toString(), callback);
    };
    this.getMainProductByName = function (term, callback) {

        $.server.webMethod("Item.getMainProductByName", "term;%" + term + "%", callback);
    };
    this.insertMainProduct = function (data, callback) {
        var map = new Map();
        map.add("mpt_name", data.mpt_name, 'Text');
        map.add("desc", data.desc, 'Text');
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Item.insertMainProduct", map.toString(), callback);
    };

    this.updateMainProduct = function (data, callback) {
        var map = new Map();
        map.add("mpt_no", data.mpt_no);
        map.add("mpt_name", data.mpt_name, 'Text');
        map.add("desc", data.desc, 'Text');
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Item.updateMainProduct", map.toString(), callback);

    };

    this.deleteMainProduct = function (mpt_no, callback) {
        var map = new Map();
        map.add("mpt_no", mpt_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Item.deleteMainProduct", map.toString(), callback);
    };
    this.getProductTypeByNo = function (ptype_no, callback) {
        var map = new Map();
        map.add("ptype_no", ptype_no);
        $.server.webMethod("Item.getProductTypeByNo", map.toString(), callback);
    };
    this.getProductTypeByName = function (term, callback) {

        $.server.webMethod("Item.getProductTypeByName", "term;%" + term + "%", callback);
    };
    this.insertProductType = function (data, callback) {
        var map = new Map();
        map.add("ptype_name", data.ptype_name, 'Text');
        map.add("mpt_no", data.mpt_no);
        $.server.webMethod("Item.insertProductType", map.toString(), callback);
    };

    this.updateProductType = function (data, callback) {
        var map = new Map();
        map.add("ptype_no", data.ptype_no);
        map.add("ptype_name", data.ptype_name, 'Text');
        map.add("mpt_no", data.mpt_no);
        $.server.webMethod("Item.updateProductType", map.toString(), callback);

    };

    this.deleteProductType = function (ptype_no, callback) {
        var map = new Map();
        map.add("ptype_no", ptype_no);
        $.server.webMethod("Item.deleteProductType", map.toString(), callback);
    };
    this.getMainProductNameByAll = function (term, callback) {
        $.server.webMethod("Item.getMainProductNameByAll", "term;%" + term + "%", callback);
    };
    this.getProductTypeNameByAll = function (term, callback) {
        $.server.webMethod("Item.getProductTypeNameByAll", "term;%" + term + "%", callback);
    };
    this.getAllVariationByItem = function (data, callback) {
        var map = new Map();
        map.add("item_no", data.item_no);
        map.add("buying_cost", data.buying_cost);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Item.getAllVariationByItem", map.toString(), callback);
    };
    this.getCostByVariation = function (data, callback) {
        var map = new Map();
        map.add("item_no", data.item_no);
        map.add("variation_name", data.variation_name);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Item.getCostByVariation", map.toString(), callback);
    };
    this.getItemVariation = function (data, callback) {
        var map = new Map();
        map.add("item_no", data.item_no);
        map.add("variation_name", data.variation_name);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Item.getItemVariation", map.toString(), callback);
    };
    this.checkDuplicatePrice = function (data, callback) {
        var map = new Map();
        map.add("item_no", data.item_no);
        map.add("cost", data.cost);
        map.add("mrp", data.mrp);
        map.add("batch_no", data.batch_no, "Text");
        //map.add("expiry_date", data.expiry_date , 'Date');
        map.add("expiry_date", dbDate(data.expiry_date));
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Item.checkDuplicatePrice", map.toString(), callback);
    };
    this.updateExpiryAlertDays = function (data, callback) {
        var map = new Map();
        map.add("comp_id", getCookie("user_company_id"));
        map.add("expiry_alert_days", data);
        $.server.webMethod("Item.updateExpiryAlertDays", map.toString(), callback);
    };
    this.getAllVariation = function (callback) {
        var map = new Map();
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Item.getAllVariation", map.toString(), callback);
    };
}