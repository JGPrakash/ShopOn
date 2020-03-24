$.fn.masterconfig = function() {
    return $.pageController.getPage(this, function(page, $$) {
        //   page.template("/" + appConfig.root + "/user/users-config/users-config.html");
        page.userService = new UserService();

        page.events = {
            //Edited By Anto
            btnUserSettings_click: function () {
                document.cookie = "app_user_id="
                window.location.href = "/" + appConfig.root + "/user/users-config/user-settings/user-settings.html";
            },
            btnUserManagement_click: function() {
                  document.cookie = "app_user_id="
                window.location.href = "/" + appConfig.root + "/user/users-config/users/users.html";
            },
            btnGroupManagement_click: function() {
                  document.cookie = "app_user_id="
                window.location.href = "/" + appConfig.root + "/user/users-config/group/group.html";
            },
            btnUserGroupConfiguration_click: function() {
                  document.cookie = "app_user_id="
                window.location.href = "/" + appConfig.root + "/user/users-config/user-group/user-group.html";
            },
            btnPermissionManagement_click: function() {
                  document.cookie = "app_user_id="
                window.location.href = "/" + appConfig.root + "/user/users-config/perm/perm.html";
            },
            btnObjectConfiguration_click: function() {
                  document.cookie = "app_user_id="
                window.location.href = "/" + appConfig.root + "/user/users-config/object/object.html";
            },
            btnUserObjectPermission_click: function() {
                  document.cookie = "app_user_id="
                window.location.href = "/" + appConfig.root + "/user/users-config/user-obj-perm/user-obj-perm.html";
            },
            lnkMenuMasterConfig_Click: function() {
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
                $$("btnUserSettings").selectedObject.html(appConfig.title);
                $$("btnUserManagement").selectedObject.html(appConfig.title);
                $$("btnGroupManagement").selectedObject.html(appConfig.title);
                $$("btnUserGroupConfiguration").selectedObject.html(appConfig.title);
                $$("btnPermissionManagement").selectedObject.html(appConfig.title);
                $$("btnObjectConfiguration").selectedObject.html(appConfig.title);
                $$("btnUserObjectPermission").selectedObject.html(appConfig.title);
                //    page.template("/" + appConfig.root + "/user/users-config/users/users.html");

            }
        };
    });
}