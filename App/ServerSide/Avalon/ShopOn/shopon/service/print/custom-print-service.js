function customPrintService() {

    this.getAllPrint = function (callback) {
        $.server.webMethod("CustomPrint.getAllPrint", "", callback);

    };

    this.getAllEntity = function (callback) {
        $.server.webMethod("CustomPrint.getAllEntity", "", callback);

    };

    this.getPrintByNo = function (print, callback) {
        var map = new Map();
        map.add("print_id", print);
        return $.server.webMethod("CustomPrint.getPrintByNo", map.toString(), callback);
    }


    this.insertPrint = function (print, callback) {
        var map = new Map();
        map.add("print_name", print.print_name,"Text");
        map.add("template", print.template,"Text");
        map.add("condition", print.condition, "Text");
        map.add("sort_by", print.sort_by, "Text");
        map.add("entity_id", print.entity_id);
        return $.server.webMethod("CustomPrint.insertPrint", map.toString(), callback);
    }

    this.updatePrint = function (print, callback) {
        var map = new Map();
        map.add("print_id", print.print_id);
        map.add("print_name", print.print_name, "Text");
        map.add("template", print.template, "Text");
        map.add("condition", print.condition, "Text");
        map.add("sort_by", print.sort_by, "Text");
        map.add("entity_id", print.entity_id);
        return $.server.webMethod("CustomPrint.updatePrint", map.toString(), callback);
    }

    this.deletePrint = function (print, callback) {
        var map = new Map();
        map.add("print_id", print);
        return $.server.webMethod("CustomPrint.deletePrint", map.toString(), callback);
    }
    this.getEntityProp = function (entity_id, callback) {
        var map = new Map();
        map.add("entity_id", entity_id);
        return $.server.webMethod("CustomPrint.getEntityProp", map.toString(), callback);
    }

}