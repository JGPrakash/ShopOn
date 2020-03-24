/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function DashboardService() {


    this.getCurrentPeriodByUser = function (comp_id, callback) {
        var map = new Map();
        map.add("comp_id", comp_id);
        $.server.webMethod("FinFacts.Dashboard.getPeriodByUser", map.toString(), callback);
    };
    this.getRevenueAccountByMonWise = function (per_id, callback) {
        var map = new Map();
        map.add("per_id", per_id);
        $.server.webMethod("FinFacts.Dashboard.getRevenueAccountByMonWise", map.toString(), callback);
    };
    this.getCostOfGoodAccountByMonWise = function (per_id, callback) {
        var map = new Map();
        map.add("per_id", per_id);
        $.server.webMethod("FinFacts.Dashboard.getCostOfGoodAccountByMonWise", map.toString(), callback);
    };
    
}