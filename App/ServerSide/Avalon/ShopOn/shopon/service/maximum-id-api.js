function MaximumIdAPI() {
    var self = this;

    this.getValue = function (data, callback) {
        $.server.webMethodGET("shopon/maxid/?table_name=" + data.table_name + "&column_name=" + data.column_name, callback, callback);
    }
    this.getStoreValue = function (data, callback) {
        $.server.webMethodGET("shopon/maxid/store/?table_name=" + data.table_name + "&column_name=" + data.column_name, callback, callback);
    }
}