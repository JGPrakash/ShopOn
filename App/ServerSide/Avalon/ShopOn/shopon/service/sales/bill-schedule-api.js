function BillScheduleAPI() {
    var self = this;

    this.getValue = function (bill_no, callback) {
        $.server.webMethodGET("shopon/billschedule/" + bill_no + "?bill_no=" + bill_no + "&store_no=" + localStorage.getItem("user_store_no"), callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/billschedule/", data, callback, errorCallback);
    }
    this.putValue = function (data, callback, errorCallback) {
        $.server.webMethodPUT("shopon/billschedule/", data, callback, errorCallback);
    }
    this.updateScheduleAmount = function (schedule_data, callback, errorCallback) {
        $(schedule_data).each(function (i, item) {
            var data = {
                schedule_id: item.sch_id,
                paid: item.amount,
                status: item.status,
                pay_id: item.pay_id
            }
            if (i == schedule_data.length - 1) {
                $.server.webMethodPUT("shopon/billschedule/", data, callback, errorCallback);
            }
            else {
                $.server.webMethodPUT("shopon/billschedule/", data);
            }
        });
    }
}