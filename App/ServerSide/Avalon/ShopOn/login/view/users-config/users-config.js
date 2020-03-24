$.fn.masterconfig = function () {
    return $.pageController.getPage(this, function (page, $$) {


        page.events = {
            lnkMenuMasterConfig_Click: function () {
                var menu = $(this).attr("menu");






                switch (menu) {
                    case "Class Config":
                        window.location.href = "view/pages/master-config/class/class-page.html";
                        break;
                    case "Configuration":
                        window.location.href = "view/pages/config-page/config-page.html";
                        break;
                    case "Student":
                        window.location.href = "view/pages/student/student.html";
                        break;
                    case "Fees":
                        window.location.href = "view/pages/fees/fees.html";
                        break;
                    case "Users":
                        window.location.href = "users/users.html";
                        break;
                    case "Accounts":
                        window.location.href = "../../pages/accounts/accounts.html";
                        break;
                    case "Reports":
                        window.location.href = "view/pages/rep-list/rep-list.html";
                        break;
                    case "Master Config":
                        window.location.href = "view/pages/master-config/master-config.html";
                        break;

                    default:
                        window.location.href = "view/pages/item-list/item-list.html";
                }
                //window.location.href = "view/pages/item-list/item-list.html";
            },

            page_load: function () {
                


            }
        };
    });
}
