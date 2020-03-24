/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function ContactService()
{

    this.getContact = function (callback) {
        var map = new Map();

        $.server.webMethod("Contacts.getAllContact", map.toString(), callback);
    };

    this.insertContact = function (data, callback) {
        var map = new Map();
       
        map.add("cont_fname", data.cont_fname, 'Text');
        map.add("cont_lname", data.cont_lname, 'Text');
       map.add("cont_salutation", data.cont_salutation, 'Text');
        map.add("mobile_phone", data.mobile_phone);
        map.add("home_phone", data.home_phone);
        map.add("cont_email", data.cont_email, 'Text');
        map.add("addr_type", data.addr_type, 'Text');
        map.add("cont_address2", data.cont_address2, 'Text');
        map.add("cont_city", data.cont_city, 'Text');
        map.add("cont_state", data.cont_state, 'Text');
        map.add("cont_pincode", data.cont_pincode);
        map.add("cont_company", data.cont_company, 'Text');
        map.add("cont_design", data.cont_design, 'Text');
        map.add("cont_bemail", data.cont_bemail, 'Text');
        map.add("cont_bphone", data.cont_bphone);
        map.add("cont_address1", data.cont_address1, 'Text');
        map.add("cont_owner", "1", '');
      //  map.add("cre_date", data.cre_date, 'Date');

        $.server.webMethod("Contacts.getAllNewContact", map.toString(), callback);
    };

    this.updateContact = function (data, callback) {
        var map = new Map();

        map.add("cont_fname", data.cont_fname, 'Text');
        map.add("cont_lname", data.cont_lname, 'Text');
        map.add("cont_salutation", data.cont_salutation, 'Text');
        map.add("mobile_phone", data.mobile_phone);
        map.add("home_phone", data.home_phone);
        map.add("cont_email", data.cont_email, 'Text');
        map.add("addr_type", data.addr_type, 'Text');
        map.add("cont_address2", data.cont_address2, 'Text');
        map.add("cont_city", data.cont_city, 'Text');
        map.add("cont_state", data.cont_state, 'Text');
        map.add("cont_pincode", data.cont_pincode);
        map.add("cont_company", data.cont_company, 'Text');
        map.add("cont_design", data.cont_design, 'Text');
        map.add("cont_bemail", data.cont_bemail, 'Text');
        map.add("cont_bphone", data.cont_bphone);
        map.add("cont_address1", data.cont_address1, 'Text');
     //   map.add("cre_date", data.cre_date, 'Date');
    
        map.add("contact_id", data.contact_id);

        $.server.webMethod("Contacts.getAllUpdate", map.toString(), callback);

    };

    this.deleteContact = function (contact_id, callback) {
        var map = new Map();
        map.add("contact_id", contact_id);
        $.server.webMethod("Contacts.deleteContact", map.toString(), callback);
    };
    this.getContactByNamePhone = function (term, callback) {
      
      $.server.webMethod("Contacts.getContactByNamePhone", "term;%" + term + "%", callback);
    };
}
