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
var menu_privilages = [], feature_privilages = [];
var CONTEXT = {};
//CONTEXT.CurrentLanguage = "ta";
CONTEXT.CurrentLanguage = "en";
CONTEXT.CurrentSecondaryLanguage = "en";
CONTEXT.SEARCH_GRID_HEIGHT = "530px";
CONTEXT.printServerURL = "localhost";
CONTEXT.FSSAI_NO = "100/1A, 101/2B";
CONTEXT.Head_OFFICE = "Tirunelveli";
CONTEXT.Regd_OFFICE = "Tirunelveli";
CONTEXT.SALESORDER_RECEIPT_TEMPLATE = "Template2";
CONTEXT.SO_RECEIPT_TEMPLATE_FORMAT = "Template4";
//CONTEXT.ESHOPON_CANCEL = true;
CONTEXT.JASPER_SUPPORTING_FORMATS = [{ "value": "PDF" }, { "value": "WORD" }, { "value": "PPT" }, { "value": "CSV" }, { "value": "HTML" }];
CONTEXT.STOREWISE_BILL_NO = true;
//CONTEXT.PURCHASE_SKU_SEARCH = "Vendor";
var masterPage,store_refresh;
$.fn.masterPage = function () {
    return $.pageController.getPage(this, function (page, $$) {
        masterPage = page;
        page.template("/" + appConfig.root + "/login/view/master-page/master-page.html");
        page.userService = new UserService();
        page.userpermissionAPI = new UserPermissionAPI();
        page.settingsAPI = new SettingsAPI();
        page.menuAPI = new MenuAPI();
        page.storeAPI = new StoreAPI();
        page.userAPI = new UserAPI();
        page.userGroupAPI = new UserGroupAPI();
        page.notificationAPI = new NotificationAPI();

        page.controlName = "masterPage";
        page.view = {}
        var mins = new Date().getMinutes();
        var rmn = 60 - mins;
        var mills = rmn * 60 * 1000;
        page.events = {
            lblAppName_click: function () {
                document.cookie = "app_user_id="
                window.location.href = "/" + appConfig.root + "/login/view/home-page/home-page.html";
            },
            btnLogout_click: function () {
                document.cookie = "app_user_id=";
                localStorage.setItem("user_comp_id", "");
                window.location.href = "/" + appConfig.root + "/login/view/login-page/login-page.html";
            },
            page_load: function () {
                //$$("lblAppName").selectedObject.html(appConfig.title);
                if (localStorage.getItem("app_user_id") == "") {
                    window.location.href = "/" + appConfig.root + "/login/view/login-page/login-page.html";
                }
                else {
                    $("body").append(' <div class="footer"> <p align="center" style="margin:0px">&copy; Avalon</p>      </div>');
                    if (androidApp == true)
                        page.selectedObject.hide();
                    window.currentContext = {};
                    $$("lblAppName").selectedObject.html(localStorage.getItem("user_company_name"));// + localStorage.getItem("user_store_name")
                    //$$("lblStoreName").selectedObject.html(localStorage.getItem("user_store_name"));
                    
                    page.userAPI.getUserDetail(function (data) {
                        page.controls.lblUserName.html("User Id : " + data[0].user_name);
                        window.currentContext.user_name = data[0].user_name;
                        CONTEXT.user_name = data[0].user_name;
                        CONTEXT.user_id = data[0].user_id;
                        CONTEXT.user_no = data[0].user_id;
                        CONTEXT.allowNoStockSales = true;
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "comp_id=" + localStorage.getItem("user_company_id"),
                            sort_expression: ""
                        }
                        //page.settingsAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        //page.userService.getSettings(function (data) {
                        //$(data).each(function (i, item) {
                        $($.parseJSON(localStorage.getItem("company_settings"))).each(function (i, item) {
                            //if (item.value_1.toUpperCase() == "TRUE")
                            //    CONTEXT[item.sett_key] = true;
                            //else if (item.value_1.toUpperCase() == "FALSE")
                            //    CONTEXT[item.sett_key] = false;
                            //else
                            CONTEXT[item.sett_key] = item.value_1;
                        });

                        //Get Menu
                        //var inputData = {
                        //    obj_type: "Product::Menu",
                        //    obj_id: localStorage.getItem("prod_id"),//"6",
                        //    comp_prod_id: localStorage.getItem("user_company_id")
                        //};
                        //page.userpermissionAPI.getValue(inputData, function (data) {
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
                        //            var finalhtmlBuilder = [];
                        //            for (var prop in ndata) {
                        //                var htmlBuilder = [];
                        //                $(ndata[prop]).each(function (i, item) {
                        //                    var tempBuilder = $$("pnlMenuTeplate").html();
                        //                    tempBuilder = tempBuilder.replace("{Menu}", item.menu_name);
                        //                    tempBuilder = tempBuilder.replace("{Menu}", item.menu_name);
                        //                    tempBuilder = tempBuilder.replace("{URL}", item.menu_path);
                        //                    htmlBuilder.push(tempBuilder);
                        //                });

                        //                var tempBuilder = $$("pnlMenuMainTeplate").html();
                        //                tempBuilder = tempBuilder.replace("{MainMenu}", prop);
                        //                tempBuilder = tempBuilder.replace("{SubMenu}", htmlBuilder.join(""));
                        //                finalhtmlBuilder.push(tempBuilder);
                        //            }

                        //            $$("pnlMenuPlaceHolder").html(finalhtmlBuilder.join(" "));
                        //            $($$("pnlMenuPlaceHolder")).children("div").children("div").click(function () {
                        //                var menu = $(this).attr("menu");

                        //                window.location.href = "/" + window.location.pathname.split("/")[1] + "/" + $(this).attr("URL");
                        //            });
                        //        }, function (data) {
                        //            alert("Your Session Is Time Out Please Login Again");
                        //            window.location.href = "/" + appConfig.root + "/login/view/login-page/login-page.html";
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
                        //            var finalhtmlBuilder = [];
                        //            for (var prop in ndata) {
                        //                var htmlBuilder = [];
                        //                $(ndata[prop]).each(function (i, item) {
                        //                    var tempBuilder = $$("pnlMenuTeplate").html();
                        //                    tempBuilder = tempBuilder.replace("{Menu}", item.menu_name);
                        //                    tempBuilder = tempBuilder.replace("{Menu}", item.menu_name);
                        //                    tempBuilder = tempBuilder.replace("{URL}", item.menu_path);
                        //                    htmlBuilder.push(tempBuilder);
                        //                });

                        //                var tempBuilder = $$("pnlMenuMainTeplate").html();
                        //                tempBuilder = tempBuilder.replace("{MainMenu}", prop);
                        //                tempBuilder = tempBuilder.replace("{SubMenu}", htmlBuilder.join(""));
                        //                finalhtmlBuilder.push(tempBuilder);
                        //            }

                        //            $$("pnlMenuPlaceHolder").html(finalhtmlBuilder.join(" "));
                        //            $($$("pnlMenuPlaceHolder")).children("div").children("div").click(function () {
                        //                var menu = $(this).attr("menu");

                        //                window.location.href = "/" + window.location.pathname.split("/")[1] + "/" + $(this).attr("URL");
                        //            });
                        //        }, function (data) {
                        //            alert("Your Session Is Time Out Please Login Again");
                        //            window.location.href = "/" + appConfig.root + "/login/view/login-page/login-page.html";
                        //        });
                        //    }
                        //});

                        //Get Company and Usre Privilages
                        $($.parseJSON(localStorage.getItem("user_privilages"))).each(function (i, user_privilage) {
                            $($.parseJSON(localStorage.getItem("company_privilages"))).each(function (i, company_privilage) {
                                if (company_privilage.obj_type == "Product::Privilege") {
                                    if (company_privilage.obj_id == user_privilage.obj_id) {
                                        feature_privilages.push(user_privilage.obj_id.split("::")[1]);
                                    }
                                }
                            })
                        });
                        $($.parseJSON(localStorage.getItem("user_menu"))).each(function (i, user_privilage) {
                            $($.parseJSON(localStorage.getItem("company_privilages"))).each(function (i, company_privilage) {
                                if (company_privilage.obj_type == "Product::Menu") {
                                    if (company_privilage.obj_id == user_privilage.obj_id) {
                                        menu_privilages.push(user_privilage.obj_id.split("::")[1]);
                                    }
                                }
                            })
                        });
                        if (typeof CONTEXT.COMPANY_MENU_HIDE != "undefined" && CONTEXT.COMPANY_MENU_HIDE != null && CONTEXT.COMPANY_MENU_HIDE != "") {
                            var menu_hide = CONTEXT.COMPANY_MENU_HIDE.split(",");
                            menu_privilages = menu_privilages.filter(function (obj) { return menu_hide.indexOf(obj) == -1; });
                        }
                        page.menuAPI.getValue(menu_privilages.join(","), function (data) {
                            var ndata = {};
                            $(data).each(function (i, item) {
                                if (item.menu_category != null) {
                                    if (typeof ndata[item.menu_category] == "undefined")
                                        ndata[item.menu_category] = [];

                                    ndata[item.menu_category].push(item);
                                }
                            });
                            var finalhtmlBuilder = [];
                            for (var prop in ndata) {
                                var htmlBuilder = [];
                                $(ndata[prop]).each(function (i, item) {
                                    var tempBuilder = $$("pnlMenuTeplate").html();
                                    tempBuilder = tempBuilder.replace("{Menu}", item.menu_name);
                                    tempBuilder = tempBuilder.replace("{Menu}", item.menu_name);
                                    tempBuilder = tempBuilder.replace("{URL}", item.menu_path);
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
                        }, function (data) {
                            alert("Your Session Is Time Out Please Login Again");
                            window.location.href = "/" + appConfig.root + "/login/view/login-page/login-page.html";
                        });
                        
                        
                        

                        CONTEXT.ENABLE_MODULE_TRAY = hasPrivilages("tray_show") && (CONTEXT.ENABLE_MODULE_TRAY == 'true')
                        CONTEXT.ENABLE_REWARD_MODULE = hasPrivilages("customer_reward_enable") && (CONTEXT.ENABLE_REWARD_MODULE == 'true');
                        CONTEXT.ENABLE_SALES_EXECUTIVE = hasPrivilages("sales_executive_enable") && (CONTEXT.ENABLE_SALES_EXECUTIVE == 'true');
                        CONTEXT.ENABLE_SMS_TO_CUST_OUT_FOR_DELIVERY = hasPrivilages("sales_customersms_enable") && (CONTEXT.ENABLE_SMS_TO_CUST_OUT_FOR_DELIVERY == 'true');
                        CONTEXT.ENABLE_SMS_TO_ADMIN_OUT_FOR_DELIVERY = hasPrivilages("sales_adminsms_enable") && (CONTEXT.ENABLE_SMS_TO_ADMIN_OUT_FOR_DELIVERY == 'true');
                        CONTEXT.ENABLE_ESHOPON = hasPrivilages("shopon_eshopon_enable") && (CONTEXT.ENABLE_ESHOPON == 'true');
                        CONTEXT.ENABLE_SMS_TO_CUST_AFTER_DELIVERY = hasPrivilages("sales_customersms_enable") && (CONTEXT.ENABLE_SMS_TO_CUST_AFTER_DELIVERY == 'true');
                        CONTEXT.ENABLE_SMS_TO_CUST_AFTER_CANCEL = hasPrivilages("sales_customersms_enable") && (CONTEXT.ENABLE_SMS_TO_CUST_AFTER_CANCEL == 'true');
                        CONTEXT.ENABLE_SMS_TO_ADMIN_AFTER_DELIVERY = hasPrivilages("sales_adminsms_enable") && (CONTEXT.ENABLE_SMS_TO_ADMIN_AFTER_DELIVERY == 'true');
                        CONTEXT.ENABLE_SMS_TO_ADMIN_AFTER_CANCEL = hasPrivilages("sales_adminsms_enable") && (CONTEXT.ENABLE_SMS_TO_ADMIN_AFTER_CANCEL == 'true');
                        CONTEXT.SHOW_BARCODE = hasPrivilages("product_barcode_show") && (CONTEXT.SHOW_BARCODE == 'true');
                        CONTEXT.ENABLE_POWISE_REPORT = hasPrivilages("report_powise_enable") && (CONTEXT.ENABLE_POWISE_REPORT == 'true');
                        CONTEXT.ENABLE_SOWISE_REPORT = hasPrivilages("report_sowise_enable") && (CONTEXT.ENABLE_SOWISE_REPORT == 'true');
                        CONTEXT.ENABLE_CASHIER_BILL = hasPrivilages("sales_cashier_bill_enable") && (CONTEXT.ENABLE_CASHIER_BILL == 'true');
                        CONTEXT.ENABLE_SALES_EXECUTIVE_REWARD = hasPrivilages("sales_sales_executive_reward_enable") && (CONTEXT.ENABLE_SALES_EXECUTIVE_REWARD == 'true');
                        CONTEXT.ENABLE_SALES_EXECUTIVE_BARCODE = hasPrivilages("sales_sales_executive_barcode_enable") && (CONTEXT.ENABLE_SALES_EXECUTIVE_BARCODE == 'true');
                        CONTEXT.ENABLE_EMI_PAYMENT = hasPrivilages("sales_emi_payment_enable") && (CONTEXT.ENABLE_EMI_PAYMENT == 'true');
                        CONTEXT.ENABLE_QR_CODE = hasPrivilages("product_qr_code_enable") && (CONTEXT.ENABLE_QR_CODE == 'true');
                        CONTEXT.ENABLE_PURCHASE_EMAIL = hasPrivilages("purchase_email_enable") && (CONTEXT.ENABLE_PURCHASE_EMAIL == 'true');
                        CONTEXT.ENABLE_SMS_IN_PURCHASE = hasPrivilages("purchase_sms_enable") && (CONTEXT.ENABLE_SMS_IN_PURCHASE == 'true');
                        CONTEXT.ENABLE_SUBSCRIPTION = hasPrivilages("subscription_enable") && (CONTEXT.ENABLE_SUBSCRIPTION == 'true');
                        CONTEXT.ENABLE_CUSTOMER_LOGIN = hasPrivilages("customer_login_enable") && (CONTEXT.ENABLE_CUSTOMER_LOGIN == 'true');
                        CONTEXT.ENABLE_SALES_EXECUTIVE_LOGIN = hasPrivilages("sales_executive_login_enable") && (CONTEXT.ENABLE_SALES_EXECUTIVE_LOGIN == 'true');
                        CONTEXT.ENABLE_CASHIER_BARCODE = hasPrivilages("cashier_barcode_enable") && (CONTEXT.ENABLE_CASHIER_BARCODE == 'true');
                        CONTEXT.ENABLE_DUE_DATE_ALERT = hasPrivilages("due_date_alert_enable") && (CONTEXT.ENABLE_DUE_DATE_ALERT == 'true');
                        CONTEXT.ENABLE_SALES_SECONDARY_LANGUAGE = hasPrivilages("secondary_language_enable") && (CONTEXT.ENABLE_SALES_SECONDARY_LANGUAGE == 'true');
                        CONTEXT.ENABLE_PURCHASE_SECONDARY_LANGUAGE = hasPrivilages("secondary_language_enable") && (CONTEXT.ENABLE_PURCHASE_SECONDARY_LANGUAGE == 'true');
                        CONTEXT.ENABLE_DYNAMIC_BARCODE = hasPrivilages("product_dynamic_barcode_enable") && (CONTEXT.ENABLE_DYNAMIC_BARCODE == 'true');
                        CONTEXT.ENABLE_DC_BILL = hasPrivilages("sales_dc_number_enable") && (CONTEXT.ENABLE_DC_BILL == 'true');
                        CONTEXT.PACKAGE = hasPrivilages("product_package_enable") && (CONTEXT.PACKAGE == 'true');
                        CONTEXT.ENABLE_SMALL_BILL = hasPrivilages("sales_small_bill_enable") && (CONTEXT.ENABLE_SMALL_BILL == 'true');
                        CONTEXT.ENABLE_ESHOPON_UPLOAD = hasPrivilages("shopon_eshopon_enable") && (CONTEXT.ENABLE_ESHOPON_UPLOAD == 'true');
                        CONTEXT.ENABLE_EXCEL_UPLOAD = hasPrivilages("product_excel_upload_enable") && (CONTEXT.ENABLE_EXCEL_UPLOAD == 'true');
                        CONTEXT.ENABLE_ITEM_CLASS = hasPrivilages("product_item_class_enable") && (CONTEXT.ENABLE_ITEM_CLASS == 'true');
                        CONTEXT.ENABLE_DRAFT_BILL = hasPrivilages("sales_draft_bill_enable") && (CONTEXT.ENABLE_DRAFT_BILL == 'true');
                        CONTEXT.ENABLE_MULTIPLE_IMAGE = hasPrivilages("product_multiple_image_enable") && (CONTEXT.ENABLE_MULTIPLE_IMAGE == 'true');
                        CONTEXT.ENABLE_SUBSCRIPTION_IP_DETAILS = hasPrivilages("customer_subscription_details_enable") && (CONTEXT.ENABLE_SUBSCRIPTION_IP_DETAILS == 'true');
                        CONTEXT.ENABLE_SUBSCRIPTION_LAST_MILE_DETAILS = hasPrivilages("customer_subscription_details_enable") && (CONTEXT.ENABLE_SUBSCRIPTION_LAST_MILE_DETAILS == 'true');
                        CONTEXT.ENABLE_SUBSCRIPTION_BILLING_DETAILS = hasPrivilages("customer_subscription_details_enable") && (CONTEXT.ENABLE_SUBSCRIPTION_BILLING_DETAILS == 'true');
                        CONTEXT.ENABLE_ADVANCE_SEARCH = (CONTEXT.ENABLE_ADVANCE_SEARCH == 'true') && hasPrivilages("product_advance_search_enable");
                        CONTEXT.ENABLE_SUBSCRIPTION_INSTALLATION_ADDRESS = (CONTEXT.ENABLE_SUBSCRIPTION_INSTALLATION_ADDRESS == 'true') && hasPrivilages("customer_subscription_details_enable");
                        CONTEXT.ENABLE_BILL_LEVEL_DISCOUNT = (CONTEXT.ENABLE_BILL_LEVEL_DISCOUNT == 'true') && hasPrivilages("sales_bill_level_discount_enable");
                        CONTEXT.ENABLE_DISCOUNT_MODULE = (CONTEXT.ENABLE_DISCOUNT_MODULE == 'true') && hasPrivilages("discount_enable");
                        CONTEXT.ENABLE_ITEM_LEVEL_PRICE = (CONTEXT.ENABLE_ITEM_LEVEL_PRICE == 'true') && hasPrivilages("product_item_level_price_enable");
                        CONTEXT.ENABLE_VARIATION_LEVEL_PRICE = (CONTEXT.ENABLE_VARIATION_LEVEL_PRICE == 'true') && hasPrivilages("product_variation_level_price_enable");


                        CONTEXT.ENABLE_EXP_DAYS_MODE = (CONTEXT.ENABLE_EXP_DAYS_MODE == 'true');//hasPrivilages("item_expiry_enable");
                        CONTEXT.ENABLE_BILL_ADJUSTMENT = (CONTEXT.ENABLE_BILL_ADJUSTMENT == 'true');//hasPrivilages("sales_bill_adjustment");
                        CONTEXT.ENABLE_RACK = (CONTEXT.ENABLE_RACK == 'true');//hasPrivilages("product_rack_enable");
                        CONTEXT.ENABLE_SECOND_BILL = (CONTEXT.ENABLE_SECOND_BILL == 'true');//hasPrivilages("sales_second_bill_enable");
                        CONTEXT.SHOW_STOCK_COLUMN = (CONTEXT.SHOW_STOCK_COLUMN == 'true');//hasPrivilages("sales_stock_show");
                        CONTEXT.ENABLE_STOCK_MAINTAINENCE = (CONTEXT.ENABLE_STOCK_MAINTAINENCE == 'true');//hasPrivilages("sales_stock_enable");
                        CONTEXT.ENABLE_CANCEL_BILL = (CONTEXT.ENABLE_CANCEL_BILL == 'true');//hasPrivilages("sales_cancel_bill_enable");
                        CONTEXT.ENABLE_SALES_RECEIPT = (CONTEXT.ENABLE_SALES_RECEIPT == 'true');//hasPrivilages("sales_receipt_enable");
                        CONTEXT.ENABLE_SALES_BUYING_COST = (CONTEXT.ENABLE_SALES_BUYING_COST == 'true');//hasPrivilages("sales_buying_cost_enable");
                        CONTEXT.ENABLE_DISCOUNT_INCLUSION = (CONTEXT.ENABLE_DISCOUNT_INCLUSION == 'true');//hasPrivilages("product_discount_enable");
                        CONTEXT.ENABLE_ITEM_DESCRIPTION = (CONTEXT.ENABLE_ITEM_DESCRIPTION == 'true');//hasPrivilages("product_item_type_description_enable");
                        CONTEXT.ENABLE_INVENTORY_DETAILS = (CONTEXT.ENABLE_INVENTORY_DETAILS == 'true');//hasPrivilages("product_inventory_enable");
                        CONTEXT.ENABLE_PINCODE_MAPPING = (CONTEXT.ENABLE_PINCODE_MAPPING == 'true');//hasPrivilages("pincode_mapping_enable");
                        CONTEXT.ENABLE_SALE_RETURN_BILL = (CONTEXT.ENABLE_SALE_RETURN_BILL == 'true');//hasPrivilages("sales_return_bill_print_enable");
                        CONTEXT.ENABLE_SALES_BILL_EDIT = (CONTEXT.ENABLE_SALES_BILL_EDIT == 'true');//hasPrivilages("sales_bill_edit_enable");
                        CONTEXT.ENABLE_PURCHASE_BILL_EDIT = (CONTEXT.ENABLE_PURCHASE_BILL_EDIT == 'true');//hasPrivilages("purchase_bill_edit_enable");
                        CONTEXT.ENABLE_PURCHASE_CANCEL_BILL = (CONTEXT.ENABLE_PURCHASE_CANCEL_BILL == 'true');//hasPrivilages("purchase_cancel_bill_enable");
                        CONTEXT.ENABLE_ALTER_PRICE_1 = (CONTEXT.ENABLE_ALTER_PRICE_1 == 'true');//hasPrivilages("product_alternate_price1_enable");
                        CONTEXT.ENABLE_ALTER_PRICE_2 = (CONTEXT.ENABLE_ALTER_PRICE_2 == 'true');//hasPrivilages("product_alternate_price2_enable");
                        CONTEXT.ENABLE_ITEM_RATE = (CONTEXT.ENABLE_ITEM_RATE == 'true');//hasPrivilages("product_item_rate_enable");
                        CONTEXT.ENABLE_CUSTOMER_BANK_DETAILS = (CONTEXT.ENABLE_CUSTOMER_BANK_DETAILS == 'true');//hasPrivilages("customer_bank_details_enable");
                        CONTEXT.ENABLE_EXECUTIVE_BANK_DETAILS = (CONTEXT.ENABLE_EXECUTIVE_BANK_DETAILS == 'true');//hasPrivilages("sales_executive_bank_details_enable");
                        CONTEXT.ENABLE_CUSTOMER_MOBILE = (CONTEXT.ENABLE_CUSTOMER_MOBILE == 'true');//hasPrivilages("customer_mobile_enable");
                        CONTEXT.SHOW_POP_GROSS_AMOUNT = (CONTEXT.SHOW_POP_GROSS_AMOUNT == 'true');//hasPrivilages("purchase_gross_amount_view");
                        CONTEXT.ENABLE_ADDITIONAL_TAX = (CONTEXT.ENABLE_ADDITIONAL_TAX == 'true');//hasPrivilages("tax_additional_enable");
                        CONTEXT.SHOW_ATTRIBUTES_IN_SEARCH = (CONTEXT.SHOW_ATTRIBUTES_IN_SEARCH == 'true');//hasPrivilages("product_attribute_enable");
                        CONTEXT.ATTRIBUTES_SEARCH = (CONTEXT.ATTRIBUTES_SEARCH == 'true');//hasPrivilages("product_attribute_enable");
                        CONTEXT.ENABLE_PRICE_LIMIT = (CONTEXT.ENABLE_PRICE_LIMIT == 'true');//hasPrivilages("product_price_limit_enable");
                        CONTEXT.ENABLE_SERIAL_NO_IN_POS = (CONTEXT.ENABLE_SERIAL_NO_IN_POS == 'true');//hasPrivilages("product_serial_no_enable");
                        CONTEXT.ENABLE_ITEM_NOTES_IN_POS = (CONTEXT.ENABLE_ITEM_NOTES_IN_POS == 'true');//hasPrivilages("product_item_notes_enable");
                        CONTEXT.ENABLE_SALES_ITEM_DATE = (CONTEXT.ENABLE_SALES_ITEM_DATE == 'true');//hasPrivilages("product_item_rate_enable");
                        CONTEXT.ENABLE_CREATE_DEFAULT_PRICE = (CONTEXT.ENABLE_CREATE_DEFAULT_PRICE == 'true');//hasPrivilages("product_default_price_enable");
                        CONTEXT.SHOW_FREE = (CONTEXT.SHOW_FREE == 'true');//hasPrivilages("shopon_free_enable");
                        CONTEXT.ENABLE_TAX_MODULE = (CONTEXT.ENABLE_TAX_MODULE == 'true');//hasPrivilages("shopon_tax_enable");
                        CONTEXT.NET_PROFIT_WITH_TAX = (CONTEXT.NET_PROFIT_WITH_TAX == 'true') ? true : false;//hasPrivilages("tax_netprofit_withtax_enable");
                        CONTEXT.NET_PROFIT_WITHOUT_TAX = (CONTEXT.NET_PROFIT_WITHOUT_TAX == 'true') ? true : false;//hasPrivilages("tax_netprofit_withouttax_enable");
                        CONTEXT.ENABLE_NEW_ITEM_IN_POS = (CONTEXT.ENABLE_NEW_ITEM_IN_POS == 'true');//hasPrivilages("sales_create_new_item_enable");
                        CONTEXT.ENABLE_PRODUCT_TYPE = (CONTEXT.ENABLE_PRODUCT_TYPE == 'true');//hasPrivilages("product_producttype_enable");
                        CONTEXT.ENABLE_PACK = (CONTEXT.ENABLE_PACK == 'true');//hasPrivilages("product_pack_enable");
                        CONTEXT.ENABLE_REORDER_LEVEL = (CONTEXT.ENABLE_REORDER_LEVEL == 'true');//hasPrivilages("product_reorder_enable");
                        CONTEXT.ENABLE_REORDER_QTY = (CONTEXT.ENABLE_REORDER_QTY == 'true');//hasPrivilages("product_reorder_enable");
                        CONTEXT.ENABLE_RECEIPT_PRINT = (CONTEXT.ENABLE_RECEIPT_PRINT == 'true');//hasPrivilages("sales_receipt_enable");
                        CONTEXT.ENABLE_JASPER = (CONTEXT.ENABLE_JASPER == 'true');//hasPrivilages("sales_jasper_enable");
                        CONTEXT.ENABLE_CUST_GST = (CONTEXT.ENABLE_CUST_GST == 'true');//hasPrivilages("customer_gst_show");
                        CONTEXT.SHOW_GST_COLUMN = (CONTEXT.SHOW_GST_COLUMN == 'true');//hasPrivilages("product_gst_show");
                        CONTEXT.ENABLE_HSN_CODE = (CONTEXT.ENABLE_HSN_CODE == 'true');//hasPrivilages("product_hsn_code_enable");
                        CONTEXT.ENABLE_ALTER_UNIT = (CONTEXT.ENABLE_ALTER_UNIT == 'true');//hasPrivilages("product_alternate_unit_enable");
                        CONTEXT.ENABLE_ORDER_MODULE = (CONTEXT.ENABLE_ORDER_MODULE == 'true');//hasPrivilages("product_order_module_enable");
                        CONTEXT.ENABLE_TAX_CHANGES = (CONTEXT.ENABLE_TAX_CHANGES == 'true');//hasPrivilages("tax_taxchanges_enable");
                        CONTEXT.ENABLE_BILL_EXPENSE_MODULES = (CONTEXT.ENABLE_BILL_EXPENSE_MODULES == 'true');//hasPrivilages("sales_bill_expense_enable");
                        CONTEXT.ENABLE_MANUFACTURE = (CONTEXT.ENABLE_MANUFACTURE == 'true');//hasPrivilages("product_manufacture_enable");
                        CONTEXT.ENABLE_TAX_INCLUSIVE = (CONTEXT.ENABLE_TAX_INCLUSIVE == 'true');//hasPrivilages("product_tax_inclusive_enable");
                        CONTEXT.ENABLE_EXP_ALERT = (CONTEXT.ENABLE_EXP_ALERT == 'true');//hasPrivilages("product_expiry_alert_days_enable");
                        CONTEXT.SELLING_PRICE_EDITABLE = (CONTEXT.SELLING_PRICE_EDITABLE == 'true');//hasPrivilages("sales_selling_price_editable_enable");
                        CONTEXT.POS_SHOW_STOCK_EMPTY_ALERT = (CONTEXT.POS_SHOW_STOCK_EMPTY_ALERT == 'true');//hasPrivilages("sales_show_stock_empty_alert_enable");
                        CONTEXT.POS_SHOW_STOCK_EMPTY_COLOR = (CONTEXT.POS_SHOW_STOCK_EMPTY_COLOR == 'true');//hasPrivilages("sales_show_stock_empty_alert_enable");
                        CONTEXT.POS_ALLOW_EXPIRED_ITEMS = (CONTEXT.POS_ALLOW_EXPIRED_ITEMS == 'true');//hasPrivilages("sales_allow_expiry_alert_enable");
                        CONTEXT.ENBLE_BILL_BARCODE = (CONTEXT.ENBLE_BILL_BARCODE == 'true');//hasPrivilages("sales_bill_barcode_enable");
                        CONTEXT.ENABLE_STOCK_MAINTANENCE = (CONTEXT.ENABLE_STOCK_MAINTANENCE == 'true');//hasPrivilages("sales_stock_maintainence_enable");
                        CONTEXT.ENABLE_EXP_DATE = (CONTEXT.ENABLE_EXP_DATE == 'true');//hasPrivilages("product_expiry_date_enable");
                        CONTEXT.PRICE_EQUAL_FREE = (CONTEXT.PRICE_EQUAL_FREE == 'true');//hasPrivilages("purchase_free_price_enable");
                        CONTEXT.ENABLE_CUSTOMER_IN_BILL = (CONTEXT.ENABLE_CUSTOMER_IN_BILL == 'true');//hasPrivilages("customer_in_bill_enable");
                        CONTEXT.ENABLE_VENDOR_IN_BILL = (CONTEXT.ENABLE_VENDOR_IN_BILL == 'true');//hasPrivilages("vendor_in_bill_enable");
                        CONTEXT.CREDIT_DEBIT_NOTE = (CONTEXT.CREDIT_DEBIT_NOTE == 'true');//hasPrivilages("credit_debit_note_enable");
                        CONTEXT.ENABLE_SECONDARY_LANGUAGE = (CONTEXT.ENABLE_SECONDARY_LANGUAGE == 'true');//hasPrivilages("secondary_language_enable");
                        CONTEXT.ENABLE_BILL_ADVANCE = (CONTEXT.ENABLE_BILL_ADVANCE == 'true');//hasPrivilages("sales_bill_advance_enable");
                        CONTEXT.ENABLE_NET_BANK_PAYMENT_MODE = (CONTEXT.ENABLE_NET_BANK_PAYMENT_MODE == 'true');//hasPrivilages("sales_bill_advance_enable");
                        CONTEXT.ENABLE_FINANCE_PAYMENT_MODE = (CONTEXT.ENABLE_FINANCE_PAYMENT_MODE == 'true');//hasPrivilages("sales_bill_advance_enable");
                        CONTEXT.ENABLE_CHEQUE_PAYMENT_MODE = (CONTEXT.ENABLE_CHEQUE_PAYMENT_MODE == 'true');//hasPrivilages("sales_bill_advance_enable");
                        CONTEXT.ENABLE_SALES_ORDER_REPORT = (CONTEXT.ENABLE_SALES_REPORT == 'true');//hasPrivilages("sales_bill_advance_enable");
                        CONTEXT.ENABLE_PURCHASE_ORDER_REPORT = (CONTEXT.ENABLE_PURCHASE_REPORT == 'true');//hasPrivilages("sales_bill_advance_enable");
                        CONTEXT.ENABLE_SALES_RECEIPT = (CONTEXT.ENABLE_SALES_RECEIPT == 'true');
                        CONTEXT.ENABLE_SALES_MULTI_PRINT = (CONTEXT.ENABLE_SALES_MULTI_PRINT == 'true');
                        CONTEXT.ESHOPON_CANCEL = (CONTEXT.ESHOPON_CANCEL == 'true');
                        CONTEXT.ENABLE_ORDER_RECEIPT_PRINT = (CONTEXT.ENABLE_ORDER_RECEIPT_PRINT == 'true');
                        CONTEXT.SHOW_SKU_COLUMN_IN_SALES = (CONTEXT.SHOW_SKU_COLUMN_IN_SALES == 'true');
                        CONTEXT.SHOW_CUSTOMER_COMPANY_IN_SALES = (CONTEXT.SHOW_CUSTOMER_COMPANY_IN_SALES == 'true');
                        CONTEXT.AUTOMATIC_REFUND = (CONTEXT.AUTOMATIC_REFUND == 'true');
                        CONTEXT.ENABLE_PRINT_FULFILL_ITEMS = (CONTEXT.ENABLE_PRINT_FULFILL_ITEMS == 'true');
                        CONTEXT.ENABLE_ADD_ADDITIONAL_ITEM = (CONTEXT.ENABLE_ADD_ADDITIONAL_ITEM == 'true');
                        CONTEXT.ENABLE_SO_RECEIPT_PRINT = (CONTEXT.ENABLE_SO_RECEIPT_PRINT == 'true');
                        CONTEXT.ENABLE_SALESORDER_NOTIFICATION = (CONTEXT.ENABLE_SALESORDER_NOTIFICATION == 'true');
			            CONTEXT.ENABLE_GLOBAL_EXP_ALERT = (CONTEXT.ENABLE_GLOBAL_EXP_ALERT == 'true');
                        CONTEXT.POS_PENDING_SHOW_FIRST_PANEL = (CONTEXT.POS_PENDING_SHOW_FIRST_PANEL == 'true');
                        CONTEXT.POS_PENDING_SHOW_SECOND_PANEL = (CONTEXT.POS_PENDING_SHOW_SECOND_PANEL == 'true');
                        CONTEXT.ENABLE_REMOVE = (CONTEXT.ENABLE_REMOVE == 'true');
                        if (CONTEXT.ENABLE_EXP_ALERT)
                            page.alert();
                        CONTEXT.ENABLE_STOCK_ALERT = (CONTEXT.ENABLE_STOCK_ALERT == 'true');
                        if (CONTEXT.ENABLE_STOCK_ALERT)
                            page.stockAlert();
                        if (CONTEXT.ENABLE_SALESORDER_NOTIFICATION) {
                            page.notifyNewOrder = setInterval(function(){
                                page.orderNotification()
                            }, 10000);
                        }
                            


                        //set the batch no showing 
                        //CONTEXT.ENABLE_BAT_NO = (CONTEXT.ENABLE_BAT_NO == 'true');

                        //Show Manufacture Date
                        //CONTEXT.ENABLE_MAN_DATE = (CONTEXT.ENABLE_MAN_DATE == 'true');

                        //set the mrp showing 
                        //CONTEXT.ENABLE_MRP = (CONTEXT.ENABLE_MRP == "true") ? true : false;

                        //Show Free Qty
                        

                        //Show Tax
                        
                        //CONTEXT.SAMPLE_EXCEL_FORMAT_LOCATION = "http://104.251.218.116:9080/ShopOn4Dev/item_uploaded_excel.xls";
                        
                        //Show Barcode
                        //$(data).each(function (i, item) {
                        //    if (item.sett_key == 'ShowBarCode')
                        //        if (item.value_1 == "true") {
                        //            CONTEXT.showBarCode = true;
                        //        }
                        //        else {
                        //            CONTEXT.showBarCode = false;
                        //        }
                        //});

                        //Show Item Code
                        //$(data).each(function (i, item) {
                        //    if (item.sett_key == 'ShowItemCode')
                        //        if (item.value_1 == "true") {
                        //            CONTEXT.showItemCode = true;
                        //        }
                        //        else {
                        //            CONTEXT.showItemCode = false;
                        //        }
                        //});

                        //Show Paid and Balance
                        //$(data).each(function (i, item) {
                        //    if (item.sett_key == 'ShowPaidBalance')
                        //        if (item.value_1 == "true") {
                        //            CONTEXT.showPaidBalance = true;
                        //        }
                        //        else {
                        //            CONTEXT.showPaidBalance = false;
                        //        }
                        //});
                        
                        //Show Product Details
                        
                        
                        //set the comment enable or not 
                        //$(data).each(function (i, item) {
                        //    if (item.sett_key == 'ShowComment') {
                        //        if (item.value_1 == "true") {
                        //            CONTEXT.showComment = true;
                        //        }
                        //        else {
                        //            CONTEXT.showComment = false;
                        //        }
                        //    }
                        //});
                        
                        
                        
                        //Show GST
                        //$(data).each(function (i, item) {
                        //    if (item.sett_key == 'ShowGST') {
                        //        if (item.value_1 == "true") {
                        //            CONTEXT.showGst = true;
                        //        }
                        //        else {
                        //            CONTEXT.showGst = false;
                        //        }
                        //    }
                        //});

                        //$(data).each(function (i, item) {
                        //    if (item.sett_key == "FREE_MODE") {
                        //        if (item.value_1 == "No Free") {
                        //            CONTEXT.ENABLE_FREE_VARIATION = false;
                        //            CONTEXT.FREE_AVG_BUYING_COST = false;
                        //        }
                        //        else if (item.value_1 == "Free Qty with average Buying Cost") {
                        //            CONTEXT.ENABLE_FREE_VARIATION = true;
                        //            CONTEXT.FREE_AVG_BUYING_COST = true;
                        //        }
                        //        else {
                        //            CONTEXT.ENABLE_FREE_VARIATION = true;
                        //            CONTEXT.FREE_AVG_BUYING_COST = false;
                        //        }
                        //    }
                        //});

                        
                        
                        CONTEXT.store_no = localStorage.getItem("user_store_id");
                        CONTEXT.FINFACTS_COMPANY = localStorage.getItem("user_finfacts_comp_id");
                        CONTEXT.FINFACTS_CURRENT_PERIOD = localStorage.getItem("user_finfacts_per_id")
                        CONTEXT.EDIT_BILL = true;
                        CONTEXT.GROUP_BUYING_COST = true;
                        CONTEXT.ADMIN = false;
                        CONTEXT.USERIDACCESS = [];
                        var previlageData = {
                            obj_type: "Product::Previlege",
                            obj_id: localStorage.getItem("prod_id"),
                            comp_prod_id: localStorage.getItem("user_company_id")
                        };
                        page.userpermissionAPI.getValue(previlageData, function (data) {
                            $(data).each(function (i, item) {
                                if (item.obj_id.startsWith("6"))
                                    item.obj_id = item.obj_id.replace("6::", "");
                                if (item.obj_id.startsWith("7"))
                                    item.obj_id = item.obj_id.replace("7::", "");
                                if (item.obj_id.startsWith("8"))
                                    item.obj_id = item.obj_id.replace("8::", "");
                                if (item.obj_id.startsWith("9"))
                                    item.obj_id = item.obj_id.replace("9::", "");
                                if (item.obj_id.startsWith("26"))
                                    item.obj_id = item.obj_id.replace("26::", "");
                                if (item.obj_id.startsWith("27"))
                                    item.obj_id = item.obj_id.replace("27::", "");
                                if (item.obj_id.startsWith("28"))
                                    item.obj_id = item.obj_id.replace("28::", "");
                                if (item.obj_id.startsWith("29"))
                                    item.obj_id = item.obj_id.replace("29::", "");
                                if (item.obj_id.startsWith("30"))
                                    item.obj_id = item.obj_id.replace("30::", "");
                                if (item.obj_id.startsWith("31"))
                                    item.obj_id = item.obj_id.replace("31::", "");
                                if (item.obj_id.startsWith("33"))
                                    item.obj_id = item.obj_id.replace("33::", "");
                                if (item.obj_id.startsWith("36"))
                                    item.obj_id = item.obj_id.replace("36::", "");
                                if (item.obj_id.startsWith("36"))
                                    item.obj_id = item.obj_id.replace("37::", "");
                                if (item.obj_id == "block_edit_bill") {
                                    CONTEXT.EDIT_BILL = false;
                                }
                                if (item.obj_id == "block_buying_cost") {
                                    CONTEXT.GROUP_BUYING_COST = false;
                                }
                                if (item.obj_id == "admin") {
                                    CONTEXT.ADMIN = true;
                                    var user_ids = [];
                                    var lastUserId;
                                    var data = {
                                        start_record: 0,
                                        end_record: "",
                                        filter_expression: " and comp.comp_prod_id=" + localStorage.getItem("user_company_id"),
                                        sort_expression: " user_id"
                                    }
                                    page.userGroupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                                        $(data).each(function (i, item) {
                                            if (lastUserId != item.user_id) {
                                                user_ids.push(item);
                                                lastUserId = item.user_id;
                                            }
                                        });
                                        CONTEXT.USERIDACCESS = user_ids;
                                    });
                                }
                                else {
                                    var user_ids = [];
                                    var lastUserId;
                                    var data = {
                                        start_record: 0,
                                        end_record: "",
                                        filter_expression: " and comp.comp_prod_id=" + localStorage.getItem("user_company_id") + " and usr_grp.user_id=" + localStorage.getItem("app_user_id"),
                                        sort_expression: " user_id"
                                    }
                                    page.userGroupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                                        $(data).each(function (i, item) {
                                            if (lastUserId != item.user_id) {
                                                user_ids.push(item);
                                                lastUserId = item.user_id;
                                            }
                                        });
                                        CONTEXT.USERIDACCESS = user_ids;
                                    });
                                }
                            });
                        });
                        var curRecPrintName = CONTEXT.DefaultReceiptPrinter;
                        var curBarPrintName = CONTEXT.DefaultBarcodePrinter;
                        CONTEXT.reg_no = CONTEXT.DefaultRegister;
                        $(data).each(function (i, item) {
                            if (item.sett_key == 'RegisterReceiptPrinter' && item.value_2 == CONTEXT.reg_no)
                                curRecPrintName = item.value_1;

                            if (item.sett_key == 'RegisterBarcodePrinter' && item.value_2 == CONTEXT.reg_no)
                                curBarPrintName = item.value_1;
                        });
                        $(data).each(function (i, item) {
                            if (item.sett_key == 'UserReceiptPrinter' && item.value_2 == CONTEXT.user_id)
                                curRecPrintName = item.value_1;

                            if (item.sett_key == 'UserBarcodePrinter' && item.value_2 == CONTEXT.user_id)
                                curBarPrintName = item.value_1;
                        });
                        $(data).each(function (i, item) {
                            if (item.sett_key == 'BackgroundColor' && item.value_1 == CONTEXT.BackgroundColor) {
                                $("label-color").css({ "background-color": CONTEXT.BackgroundColor });
                            }
                            if (item.sett_key == 'FONT_SIZE' && item.value_1 == CONTEXT.FONT_SIZE) {
                                $("label-font").css({ "font-size": CONTEXT.FONT_SIZE });
                            }
                        });
                        CONTEXT.RESTAPI = true;
                        CONTEXT.ITEM_SELECTION_MODE = "HighVolumeAuto";
                        CONTEXT.INCOME_STATEMENT_LABEL_NAME = "Profit And Loss";
                        CONTEXT.ENABLE_FINFACTS_MODULES = true;
                        CONTEXT.COUNT_AFTER_POINTS = parseInt(CONTEXT.COUNT_AFTER_POINTS);
                        CONTEXT.COUNT_AFTER_POINTS = (isNaN(CONTEXT.COUNT_AFTER_POINTS) || CONTEXT.COUNT_AFTER_POINTS == "" || CONTEXT.COUNT_AFTER_POINTS == null || typeof CONTEXT.COUNT_AFTER_POINTS == "undefined") ? 2 : CONTEXT.COUNT_AFTER_POINTS;
                        CONTEXT.SEARCH_ATTRIBUTES_VALUE = "attr_value6";
                        if (CONTEXT.DEFAULT_BILL_DUE_DAYS == null || CONTEXT.DEFAULT_BILL_DUE_DAYS == "" || typeof CONTEXT.DEFAULT_BILL_DUE_DAYS == "undefined") {
                            CONTEXT.DEFAULT_BILL_DUE_DAYS = 14;
                        }
                        CONTEXT.ENABLE_TOTAL_QTY_IN_BILL = true;
                        CONTEXT.ENABLE_CREATE_DEFAULT_PRICE_VALUE = "1500";

                            
                        //Set the CSS for the page
                        document.documentElement.style.setProperty('--label-color', CONTEXT.LABEL_COLOR);
                        document.documentElement.style.setProperty('--label-font', CONTEXT.LABEL_FONT);
                        document.documentElement.style.setProperty('--label-header-color', CONTEXT.LABEL_HEADER_COLOR);
                        document.documentElement.style.setProperty('--label-header-font', CONTEXT.LABEL_HEADER_FONT);
                        document.documentElement.style.setProperty('--input-color', CONTEXT.INPUT_COLOR);
                        document.documentElement.style.setProperty('--input-font', CONTEXT.INPUT_FONT);

                        //if (CONTEXT.CurrentLanguage == "ta") {
                        //    document.documentElement.style.setProperty('--input-text-font', "14px bamini");
                        //}
                        //else {
                        //    document.documentElement.style.setProperty('--input-text-font', "normal 14px Calibri");
                        //}

                        document.documentElement.style.setProperty('--input-button-read-color', CONTEXT.INPUT_BUTTON_READ_COLOR);
                        document.documentElement.style.setProperty('--input-button-read-back-color', CONTEXT.INPUT_BUTTON_READ_BG_COLOR);
                        document.documentElement.style.setProperty('--input-button-read-hover-color', CONTEXT.INPUT_BUTTON_READ_HOVER_COLOR);
                        document.documentElement.style.setProperty('--input-button-write-color', CONTEXT.INPUT_BUTTON_WRITE_COLOR);
                        document.documentElement.style.setProperty('--input-button-write-back-color', CONTEXT.INPUT_BUTTON_WRITE_BACK_COLOR);
                        document.documentElement.style.setProperty('--input-button-write-hover-color', CONTEXT.INPUT_BUTTON_WRITE_HOVER_COLOR);
                        document.documentElement.style.setProperty('--input-button-sec-color', CONTEXT.INPUT_BUTTON_SEC_COLOR);
                        document.documentElement.style.setProperty('--input-button-sec-back-color', CONTEXT.INPUT_BUTTON_SEC_BACK_COLOR);
                        document.documentElement.style.setProperty('--grid-header-font', CONTEXT.GRID_HEADER_FONT);
                        document.documentElement.style.setProperty('--grid-row-font', CONTEXT.GRID_HEADER_FONT);
                        document.documentElement.style.setProperty('--tab-header-font', CONTEXT.TAB_HEADER_FONT);
                        document.documentElement.style.setProperty('--tab-back-color', CONTEXT.TAB_BACK_COLOR);
                        document.documentElement.style.setProperty('--tab-sel-color', CONTEXT.TAB_SEL_COLOR);
                        document.documentElement.style.setProperty('--tab-color', CONTEXT.TAB_COLOR);
                        document.documentElement.style.setProperty('--msg-panel-color', CONTEXT.MSG_PANEL_COLOR);
                        document.documentElement.style.setProperty('--grid-back-color', CONTEXT.GRD_BACK_COLOR);
                        document.documentElement.style.setProperty('--grid-header-color', CONTEXT.GRD_HEADER_COLOR);
                        document.documentElement.style.setProperty('--detail-color', CONTEXT.DETAIL_BACK_COLOR);
                        document.documentElement.style.setProperty('--action-color', CONTEXT.ACTION_BACK_COLOR);
                        document.documentElement.style.setProperty('--input-sbutton-read-color', CONTEXT.S_BUTTON_COLOR);
                        document.documentElement.style.setProperty('--grid-odd-row-color', CONTEXT.GRD_ODD_ROW_COLOR);
                        document.documentElement.style.setProperty('--grid-even-row-color', CONTEXT.GRD_EVEN_ROW_COLOR);
                        document.documentElement.style.setProperty('--search-color', CONTEXT.SEARCH_COLOR);
                        document.documentElement.style.setProperty('--input-button-height', CONTEXT.INPUT_BUTTON_HEIGHT);

                        //});

                        //$(company_privilages).each(function (i, item) {
                        //    var privilage_ids = [];
                        //    $(data).each(function (i, item) {
                        //        item.obj_type = item.obj_type.replace("Product::", "");
                        //        if (item.obj_id.startsWith("6"))
                        //            privilage_ids.push(item.obj_id);
                        //    });
                        //    page.menuAPI.getValue(menu.join(","), function (data) { });
                    })
                
                //});
            

                setTimeout(function () {
                    if (localStorage.getItem("product_version") != "Licensed" && localStorage.getItem("product_version") != null) {
                        document.title = document.title + "-" + localStorage.getItem("product_version");
                    }
                }, 5000);
                if (localStorage.getItem("product_version") == "Expired") {
                    page.events.license_alert();
                }
                //page.events.license_alert();
                }

                //var previlageData = {
                //    obj_type: "Product::CompProd::Store",
                //    obj_id: localStorage.getItem("prod_id"),
                //};
                //var menu_ids = [];
                //page.userpermissionAPI.getValue(previlageData, function (store_data) {
                //    $(store_data).each(function (i, item) {
                //        item.obj_id = item.obj_id.split("::")[2];
                //        menu_ids.push(item.obj_id);
                //    });
                //    var data = {
                //        start_record: 0,
                //        end_record: "",
                //        filter_expression: "store_no in (" + menu_ids.join(",") + ")",
                //        sort_expression: ""
                //    }
                //    page.storeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //        $$("ddlGlobalStoreName").dataBind(data, "store_no", "store_name");
                //        $$("ddlGlobalStoreName").selectedValue(localStorage.getItem("user_store_no"));
                //    });
                //});
                store_refresh = true;
                $$("ddlGlobalStoreName").dataBind($.parseJSON(localStorage.getItem("user_store_data")), "store_no", "store_name");
                $$("ddlGlobalStoreName").selectedValue(localStorage.getItem("user_store_no"));
                if (localStorage.getItem("user_store_no") == "-1" || localStorage.getItem("user_store_no") == "All") {
                    localStorage.setItem("user_store_no", localStorage.getItem("temp_user_store_no"));
                    $$("ddlGlobalStoreName").selectedValue(localStorage.getItem("user_store_no"));
                }
                $$("ddlGlobalStoreName").selectionChange(function () {
                    var load = (localStorage.getItem("user_store_no") == page.controls.ddlGlobalStoreName.selectedValue())?false:true;
                    localStorage.setItem("user_store_no", page.controls.ddlGlobalStoreName.selectedValue());
                    if (localStorage.getItem("user_store_no") != "-1" && localStorage.getItem("user_store_no") != "All") {
                        localStorage.setItem("temp_user_store_no", page.controls.ddlGlobalStoreName.selectedValue());
                    }
                    document.cookie = "user_store_id=" + page.controls.ddlGlobalStoreName.selectedValue() + ";path=/";
                    
                    if (store_refresh)
                        location.reload(true);
                });
                $$("ddlGlobalRegisterName").dataBind($.parseJSON(localStorage.getItem("user_register_data")), "reg_no", "reg_name");
                $$("ddlGlobalRegisterName").selectedValue(localStorage.getItem("user_register_id"));
                $$("ddlGlobalRegisterName").selectionChange(function () {
                    localStorage.setItem("user_register_id", page.controls.ddlGlobalRegisterName.selectedValue());
                    document.cookie = "user_register_id=" + page.controls.ddlGlobalRegisterName.selectedValue() + ";path=/";
                    //location.reload(true);
                });
                page.storeAPI.searchValue("", "", "store_no in (" + page.controls.ddlGlobalStoreName.selectedData().fulfillment_store.split(",").join(",") + ")", "", function (data) {
                    page.controls.ddlFulfillmentStoreName.dataBind(data, "store_no", "store_name");
                    localStorage.setItem("user_fulfillment_store_no", page.controls.ddlFulfillmentStoreName.selectedValue());
                });
                $$("ddlFulfillmentStoreName").selectionChange(function () {
                    localStorage.setItem("user_fulfillment_store_no", page.controls.ddlFulfillmentStoreName.selectedValue());
                });
                
                setTimeout(function () {
                    setHeaderDetails();
                }, 100);
            },
            license_init_alert:function(){
                $$("pnlExpireLicense").open();
                $$("pnlExpireLicense").title("License");
                $$("pnlExpireLicense").width("90%");
                $$("pnlExpireLicense").height(600);
                $(".ui-dialog-titlebar").css("display", "none");
                setTimeout(function () {
                    page.events.license_stop_alert();
                }, 60000);
            },
            license_stop_alert: function () {
                $(".ui-dialog-titlebar").css("display", "block");
                $$("pnlExpireLicense").close();
            },
            license_alert: function () {
                page.events.license_init_alert();
                setTimeout(function () {
                    page.events.license_alert();
                }, mills);
            }
        }
        page.alert = function () {
            page.userService.getExpiryAlertItems(function (data) {
                if (data.length != 0) {
                    if (!("Notification" in window)) {
                        alert("This browser does not support desktop notification");
                    }
                    else if (Notification.permission === "granted") {
                        var notification = new Notification(data.length + " Items Are Going To Expired, Please Verify The Product");
                        notification.onclick = function () {
                            window.location.href = "/" + appConfig.root + "/shopon/view/stock-report/stock-report.html";
                        };
                    }
                    else if (Notification.permission !== "denied") {
                        Notification.requestPermission(function (permission) {
                            if (permission === "granted") {
                                var notification = new Notification(data.length + " Items Are Going To Expired, Please Verify The Product");
                                notification.onclick = function () {
                                    window.location.href = "/" + appConfig.root + "/shopon/view/stock-report/stock-report.html";
                                };
                            }
                        });
                    }
                }
            });
        }

        //STOCK ALERT
        page.stockAlert = function () {
            page.userService.getStockAlert(function (data) {
                if (data.length != 0) {
                    if (!("Notification" in window)) {
                        alert("This browser does not support desktop notification");
                    }
                    else if (Notification.permission === "granted") {
                        var notification = new Notification(data.length + " Items Qty Is Lesser Than The Reorder Level Please Verify Stock Report");
                        notification.onclick = function () {
                            window.location.href = "/" + appConfig.root + "/shopon/view/stock-report/stock-report.html";
                        };
                    }
                    else if (Notification.permission !== "denied") {
                        Notification.requestPermission(function (permission) {
                            if (permission === "granted") {
                                var notification = new Notification(data.length + " Items Qty Is Lesser Than The Reorder Level Please Verify Stock Report");
                                notification.onclick = function () {
                                   window.location.href = "/" + appConfig.root + "/shopon/view/stock-report/stock-report.html";
                                };
                            }
                        });
                    }
                }
            });
        }

        //ORDER NOTIFICATION ALERT
        page.orderNotification = function () {
            var notifData = {
                start_record: "",
                end_record: "",
                filter_expression: " upd_date >='" + CONTEXT.NOTIFICATION_LAST_UPDATED_TIME + "'",
                sort_expression: ""
            }
            page.notificationAPI.searchValue(notifData.start_record, notifData.end_record, notifData.filter_expression, notifData.sort_expression, function (data) {
                if (data.length != 0) {
                    if (!("Notification" in window)) {
                        alert("This browser does not support desktop notification");
                    }
                    else if (Notification.permission === "granted") {
                        var notification = new Notification("There is " + data.length + " New Order(s) Received ");
                        notification.icon = "/" + appConfig.root + "/shopon/view/BackgroundImage/mail-envelope.png";
                        notification.onclick = function () {
                            window.location.href = "/" + appConfig.root + "/shopon/view/sales-order/sales-order.html";
                        };
                        var settData = {
                            start_record: "",
                            end_record: "",
                            filter_expression: " sett_key='NOTIFICATION_LAST_UPDATED_TIME'",
                            sort_expression: ""
                        }
                        page.settingsAPI.searchValue(settData.start_record, settData.end_record, settData.filter_expression, settData.sort_expression, function (data) {
                            if (data.length > 0) {
                                var setData = {
                                    sett_no: data[0].sett_no,
                                    sett_key: "NOTIFICATION_LAST_UPDATED_TIME",
                                    comp_id: getCookie("user_company_id"),
                                }
                                page.settingsAPI.putTimeValue(setData, function (data) {
                                    CONTEXT.NOTIFICATION_LAST_UPDATED_TIME = data[0].key_value;
                                })
                            }

                        })

                    }
                    else if (Notification.permission !== "denied") {
                        Notification.requestPermission(function (permission) {
                            if (permission === "granted") {
                                var notification = new Notification("There is " + data.length + " New Order(s) Received ");
                                notification.icon = "/" + appConfig.root + "/shopon/view/BackgroundImage/mail-envelope.png";
                                notification.onclick = function () {
                                    window.location.href = "/" + appConfig.root + "/shopon/view/sales-order/sales-order.html";
                                };
                            }
                        });
                    }
                }
            });
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

function hasPrivilages(property) {
    return feature_privilages.includes(property);
}

function setHeaderDetails() {
    var hide_fulfillment = false;
    //$(".register-header").hide();
    if ($.parseJSON(localStorage.getItem("user_register_data")).length == 1) {
        $(".register-header").hide();
    }
    else {
        $(".register-header").show();
    }
    if (masterPage.controls.ddlGlobalStoreName.selectedData().fulfillment_store.split(",").length == 1) {
        hide_fulfillment = true;
        $(".fullfillment-header").hide();
    }
    if (document.title == "ShopOn - POS" || document.title == "ShopOn - POP" || document.title == "ShopOn - Product" || document.title == "ShopOn - Sales Order" || document.title == "ShopOn - Purchase Order" || document.title == "ShopOn - Purchase Order") {
        (hide_fulfillment) ? $(".fullfillment-header").hide() : $(".fullfillment-header").show();
        $(".store-header").show();
        if ($.parseJSON(localStorage.getItem("user_register_data")).length == 1) {
            $(".register-header").hide();
        }
        else {
            $(".register-header").show();
        }
    }
    else if (document.title == "ShopOn - Collection Report" || document.title == "ShopOn - Due Report" || document.title == "ShopOn - GST Report" || document.title == "ShopOn - Purchase Report" || document.title == "ShopOn - Sales Report" || document.title == "ShopOn - Collection") {
        $(".store-header").show();
        $(".fullfillment-header").hide();
        if ($.parseJSON(localStorage.getItem("user_register_data")).length == 1) {
            $(".register-header").hide();
        }
        else {
            $(".register-header").show();
        }
    }
    else {
        (hide_fulfillment) ? $(".fullfillment-header").hide() : $(".fullfillment-header").hide();
        $(".store-header").hide();
        $(".register-header").hide();
    }
}