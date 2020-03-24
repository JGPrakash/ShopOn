function CompanyProductService() {

    this.getCompanyProduct = function (comp_id, callback) {
        $.server.webMethodGET("cloud/companyproduct/old?comp_id=" + comp_id, callback);
    }
    this.insertCompanyProduct = function (data, callback) {

        $.server.webMethodPOST("cloud/companyproduct/", data, callback);
    }
    this.getProductDetails = function (comp_prod_id, callback) {
        var user_id = JSON.parse(getCookie("admin_data"))[0].user_id;
        $.server.webMethodGET("cloud/companyproduct/oldproductdetails?comp_prod_id=" + comp_prod_id + ";&user_id=" + user_id, callback);
    }
}