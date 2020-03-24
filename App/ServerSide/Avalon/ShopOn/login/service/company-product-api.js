function CompanyProductAPI() {

    var self = this;



    this.SearchValue = function (start_record, end_record, filterExpression, sort_expression, callback) {
        var user_id = JSON.parse(localStorage.getItem("admin_data"))[0].user_id;
        //$.server.webMethodGET("iam/CompanyProduct11?user_id=" + user_id, callback);
        $.server.webMethodGET("cloud/companyproduct/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);

    }

}