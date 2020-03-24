function DashBoardService() {

    this.insertDashBoardAll = function (i,datas, callback) {
        var map = new Map();
        
        var self = this;
        if (i == datas.length) {
            callback();
        } else {
            var data = datas[i];
            self.insertDashBoard(data, function () {
                self.insertDashBoardAll(i + 1, datas, callback);
            });
        }
    }
    this.getDashBoard = function ( callback) {
        var map = new Map();
        map.add("comp_id", localStorage.getItem("user_finfacts_comp_id"));
        $.server.webMethod("FinFacts.DashBoard.getDashBoard", map.toString(), callback);
    };
    this.deleteDashBoard = function (callback) {
        var map = new Map();
        map.add("comp_id", localStorage.getItem("user_finfacts_comp_id"));
        return $.server.webMethod("FinFacts.DashBoard.truncateDashboard", map.toString(), callback);
    }
    this.insertDashBoard = function (data, callback) {
        $(data).each(function (i, item) {
            var map = new Map();
            map.add("keyvalue", item.keyvalue, 'Text');
            map.add("acc_name", item.acc_name, 'Text');
            map.add("amount", item.amount);
            map.add("comp_id", localStorage.getItem("user_finfacts_comp_id"));
            return $.server.webMethod("FinFacts.DashBoard.insertDashBoard", map.toString(), callback);
        })

    }
    this.getUserBills = function (callback) {
        var map = new Map();
        map.add("comp_id", localStorage.getItem("user_company_id"));
        return $.server.webMethod("DashBoard.getUserBills", map.toString(), callback);
    }
}