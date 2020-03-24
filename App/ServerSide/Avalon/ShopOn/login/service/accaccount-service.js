/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function AccAccountService()
{
    this.getAccount = function (callback) {
        var map = new Map();

        $.server.webMethod("AccAccount.getAccount", map.toString(), callback);
    };
   
    this.insertAccount = function (data, callback) {
        var map = new Map();
            map.add("acc_name", data.acc_name, 'Text');
            map.add("acc_no", data.acc_no);
            map.add("acc_group_id", data.acc_group_id);
            

        $.server.webMethod("AccAccount.getNewAccount", map.toString(), callback);
    };
    
     this.updateAccount = function (data, callback) {
        var map = new Map();
        
       map.add("acc_name", data.acc_name, 'Text');
            map.add("acc_no", data.acc_no);
            map.add("acc_group_id", data.acc_group_id);
            
            
        map.add("acc_id",data.acc_id);
        
    $.server.webMethod("AccAccount.getAllUpdate", map.toString(), callback);

    };
    
    this.deleteAccount = function (acc_id, callback) {
      var map = new Map();
        map.add("acc_id",acc_id);
       $.server.webMethod("AccAccount.deleteAccount", map.toString(), callback);
    };
    this.getTransactions = function (acc_id,callback) {
    var map = new Map();
  map.add("acc_id",acc_id);
        $.server.webMethod("AccAccount.getTransactions", map.toString(), callback);
    };
    this.getAccountGroup = function (callback) {
        var map= new Map();
        $.server.webMethod("AccAccount.getAccountGroup", map.toString(), callback);
    };
    this.getAccAccountById = function (acc_id, callback) {
      
      $.server.webMethod("AccAccount.getAccAccountById", "acc_id;" + acc_id, callback);
    };
}