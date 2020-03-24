/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function SettingService()
{
    this.factoryReset = function (callback) {
        $.server.webMethod("Setting.factoryReset", "", function () {
            $.server.webMethod("RAC.Setting.factoryReset", "", function () {
                $.server.webMethod("Finfacts.Setting.factoryReset", "", function () {
                    callback();

                });
            });
        });
      
      
    }

    this.updateSetting = function (data, callback) {
        //var map = new Map();
        //map.add("sett_no", data.sett_no);
        //map.add("sett_desc", data.sett_desc, 'Text');
        //map.add("sett_key", data.sett_key,'Text');
        //map.add("value_1", data.value_1,'Text');
        //map.add("value_2", data.value_2,'Text');
        //map.add("value_3", data.value_3,'Text');
     
        //$.server.webMethod("Setting.updateSetting", map.toString(), callback);
        var update_data = {
            sett_no: data.sett_no,
            sett_desc: data.sett_desc,
            sett_key: data.sett_key,
            value_1: data.value_1,
            value_2: data.value_2,
            value_3: data.value_3
        }

        $.server.webMethodPUT("shopon/settings", update_data, callback);
    };

    this.getMaxSettingDetails = function (callback) {
        $.server.webMethod("Setting.getMaxSettingDetails", "", callback);
    }

    this.getPrinterSetting = function (callback) {
        $.server.webMethod("Setting.getPrinterSetting", "", callback);
    }


    this.insertSettings= function (data, sett_no, callback) {
        var map = new Map();
        map.add("sett_no", sett_no);

        map.add("sett_desc", data.sett_desc, 'Text');
        map.add("sett_key", data.sett_key, 'Text');
        map.add("value_1", data.value_1, 'Text');
        if (data.value_2 != undefined) {
            map.add("value_2", data.value_2, 'Text');

        }
        else {
            map.add("value_2", '', 'Text');
        }
        if (data.value_3 != undefined) {
            map.add("value_3", data.value_3, 'Text');

        }
        else {
            map.add("value_3", '', 'Text');
        }

        $.server.webMethod("Setting.insertSetting", map.toString(), callback);
    }

    this.getStoreByCompID = function (comp_id, callback) {
        var map = new Map();
        map.add("comp_id", comp_id);
        $.server.webMethod("Setting.getStoreByCompID", map.toString(), callback);
        //$.server.webMethodGET("shopon/settings/getStoreByCompID/" + comp_id, callback);
    }
    this.getRegisterByCompID = function (store_no, callback) {
        var map = new Map();
        map.add("store_no", store_no);
        $.server.webMethod("Setting.getRegisterByCompID", map.toString(), callback);
    }
   


    this.getCompanyPrinter = function (data, callback) {
        var map = new Map();
        map.add("sett_no", data);
        $.server.webMethod("Setting.getCompanyPrinter", map.toString(), callback);

    };
    
    //getAllSettings
    this.getAllSettings = function (callback) {
        var map = new Map();
        map.add("comp_id", getCookie("user_company_id"));
        map.add("store_no", getCookie("user_store_id"));
        $.server.webMethod("Setting.getAllSettings", map.toString(), callback);
        //$.server.webMethodGET("shopon/settings/search/allSettings", callback);
    }

    //getAllSettings
    this.getFinfactsettings = function (callback) {
        var map = new Map();
        map.add("comp_id", getCookie("user_company_id"));
        map.add("store_no", getCookie("user_store_id"));
        $.server.webMethod("Setting.getFinfactsSetting", map.toString(), callback);
        //$.server.webMethodGET("shopon/settings/search/allFinfactsSettings", callback);
    }


    this.deleteSettingDetails = function (sett_no, callback) {

        var map = new Map();
        map.add("sett_no", sett_no);
        $.server.webMethod("Setting.deletesettingDetails", map.toString(), callback);
    }

    
}