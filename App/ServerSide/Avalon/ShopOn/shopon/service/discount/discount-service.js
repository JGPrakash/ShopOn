function DiscountService() {
    var self = this;

    
   
    this.getDiscountDetailsBySearch = function(term, callback) {


        $.server.webMethod("Discount.getDiscountDetailsBySearch", "term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);
        



    }
    this.getDiscountByNo = function (disc_no, callback) {


        var map = new Map();
        map.add("disc_no", disc_no);
        map.add("comp_id", getCookie("user_company_id"));

        $.server.webMethod("Discount.getDiscountByNo", map.toString(), callback);
    }
   

    this.getDiscountItems = function(term, callback) {

        $.server.webMethod("Discount.getDiscountItems", "disc_no;" + term + ",comp_id;" + getCookie("user_company_id"), callback);
    }

    


    this.insertDiscount = function(data, callback, error) {
        var map = new Map();
        map.add("disc_type", data.disc_type, 'Text');
        map.add("disc_value", data.disc_value, 'Text');

        map.add("disc_name", data.disc_name, 'Text');
        map.add("disc_level", data.disc_level, 'Text');
        if (data.start_date!=undefined)
            map.add("start_date", data.start_date, "Text");
        if (data.end_date != undefined)

            map.add("end_date", data.end_date, "Text");
        map.add("comp_id", getCookie("user_company_id"));

        return $.server.webMethod("Discount.insertDiscount", map.toString(), callback, error);
    }

    this.insertItemDiscount = function (data, callback, error) {
        var map = new Map();
        map.add("disc_no", data.disc_no);
        map.add("item_no", data.item_no);

        map.add("trans_date", data.trans_date, "Date");
       



        return $.server.webMethod("Discount.insertItemDiscount", map.toString(), callback, error);
    }




    
    this.updateDiscount = function(data, callback) {
        var map = new Map();

        map.add("disc_type", data.disc_type, 'Text');
        map.add("disc_value", data.disc_value, 'Text');

        map.add("disc_name", data.disc_name, 'Text');
        map.add("disc_no", data.disc_no);
        map.add("disc_level", data.disc_level, 'Text');

        map.add("start_date", data.start_date, 'Text');

        map.add("end_date", data.end_date, 'Text');


        $.server.webMethod("Discount.updateDiscount", map.toString(), callback);

    }
    this.deleteDiscount = function (disc_no, callback) {
        var map = new Map();
        map.add("disc_no", disc_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Discount.deleteDiscount", map.toString(), callback);

    }
    this.deleteItemDiscount = function(disc_item_no, callback) {
        var map = new Map();
        map.add("disc_item_no", disc_item_no);
        $.server.webMethod("Discount.deleteItemDiscount", map.toString(), callback);

    }
   

}