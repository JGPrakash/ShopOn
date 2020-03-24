function ProductAPI() {

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter Expression -> prod_id, prod_name, prod_uri
        $.server.webMethodGET("cloud/product/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
}