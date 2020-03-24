function DoctorService() {

    this.getSaleExecutiveByAll = function (term, callback) {

        $.server.webMethod("SalesExecutive.getSaleExecutiveByAll", "term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);
    }
    this.getSaleExecutiveById = function (sale_executive_no, callback) {
        var map = new Map();
        map.add("sale_executive_no", sale_executive_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesExecutive.getSaleExecutiveById", map.toString(), callback);
    };
    this.updateSalesExecutive = function (data, callback) {
        var map = new Map();
        map.add("sale_executive_no", data.sale_executive_no);
        map.add("sale_executive_name", data.sale_executive_name, "Text");
        map.add("company_name", data.company_name, "Text");
        map.add("company_id", data.company_id, "Text");
        if (data.date_of_birth != '')
            map.add("date_of_birth", data.date_of_birth, "Date");
        map.add("address", data.address, "Text");
        map.add("phone_no", data.phone_no, "Text");
        map.add("email", data.email, "Text");
        map.add("saexe_active", data.saexe_active, "Text");
        //Bank Details
        if (data.bank_name != undefined)
            map.add("bank_name", data.bank_name, "Text");
        if (data.account_no != undefined)
            map.add("account_no", data.account_no, "Text");
        if (data.ifsc_code != undefined)
            map.add("ifsc_code", data.ifsc_code, "Text");
        if (data.license_no != undefined)
            map.add("license_no", data.license_no, "Text");
        if (data.area != undefined)
            map.add("area", data.area, "Text");
        if (data.pan_no != undefined)
            map.add("pan_no", data.pan_no, "Text");
        if (data.aadar_no != undefined)
            map.add("aadar_no", data.aadar_no, "Text");
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesExecutive.updateSaleExecutive", map.toString(), callback);
    }

    this.deleteSaleExecutive = function (data, callback) {
        var map = new Map();
        map.add("sale_executive_no", data);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesExecutive.deleteSaleExecutive", map.toString(), callback);
    }

    this.insertSaleExecutive = function (data, callback) {
        var map = new Map();
        if (data.sale_executive_name != undefined)
            map.add("sale_executive_name", data.sale_executive_name, "Text");
        if (data.company_name != undefined)
            map.add("company_name", data.company_name, "Text");
        if (data.company_id != undefined)
            map.add("company_id", data.company_id, "Text");
        if (data.date_of_birth != '' && data.date_of_birth != undefined)
            map.add("date_of_birth", data.date_of_birth, "Date");
        if (data.address != undefined)
            map.add("address", data.address, "Text");
        if (data.phone_no != undefined)
            map.add("phone_no", data.phone_no, "Text");
        if (data.email != undefined)
            map.add("email", data.email, "Text");
        if (data.saexe_active != undefined)
            map.add("saexe_active", data.saexe_active, "Text");
        if (data.bank_name != undefined)
            map.add("bank_name", data.bank_name, "Text");
        if (data.account_no != undefined)
            map.add("account_no", data.account_no, "Text");
        if (data.ifsc_code != undefined)
            map.add("ifsc_code", data.ifsc_code, "Text");
        if (data.license_no != undefined)
            map.add("license_no", data.license_no, "Text");
        if (data.area != undefined)
            map.add("area", data.area, "Text");
        if (data.pan_no != undefined)
            map.add("pan_no", data.pan_no, "Text");
        if (data.aadar_no != undefined)
            map.add("aadar_no", data.aadar_no, "Text");
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesExecutive.insertSaleExecutive", map.toString(), callback);
    }
}