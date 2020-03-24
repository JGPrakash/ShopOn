/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.indexPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {

        //page.manufactureAPI = new ManufactureAPI();
        //page.coreProductTypeAPI = new CoreProductTypeAPI();
        //page.searchAPI = new SearchAPI();
        page.carosalAPI = new CarosalAPI();
        page.collectionAPI = new CollectionAPI();
        page.collectionItemAPI = new CollectionItemAPI();
        page.events = {
            page_load: function () {
                
                $(".footer").html(footerTemplate.join(""));
                //$('.owl-carousel').owlCarousel({
                //    loop: true,
                //    margin: 10,
                //    nav: true,
                //    responsive: {
                //        0: {
                //            items: 1
                //        },
                //        600: {
                //            items: 3
                //        },
                //        1000: {
                //            items: 5
                //        }
                //    }
                //});

                //$(".pnlManufacture").hover(function () {
                //    var visible = false;
                //    if ($(".popuptext").is(":visible")) {
                //        visible = true;
                //    }
                //    if (visible)
                //        $(".popuptext").hide();
                //    else
                //        $(".popuptext").show();
                //});

                //Load Manufacture
                //page.manufactureAPI.searchValues("", "", "", "", function (data) {
                //    var manufactureTemplate = [];
                //    $(data).each(function (i, item) {
                //        if(item.man_image == null || item.man_image == "" || typeof item.man_image == "undefined"){
                //            manufactureTemplate.push('<a class="col-xs-6" href="' + appConfig.location + '/pages/category-products.html?tag=manufacture&value='+item.man_no+'"><img src="image/no-image.png" width="100%" /><br /><span class="col-xs-12">' + item.man_name + '</span></a>');
                //        }
                //        else {
                //            manufactureTemplate.push('<a class="col-xs-6" href="' + appConfig.location + '/pages/category-products.html?tag=manufacture&value=' + item.man_no + '"><img src="' + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.man_no + '/' + item.man_image + '" width="100%" /><br /><span class="col-xs-12">' + item.man_name + '</span></a>');
                //        }
                //    })
                //    $$("lblManufacture").html(manufactureTemplate.join(""));
                //});

                //Load Core Product Type
                //page.coreProductTypeAPI.searchValues("", "", "", "core_product_type_order", function (data) {
                //    $$("ddlCoreProductType").dataBind(data, "core_product_type_id", "core_product_type_name","Search All")
                //});


                //Load The Main Menu Screen
                //page.searchAPI.searchValues("", "", "", "mpt.core_product_type_id,mpt.mpt_id", function (data) {
                //    page.view.selectedMainMenu(data);
                //});

                //Load Carosal
                page.carosalAPI.searchValues("", "", "collection_id = 4", "", function (data) {
                    page.view.selectedCarosal(data);
                });

                page.collectionAPI.searchValues("", "", "collection_type not in (1)", "sort_order", function (data) {
                    page.collectionItemAPI.searchValues("", "", "", "", function (item_data) {
                        var result = [], last_collection_id = "";
                        $(data).each(function (i, item) {
                            if (last_collection_id != item.collection_id) {
                                result.push({
                                    collection_name: item.collection_name,
                                    collection_id: item.collection_id,
                                    collection_style:item.collection_style,
                                    collection_item: []
                                })
                            }
                            $(item_data).each(function (j, item1) {
                                if (item1.collection_id == item.collection_id) {
                                    result[i].collection_item.push({
                                        item_name: item1.item_name,
                                        sku_no: item1.sku_no,
                                        image_name: item1.image_name,
                                        item_no: item1.item_no,
                                        price: item1.price,
                                        disc_value: item1.disc_value,
                                        disc_type: item1.disc_type
                                    });
                                }
                            })
                        });
                        page.view.selectedCollection(result);
                    });
                });
            }
        }

        page.view = {
            //selectedMainMenu: function (data) {
            //    var last_core_product_id = "", last_main_product_id = "", core_product_type = [], main_product_type = [], product_type = [];
            //    $(data).each(function (i, item) {
            //        main_product_type = [], product_type = [];
            //        if (last_core_product_id != item.core_product_type_id) {
            //            core_product_type.push({
            //                core_product_type_name: item.core_product_type_name,
            //                core_product_type_id: item.core_product_type_id,
            //                main_product: []
            //            })
            //            main_product_type.push({
            //                mpt_no: item.mpt_no,
            //                mpt_name: item.mpt_name,
            //                product_type: []
            //            })
            //            product_type.push({
            //                ptype_no: item.ptype_no,
            //                ptype_name: item.ptype_name
            //            })
            //            main_product_type[main_product_type.length - 1].product_type.push(product_type);
            //            core_product_type[core_product_type.length - 1].main_product.push(main_product_type);
            //        }
            //        else {
            //            if (last_main_product_id != item.mpt_no) {
            //                main_product_type.push({
            //                    mpt_no: item.mpt_no,
            //                    mpt_name: item.mpt_name,
            //                    product_type: []
            //                })
            //                product_type.push({
            //                    ptype_no: item.ptype_no,
            //                    ptype_name: item.ptype_name
            //                })
            //                main_product_type[main_product_type.length - 1].product_type.push(product_type);
            //                core_product_type[core_product_type.length - 1].main_product.push(main_product_type);
            //            }
            //            else {
            //                product_type.push({
            //                    ptype_no: item.ptype_no,
            //                    ptype_name: item.ptype_name
            //                })
            //                core_product_type[core_product_type.length - 1].main_product[core_product_type[core_product_type.length - 1].main_product.length - 1][core_product_type[core_product_type.length - 1].main_product[core_product_type[core_product_type.length - 1].main_product.length - 1].length - 1].product_type.push(product_type);
            //            }
            //        }
            //        last_core_product_id = item.core_product_type_id;
            //        last_main_product_id = item.mpt_no;
            //    });
            //    var htmlTemplate = [];
            //    $(core_product_type).each(function (i, item) {
            //        htmlTemplate.push('<div class="col-xs-12 core_product_left_panel">');
            //        htmlTemplate.push('<span>' + item.core_product_type_name + '<span style="float:right;">></span></span>');
            //        htmlTemplate.push('<div class="col-xs-12 col-sm-12 col-m3 col-lg-3 product_type_panel" style="display:none">');
            //        for (var j = 0; j < item.main_product.length; j++) {
            //            htmlTemplate.push('<h4 class="col-xs-12"><a href="' + appConfig.location + '/pages/category-products.html?tag=mainproducttype&value=' + item.main_product[j][0].mpt_no + '">' + item.main_product[j][0].mpt_name + '</a></h4>');
            //            for (var k = 0; k < item.main_product[j][0].product_type.length; k++) {
            //                htmlTemplate.push('<span class="col-xs-12"><a href="' + appConfig.location + '/pages/category-products.html?tag=producttype&value=' + item.main_product[j][0].product_type[k][0].ptype_no + '">' + item.main_product[j][0].product_type[k][0].ptype_name + '</a></span>');
            //            }
            //        }
            //        htmlTemplate.push('</div>');
            //        htmlTemplate.push('</div>');
            //    });
            //    $$("pnlMainMenu").html(htmlTemplate.join(""));

            //    $(".core_product_left_panel").hover(function () {
            //        var visible = false;
            //        if ($(this).find("div").is(":visible")) {
            //            visible = true;
            //        }
            //        $(".product_type_panel").hide();
            //        if (visible) {
            //            $(this).removeClass("menu-hover-color");
            //            $(this).find("div").hide();
            //        }
            //        else{
            //            $(this).addClass("menu-hover-color");
            //            $(this).find("div").show();
            //        }
            //    });
            //},
            selectedCarosal: function (data) {
                var htmlTemplate = [];
                htmlTemplate.push("<div id='myCarousel' class='carousel slide' data-ride='carousel'>");
                htmlTemplate.push("<ol class='carousel-indicators'>");
                $(data).each(function (i, item) {
                    if (i == 0) {
                        htmlTemplate.push("<li data-target='#myCarousel' data-keywords=" + item.carosal_id + " data-slide-to=" + item.carosal_id + " class='active'></li>");
                    }
                    else {
                        htmlTemplate.push("<li data-target='#myCarousel' data-keywords=" + item.carosal_id + " data-slide-to=" + item.carosal_id + "></li>");
                    }
                });
                htmlTemplate.push("</ol>");
                htmlTemplate.push("<div class='carousel-inner'>");
                $(data).each(function (i, item) {
                    if (i == 0) {
                        htmlTemplate.push("<div class='item active'>");
                        htmlTemplate.push("<img src='" + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.carosal_id + '/' + item.carosal_image + "' style='width:100%;' class='home-carosal'>");
                        htmlTemplate.push("</div>");
                    }
                    else {
                        htmlTemplate.push("<div class='item'>");
                        htmlTemplate.push("<img src='" + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.carosal_id + '/' + item.carosal_image + "' style='width:100%;' class='home-carosal'>");
                        htmlTemplate.push("</div>");
                    }
                });
                htmlTemplate.push("</div>");
                htmlTemplate.push("<a class='left carousel-control' href='#myCarousel' data-slide='prev'>");
                htmlTemplate.push("<span class='glyphicon glyphicon-chevron-left'></span>");
                htmlTemplate.push("<span class='sr-only'>Previous</span>");
                htmlTemplate.push("</a>");
                htmlTemplate.push("<a class='right carousel-control' href='#myCarousel' data-slide='next'>");
                htmlTemplate.push("<span class='glyphicon glyphicon-chevron-right'></span>");
                htmlTemplate.push("<span class='sr-only'>Next</span>");
                htmlTemplate.push("</a>");
                htmlTemplate.push("</div>");
                $$("lblCarosal").html(htmlTemplate.join(""));

                $(".item").click(function () {
                    window.location.href = appConfig.location + '/pages/category-products.html?tag=carosal&value=' + $(".active").attr("data-keywords");
                })
            },
            selectedCollection: function (data) {
                var htmlTemplate = [];
                $(data).each(function (i, item) {
                    htmlTemplate.push('<div class="col-xs-12 row">');
                    if (item.collection_style == "1") {
                        htmlTemplate.push('<span class="collection-heading">' + item.collection_name + '</span>&nbsp;<span class="collection-button"><a href="pages/category-products.html?tag=collection&value=' + item.collection_id + '">See All</a></span>');
                        htmlTemplate.push('<div class="owl-carousel owl-theme col-xs-12 collection-item">');
                        for (var j = 0; j < item.collection_item.length; j++) {
                            //for (var k = 0; k < 12; k++) {
                                htmlTemplate.push('<div class="item item-details" sku-id="' + item.collection_item[j].sku_no + '"><img src="' + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.collection_item[j].item_no + '/' + item.collection_item[j].image_name + '" />');
                                htmlTemplate.push('<h4>' + item.collection_item[j].item_name + '</h4>');
                                //htmlTemplate.push('<h2><i class="fa fa-rupee"></i>&nbsp;' + item.collection_item[j].price + '</h2></div>');
                                var discount = 0;
                                if (item.collection_item[j].disc_value != null && typeof item.collection_item[j].disc_value != "undefined" && parseFloat(item.collection_item[j].disc_value) > 0) {
                                    if (item.collection_item[j].disc_type == "Percent") {
                                        discount = parseFloat(item.collection_item[j].price) * (parseFloat(item.collection_item[j].disc_value) / 100);
                                    }
                                    else {
                                        discount = parseFloat(item.collection_item[j].disc_value);
                                    }
                                }
                                if (discount != 0) {
                                    htmlTemplate.push('<h6 class="discount-style-2"><i class="fa fa-rupee"></i>&nbsp;' + item.collection_item[j].price + '</h6>');
                                }
                                htmlTemplate.push('<h3><i class="fa fa-rupee"></i>&nbsp;' + parseFloat(parseFloat(item.collection_item[j].price) - parseFloat(discount)).toFixed(2) + '</h3>');

                                if (discount != 0) {
                                    if (item.collection_item[j].disc_type == "Percent") {
                                        htmlTemplate.push('<h6 class="discount-style-1">Saved: &nbsp;' + parseInt(item.collection_item[j].disc_value) + '%</h6>');
                                    }
                                    else {
                                        htmlTemplate.push('<h6 class="discount-style-1">Saved: <i class="fa fa-rupee"></i>&nbsp;' + parseFloat(item.collection_item[j].disc_value).toFixed(2) + '</h6>');
                                    }
                                }
                                htmlTemplate.push('</div>');
                            //}
                        }
                        htmlTemplate.push('</div>');
                    }
                    else if (item.collection_style == "2") {
                        htmlTemplate.push('<span class="collection-heading">' + item.collection_name + '</span>&nbsp;<span class="collection-button"><a href="pages/category-products.html?tag=collection&value=' + item.collection_id + '">See All</a></span>');
                        htmlTemplate.push('<span class="col-xs-12">&nbsp;</span>');
                        for (var j = 0; j < 5; j++) {
                            if (j == 3) {
                                htmlTemplate.push('<span class="col-xs-12" style="height:5px;">&nbsp;</span>');
                            }
                            if (j == 0) {
                                htmlTemplate.push('<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 collection-item item-details" sku-id="' + item.collection_item[j].sku_no + '">');
                                htmlTemplate.push('<img src="' + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.collection_item[j].item_no + '/' + item.collection_item[j].image_name + '" width="100%" />');
                                htmlTemplate.push('<h3>' + item.collection_item[j].item_name + '</h3>');
                                var discount = 0;
                                if(item.collection_item[j].disc_value != null && typeof item.collection_item[j].disc_value != "undefined" && parseFloat(item.collection_item[j].disc_value) > 0){
                                    if(item.collection_item[j].disc_type == "Percent"){
                                        discount = parseFloat(item.collection_item[j].price)*(parseFloat(item.collection_item[j].disc_value)/100);
                                    }
                                    else {
                                        discount = parseFloat(item.collection_item[j].disc_value);
                                    }
                                }
                                if (discount != 0) {
                                    htmlTemplate.push('<h6 class="discount-style-2"><i class="fa fa-rupee"></i>&nbsp;' + item.collection_item[j].price + '</h6>');
                                }
                                htmlTemplate.push('<h2><i class="fa fa-rupee"></i>&nbsp;' + parseFloat(parseFloat(item.collection_item[j].price) - parseFloat(discount)).toFixed(2) + '</h2>');

                                if (discount != 0) {
                                    if (item.collection_item[j].disc_type == "Percent") {
                                        htmlTemplate.push('<h6 class="discount-style-1">Saved: &nbsp;' + parseInt(item.collection_item[j].disc_value) + '%</h6>');
                                    }
                                    else {
                                        htmlTemplate.push('<h6 class="discount-style-1">Saved: <i class="fa fa-rupee"></i>&nbsp;' + parseFloat(item.collection_item[j].disc_value).toFixed(2) + '</h6>');
                                    }
                                }
                                htmlTemplate.push('</div>');

                                htmlTemplate.push('<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 collection-item">');
                            }
                            else {
                                htmlTemplate.push('<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 item-details" sku-id="' + item.collection_item[j].sku_no + '">');
                                htmlTemplate.push('<img src="' + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.collection_item[j].item_no + '/' + item.collection_item[j].image_name + '" width="100%" />');
                                htmlTemplate.push('<h4>' + item.collection_item[j].item_name + '</h4>');
                                //htmlTemplate.push('<h2><i class="fa fa-rupee"></i>&nbsp;' + item.collection_item[j].price + '</h2></div>');
                                var discount = 0;
                                if (item.collection_item[j].disc_value != null && typeof item.collection_item[j].disc_value != "undefined" && parseFloat(item.collection_item[j].disc_value) > 0) {
                                    if (item.collection_item[j].disc_type == "Percent") {
                                        discount = parseFloat(item.collection_item[j].price) * (parseFloat(item.collection_item[j].disc_value) / 100);
                                    }
                                    else {
                                        discount = parseFloat(item.collection_item[j].disc_value);
                                    }
                                }
                                if (discount != 0) {
                                    htmlTemplate.push('<h6 class="discount-style-2"><i class="fa fa-rupee"></i>&nbsp;' + item.collection_item[j].price + '</h6>');
                                }
                                htmlTemplate.push('<h3><i class="fa fa-rupee"></i>&nbsp;' + parseFloat(parseFloat(item.collection_item[j].price) - parseFloat(discount)).toFixed(2) + '</h3>');

                                if (discount != 0) {
                                    if (item.collection_item[j].disc_type == "Percent") {
                                        htmlTemplate.push('<h6 class="discount-style-1">Saved: &nbsp;' + parseInt(item.collection_item[j].disc_value) + '%</h6>');
                                    }
                                    else {
                                        htmlTemplate.push('<h6 class="discount-style-1">Saved: <i class="fa fa-rupee"></i>&nbsp;' + parseFloat(item.collection_item[j].disc_value).toFixed(2) + '</h6>');
                                    }
                                }
                                htmlTemplate.push('</div>');
                            }
                        }
                        htmlTemplate.push('</div>');
                    }
                    else if (item.collection_style == "3") {
                        htmlTemplate.push('<div class="col-xs-12 col-sm-12 col-md-2 col-lg-1"><h6>&nbsp;</h6></div>');
                        htmlTemplate.push('<div class="col-xs-12 col-sm-12 col-md-8 col-lg-10">');
                        htmlTemplate.push('<span class="collection-heading">' + item.collection_name + '</span>&nbsp;<span class="collection-button"><a href="pages/category-products.html?tag=collection&value=' + item.collection_id + '">See All</a></span>');
                        
                        htmlTemplate.push('<div class="owl-carousel owl-theme col-xs-12 collection-item">');
                        for (var j = 0; j < item.collection_item.length; j++) {
                            //for (var k = 0; k < 12; k++) {
                                htmlTemplate.push('<div class="item item-details" sku-id="' + item.collection_item[j].sku_no + '"><img src="' + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.collection_item[j].item_no + '/' + item.collection_item[j].image_name + '" />');
                                htmlTemplate.push('<h4>' + item.collection_item[j].item_name + '</h4>');
                                //htmlTemplate.push('<h2><i class="fa fa-rupee"></i>&nbsp;' + item.collection_item[j].price + '</h2></div>');
                                var discount = 0;
                                if (item.collection_item[j].disc_value != null && typeof item.collection_item[j].disc_value != "undefined" && parseFloat(item.collection_item[j].disc_value) > 0) {
                                    if (item.collection_item[j].disc_type == "Percent") {
                                        discount = parseFloat(item.collection_item[j].price) * (parseFloat(item.collection_item[j].disc_value) / 100);
                                    }
                                    else {
                                        discount = parseFloat(item.collection_item[j].disc_value);
                                    }
                                }
                                if (discount != 0) {
                                    htmlTemplate.push('<h6 class="discount-style-2"><i class="fa fa-rupee"></i>&nbsp;' + item.collection_item[j].price + '</h6>');
                                }
                                htmlTemplate.push('<h3><i class="fa fa-rupee"></i>&nbsp;' + parseFloat(parseFloat(item.collection_item[j].price) - parseFloat(discount)).toFixed(2) + '</h3>');

                                if (discount != 0) {
                                    if (item.collection_item[j].disc_type == "Percent") {
                                        htmlTemplate.push('<h6 class="discount-style-1">Saved: &nbsp;' + parseInt(item.collection_item[j].disc_value) + '%</h6>');
                                    }
                                    else {
                                        htmlTemplate.push('<h6 class="discount-style-1">Saved: <i class="fa fa-rupee"></i>&nbsp;' + parseFloat(item.collection_item[j].disc_value).toFixed(2) + '</h6>');
                                    }
                                }
                                htmlTemplate.push('</div>');
                            //}
                        }
                        htmlTemplate.push('</div>');
                        htmlTemplate.push('</div>');
                    }

                    htmlTemplate.push('</div>');
                });
                $$("pnlCollection").html(htmlTemplate.join(""));
                $('.owl-carousel').owlCarousel({
                    loop: false,
                    margin: 10,
                    nav: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 3
                        },
                        1000: {
                            items: 5
                        }
                    }
                });
                $(".item-details").on("click", function () {
                    window.location.href = '/pages/item-details.html?sku=' + $(this).attr("sku-id");
                });
            },
        }
    });
};


//function HeaderServiceAPI() {
//    var self = this;

//    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
//        $.server.webMethodGET("greentivity/header/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
//    }
//}

//function ManufactureAPI() {
//    var self = this;

//    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
//        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
//        $.server.webMethodGET("shopon/manufacturer/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
//    }
//}

//function CoreProductTypeAPI() {
//    var self = this;

//    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
//        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
//        $.server.webMethodGET("shopon/coreproducttype/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
//    }
//}
//function SearchAPI() {
//    var self = this;

//    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
//        $.server.webMethodGET("shopon/searching/productType/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
//    }
//}

//function CarosalAPI() {
//    var self = this;

//    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
//        $.server.webMethodGET("shopon/carosal/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
//    }
//}

//function CollectionAPI() {
//    var self = this;

//    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
//        $.server.webMethodGET("shopon/collection/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
//    }
//}

//function CollectionItemAPI() {
//    var self = this;

//    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
//        $.server.webMethodGET("shopon/collectionitem/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
//    }

//}


