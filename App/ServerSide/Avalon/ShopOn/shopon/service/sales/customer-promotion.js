function CustomerPromotion() {

    this.getCustomerByAll = function (term, callback) {

        if (term == null) {
            term = "";
        }
        if (androidApp == true) {

            AndroidProxy.execute("select cust_no  ,cust_name from local_customer_t lct", function (data) {

                $(data).each(function (i, item) {
                    item.cust_no = item.cust_no;
                });
                callback(data);
            });
            // callback( eval(Android.execute("select * from customer_t")));


        } else {
            $.server.webMethod("Promotion.getCustomerByAll", "term;%" + term + "%", callback);
        }

    }

   
    this.getCustomerById = function (data, callback) {
        return $.server.webMethod("Promotion.getCustomerById", "cust_no;" + data, callback);
    }
    this.getAllCustomer = function (callback) {
        var map = new Map();

        $.server.webMethod("Promotion.getAllCustomer", map.toString(), callback);
    };
    
    //reward plans
    this.getRewardByAll = function (term, callback) {
        $.server.webMethod("Promotion.getRewardByAll", "term;%" + term + "%", callback);
    };
        
    
}