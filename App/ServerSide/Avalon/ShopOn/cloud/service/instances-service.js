function InstancesService() {

    this.getInstances = function (prod_id,callback) {
        $.server.webMethodGET("iam/instances?prod_id=" + prod_id, callback);
    }
}