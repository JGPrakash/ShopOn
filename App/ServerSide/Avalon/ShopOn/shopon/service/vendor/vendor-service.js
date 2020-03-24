/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function VendorService()
{

    this.getVendor = function (callback) {
        var map = new Map();
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Vendor.getAllVendor", map.toString(), callback);
    };

    this.getActiveVendor = function (callback) {
        var map = new Map();
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Vendor.getActiveVendor", map.toString(), callback);
    };
    this.getVendorByNo = function (vendor_no, callback) {
        var map = new Map();
        map.add("vendor_no", vendor_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Vendor.getVendorByNo", map.toString(), callback);
    };

    this.getVendorByAll = function (term, callback) {

        if (term == null) {
            term = "";
        }
        if (androidApp == true) {

            AndroidProxy.execute("select cust_no  ,cust_name from local_customer_t lct", function (data) {

                $(data).each(function (i, item) {
                    item.cust_no = item.cust_no;
                });
                callback(data);
            });
            // callback( eval(Android.execute("select * from customer_t")));


        } else {
            $.server.webMethod("Vendor.getVendorByAll", "term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);
        }

    }


    this.insertVendor = function (data, callback) {
        var map = new Map();
        map.add("vendor_name", data.vendor_name, 'Text');
        map.add("vendor_phone", data.vendor_phone, 'Text');
        map.add("landline_no", data.landline_no, "Text");
        map.add("vendor_address", data.vendor_address, 'Text');
        map.add("vendor_email", data.vendor_email, 'Text');
        map.add("area", data.area, 'Text');
        map.add("ifsc_code", data.ifsc_code, 'Text');
        map.add("bank_name", data.bank_name, 'Text');
        map.add("account_no", data.account_no, 'Text');
        map.add("license_no", data.license_no, 'Text');
        map.add("gst_no", data.gst_no, 'Text');
        map.add("tin_no", data.tin_no, 'Text');
        map.add("active_comm", data.active_comm);
        map.add("comp_id", getCookie("user_company_id"));

        $.server.webMethod("Vendor.getAllNewVendor", map.toString(), callback);
    };

    this.updateVendor = function (data, callback) {
        var map = new Map();

        map.add("vendor_name", data.vendor_name, 'Text');
        map.add("vendor_phone", data.vendor_phone, 'Text');
        map.add("landline_no", data.landline_no, "Text");
        map.add("vendor_address", data.vendor_address, 'Text');
        map.add("vendor_email", data.vendor_email, 'Text');
        map.add("area", data.area, 'Text');
        map.add("ifsc_code", data.ifsc_code, 'Text');
        map.add("bank_name", data.bank_name, 'Text');
        map.add("account_no", data.account_no, 'Text');
        map.add("license_no", data.license_no, 'Text');
        map.add("gst_no", data.gst_no, 'Text');
        map.add("tin_no", data.tin_no, 'Text');
        map.add("vendor_no", data.vendor_no);
        map.add("active_comm", data.active_comm);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Vendor.getAllUpdate", map.toString(), callback);

    };

    this.deleteVendor = function (vendor_no, callback) {
        var map = new Map();
        map.add("vendor_no", vendor_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Vendor.deleteVendor", map.toString(), callback);
    };
     this.getVendorByNamePhone = function (term, callback) {
      
         $.server.webMethod("Vendor.getVendorByNamePhone", "term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);
    };
}