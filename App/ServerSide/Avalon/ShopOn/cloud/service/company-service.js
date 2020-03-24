function CompanyService() {

    var self = this;
    this.registerCompany = function (registerData, callback) {
        $.server.webMethodPOST("iam/company/register", registerData, callback);
    }
    this.insertCompany = function (data, callback) {
        $.server.webMethodPOST("iam/company", data, callback);
    }
    this.getCompany = function (comp_id, callback) {
        $.server.webMethodGET("iam/users/Company/" + comp_id, callback);
    }
    this.getCompanyByUserId = function (callback) {
        var user_id = JSON.parse(getCookie("admin_data"))[0].user_id;
        $.server.webMethodGET("iam/company?user_id="+user_id, callback);
    }

    //this.insertShopOnCompany = function (data, callback) {

    //    $.server.webMethodPOST("iam/company/shopon/product", data, callback);
    //}

    this.getCompanyProduct = function (comp_id, callback) {

        $.server.webMethodGET("iam/company/gproduct?comp_id=" + comp_id, callback);
    }

    this.getPricePlan = function (prod_id, callback) {

        $.server.webMethodGET("iam/priceplan?prod_id=" + prod_id, callback);
    }

    this.getInstances = function (prod_id, callback) {

        $.server.webMethodGET("iam/instance?prod_id=" + prod_id, callback);
    }

    this.getProductDetails = function (comp_prod_id, callback) {
        var user_id = JSON.parse(getCookie("admin_data"))[0].user_id;
        $.server.webMethodGET("iam/company/productDetails?comp_prod_id=" + comp_prod_id + ";&user_id=" + user_id, callback);
    }


    this.getAllProduct = function (callback) {
        $.server.webMethodGET("iam/product", callback);
    }
    this.getAllCompanyProduct = function (callback) {
        $.server.webMethodGET("iam/companyproduct", callback);
    }
    this.getAllGroup = function (callback) {
        $.server.webMethodGET("iam/group", callback);
    }

    this.getAllInsatnceById = function (instance_id, callback) {
        $.server.webMethodGET("iam/company/getAllInsatnceById?instance_id=" + instance_id, callback);
    }
    this.insertBatch = function (data, callback) {
        $.server.webMethodPOST("iam/company/batch", data, callback);
    }


}