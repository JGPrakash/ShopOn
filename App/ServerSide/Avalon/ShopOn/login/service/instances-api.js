function InstancesAPI() {

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter Expression -> instance_id, instance_name, instance_url, prod_id
        $.server.webMethodGET("cloud/instances/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
    this.getValue = function (id, callback) {
        $.server.webMethodGET("cloud/instances/" + id, callback);
    }
}