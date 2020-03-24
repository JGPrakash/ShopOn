function BatchAPI() {

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("cloud/batch/", data, callback, errorCallback);
    }
}