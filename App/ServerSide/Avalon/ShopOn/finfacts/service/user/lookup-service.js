/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function LookupService()
{
    this.getLookup = function (callback) {
        var map = new Map();
        map.add("comp_id", localStorage.getItem("user_finfacts_comp_id"));
        $.server.webMethod("FinFacts.Lookup.getLookup", map.toString(), callback);
    };
    this.getLookupById = function (data, callback) {
        var map = new Map();
        map.add("lookup_id", data.lookup_id);
        map.add("comp_id", localStorage.getItem("user_finfacts_comp_id"));
        $.server.webMethod("FinFacts.Lookup.getLookupById", map.toString(), callback);
    };
    this.insertLookup = function (data, callback) {
        var map = new Map();
        map.add("lookup_name", data.lookup_name, 'Text');
        map.add("description", data.description, 'Text');
        map.add("comp_id", localStorage.getItem("user_finfacts_comp_id"));
        $.server.webMethod("FinFacts.Lookup.getNewLookup", map.toString(), callback);
    };
    this.updateLookup = function (data, callback) {
        var map = new Map();
        map.add("lookup_name", data.lookup_name, 'Text');
        map.add("description", data.description, 'Text');
        map.add("lookup_id", data.lookup_id);
        map.add("comp_id", localStorage.getItem("user_finfacts_comp_id"));
        $.server.webMethod("FinFacts.Lookup.getAllUpdate", map.toString(), callback);
    };
    this.deleteLookup = function (lookup_id, callback) {
        var map = new Map();
        map.add("lookup_id", lookup_id);
        map.add("comp_id", localStorage.getItem("user_finfacts_comp_id"));
        $.server.webMethod("FinFacts.Lookup.deleteLookup", map.toString(), callback);
    };
    this.getLookupValue = function (lookup_id, callback) {
        var map = new Map();
        map.add("lookup_id", lookup_id);
        map.add("comp_id", localStorage.getItem("user_finfacts_comp_id"));
        $.server.webMethod("FinFacts.Lookup.getLookupValue", map.toString(), callback);
    };
    this.getLookupByIdName = function (term, callback) {
        $.server.webMethod("FinFacts.Lookup.getLookupByIdName", "term;%" + term + "%", callback);
    };
    this.insertLookupValue = function (data, lookup_id, callback) {
        var map = new Map();
        map.add("lookup_id", lookup_id);
        map.add("key_value", data.key_value, 'Text');
        $.server.webMethod("FinFacts.Lookup.getNewLookupValue", map.toString(), callback);
    };
    this.deleteLookupValue = function (lookup_val_id, callback) {
        var map = new Map();
        map.add("lookup_val_id", lookup_val_id);
        $.server.webMethod("FinFacts.Lookup.deleteLookupValue", map.toString(), callback);
    };
    this.getLookupValueByName = function (term, callback) {
       // $.server.webMethod("FinFacts.Lookup.getLookupValueByName", "lookup_name;%" + term + "%", callback);
        $.server.webMethod("FinFacts.Lookup.getLookupValueByName", "lookup_name;" + term, callback);
    };
    this.getCustomerLookup = function (term, callback) {
        var map = new Map();
        map.add("lookup_name", term);
        map.add("comp_id", localStorage.getItem("user_finfacts_comp_id"));
        $.server.webMethod("FinFacts.Lookup.getCustomerLookup", map.toString(), callback);
    };
}