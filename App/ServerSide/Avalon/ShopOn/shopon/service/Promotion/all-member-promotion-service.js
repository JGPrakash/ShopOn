function AllMemberPromotionService() {
    this.getChurchByAll = function (term, callback) {
        $.server.webMethod("AllMemberPromotion.getChurchByAll", "term;%" + term + "%", callback);
    };
    this.getPastorateByAll = function (term, callback) {
        $.server.webMethod("AllMemberPromotion.getPastorateByAll", "term;%" + term + "%", callback);
    };
    this.getGroupByAll = function (term, callback) {
        $.server.webMethod("AllMemberPromotion.getGroupByAll", "term;%" + term + "%", callback);
    };
    this.getAllMemNameByAll = function (term, callback) {
        $.server.webMethod("AllMemberPromotion.getAllMemNameByAll", "term;%" + term + "%", callback);
    };
    this.getChurchMemById = function (term, callback) {
        if (term == -1)
            $.server.webMethod("AllMemberPromotion.getChurchMemById", "term;%" + term + "%", callback);
        else
            $.server.webMethod("AllMemberPromotion.getChurchMemById", "term;" + term, callback);
    };
    this.getChurchMemByAll = function (term, callback) {
        if (term == -1)
            $.server.webMethod("AllMemberPromotion.getChurchMemByAll", "term;" + term, callback);
        else
            $.server.webMethod("AllMemberPromotion.getChurchMemById", "term;" + term, callback);
    };
    this.getPastorateMemById = function (term, callback) {
        if (term == -1)
            $.server.webMethod("AllMemberPromotion.getPastorateMemByAll", "term;%" + term + "%", callback);
        else
            $.server.webMethod("AllMemberPromotion.getPastorateMemById", "term;" + term, callback);
    };
    this.getPastorateMemByAll = function (term, callback) {
        if (term == -1)
            $.server.webMethod("AllMemberPromotion.getPastorateMemByAll", "term;" + term, callback);
        else
            $.server.webMethod("AllMemberPromotion.getPastorateMemById", "term;" + term, callback);
    };
    this.getGroupMemById = function (term, callback) {
        if (term == -1)
            $.server.webMethod("AllMemberPromotion.getGroupMemByAll", "term;%" + term + "%", callback);
        else
            $.server.webMethod("AllMemberPromotion.getGroupMemById", "term;" + term, callback);
    };
    this.getGroupMemByAll = function (term, callback) {
        if (term == -1)
            $.server.webMethod("AllMemberPromotion.getGroupMemByAll", "term;" + term, callback);
        else
            $.server.webMethod("AllMemberPromotion.getChurchMemById", "term;" + term, callback);
    };
    this.getChrById = function (chr_id, callback) {
        var map = new Map();
        map.add("chr_id", chr_id);
        $.server.webMethod("AllMemberPromotion.getChrById", map.toString(), callback);
    };
    this.getPasById = function (pas_id, callback) {
        var map = new Map();
        map.add("pas_id", pas_id);
        $.server.webMethod("AllMemberPromotion.getPasById", map.toString(), callback);
    };
    this.getMemById = function (mem_id, callback) {
        var map = new Map();
        map.add("mem_id", mem_id);
        $.server.webMethod("AllMemberPromotion.getMemById", map.toString(), callback);
    };
    this.getCustomerById = function (data, callback) {

        return $.server.webMethod("Promotion.getCustomerById", "cust_no;" + data, callback);
    }
    this.getChrMemDet = function (data, callback) {
        var map = new Map();
        map.add("chr_id", data.chr_id);
        map.add("year", data.year);
        $.server.webMethod("AllMemberPromotion.getChrMemDet", map.toString(), callback);
    };
    this.getPasMemDet = function (data, callback) {
        var map = new Map();
        map.add("pas_id", data.chr_id);
        map.add("year", data.year);
        $.server.webMethod("AllMemberPromotion.getPasMemDet", map.toString(), callback);
    };
    this.getMemDet = function (data, callback) {
        var map = new Map();
        map.add("mem_id", data.mem_id);
        map.add("year", data.year);
        $.server.webMethod("AllMemberPromotion.getMemDet", map.toString(), callback);
    };
    this.getGroupName = function (callback) {
        var map = new Map();
        $.server.webMethod("AllMemberPromotion.getGroupName", map.toString(), callback);
    };
    this.getGrpCustById = function (group_id, callback) {
        var map = new Map();
        map.add("group_id", group_id);
        $.server.webMethod("AllMemberPromotion.getGrpCustById", map.toString(), callback);
    };
    this.getGrpCustByList = function (data, callback) {
        var map = new Map();
        map.add("group_id", data.group_id);
        $.server.webMethod("AllMemberPromotion.getGrpCustByList", map.toString(), callback);
    };
    this.getMemByAll = function (callback) {
        var map = new Map();
        $.server.webMethod("AllMemberPromotion.getMemByAll", map.toString(), callback);
    };
    this.getCustomerById = function (data, callback) {
        return $.server.webMethod("AllMemberPromotion.getCustomerById", "cust_no;" + data, callback);
    };
    this.getCustomerDetById = function (term, callback) {
        if (term == -1)
            $.server.webMethod("AllMemberPromotion.getCustomerPromotionByAll", "term;" + term, callback);
        else
            $.server.webMethod("AllMemberPromotion.getCustomerDetById", "term;" + term, callback);
    };
    this.getRewardDetById = function (term, callback) {
        if (term == -1)
            $.server.webMethod("AllMemberPromotion.getCustomerPromotionByAll", "term;" + term, callback);
        else
            $.server.webMethod("AllMemberPromotion.getRewardDetById", "term;" + term, callback);
    };
    this.getCustDet = function (data, callback) {
        var map = new Map();
        map.add("cust_no", data.cust_no);
        $.server.webMethod("AllMemberPromotion.getCustDet", map.toString(), callback);
    };
    this.getRewardDet = function (data, callback) {
        var map = new Map();
        map.add("reward_plan_id", data.reward_plan_id);
        $.server.webMethod("AllMemberPromotion.getRewardDet", map.toString(), callback);
    };
}