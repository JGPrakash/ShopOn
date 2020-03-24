$.fn.shopOnMenu = function () {
    $(this).find("img").attr("src", "/" + appConfig.root + "/ui/ui/images/menu_grid-128.png");

    $(this).mousemove(function () {
        $(".menu-shopon").css("width", "100%");
        $(".menu-shopon").css("height", "auto");
        $(".menu-shopon").css("display", "");
    });
    $(this).hover(function () {
        $(this).css("background-color", "darkgray");
        $(".menu-shopon").css("width", "100%");
        $(".menu-shopon").css("height", "auto");
        $(".menu-shopon").css("display", "");
    }, function () {
        $(this).css("background-color", "");
        //$(".menu-shopon").css("width", "30px");
        setTimeout(function () {
            if ($(".menu-shopon").attr("hover") != "true") {
                $(".menu-shopon").css("display", "none");
            }
        }, 1000);
    });
    $(".menu-shopon").hover(function () {
        $(this).css("width", "100%");
        $(".menu-shopon").css("height", "auto");
        $(".menu-shopon").attr("hover", "true");
        $(".menu-shopon").css("display", "");
    }, function () {
        //$(this).css("width", "30px");
        $(".menu-shopon").attr("hover", "false");
        $(".menu-shopon").css("display", "none");
    });

    $(".menu-shopon>div:first>div").hover(function () {
        $(this).find("span").css("border-bottom", "solid 3px gray");
        //   $(this).css("background-color", "gray");
    }, function () {
        $(this).find("span").css("border-bottom", "");
    });

    $(".menu-shopon>div:first>div").click(function () {
        $(".menu-shopon").css("width", "30px");
    });

    //if (window.mobile) {
    // $(".menu-shopon").css("height", "100px");
    //    $(".menu-shopon").delay(000).fadeOut();
    //}
}

var CONTEXT = {};
CONTEXT.CurrentLanguage = "en";

$.fn.masterPage = function () {
    return $.pageController.getPage(this, function (page, $$) {
        page.template("/" + appConfig.root + "/cloud/view/master-page/master-page.html");
        page.userpermissionAPI = new UserPermissionAPI();
        page.events = {
            lblAppName_click: function () {            
                window.location.href = "/" + appConfig.root + "/cloud/view/home-page/home-page.html";
            },
            btnLogout_click: function () {
                window.location.href = "/" + appConfig.root + "/cloud/view/login-page/login-page.html";
            },
            page_load: function () {
                //Add Footer
                $("body").append(' <div class="footer"> <p align="center" style="margin:0px">&copy; 2017  <a href="http://www.wototech.com" >www.wototech.com</a> WoTo Technologies,Tiruchendur, Chennai, USA; Contact:+91 9944103296, +91 9003300929            <p>        </div>');
                //Set App Name
                $$("lblAppName").selectedObject.html("WoToCloud");
                //Set User Name
                page.controls.lblUserName.html(JSON.parse(getCookie("admin_data"))[0].user_name);
                //Load Menu
                page.userpermissionAPI.getValue(function (data) {
                    var ndata = {};
                    $(data).each(function (i, item) {
                        if (item.attr_2 != null) {
                            if (typeof ndata[item.attr_2] == "undefined")
                                ndata[item.attr_2] = [];

                            ndata[item.attr_2].push(item);
                        }
                    });
                    var finalhtmlBuilder = [];
                    for (var prop in ndata) {
                        var htmlBuilder = [];
                        $(ndata[prop]).each(function (i, item) {
                            var tempBuilder = $$("pnlMenuTeplate").html();
                            tempBuilder = tempBuilder.replace("{Menu}", item.attr_3);
                            tempBuilder = tempBuilder.replace("{Menu}", item.attr_3);
                            tempBuilder = tempBuilder.replace("{URL}", item.attr_1);
                            htmlBuilder.push(tempBuilder);
                        });
                        var tempBuilder = $$("pnlMenuMainTeplate").html();
                        tempBuilder = tempBuilder.replace("{MainMenu}", prop);
                        tempBuilder = tempBuilder.replace("{SubMenu}", htmlBuilder.join(""));
                        finalhtmlBuilder.push(tempBuilder);
                    }

                    $$("pnlMenuPlaceHolder").html(finalhtmlBuilder.join(" "));
                    $($$("pnlMenuPlaceHolder")).children("div").children("div").click(function () {
                        var menu = $(this).attr("menu");

                        window.location.href = "/" + window.location.pathname.split("/")[1] + "/" + $(this).attr("URL");
                    });
                });
            },
        }
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}