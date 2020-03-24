function SalesExecutiveRewardService() {
    this.getCustomerRewardByAll = function (term, callback) {

        if (term == null) {
            term = "";
        }
        if (androidApp == true) {

            AndroidProxy.execute("select reward_plan_id,reward_plan_name from customer_reward_plan_t lcrt", function (data) {

                $(data).each(function (i, item) {
                    item.reward_no = item.reward_no;
                });
                callback(data);
            });
            // callback( eval(Android.execute("select * from customer_t")));
        } else {
            $.server.webMethod("SalesReward.getCustomerRewardByAll", "term;%" + term + "%", callback);
        }

    }
    this.updateReward = function (data, callback) {
        var map = new Map();
        map.add("reward_plan_id", data.reward_plan_id);
        map.add("reward_plan_name", data.reward_plan_name, "Text");
        map.add("reward_plan_point", data.reward_plan_point);
        map.add("reward_plan_type", data.reward_plan_type, "Text");
        $.server.webMethod("SalesReward.updateReward", map.toString(), callback);
    }
    this.deleteReward = function (data, callback) {
        var map = new Map();
        map.add("reward_plan_id", data);
        $.server.webMethod("SalesReward.deleteReward", map.toString(), callback);
    }
    this.insertReward = function (data, callback) {
        var map = new Map();
        map.add("reward_plan_name", data.reward_plan_name, "Text");
        map.add("reward_plan_point", data.reward_plan_point);
        map.add("reward_plan_type", data.reward_plan_type, "Text");
        $.server.webMethod("SalesReward.insertReward", map.toString(), callback);
    }
    this.getRewardPlanByAll = function (term, callback) {
        $.server.webMethod("SalesReward.getRewardPlanByAll", "term;%" + term + "%", callback);
    };
    this.getRewardById = function (data, callback) {
        var map = new Map();
        map.add("reward_plan_id", data);
        $.server.webMethod("SalesReward.getRewardById", map.toString(), callback);
        // return $.server.webMethod("Reward.getRewardById", "reward_plan_id;" + data.reward_plan_id, callback);
    }
    this.getRewardByName = function (data, callback) {
        return $.server.webMethod("SalesReward.getRewardByName", "data.reward_plan_name;" + data, callback);
    }
    this.getRewardPlanById = function (data, callback) {
        var map = new Map();
        map.add("reward_plan_id", data);
        $.server.webMethod("SalesReward.getRewardPlanById", map.toString(), callback);
    };
    this.getRewardByAll = function (term, callback) {
        $.server.webMethod("SalesReward.getRewardByAll", "term;%" + term + "%", callback);
    };
    this.getSalesExecutiveById = function (data, callback) {
        var map = new Map();
        map.add("sale_executive_no", data);
        map.add("comp_id", getCookie("user_company_id"));
        map.add("store_no", getCookie("user_store_id"));
        $.server.webMethod("SalesReward.getSalesExecutiveById", map.toString(), callback);
    };
    this.insertSalesExecutiveRewardt = function (data, callback) {
        var map = new Map();
        map.add("sale_executive_no", data.sales_executive_no, "Text");
        map.add("trans_date", data.trans_date, "Date");
        map.add("bill_no", data.bill_no, "Text");
        map.add("reward_plan_id", data.reward_plan_id, "Text");
        map.add("points", data.points, "Text");
        map.add("trans_type", data.trans_type, "Text");
        map.add("description", data.description, "Text");
        map.add("setteled_amount", data.setteled_amount, "Text");
        $.server.webMethod("SalesReward.insertSalesExecutiveReward", map.toString(), callback);
    }
    this.insertAllSalesExecutiveRewardt = function (i, dataLists, callback) {
        var self = this;
        if (i == dataLists.length) {
            callback();
        }
        else {
            var dataList = dataLists[i];
            self.insertSalesExecutiveRewardt(dataList, function () {
                self.insertAllSalesExecutiveRewardt(i + 1, dataLists, callback);
            });
        }
    };
    this.getActiveReward = function (callback) {
        $.server.webMethod("SalesReward.getActiveReward", "term;%%", callback);
    };
    this.getPointTransaction = function (data, callback) {
        var map = new Map();
        map.add("sale_executive_no", data);
        $.server.webMethod("SalesReward.getPointTransaction", map.toString(), callback);
    };
}