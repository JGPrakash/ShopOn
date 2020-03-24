/// <reference path="../shopon/view/report/pur-bill.html" />
var ReportEngine = {

    generate : function(template,data,exportType){
        var r = window.open(null, "_blank");
        var doc = r.document;
        $.get("../shopon/view/report/pur-bill.html", function (htmlTemplate) {

            for (var prop in data) {
                htmlTemplate = htmlTemplate.replaceAll("{data." + prop + "}", item[prop] == null ? "" : item[prop]);
            }
           

            $($(htmlTemplate).find("[header]")).each(function (i,listTemplate) {
                var template = listTemplate.html();
            });

            doc.write(data);
            r.focus();
            r.print();
        });
        

    }
}