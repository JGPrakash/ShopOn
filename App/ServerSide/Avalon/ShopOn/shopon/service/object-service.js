function ObjectService() {

    this.getObjects = function(callback) {
        var map = new Map();

        $.server.webMethod("Selfie.getObjects", map.toString(), callback);
    }

}

