/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function AccountsService()
{
    this.getAccounts = function (callback) {
        var map = new Map();

        $.server.webMethod("NewAccount.getAllAccounts", map.toString(), callback);
    };

    this.insertAccount = function (data, callback) {
        var map = new Map();
        
        map.add("acct_name", data.acct_name, 'Text');
        map.add("acct_phone", data.acct_phone);
        map.add("parent_account", data.parent_account, 'Text');
        map.add("acct_email", data.acct_email, 'Text');
        map.add("acct_website", data.acct_website, 'Text');
        map.add("primary_contact", data.primary_contact, 'Text');
        map.add("addr_type", data.addr_type, 'Text');
        map.add("acct_address1", data.acct_address1, 'Text');
        map.add("acct_address2", data.acct_address2, 'Text');
        map.add("acct_city", data.acct_city, 'Text');
        map.add("acct_state", data.acct_state, 'Text');
        map.add("acct_pincode", data.acct_pincode);
        map.add("acct_owner", "1", '');
        
        $.server.webMethod("NewAccount.getAllNewAccount", map.toString(), callback);
    };

    this.updateAccount = function (data, callback) {
        var map = new Map();
        
       map.add("acct_name", data.acct_name, 'Text');
        map.add("acct_phone", data.acct_phone);
        map.add("parent_account", data.parent_account, 'Text');
        map.add("acct_email", data.acct_email, 'Text');
        map.add("acct_website", data.acct_website, 'Text');
        map.add("primary_contact", data.primary_contact, 'Text');
        map.add("addr_type", data.addr_type, 'Text');
        map.add("acct_address1", data.acct_address1, 'Text');
        map.add("acct_address2", data.acct_address2, 'Text');
        map.add("acct_city", data.acct_city, 'Text');
        map.add("acct_state", data.acct_state, 'Text');
        map.add("acct_pincode", data.acct_pincode);
        
        map.add("acct_id",data.acct_id);
        
    $.server.webMethod("NewAccount.getAllUpdate", map.toString(), callback);

    };
    
    this.deleteAccount = function (acct_id, callback) {
      var map = new Map();
        map.add("acct_id",acct_id);
       $.server.webMethod("NewAccount.deleteAccount", map.toString(), callback);
    };
    
    this.getAccountByNamePhone = function (term, callback) {
      
      $.server.webMethod("NewAccount.getAccountByNamePhone", "term;%" + term + "%", callback);
    };
    
    this.getContactByName = function (cont_fname, callback) {
      
      $.server.webMethod("NewAccount.getContactByName", "cont_fname;" + cont_fname, callback);
    };
    
    this.getContforAct = function (acct_id,callback) {
        var map = new Map();
           map.add("acct_id",acct_id);
        $.server.webMethod("NewAccount.getContforAct", map.toString(), callback);
    };
    
    this.getContactById = function (acct_id, callback) {
        
        $.server.webMethod("NewAccount.getContactById", "acct_id;" + acct_id, callback);
    };
    
    this.insertContAct = function (data, callback) {
      var map = new Map();
      
      map.add("acct_id",data.acct_id);
      map.add("cont_id",data.cont_id);
      
      $.server.webMethod("NewAccount.insertContAct", map.toString(), callback);
    };
    this.deleteContAct = function (acct_id, callback) {
      var map = new Map();
        map.add("acct_id",acct_id);
       $.server.webMethod("NewAccount.deleteContAct", map.toString(), callback);
    };
}
 
