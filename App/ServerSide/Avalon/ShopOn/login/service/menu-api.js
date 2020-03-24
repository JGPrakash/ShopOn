﻿function MenuAPI() {

    var self = this;



    this.getValue = function (menu_ids, callback, errorCallback) {
        $.server.webMethodGET("shopon/menu?menu_ids=" + menu_ids, callback, errorCallback);
        //callback([{ "menu_category": "Admin", "upd_date": "2017-09-15 19:58:21.0", "menu_name": "Home", "menu_path": "iam/home-page/home-page.html", "cre_date": "2017-09-15 19:58:21.0", "sort_order": "1", "ver_no": "1", "menu_id": "1" },
        //    { "menu_category": "Admin", "upd_date": "2017-09-15 19:58:21.0", "menu_name": "Booking", "menu_path": "iam/user/user.html", "cre_date": "2017-09-15 19:58:21.0", "sort_order": "2", "ver_no": "1", "menu_id": "2" },
        //    { "menu_category": "Admin", "upd_date": "2017-09-15 19:58:21.0", "menu_name": "Payment", "menu_path": "iam/group/group.html", "cre_date": "2017-09-15 19:58:21.0", "sort_order": "3", "ver_no": "1", "menu_id": "3" }]);
    }

    this.getCompanyPrivilages = function (data, callback) {
        $.server.webMethodGET("shopon/privilages/?start_record=" + data.start_record + "&end_record=" + data.end_record + "&filter_expression=" + encodeURIComponent(data.filterExpression) + "&sort_expression=" + data.sort_expression, callback);
    }

}