/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.businessMemberPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        
        page.url = {};
        page.events = {
            page_load: function () {
                $(".footer").html(footerTemplate.join(""));

                if (localStorage.getItem("business_user_id") == "" || localStorage.getItem("business_user_id") == null || typeof localStorage.getItem("business_user_id") == "undefined") {
                    window.location.href = "./business-signin.html";
                }
                $(".menu-div").hide();
            },
            btnOrders_click: function () {
                page.view.setPage(1);
            },
            btnProducts_click: function () {
                page.view.setPage(2);
                $.pageController.unLoadUserControl(page, "currentUC");
                $.pageController.loadUserControl(page, page.controls.pnlContainerPage.children("div"), "currentUC", "businessProductsPage");
                page.controls.currentUC.load("");
            },
            btnSalesReport_click: function () {
                page.view.setPage(3);
            },
            btnStockReport_click: function () {
                page.view.setPage(4);
            },
        }

        page.view = {
            setPage: function (page) {
                $("[controlid=btnOrders]").removeClass("active");
                $("[controlid=btnProducts]").removeClass("active");
                $("[controlid=btnSalesReport]").removeClass("active");
                $("[controlid=btnStockReport]").removeClass("active");
                if (page == 1) {
                    $("[controlid=btnOrders]").addClass("active");
                }
                if (page == 2) {
                    $("[controlid=btnProducts]").addClass("active");
                }
                if (page == 3) {
                    $("[controlid=btnSalesReport]").addClass("active");
                }
                if (page == 4) {
                    $("[controlid=btnStockReport]").addClass("active");
                }
            },
        }

    });
};



