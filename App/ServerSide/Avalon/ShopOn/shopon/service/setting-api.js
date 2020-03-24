function SettingsAPI() {

    //search api to search purchase and sales bill
    this.getAllSettings = function ( callback) {
        $.server.webMethodGET("shopon/settings", callback);
    };

    //search api to search purchase and sales bill
    this.searchSettings = function (start_record, end_record, filter_expression, sort_expression, callback) {
        $.server.webMethodGET("shopon/settings?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression, callback);
    };
    //search api to search purchase and sales bill
    this.searchValue = function (data, callback) {
        $.server.webMethodGET("shopon/settings?select_expression="+data.select_expression+"&start_record=" + data.start_record + "&end_record=" + data.end_record + "&filter_expression=" + encodeURIComponent(data.filter_expression) + "&sort_expression=" + data.sort_expression, callback);
    };

    this.putValue = function (data, callback, errorCallback) {
        $.server.webMethodPUT("shopon/settings", data, callback, errorCallback);
    }

    this.eShopOnSearchValue = function (data, callback) {
        $.server.webMethodGET("eshopon/settings?select_expression=" + data.select_expression + "&start_record=" + data.start_record + "&end_record=" + data.end_record + "&filter_expression=" + encodeURIComponent(data.filter_expression) + "&sort_expression=" + data.sort_expression, callback);
    };

    this.eShopOnPutValue = function (data, callback, errorCallback) {
        $.server.webMethodPUT("eshopon/settings", data, callback, errorCallback);
    }
}