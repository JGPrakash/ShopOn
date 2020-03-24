/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function BusinessService()
{
    this.getBusiness = function (callback) {
        var map = new Map();

        $.server.webMethod("FinFacts.Business.getBusiness", map.toString(), callback);
    };
    //
    //this.getTemplateAccessByName = function (callback) {
    //    var map = new Map();

    //    $.server.webMethod("FinFacts.Business.getTemplateAccessByName", map.toString(), callback);
    //};getTemplateAccess
    this.getBusinessById = function (data, callback) {
        var map = new Map();
        map.add("bus_id", data.bus_id);

        $.server.webMethod("FinFacts.Business.getBusinessById", map.toString(), callback);
    };
    this.getTemplateAccess = function (bus_id, callback) {
        var map = new Map();
        map.add("bus_id", bus_id);

        $.server.webMethod("FinFacts.Business.getTemplateAccess", map.toString(), callback);
    };
    this.insertBusiness = function (data, callback) {
        var map = new Map();
        map.add("bus_name", data.bus_name, 'Text');
        map.add("bus_desc", data.bus_desc, 'Text');

        $.server.webMethod("FinFacts.Business.getNewBusiness", map.toString(), callback);
    };

    this.updateBusiness = function (data, callback) {
        var map = new Map();
        map.add("bus_name", data.bus_name, 'Text');
        map.add("bus_desc", data.bus_desc, 'Text');

        map.add("bus_id", data.bus_id);

        $.server.webMethod("FinFacts.Business.getAllUpdate", map.toString(), callback);

    };

    this.deleteBusiness = function (bus_id, callback) {
        var map = new Map();
        map.add("bus_id", bus_id);
        $.server.webMethod("FinFacts.Business.deleteBusiness", map.toString(), callback);
    };
    this.getTemplate = function (callback) {
        var map = new Map();
        $.server.webMethod("FinFacts.Business.getTemplate", map.toString(), callback);
    };
    this.getBusinessByIdName = function (term, callback) {

        $.server.webMethod("FinFacts.Business.getBusinessByIdName", "term;%" + term + "%", callback);
    };
    this.insertTemplateAccess = function (data, bus_id, callback) {
        var map = new Map();
        map.add("bus_id", bus_id);
        map.add("template_id", data.template_id, 'Text');
        map.add("active", data.active, 'Text');

        $.server.webMethod("FinFacts.Business.getNewTemplateAccess", map.toString(), callback);
    };
    this.deleteTemplateAccess = function (acc_id, callback) {
        var map = new Map();
        map.add("acc_id", acc_id);
        $.server.webMethod("FinFacts.Business.deleteTemplateAccess", map.toString(), callback);
    };

    this.getTemplateForComp = function (bus_id, callback) {
        var map = new Map();
        map.add("bus_id", bus_id);
        $.server.webMethod("FinFacts.Business.getTemplateForComp", map.toString(), callback);
    };
}