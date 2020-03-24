/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function SalesTaxService() {
    this.getSalesTax = function(callback) {
        var map = new Map();
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesTax.getSalesTax", map.toString(), callback);
    };
    this.insertSalesTax = function(data, callback) {
        var map = new Map();
        //map.add("sales_tax_name", data.sales_tax_name, 'Text');
        //map.add("active", data.active);
        //map.add("sales_tax_level", data.sales_tax_level, 'Text');
        //map.add("sales_tax_value", data.sales_tax_value);
        if (data.sales_tax_name != undefined) {
            if (data.sales_tax_name == null || (data.sales_tax_name == ""))
                map.add("sales_tax_name", "null");
            else
                map.add("sales_tax_name", data.sales_tax_name, 'Text');
        }
        if (data.active != undefined) {
            if (data.active == null || (data.active == ""))
                map.add("active", "null");
            else
                map.add("active", data.active);
        }
        map.add("comp_id", getCookie("user_company_id"));
        //if (data.sales_tax_level != undefined) {
        //    if (data.sales_tax_level == null || (data.sales_tax_level == ""))
        //        map.add("sales_tax_level", "null");
        //    else
        //        map.add("sales_tax_level", data.sales_tax_level, 'Text');
        //}
        //if (data.sales_tax_value != undefined) {
        //    if (data.sales_tax_value == null || (data.sales_tax_value == ""))
        //        map.add("sales_tax_value", "null");
        //    else
        //        map.add("sales_tax_value", data.sales_tax_value);
        //}
        $.server.webMethod("SalesTax.getNewSalesTax", map.toString(), callback);
    };

    this.updateSalesTax = function(data, callback) {
        var map = new Map();

        //map.add("sales_tax_name", data.sales_tax_name, 'Text');

        map.add("sales_tax_no", data.sales_tax_no);
        //map.add("active", data.active);
        //map.add("sales_tax_level", data.sales_tax_level, 'Text');
        //map.add("sales_tax_value", data.sales_tax_value);
        if (data.sales_tax_name != undefined) {
            if (data.sales_tax_name == null || (data.sales_tax_name == ""))
                map.add("sales_tax_name", "null");
            else
                map.add("sales_tax_name", data.sales_tax_name, 'Text');
        }
        if (data.active != undefined) {
            if (data.active == null || (data.active == ""))
                map.add("active", "null");
            else
                map.add("active", data.active);
        }
        //if (data.sales_tax_level != undefined) {
        //    if (data.sales_tax_level == null || (data.sales_tax_level == ""))
        //        map.add("sales_tax_level", "null");
        //    else
        //        map.add("sales_tax_level", data.sales_tax_level, 'Text');
        //}
        //if (data.sales_tax_value != undefined) {
        //    if (data.sales_tax_value == null || (data.sales_tax_value == ""))
        //        map.add("sales_tax_value", "null");
        //    else
        //        map.add("sales_tax_value", data.sales_tax_value);
        //}
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesTax.getAllUpdate", map.toString(), callback);

    };

    this.deleteSalesTax = function(sales_tax_no, callback) {
        var map = new Map();
        map.add("sales_tax_no", sales_tax_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesTax.deleteSalesTax", map.toString(), callback);
    };

    this.getSalesTaxByNo = function(term, callback) {
        if (term == null)
            term = '';
        $.server.webMethod("SalesTax.getSalesTaxByNo", "term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);
    };

    this.getActiveSalesTax = function (callback) {
        var map = new Map();
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesTax.getActiveSalesTax", map.toString(), callback);
    };

    //  this.getTax = function(tax_class_no, callback) {

    //    $.server.webMethod("SalesTax.getTax", "tax_class_no;" + tax_class_no, callback);
    //};

    this.insertTaxSalesNo = function(data, callback) {
        var map = new Map();

        map.add("sales_tax_no", data.sales_tax_no);
        map.add("tax_class_no", data.tax_class_no);
        map.add("tax_per", data.tax_per);
        //map.add("class_type", data.class_type, "Text");
        //if (data.hsn_code != undefined) {
        //    if(data.hsn_code == "" || data.hsn_code == null)
        //        map.add("hsn_code", "null");
        //    else
        //        map.add("hsn_code", data.hsn_code, "Text");
        //}
        //if (data.sac_code != undefined) {
        //    if (data.sac_code == "" || data.sac_code == null)
        //        map.add("sac_code", "null");
        //    else
        //        map.add("sac_code", data.sac_code, "Text");
        //}
        map.add("cgst", data.cgst);
        map.add("sgst", data.sgst);
        map.add("igst", data.igst);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesTax.insertTaxSalesNo", map.toString(), callback);
    };
    this.updateTaxSalesNo = function(data, callback) {
        var map = new Map();
        map.add("sales_tax_class_no", data.sales_tax_class_no);
        map.add("sales_tax_no", data.sales_tax_no);
        map.add("tax_class_no", data.tax_class_no);
        map.add("tax_per", data.tax_per);
        //map.add("class_type", data.class_type, "Text");
        //if (data.hsn_code != undefined) {
        //    if (data.hsn_code == "" || data.hsn_code == null)
        //        map.add("hsn_code", "null");
        //    else
        //        map.add("hsn_code", data.hsn_code, "Text");
        //}
        //if (data.sac_code != undefined) {
        //    if (data.sac_code == "" || data.sac_code == null)
        //        map.add("sac_code", "null");
        //    else
        //        map.add("sac_code", data.sac_code, "Text");
        //}
        map.add("cgst", data.cgst);
        map.add("sgst", data.sgst);
        map.add("igst", data.igst);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesTax.updateTaxSalesNo", map.toString(), callback);

    };
    this.deleteTaxSales = function(sales_tax_class_no, callback) {
        var map = new Map();
        map.add("sales_tax_class_no", sales_tax_class_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesTax.deleteTaxSales", map.toString(), callback);
    };
    this.getSalesTaxClass = function(sales_tax_no, callback) {
        var map = new Map();
        map.add("sales_tax_no", sales_tax_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesTax.getSalesTaxClass", map.toString(), callback);
    };
}