/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.businessSignInPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.userAPI = new UserAPI();
        page.tokenAPI = new TokenAPI();
        page.url = {};
        page.events = {
            page_load: function () {
                $(".footer").html(footerTemplate.join(""));
                localStorage.setItem("business_user_id", "");
            },
            btnShowPassword_click: function () {
                $$("txtPassword").selectedObject.attr("type", "text");
                $$("btnShowPassword").hide();
                $$("btnHidePassword").show();
            },
            btnHidePassword_click: function () {
                $$("txtPassword").selectedObject.attr("type", "password");
                $$("btnShowPassword").show();
                $$("btnHidePassword").hide();
            },
            btnForgetPassword_click: function () {
                localStorage.setItem("forget-type", "business");
                window.location.href = '../pages/forget-password.html';
            },
            btnSignUp_click: function () {
                window.location.href = '../pages/business-signup.html';
            },
            btnOpenAlert_click: function (data) {
                $$("lblAlertContent").html(data);
                page.controls.pnlAlert.open();
                page.controls.pnlAlert.title("Message");
                page.controls.pnlAlert.width(500);
                page.controls.pnlAlert.height(200);
            },
            btnCloseAlert_click: function () {
                page.controls.pnlAlert.close();
            },
            btnCloseSuccess_click: function () {
                window.location.href = localStorage.getItem("page_url");
            },
            btnSignIn_click: function () {
                try{
                    if ($$("txtUserId").val() == "" || $$("txtUserId").val() == null || typeof $$("txtUserId").val() == "undefined") {
                        throw "User Id Is Not Valid..!!";
                    }
                    if ($$("txtPassword").val() == "" || $$("txtPassword").val() == null || typeof $$("txtPassword").val() == "undefined") {
                        throw "Password Is Not Valid..!!";
                    }
                    var userData;
                    if (ValidateMobileNo(page.controls.txtUserId.value())) {
                        userData = {
                            phone_no: page.controls.txtUserId.value(),
                            password: page.controls.txtPassword.val(),
                            scope: "shopon",
                            default_branch: "103"
                        };
                    }
                    else if (ValidateEmail(page.controls.txtUserId.value())) {
                        userData = {
                            email_id: page.controls.txtUserId.value(),
                            password: page.controls.txtPassword.val(),
                            scope: "shopon",
                            default_branch: "103"
                        };
                    }
                    else if (isNaN(page.controls.txtUserId.value())) {
                        userData = {
                            user_name: page.controls.txtUserId.value(),
                            password: page.controls.txtPassword.val(),
                            scope: "shopon",
                            default_branch: "103"
                        };
                    }
                    else {
                        userData = {
                            user_id: page.controls.txtUserId.value(),
                            password: page.controls.txtPassword.val(),
                            scope: "shopon",
                            default_branch: "103"
                        };
                    }
                    page.tokenAPI.putValue(userData, function (data) {
                        if (typeof data.length == "undefined") {
                            page.events.btnOpenAlert_click("Invalid user id or password!");
                        }
                        else {
                            localStorage.setItem("business_user_id", data[0].user_id);
                            window.location.href = './business-member.html';
                        }
                    }, function (data) {
                        page.events.btnOpenAlert_click("Invalid user id or password!");
                    }
                    );
                }
                catch (e) {
                    page.events.btnOpenAlert_click(e);
                }
            }
        }

        page.view = {
            
        }

    });
};



