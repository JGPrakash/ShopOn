/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.businessSignUpPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.userAPI = new UserAPI();
        page.shopKeeperAPI = new ShopKeeperAPI();
        page.tokenAPI = new TokenAPI();
        page.url = {};
        page.selectedBill = {};
        page.events = {
            page_load: function () {
                $(".footer").html(footerTemplate.join(""));
                localStorage.setItem("business_user_id", "");
            },
            btnShowPassword_click: function () {
                $$("txtPassword").selectedObject.attr("type", "text");
                $$("txtRetypePassword").selectedObject.attr("type", "text");
                $$("btnShowPassword").hide();
                $$("btnHidePassword").show();
            },
            btnHidePassword_click: function () {
                $$("txtPassword").selectedObject.attr("type", "password");
                $$("txtRetypePassword").selectedObject.attr("type", "password");
                $$("btnShowPassword").show();
                $$("btnHidePassword").hide();
            },
            btnSendOTP_click: function () {
                try {
                    if ($$("txtUserName").value() == "" || $$("txtUserName").value() == null || typeof $$("txtUserName").value() == "undefined") {
                        throw "User Name Is Not Valid...!!!";
                    }
                    if ($$("txtShopName").value() == "" || $$("txtShopName").value() == null || typeof $$("txtShopName").value() == "undefined") {
                        throw "Shop Name Is Not Valid...!!!";
                    }
                    if (!ValidateMobileNo($$("txtMobileNo").value())) {
                        throw "Mobile Number Is Not Valid...!!!";
                    }
                    if (!ValidateEmail($$("txtEmailId").value())) {
                        throw "Email Id Is Not Valid...!!!";
                    }
                    if (!ValidateGSTNo($$("txtGstNo").value())) {
                        throw "GST Number Is Not Valid...!!!";
                    }
                    if ($$("txtAddress").value() == "" || $$("txtAddress").value() == null || typeof $$("txtAddress").value() == "undefined") {
                        throw "Address Is Not Valid...!!!";
                    }
                    if ($$("txtPassword").value() == "" || $$("txtPassword").value() == null || typeof $$("txtPassword").value() == "undefined") {
                        throw "Password Is Not Valid...!!!";
                    }
                    if ($$("txtPassword").value() != $$("txtRetypePassword").value()) {
                        throw "Password Didn't Match...!!!";
                    }
                    page.userAPI.searchValues("", "", "phone_no = '" + $$("txtMobileNo").value() + "' and default_branch in (102,103)", "", function (data) {
                        if (data.length > 0) {
                            page.events.btnOpenAlert_click("This Mobile Number Is Already Present...!!!");
                        }
                        else {
                            page.userAPI.searchValues("", "", "email_id = '" + $$("txtEmailId").value() + "' and default_branch in (102,103)", "", function (data) {
                                if (data.length > 0) {
                                    page.events.btnOpenAlert_click("This Email Id Is Already Present...!!!");
                                }
                                else {
                                    page.events.sendOTP_click(function (data) {
                                        page.controls.pnlOTPVerification.open();
                                        page.controls.pnlOTPVerification.title("OTP Verification");
                                        page.controls.pnlOTPVerification.width(600);
                                        page.controls.pnlOTPVerification.height(350);
                                    });
                                }
                            })
                        };
                    });
                }
                catch (e) {
                    page.events.btnOpenAlert_click(e);
                }
            },
            sendOTP_click:function(callback){
                //var otpData = {
                //    mobile_no: page.controls.txtMobileNo.val()
                //}
                //page.tokenAPI.getOTP(otpData, function (data) {
                //    if (typeof callback != "undefined")
                //        callback(data);
                //});
                
                if (typeof callback != "undefined")
                    callback([]);
            },
            btnCheckOTP_click: function () {
                var otpData = {
                    mobile_no: page.controls.txtMobileNo.val(),
                    otp: $$("txtOTP").value()
                }
                page.tokenAPI.checkOTP(otpData, function (data) {
                    if (data.result == "success") {
                        page.events.btnSignUp_click();
                    }
                    else {
                        $$("lblAlertContent").html("OTP Is Not Valid");
                        page.controls.pnlAlert.open();
                        page.controls.pnlAlert.title("Message");
                        page.controls.pnlAlert.width(500);
                        page.controls.pnlAlert.height(200);
                    }
                });
            },
            btnSignUp_click: function () {
                try{
                    if ($$("txtUserName").value() == "" || $$("txtUserName").value() == null || typeof $$("txtUserName").value() == "undefined") {
                        throw "User Name Is Not Valid...!!!";
                    }
                    if ($$("txtShopName").value() == "" || $$("txtShopName").value() == null || typeof $$("txtShopName").value() == "undefined") {
                        throw "Shop Name Is Not Valid...!!!";
                    }
                    if (!ValidateMobileNo($$("txtMobileNo").value())) {
                        throw "Mobile Number Is Not Valid...!!!";
                    }
                    if (!ValidateEmail($$("txtEmailId").value())) {
                        throw "Email Id Is Not Valid...!!!";
                    }
                    if (!ValidateGSTNo($$("txtGstNo").value())) {
                        throw "GST Number Is Not Valid...!!!";
                    }
                    if ($$("txtAddress").value() == "" || $$("txtAddress").value() == null || typeof $$("txtAddress").value() == "undefined") {
                        throw "Address Is Not Valid...!!!";
                    }
                    if ($$("txtPassword").value() == "" || $$("txtPassword").value() == null || typeof $$("txtPassword").value() == "undefined") {
                        throw "Password Is Not Valid...!!!";
                    }
                    if ($$("txtPassword").value() != $$("txtRetypePassword").value()) {
                        throw "Password Didn't Match...!!!";
                    }
                    var data = {
                        comp_id: "6043",
                        email_id: $$("txtEmailId").value(),
                        user_name: $$("txtUserName").value(),
                        password: $$("txtPassword").value(),
                        phone_no: $$("txtMobileNo").value(),
                        default_branch:"102"
                    }
                    page.userAPI.insertUser(data, function (data) {
                        localStorage.setItem("business_user_id", data[0].user_id);
                        var cust_data = {
                            shopkeeper_name: $$("txtUserName").value(),
                            shop_name: $$("txtUserName").value(),
                            address: $$("txtAddress").value(),
                            gst_no: $$("txtGstNo").value(),
                            phone_no: $$("txtMobileNo").value(),
                            email: $$("txtEmailId").val(),
                            user_id: data[0].user_id,
                            comp_id:localStorage.getItem("user_company_id")
                        }
                        page.shopKeeperAPI.postValue(cust_data, function (data) {
                            page.controls.pnlSuccess.open();
                            page.controls.pnlSuccess.title("Message");
                            page.controls.pnlSuccess.width(500);
                            page.controls.pnlSuccess.height(400);
                        });
                    });
                }
                catch (e) {
                    $$("lblAlertContent").html(e);
                    page.controls.pnlAlert.open();
                    page.controls.pnlAlert.title("Message");
                    page.controls.pnlAlert.width(500);
                    page.controls.pnlAlert.height(200);
                }
            },
            btnSignIn_click:function(){
                window.location.href = './business-signin.html';
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
                window.location.href = './business-services.html';
            }
        }

        page.view = {
            
        }

    });
};


function ShopKeeperAPI() {
    var self = this;
    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        var url = "services/shopkeeper/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression + "&store_no=" + localStorage.getItem("user_store_no");
        $.server.webMethodGET(url, function (result, obj) {
            LCACHE.set(url, result);
            callback(result, obj);
        });
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("services/shopkeeper/", data, callback, errorCallback);
    }
}



