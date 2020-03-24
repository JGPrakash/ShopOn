function RewardService() {
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
            $.server.webMethod("Reward.getCustomerRewardByAll", "term;%" + term + "%", callback);
        }

    }
    this.updateReward = function (data, callback) {
        var map = new Map();
        map.add("reward_plan_id", data.reward_plan_id);
        map.add("reward_plan_name", data.reward_plan_name, "Text");
        map.add("reward_plan_point", data.reward_plan_point);
        map.add("reward_plan_type", data.reward_plan_type, "Text");
        $.server.webMethod("Reward.updateReward", map.toString(), callback);
    }
    this.deleteReward = function (data, callback) {
        var map = new Map();
        map.add("reward_plan_id", data);
        $.server.webMethod("Reward.deleteReward", map.toString(), callback);
    }
    this.insertReward = function (data, callback) {
        var map = new Map();
        map.add("reward_plan_name", data.reward_plan_name, "Text");
        map.add("reward_plan_point", data.reward_plan_point);
        map.add("reward_plan_type", data.reward_plan_type, "Text");
        $.server.webMethod("Reward.insertReward", map.toString(), callback);
    }
    this.getRewardPlanByAll = function (term, callback) {
        $.server.webMethod("Reward.getRewardPlanByAll", "term;%" + term + "%", callback);
    };
    this.getRewardById = function (data, callback) {
        var map = new Map();
        map.add("reward_plan_id", data);
        $.server.webMethod("Reward.getRewardById", map.toString(), callback);
       // return $.server.webMethod("Reward.getRewardById", "reward_plan_id;" + data.reward_plan_id, callback);
    }
    this.getRewardByName = function (data, callback) {
        return $.server.webMethod("Reward.getRewardByName", "data.reward_plan_name;" + data, callback);
    }
    this.getRewardPlanById = function (data, callback) {
        var map = new Map();
        map.add("reward_plan_id", data);
        $.server.webMethod("Reward.getRewardPlanById", map.toString(), callback);
    };
    this.getRewardByAll = function (term, callback) {
        $.server.webMethod("Reward.getRewardByAll", "term;%" + term + "%", callback);
    };
}