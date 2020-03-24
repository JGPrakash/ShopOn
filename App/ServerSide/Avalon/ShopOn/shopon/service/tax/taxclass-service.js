/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function TaxClassService() {

    this.getTaxClass = function(callback) {
        var map = new Map();
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("TaxClass.getTaxClass", map.toString(), callback);
    };
    this.getActiveTaxClass = function (data,callback) {
        var map = new Map();
        map.add("sales_tax_no", data.sales_tax_no);
        map.add("comp_id", getCookie("user_company_id"));
        if(data.add)
            $.server.webMethod("TaxClass.getActiveAddTaxClass", map.toString(), callback);
        else
            $.server.webMethod("TaxClass.getActiveTaxClass", map.toString(), callback);
    };
    this.insertTaxClass = function(data, callback) {
        var map = new Map();
        map.add("tax_class_name", data.tax_class_name, 'Text');
        map.add("active", 1);
        map.add("class_type", data.class_type, "Text");
        if (data.hsn_code != undefined) {
            if(data.hsn_code == "" || data.hsn_code == null)
                map.add("hsn_code", "null");
            else
                map.add("hsn_code", data.hsn_code, "Text");
        }
        if (data.sac_code != undefined) {
            if (data.sac_code == "" || data.sac_code == null)
                map.add("sac_code", "null");
            else
                map.add("sac_code", data.sac_code, "Text");
        }
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("TaxClass.getNewTaxClass", map.toString(), callback);
    };

    this.updateTaxClass = function(data, callback) {
        var map = new Map();

        map.add("tax_class_name", data.tax_class_name, 'Text');


        map.add("tax_class_no", data.tax_class_no);
        map.add("active", data.active);
        map.add("class_type", data.class_type, "Text");
        if (data.hsn_code != undefined) {
            if (data.hsn_code == "" || data.hsn_code == null)
                map.add("hsn_code", "null");
            else
                map.add("hsn_code", data.hsn_code, "Text");
        }
        if (data.sac_code != undefined) {
            if (data.sac_code == "" || data.sac_code == null)
                map.add("sac_code", "null");
            else
                map.add("sac_code", data.sac_code, "Text");
        }
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("TaxClass.getAllUpdate", map.toString(), callback);

    };

    this.deleteTaxClass = function(tax_class_no, callback) {
        var map = new Map();
        map.add("tax_class_no", tax_class_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("TaxClass.deleteTaxClass", map.toString(), callback);
    };
    this.getNewTaxClassId = function (tax_class_no, callback) {
        var map = new Map();
        map.add("tax_class_no", tax_class_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("TaxClass.getNewTaxClassId", map.toString(), callback);
    };
    this.getTaxClassByNo = function(term, callback) {
        if (term == null)
            term = '';
        $.server.webMethod("TaxClass.getTaxClassByNo", "term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getTaxByItem = function (sales_tax_no, tax_class_no,callback) {
        var map = new Map();
        sales_tax_no = (sales_tax_no == null || sales_tax_no == "" || typeof sales_tax_no == "undefined") ? "-1" : sales_tax_no;
        tax_class_no = (tax_class_no == null || tax_class_no == "" || typeof tax_class_no == "undefined") ? "-1" : tax_class_no;
        map.add("sales_tax_no", sales_tax_no);
        map.add("tax_class_no", tax_class_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("TaxClass.getTaxByItem", map.toString(), callback);
    };
}