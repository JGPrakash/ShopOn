var CONTEXT = {};
CONTEXT.CurrentLanguage = "en";
$.fn.masterPage = function () {
    return $.pageController.getPage(this, function (page, $$) {
        page.template("/" + appConfig.greentivity_root + "/master-page/master-page.html");
        page.controlName = "masterPage";
        page.view = {}
        page.showDropdown = true;
        page.settingsAPI = new SettingsAPI();
        page.searchAPI = new SearchAPI();
        page.manufactureAPI = new ManufactureAPI();
        page.collectionAPI = new CollectionAPI();
        page.userAPI = new UserAPI();

        var typingTimer;                //timer identifier
        var doneTypingInterval = 250;  //time in ms, 5 second for example
        $("[controlid=txtSearch]").on('keyup', function (e) {
            if (e.which == 13) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () {
                    page.events.btnSearch_click();
                }, doneTypingInterval);
            }
        });


        page.events = {
            page_load: function () {

                localStorage.setItem("user_company_id", "12083");
                localStorage.setItem("user_finfacts_comp_id", "2826");
                localStorage.setItem("user_store_no", "3759");
                localStorage.setItem("auth-token", "fff5fb48-58d5-11e8-8971-c48e7aba35d9");
                localStorage.setItem("user_fulfillment_store_no", "3759");
                if (localStorage.getItem("cart_details") == null || typeof localStorage.getItem("cart_details") == "undefined" || localStorage.getItem("cart_details") == "") {
                    localStorage.setItem("cart_details", "");
                }
                if (!(window.location.href.includes('signup.html')) && !(window.location.href.includes('signin.html')) && !(window.location.href.includes('forget-password.html')))
                    localStorage.setItem("page_url", window.location.href);

                if (localStorage.getItem("app_user_id") != null && typeof localStorage.getItem("app_user_id") != "undefined" && localStorage.getItem("app_user_id") != "") {
                    page.userAPI.searchValues("", "", "user_id = '" + localStorage.getItem("app_user_id") + "'", "", function (data) {
                        var htmlTemplate = [];
                        htmlTemplate.push("<a>Hello &nbsp;" + data[0].user_name + "</a>");
                        $$("lblUser").html(htmlTemplate.join(""));
                        $$("lblMobileUser").html('<i class="fa fa-user"></i>&nbsp;&nbsp;&nbsp;Hello &nbsp;' + data[0].user_name + '');
                    });
                }

                page.getSettings(function (data) {
                    $(data).each(function (i, item) {
                        CONTEXT[item.sett_key] = item.value_1;
                    });
                });

                $(".menu-heading-content").click(function () {
                    $(".left-side-title").show();
                })

                $(".menu-panel").hover(function () {
                    var visible = false;
                    if ($(this).find("div").is(":visible")) {
                        visible = true;
                    }
                    $(".sub-menu-panel").hide();
                    if (visible) {
                        $(this).removeClass("menu-hover-color");
                        $(this).find("div").hide();
                    }
                    else {
                        $(this).addClass("menu-hover-color");
                        $(this).find("div").show();
                    }
                });
                page.searchAPI.searchValues("", "", "", "mpt.mpt_id", function (data) {
                    page.view.selectedProducts(data);
                });

                page.manufactureAPI.searchValues("", "", "", "", function (data) {
                    page.view.selectedBrands(data);
                });

                page.collectionAPI.searchValues("", "", "collection_type = 4", "", function (data) {
                    page.view.selectedDeals(data);
                });

            },
            btnDropdown_click:function(){
                if (page.showDropdown) {
                    $$("pnlDropDownData").show();
                    page.showDropdown = false;
                }
                else {
                    $$("pnlDropDownData").hide();
                    page.showDropdown = true;
                }
            },
            btnSearch_click: function () {
                if ($$("txtSearch").value() != "" && $$("txtSearch").value() != null && typeof $$("txtSearch").value() != "undefined")
                    window.location.href = '/pages/item-search.html?text=' + $$("txtSearch").value();
            }
        }
        page.view = {
            selectedProducts: function (data) {
                var last_main_product_id = "", core_product_type = [], main_product_type = [], product_type = [];
                $(data).each(function (i, item) {
                    if (item.mpt_no != null) {
                        product_type = [];
                        if (last_main_product_id != item.mpt_no) {
                            main_product_type.push({
                                mpt_no: item.mpt_no,
                                mpt_name: item.mpt_name,
                                product_type: []
                            });
                            if (item.ptype_no != null) {
                                product_type.push({
                                    ptype_no: item.ptype_no,
                                    ptype_name: item.ptype_name
                                });
                                main_product_type[main_product_type.length - 1].product_type.push(product_type);
                            }
                        }
                        else {
                            if (item.ptype_no != null) {
                                product_type.push({
                                    ptype_no: item.ptype_no,
                                    ptype_name: item.ptype_name
                                });
                                main_product_type[main_product_type.length - 1].product_type.push(product_type);
                            }
                        }
                        last_main_product_id = item.mpt_no;
                    }
                });
                var htmlTemplate = [], mobileTemplate = [];
                $(main_product_type).each(function (i, item) {
                    htmlTemplate.push('<div class="col-xs-4">');
                    htmlTemplate.push('<h4><a href="' + appConfig.location + '/pages/category-products.html?tag=mainproducttype&value=' + item.mpt_no + '">' + item.mpt_name + '</a></h4>');
                    mobileTemplate.push('<button class="sub-mobile-menu">' + item.mpt_name + ' &nbsp;&nbsp;<i class="fa fa-caret-down"></i></button>');
                    mobileTemplate.push('<div class="menu-mobile-link" style="display:none;">');
                    for (var j = 0; j < item.product_type.length; j++) {
                        htmlTemplate.push('<h6><a href="' + appConfig.location + '/pages/category-products.html?tag=producttype&value=' + item.product_type[j][0].ptype_no + '">' + item.product_type[j][0].ptype_name + '</a></h6>');
                        mobileTemplate.push('<a href="' + appConfig.location + '/pages/category-products.html?tag=producttype&value=' + item.product_type[j][0].ptype_no + '">' + item.product_type[j][0].ptype_name + '</a>');
                    }
                    mobileTemplate.push('</div>');
                    htmlTemplate.push('</div>');
                    if((i+1)%3 == 0)
                        htmlTemplate.push('<span class="col-xs-12" style="height:1px;">&nbsp;</span>');
                })
                $$("pnlProducts").html(htmlTemplate.join(""));
                $$("lblMobileProducts").html(mobileTemplate.join(""));
            },
            selectedBrands: function (data) {
                var htmlTemplate = [], mobileTemplate = [];
                htmlTemplate.push('<h4>Shop By Brands</h4>');
                $(data).each(function (i, item) {
                    htmlTemplate.push('<div class="col-xs-3">');
                    htmlTemplate.push('<a href="' + appConfig.location + '/pages/category-products.html?tag=manufacture&value=' + item.man_no + '">');
                    if (item.man_image == null || item.man_image == "" || typeof item.man_image == "undefined") {
                        htmlTemplate.push('<img src = "image/no-image.png" width="100%" style="height:150px;" />');
                    }
                    else {
                        htmlTemplate.push('<img src = "' + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.man_no + '/' + item.man_image + '" width="100%" style="height:90px;" />');
                    }
                    htmlTemplate.push('<h4 style="text-align:center;">' + item.man_name + '</h4>');
                    htmlTemplate.push('</a>');
                    htmlTemplate.push('</div>');
                    if (i == 0) {
                        mobileTemplate.push('<div class="sub-mobile-menu" style="">');
                    }
                    mobileTemplate.push('<a href="' + appConfig.location + '/pages/category-products.html?tag=manufacture&value=' + item.man_no + '">' + item.man_name + '</a>');
                });
                $$("pnlBrands").html(htmlTemplate.join(""));
                mobileTemplate.push('</div>');
                $$("lblMobileBrands").html(mobileTemplate.join(""));
            },
            selectedDeals: function (data) {
                var htmlTemplate = [], mobileTemplate = [];
                htmlTemplate.push('<h4>Deals From Avalon</h4>');
                $(data).each(function (i, item) {
                    htmlTemplate.push('<div class="col-xs-3">');
                    htmlTemplate.push('<a href="' + appConfig.location + '/pages/category-products.html?tag=collection&value=' + item.collection_id + '">');
                    if (item.collection_image == null || item.collection_image == "" || typeof item.collection_image == "undefined") {
                        htmlTemplate.push('<img src = "image/no-image.png" width="100%" />');
                    }
                    else {
                        htmlTemplate.push('<img src = "' + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.man_no + '/' + item.collection_image + '" width="100%" />');
                    }
                    htmlTemplate.push('<h4>' + item.collection_name + '</h4>');
                    htmlTemplate.push('</a>');
                    htmlTemplate.push('</div>');
                    if (i == 0) {
                        mobileTemplate.push('<div class="sub-mobile-menu" style="">');
                    }
                    mobileTemplate.push('<a href="' + appConfig.location + '/pages/category-products.html?tag=collection&value=' + item.collection_id + '">' + item.collection_name + '</a>');
                });
                mobileTemplate.push('</div>');
                $$("pnlDeals").html(htmlTemplate.join(""));
                $$("lblMobileDeals").html(mobileTemplate.join(""));
            },
        }
        page.showPanel = true;
        $("#pnlEnquireButton").click(function () {
            if (page.showPanel) {
                $(".enduire-form-panel").css("z-index", "100");
                $("#pnlEnquireForm").css("z-index", "100");
                $(".leftcontent").css("z-index", "100");
                $("#pnlEnquireForm").show("slide", { direction: "right" }, 500);
                $(".leftcontent").css("float", "left");
                //$$("txtUserName").focus();
                page.showPanel = false;
                page.events.btnClearQuery_click();
                $$("txtUserName").focus();
            }
            else {
                $(".leftcontent").css("float", "right");
                $("#pnlEnquireForm").hide("slide", { direction: "right" }, 500);
                $(".enduire-form-panel").css("z-index", "9");
                $("#pnlEnquireForm").css("z-index", "9");
                $(".leftcontent").css("z-index", "9");
                page.showPanel = true;
            }

        })
        $("#myBtn").click(function () {
            $("html, body").animate({ scrollTop: 0 }, "slow");
        })

        window.onscroll = function () { scrollFunction() };
        function scrollFunction() {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                $(".header").addClass("menu-background");
                document.getElementById("myBtn").style.display = "block";


            } else {
                $(".header").removeClass("menu-background");
                document.getElementById("myBtn").style.display = "none";
            }
        }

        page.getSettings = function (callback) {
            if (localStorage.getItem("company_settings") == "" || localStorage.getItem("company_settings") == null || typeof localStorage.getItem("company_settings") == "undefined" || $.parseJSON(localStorage.getItem("company_settings")).length == "0") {
                page.settingsAPI.getSettings(function (data) {
                    localStorage.setItem("company_settings", JSON.stringify(data));
                    location.reload(true);
                    callback(data);
                });

            }
            else {
                callback($.parseJSON(localStorage.getItem("company_settings")));
            }
        }

    });
}

