function PricePlanAPI() {

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter Expression -> prod_id, plan_type, price
        $.server.webMethodGET("cloud/priceplan/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
}