/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function CompanyService()
{
    this.getCompany = function (callback) {
        var map = new Map();

        $.server.webMethod("FinFacts.Company.getCompany", map.toString(), callback);
    };

    this.getCompanyById = function (data, callback) {
        var map = new Map();
        //  map.add("comp_id", data.comp_id);
        map.add("comp_id",data.comp_id);

        $.server.webMethod("FinFacts.Company.getCompanyById", map.toString(), callback);
    };

    this.insertCompany = function (data, callback) {
        var map = new Map();
      //  map.add("comp_id", data.comp_id);
        map.add("comp_name", data.comp_name, 'Text');
        map.add("start_date", data.start_date, 'Date');
        if (data.phone_no != undefined) {
            if(data.phone_no == null || data. phone_no == "")
                map.add("phone_no", "null");
            else
                map.add("phone_no", data.phone_no, 'Text');
        }
        if (data.email != undefined) {
            if (data.email == null || data.email == "")
                map.add("email", "null");
            else
                map.add("email", data.email, 'Text');
        }
        if (data.bus_id != undefined) {
            if (data.bus_id == null || data.bus_id == "")
                map.add("bus_id", "null");
            else
                map.add("bus_id", data.bus_id);
        }
        if (data.user_id != undefined) {
            if (data.user_id == null || data.user_id == "")
                map.add("user_id", "null");
            else
                map.add("user_id", data.user_id);
        }

        $.server.webMethod("FinFacts.Company.getNewCompany", map.toString(), callback);
    };

    this.updateCompany = function (data, callback) {
        var map = new Map();

     //   map.add("comp_id", data.comp_id);
        map.add("comp_name", data.comp_name, 'Text');
        map.add("start_date", data.start_date, 'Date');

        map.add("comp_id", data.comp_id);
        map.add("bus_id", data.bus_id);

        $.server.webMethod("FinFacts.Company.getAllUpdate", map.toString(), callback);

    };

    this.deleteCompany = function (comp_id, callback) {
        var map = new Map();
        map.add("comp_id",comp_id);
        $.server.webMethod("FinFacts.Company.deleteCompany", map.toString(), callback);
    };
    this.getPeriod = function (comp_id,callback) {
        var map = new Map();
        map.add("comp_id",comp_id);
        $.server.webMethod("FinFacts.Company.getPeriod", map.toString(), callback);
    };
    this.getCompanyByIdName = function (term, callback) {
        var map = new Map();
        map.add("comp_id", localStorage.getItem("user_finfacts_comp_id"));
        map.add("term", term);
        $.server.webMethod("FinFacts.Company.getCompanyByIdName", map.toString(), callback);
    };
    this.insertPeriod = function (data, comp_id, callback) {
        var map = new Map();
        map.add("comp_id",comp_id);
        map.add("per_name", data.per_name, 'Text');

        $.server.webMethod("FinFacts.Company.getNewPeriod", map.toString(), callback);
    };
    this.deletePeriod = function (per_id, callback) {
        var map = new Map();
        map.add("per_id",per_id);
        $.server.webMethod("FinFacts.Company.deletePeriod", map.toString(), callback);
    };
}