/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.forgetPasswordPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.userAPI = new UserAPI();
        page.tokenAPI = new TokenAPI();
        page.customerAPI = new CustomerAPI();
        page.url = {};
        page.selectedBill = {};
        page.events = {
            page_load: function () {
                $(".footer").html(footerTemplate.join(""));
            },
            btnSignIn_click: function () {
                if (localStorage.getItem("forget-type") == "business") {
                    window.location.href = '../pages/business-signin.html';
                }
                else {
                    window.location.href = '../pages/signin.html';
                }
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
                page.events.btnSignIn_click();
            },
            btnGetPassword_click: function () {
                try{
                    if (!ValidateMobileNo($$("txtUserId").value())) {
                        throw "Mobile Number Is Not Valid...!!!";
                    }
                    var default_branch = "101";
                    if (localStorage.getItem("forget-type") == "business") {
                        default_branch = "103";
                    }
                    page.userAPI.searchValues("", "", "phone_no = '" + $$("txtUserId").value() + "' and default_branch = '" + default_branch + "'", "", function (data) {
                        if (data.length == 0) {
                            page.events.btnOpenAlert_click("This Mobile Number Is Not Registered...!!!");
                        }
                        else {
                            page.events.getPassword_click(function (data) {
                                page.controls.pnlSuccess.open();
                                page.controls.pnlSuccess.title("Message");
                                page.controls.pnlSuccess.width(500);
                                page.controls.pnlSuccess.height(250);
                            });
                        }
                    });
                }
                catch (e) {
                    page.events.btnOpenAlert_click(e);
                }
            },
            getPassword_click: function (callback) {
                var otpData = {
                    mobile_no: page.controls.txtUserId.val(),
                    default_branch: localStorage.getItem("forget-type")
                }
                page.tokenAPI.getPassword(otpData, function (data) {
                    if (typeof callback != "undefined")
                        callback(data);
                });

                //if (typeof callback != "undefined")
                //    callback([]);
            },
        }

        page.view = {
            
        }

    });
};



