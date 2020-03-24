function ProductService() {

    this.getAllProduct = function (callback) {
        $.server.webMethodGET("cloud/product/", callback);
    }
}