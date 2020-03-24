/// <reference path="../sales-pos/sales-pos.html" />

$.fn.homePage = function() {
    return $.pageController.getControl(this, function(page, $$) {
        //Import Services required
        page.userService = new UserService();
        //page.compService = new CompanyService();
        page.userpermissionAPI = new UserPermissionAPI();
        page.menuAPI = new MenuAPI();
        page.events = {
            btnLogin_click: function() {
                page.userService.getUserById(page.controls.txtUserId.val(), function(data) {
                    if (data.length == 1) {
                        if (page.controls.txtUserId.val() == data[0].password) {
                            window.location.href = "view/pages/sales-pos/sales-pos.html";
                        } else {
                            alert("Invalid User Id or Password !");
                        }
                    } else {
                        alert("Invalid User Id or Password !");
                    }
                });

            },
            page_load: function () {


                page.menuAPI.getValue(menu_privilages.join(","), function (data) {
                    var ndata = {};
                    $(data).each(function (i, item) {
                        if (item.menu_category != null) {
                            if (typeof ndata[item.menu_category] == "undefined")
                                ndata[item.menu_category] = [];

                            ndata[item.menu_category].push(item);
                        }
                    });
                    var htmlBuilder = [];
                    var attr_2 = "";
                    $(data).each(function (i, item) {

                        if (item.menu_category == "")
                            htmlBuilder.push("<span style='font-size: 20px;font-weight:bold;line-height: 45px;'>" + item.menu_category + "</span><br><br>");

                        if (item.menu_category != attr_2) {
                            if (attr_2 != "")
                                htmlBuilder.push("<br><br>");
                            htmlBuilder.push("<span style='font-size: 20px;font-weight:bold;line-height: 45px;'>" + item.menu_category + "</span><br><br>");

                        }
                        if (item.obj_id != "Home")
                            htmlBuilder.push("<a href='" + "/" + window.location.pathname.split("/")[1] + "/" + item.menu_path + "'>" + item.menu_name + "</a>");

                        attr_2 = item.menu_category;
                        //    if(item.obj_id=="Payment")
                        //        htmlBuilder.push('<br><br><br><div style="font-weight: bold; margin-left: 0px; margin-top: 20px; display: inline-block; margin-right: 30px; width: 80px; font-size: 20px; color: yellowgreen;">Reports</div>');
                    });
                    $$("pnlMenuBig").html(htmlBuilder.join("  "));
                });

                //var inputData = {
                //    obj_type: "Product::Menu",
                //    obj_id: localStorage.getItem("prod_id"),//"6",
                //    comp_prod_id: localStorage.getItem("user_company_id")
                //};
                //page.userpermissionAPI.getValue(inputData, function (data) {
                //    //page.userService.getUserObject(inputData, function (data) {
                //    var menu_ids = [];
                //    $(data).each(function (i, item) {
                //        item.obj_type = item.obj_type.replace("Product::", "");
                //        if (item.obj_id.startsWith("6"))
                //            item.obj_id = item.obj_id.replace("6::", "");
                //        if (item.obj_id.startsWith("7"))
                //            item.obj_id = item.obj_id.replace("7::", "");
                //        if (item.obj_id.startsWith("8"))
                //            item.obj_id = item.obj_id.replace("8::", "");
                //        if (item.obj_id.startsWith("9"))
                //            item.obj_id = item.obj_id.replace("9::", "");
                //        if (item.obj_id.startsWith("26"))
                //            item.obj_id = item.obj_id.replace("26::", "");
                //        if (item.obj_id.startsWith("27"))
                //            item.obj_id = item.obj_id.replace("27::", "");
                //        if (item.obj_id.startsWith("28"))
                //            item.obj_id = item.obj_id.replace("28::", "");
                //        if (item.obj_id.startsWith("29"))
                //            item.obj_id = item.obj_id.replace("29::", "");
                //        if (item.obj_id.startsWith("30"))
                //            item.obj_id = item.obj_id.replace("30::", "");
                //        if (item.obj_id.startsWith("31"))
                //            item.obj_id = item.obj_id.replace("31::", "");
                //        if (item.obj_id.startsWith("33"))
                //            item.obj_id = item.obj_id.replace("33::", "");
                //        if (item.obj_id.startsWith("36"))
                //            item.obj_id = item.obj_id.replace("36::", "");
                //        if (item.obj_id.startsWith("37"))
                //            item.obj_id = item.obj_id.replace("37::", "");
                //        menu_ids.push(item.obj_id);
                //    });
                //    if (typeof CONTEXT.COMPANY_MENU_HIDE == "undefined" || CONTEXT.COMPANY_MENU_HIDE == null || CONTEXT.COMPANY_MENU_HIDE == "") {
                //        page.menuAPI.getValue(menu_ids.join(","), function (data) {
                //            var ndata = {};
                //            $(data).each(function (i, item) {
                //                if (item.menu_category != null) {
                //                    if (typeof ndata[item.menu_category] == "undefined")
                //                        ndata[item.menu_category] = [];

                //                    ndata[item.menu_category].push(item);
                //                }
                //            });




                //            var htmlBuilder = [];
                //            // page.template(+ appConfig.root + '/shopon/view/customer/customer-edit/customer-edit.html');

                //            //htmlBuilder.push(' <div style="font-weight: bold; margin-left: 0px; margin-top: 20px; display: inline-block; margin-right: 30px; width: 80px; font-size: 20px; color: slateblue;">Screens</div> ')
                //            var attr_2 = "";
                //            $(data).each(function (i, item) {

                //                if (item.menu_category == "")
                //                    htmlBuilder.push("<span style='font-size: 20px;font-weight:bold;line-height: 45px;'>" + item.menu_category + "</span><br><br>");

                //                if (item.menu_category != attr_2) {
                //                    if (attr_2 != "")
                //                        htmlBuilder.push("<br><br>");
                //                    htmlBuilder.push("<span style='font-size: 20px;font-weight:bold;line-height: 45px;'>" + item.menu_category + "</span><br><br>");

                //                }
                //                if (item.obj_id != "Home")
                //                    htmlBuilder.push("<a href='" + "/" + window.location.pathname.split("/")[1] + "/" + item.menu_path + "'>" + item.menu_name + "</a>");

                //                attr_2 = item.menu_category;
                //                //    if(item.obj_id=="Payment")
                //                //        htmlBuilder.push('<br><br><br><div style="font-weight: bold; margin-left: 0px; margin-top: 20px; display: inline-block; margin-right: 30px; width: 80px; font-size: 20px; color: yellowgreen;">Reports</div>');
                //            });
                //            $$("pnlMenuBig").html(htmlBuilder.join("  "));


                //        });
                //    }
                //    else {
                //        var menu_hide = CONTEXT.COMPANY_MENU_HIDE.split(",");
                //        var menu = menu_ids.filter(function (obj) { return menu_hide.indexOf(obj) == -1; });
                //        page.menuAPI.getValue(menu.join(","), function (data) {
                //            var ndata = {};
                //            $(data).each(function (i, item) {
                //                if (item.menu_category != null) {
                //                    if (typeof ndata[item.menu_category] == "undefined")
                //                        ndata[item.menu_category] = [];

                //                    ndata[item.menu_category].push(item);
                //                }
                //            });




                //            var htmlBuilder = [];
                //            // page.template(+ appConfig.root + '/shopon/view/customer/customer-edit/customer-edit.html');

                //            //htmlBuilder.push(' <div style="font-weight: bold; margin-left: 0px; margin-top: 20px; display: inline-block; margin-right: 30px; width: 80px; font-size: 20px; color: slateblue;">Screens</div> ')
                //            var attr_2 = "";
                //            $(data).each(function (i, item) {

                //                if (item.menu_category == "")
                //                    htmlBuilder.push("<span style='font-size: 20px;font-weight:bold;line-height: 45px;'>" + item.menu_category + "</span><br><br>");

                //                if (item.menu_category != attr_2) {
                //                    if (attr_2 != "")
                //                        htmlBuilder.push("<br><br>");
                //                    htmlBuilder.push("<span style='font-size: 20px;font-weight:bold;line-height: 45px;'>" + item.menu_category + "</span><br><br>");

                //                }
                //                if (item.obj_id != "Home")
                //                    htmlBuilder.push("<a href='" + "/" + window.location.pathname.split("/")[1] + "/" + item.menu_path + "'>" + item.menu_name + "</a>");

                //                attr_2 = item.menu_category;
                //                //    if(item.obj_id=="Payment")
                //                //        htmlBuilder.push('<br><br><br><div style="font-weight: bold; margin-left: 0px; margin-top: 20px; display: inline-block; margin-right: 30px; width: 80px; font-size: 20px; color: yellowgreen;">Reports</div>');
                //            });
                //            $$("pnlMenuBig").html(htmlBuilder.join("  "));


                //        });
                //    }
                //});
            }
        }

    });



}