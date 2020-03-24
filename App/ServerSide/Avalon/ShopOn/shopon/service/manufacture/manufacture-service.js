/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function ManufactureService()
{

    this.getManufacture = function (callback) {
        var map = new Map();

        $.server.webMethod("Manufacture.getAllManufacture", map.toString(), callback);
    };
    this.insertManufacture = function (data, callback) {
        var map = new Map();
        map.add("man_name", data.man_name, 'Text');
        map.add("man_address", data.man_address, 'Text');
        map.add("man_phone", data.man_phone, 'Text');
        map.add("man_email", data.man_email, 'Text');
        map.add("man_active", data.man_active);
        map.add("comp_id", getCookie("user_company_id"));

        $.server.webMethod("Manufacture.getAllNewManufacture", map.toString(), callback);
    };

    this.updateManufacture = function (data, callback) {
        var map = new Map();

        map.add("man_name", data.man_name, 'Text');
        map.add("man_address", data.man_address, 'Text');
        map.add("man_phone", data.man_phone, 'Text');
        map.add("man_email", data.man_email, 'Text');
        map.add("man_active", data.man_active);
        map.add("comp_id", getCookie("user_company_id"));
        map.add("man_no", data.man_no);

        $.server.webMethod("Manufacture.getAllUpdate", map.toString(), callback);

    };

    this.deleteManufacture = function (man_no, callback) {
        var map = new Map();
        map.add("man_no", man_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Manufacture.deleteManufacture", map.toString(), callback);
    };
    this.getManuByNamePhone = function (term, callback) {
       if(term==null)
           term='';
       $.server.webMethod("Manufacture.getManuByNamePhone", "term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);
    };
    
    this.getManufactureByAll = function (term, callback) {
        if(term==null)
            term='';
        $.server.webMethod("Manufacture.getManufactureByAll", "term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getManufactureByNo = function (man_no, callback) {
        var map = new Map();
        map.add("man_no", man_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Manufacture.getManufactureByNo", map.toString(), callback);
    };
}