function openNav() {
    document.getElementById("mySidenav").style.width = "" + window.innerWidth - 50 + "";
    $("#mySidenav").css("width", window.innerWidth - 50);
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function replacceText(text) {
    return text.replace(/&amp;lt;/gi, "<").replace(/&amp;gt;/gi, ">").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&amp;quot;/gi, "'").replace(/&quot;/gi, "'").replace(/&amp;amp;/gi, "&");
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

function showErrorDialog() {
    alert("Some Internal Problem Will Occur Please Try Again Later...!!!");
}


function SettingsAPI() {
    this.getSettings = function (callback) {
        var filter_expression = "comp_id =" + localStorage.getItem("user_company_id");
        $.server.webMethodGET("shopon/settings?start_record=&end_record=&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=sett_no", callback);
    }
}
function SearchAPI() {
    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("shopon/searching/productType/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.itemSearch = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("shopon/searching/items/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.categorySearch = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("shopon/searching/category/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
}
function ManufactureAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        $.server.webMethodGET("shopon/manufacturer/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
}
function CollectionAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("shopon/collection/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
}
function CollectionItemAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("shopon/collectionitem/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

}
function SalesItemAPI() {

    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, search_mode, callback) {
        $.server.webMethodGET("sales/item/?sales_tax_no=" + CONTEXT.DEFAULT_SALES_TAX + "&start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression + "&search_mode=" + search_mode, function (data) {
            callback(data);
        });
    }
}
function MainProductTypeAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("shopon/mainproducttype/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
}
function ProductTypeAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        $.server.webMethodGET("shopon/producttype/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
}
function CarosalAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("shopon/carosal/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
}
function CoreProductTypeAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        $.server.webMethodGET("shopon/coreproducttype/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
}
function UserAPI() {

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("iam/users/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
    this.insertUser = function (registerData, callback, errorCallback) {
        $.server.webMethodPOST("iam/users/", registerData, callback, errorCallback);
    }
    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("iam/users/" + id, data, callback, errorCallback);
    }
}
function CustomerAPI() {
    var self = this;
    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
       var url = "shopon/customer/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression + "&store_no=" + localStorage.getItem("user_store_no");
       $.server.webMethodGET(url, function (result, obj) {
           LCACHE.set(url, result);
           callback(result, obj);
       });
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/customer/", data, callback, errorCallback);
    }
}
function TokenAPI() {
    var self = this;
    this.putValue = function (userData, callback, errorCallback) {
        $.server.webMethodPOST("iam/tokens/", userData, callback, errorCallback);
    }
    this.getOTP = function (userData, callback, errorCallback) {
        $.server.webMethodPOST("iam/tokens/otp/", userData, callback, errorCallback);
    }
    this.checkOTP = function (userData, callback, errorCallback) {
        $.server.webMethodPOST("iam/tokens/checkotp/", userData, callback, errorCallback);
    }
    this.getPassword = function (userData, callback, errorCallback) {
        $.server.webMethodPOST("iam/tokens/getpassword/", userData, callback, errorCallback);
    }
}



