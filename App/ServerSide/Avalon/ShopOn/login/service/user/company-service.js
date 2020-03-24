function CompanyService() {

    var self = this;
    this.registerCompany = function (registerData, callback) {
        $.server.webMethodPOST("iam/company/", registerData, callback);
    }

    this.getCompany = function (comp_id, callback) {
        $.server.webMethodGET("iam/users/Company/" + comp_id, callback);
    }

    this.insertCompanyProduct = function (data, callback) {

        $.server.webMethodPOST("iam/company/" + data.comp_id + "/product", data, callback);
    }

    this.getCompanyProduct = function (comp_id, callback) {

        $.server.webMethodGET("iam/company/" + comp_id + "/gproduct?comp_id=" + comp_id, callback);
    }



    this.getAllProduct = function (callback) {
        $.server.webMethodGET("iam/product", callback);
    }
    this.getAllCompanyProduct = function (callback) {
        $.server.webMethodGET("iam/companyproduct", callback);
    }
    this.getAllCompanyGroup = function (comp_id, callback) {
        $.server.webMethodGET("iam/group/company/all?comp_id=" + comp_id, callback);
    }

}