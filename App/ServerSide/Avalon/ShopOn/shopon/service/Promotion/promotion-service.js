function CustomerPromotion() {
    this.getCustomerNameByAll = function (term, callback) {

        if (term == -1){
            $.server.webMethod("Promotion.getCustomerPromotionByAll", "term;" + term, callback);
        } else {
            $.server.webMethod("Promotion.getCustomerNameByAll", "term;" + term, callback);
        }

    }
    this.getCustomerByAll = function (term, callback) {

        if (term == -1)
            $.server.webMethod("Promotion.getCustomerPromotionByAll", "term;" + term, callback);
        else
            $.server.webMethod("Promotion.getCustomerByAll", "term;" + term, callback);
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