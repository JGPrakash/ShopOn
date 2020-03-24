/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.businessPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        
        page.url = {};
        page.events = {
            page_load: function () {
                $(".footer").html(footerTemplate.join(""));

                if (localStorage.getItem("business_user_id") == "" || localStorage.getItem("business_user_id") == null || typeof localStorage.getItem("business_user_id") == "undefined") { }
                else {
                    window.location.href = "business-member.html";
                }
            },
            btnSignUp_click: function () {
                window.location.href = "./business-signup.html";
            },
        }

        page.view = {
            
        }

    });
};



