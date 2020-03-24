$.fn.customerSignInPage = function () {
    return $.pageController.getPage(this, function (page,$$) {
        //Import Services required
        page.companyAPI = new CompanyAPI();
        page.tokenAPI = new TokenAPI();
        page.events = {
            btnBack_click: function(){
                page.controls.pnlSignUp.show();
                //page.controls.pnlSignIn.hide();
            },
            btnSignIn_click: function(){
                //page.controls.pnlSignUp.hide();
                //page.controls.pnlSignIn.show();
                window.location.href = "/" + appConfig.root + "/cloud/view/login-page/login-page.html";
            },
            btnLogin_click: function () {
                var userData = {
                    user_id: page.controls.txtloginUserName.val(),
                    password: page.controls.txtloginPwd.val(),
                    scope: "shopon"
                };
                page.companyAPI.postValue(userData, function (data) {
                    try{
                    document.cookie = "auth_token=" + data[0].auth_token;
                    document.cookie = "user_data=" + JSON.stringify(data);
                    window.location.href = "/" + appConfig.root + "/customer/view/customer/customer.html";
                    }
                    catch (e) {
                        $$("msgPanel").show(e);
                    }
                }
                );
            },
            btnSignUp_click: function () {
                try{
                    if (page.controls.txtFullName.val() == "") {
                        $$("txtFullName").focus();
                        throw "Full name is mandatory ...!";
                    }
                    if (page.controls.txtCompanyName.val() == "") {
                        $$("txtCompanyName").focus();
                        throw "Company name is mandatory ...!";
                    }
                    if (page.controls.txtUserName.val() == "") {
                        $$("txtUserName").focus();
                        throw "User name is mandatory ...!";
                    }
                    if (page.controls.txtEmailId.val() == "") {
                        $$("txtEmailId").focus();
                        throw "Email ID is mandatory ...!";
                    }
                    if (page.controls.txtEmailId.val() != "" && !ValidateEmail(page.controls.txtEmailId.val())) {
                        $$("txtEmailId").focus().select();
                        throw "Check your e-mail ID...!";
                    }
                    if (page.controls.txtMobileNo.val() == "") {
                        $$("txtMobileNo").focus();
                        throw "Mobile No is mandatory ...!";
                    }
                    else if (page.controls.txtMobileNo.val() != "" && !isInt(page.controls.txtMobileNo.val())) {
                        $$("txtMobileNo").focus();
                        throw "Mobile No should only contain numbers ...!";
                    }
                    else if (page.controls.txtMobileNo.val() != "" && page.controls.txtMobileNo.val().length < 10) {
                        $$("txtMobileNo").focus();
                        throw "Mobile No should be 10 in length...!";
                    }
                    else if (page.controls.txtPwd.val() == "") {
                        $$("txtPwd").focus();
                        throw "Password is mandatory ...!";
                    }
                    else if (page.controls.txtConfirmPwd.val() == "") {
                        $$("txtConfirmPwd").focus();
                        throw "Confirm Password is mandatory ...!";
                    }
                    //else if (!ValidateEmail(page.controls.txtEmailId.val())) {
                    //    page.controls.txtEmailId.focus().select();
                    //    throw ("Check your e-mail ID...!");
                    //}
                    else if (page.controls.txtPwd.val() != page.controls.txtConfirmPwd.val()) {
                        page.controls.txtPwd.focus().select();
                        throw ("Password did not match...!");
                    }
                    else {
                        var registerData = {
                            full_name: page.controls.txtFullName.val(),
                            comp_name: page.controls.txtCompanyName.val(),
                            user_name: page.controls.txtUserName.val(),
                            email_id: page.controls.txtEmailId.val(),
                            phone_no :page.controls.txtMobileNo.val(),
                            password: page.controls.txtPwd.val(),
                        };
                        page.sms_user_name = page.controls.txtFullName.val();
                        page.sms_email_id = page.controls.txtEmailId.val();
                        page.sms_phone_no = page.controls.txtMobileNo.val();
                        page.sms_password = page.controls.txtPwd.val();
                        page.companyAPI.postValue(registerData, function (data) {
                            //window.location.href = "/ShopOn/login/view/login-page/login-page.html";  
                            page.sms_user_id = data[0].user_id;
                            if (data.length != 0) {
                                page.sendSMSSignUp(function () {
                                    page.sendEmailSignUp(function () {
                                        page.controls.pnlSignUp.hide();
                                        //page.controls.pnlSignIn.show();
                                        $$("msgPanel").show("Registered Successfully...!");
                                        var userData = {
                                            email_id: page.controls.txtEmailId.val(),
                                            password: page.controls.txtPwd.val(),
                                            scope: "shopon"
                                        };
                                        page.tokenAPI.postValue(userData, function (data) {
                                            if (data.length != 0) {
                                                $$("msgPanel").hide();
                                                if (data[0].email_id == page.controls.txtEmailId.val()) {
                                                    document.cookie = "auth_token=" + data[0].auth_token + ";path=/";
                                                    document.cookie = "admin_data=" + JSON.stringify(data) + ";path=/";
                                                    window.location.href = "/" + appConfig.root + "/cloud/view/home-page/home-page.html";
                                                }
                                            }
                                            else {
                                                alert("Invalid username or password!");
                                            }

                                        }, function (data2) {
                                            if (data2.responseJSON.message != "" || data2.responseJSON.message != undefined || data2.responseJSON.message != null) {
                                                alert(data2.responseJSON.message);
                                            }

                                            else {
                                                alert("Unable to create Company...!");
                                            }
                                        }
                                        )
                                    });
                                });
                            }
                        }, function (data1) {
                            //if (data1.responseJSON.message != "" || data1.responseJSON.message != undefined || data1.responseJSON.message != null) {
                            //    alert(data1.responseJSON.message);
                            //}
                            if(data1.responseJSON.message=="Duplicate entry '"+page.controls.txtMobileNo.val()+"' for key 'phone_no_UNIQUE'"){
                                    alert("Mobile No is already Exists");
                                    page.controls.txtMobileNo.focus();
                                }
                            else if(data1.responseJSON.message=="Duplicate entry '"+page.controls.txtEmailId.val()+"' for key 'email_id_UNIQUE'"){
                                    alert("Email ID is already Exists");
                                    page.controls.txtEmailId.focus();
                                }
                            else {
                                alert("Company name is already exists...!");
                            }
                        });
                    }
                }
                catch (e) {
                    //$$("msgPanel").show(e);
                    ShowDialogBox('Warning', e, 'Ok', 'Cancel', null);
                }
            },
            page_load: function () {
                $("#left-side").css("background-image", "url('/" + appConfig.root + "/login/view/sign-up/images/reg_background.jpg')");
                $("#left-side").height($(window).height());
                if (window.mobile) {
                    $("#left-side").hide();
                }

                $('#login').click(function () {
                    window.location.href = "/" + appConfig.root + "/login/view/login-page/login-page.html";
                })
            }
        }
        page.sendEmailSignUp = function (callback) {
            try {
                if (page.sms_email_id != "") {
                    var accountInfo =
                    {
                        "appName": "WoToCloud",
                        "companyId": "1",
                        "clientAddress": "-",
                        "customerNumber": page.sms_user_id,
                        "customerName": page.sms_user_name,
                        "planName": "User",
                        "totalRewardPoint": "-",
                        "subject": "WoTo Cloud Registration",
                        "emailAddressList": [page.sms_email_id],
                        //["sam.info85@gmail.com"],
                        //["immanuvel.kalaiarasan@gmail.com"],
                        //["sundaralingam48@gmail.com", "wototech@outlook.com", "balumanoj85@gmail.com", "ram.vegeta@gmail.com", "sam.info85@gmail.com"]
                    };
                    accountInfo.message = "Dear " + page.sms_user_name + "(User ID-" + page.sms_user_id + "). Your account has registered successfully " + "\n" + " Your Registered Email ID is " + page.sms_email_id + " and Password is " + page.sms_password + "." + "\n" + "Thank You." + "\n" + "Regards, WOTOTECH";
                    var accountInfoJson = JSON.stringify(accountInfo);
                    $.ajax({
                        type: "POST",
                        url: "http://104.251.218.116:8080/woto-utility-rest/rest/sendEmail/promotion-email",
                        //url: CONTEXT.ENABLE_EMAIL_URL,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        crossDomain: false,
                        data: JSON.stringify(accountInfo),
                        dataType: 'json',
                        success: function (responseData, status, xhr) {
                            console.log(responseData);
                            $$("msgPanel").flash("E-mail Sent to User Successfully...");
                            if (callback != undefined)
                                callback();
                        },
                        error: function (request, status, error) {
                            console.log(request.responseText);
                            $$("msgPanel").flash("E-mail to User Sent Failed...");
                            if (callback != undefined)
                                callback();
                        }
                    });
                }
                else {
                    $$("msgPanel").flash("Email Sent Failed Email ID is Empty...");
                    if (callback != undefined)
                        callback();
                }
            } catch (e) {
                alert(e);
                if (callback != undefined)
                    callback();
            }
        }
        page.sendSMSSignUp = function (callback) {
            try {
                if (page.sms_phone_no != "") {
                    var accountInfo =
                    {
                        "appName": "WoToCloud",
                        "senderNumber": "WT-WOTOLT",
                        "companyId": "WT-WOTOLTD",
                        "receiverNumber": "+91" + page.sms_phone_no,
                        /*"91+" + "9442733772"*/
                        //"+919486342575"
                        //"9003300929",//9894692492
                    };
                    accountInfo.message = "Dear " + page.sms_user_name + "(User ID-" + page.sms_user_id + "). Your account has registered successfully " + "\n" + " Your Registered Email ID is " + page.sms_email_id + " and Password is " + page.sms_password + "." + "\n" + "Thank You." + "\n" + "Regards, WOTOTECH";
                    var accountInfoJson = JSON.stringify(accountInfo);
                    $.ajax({
                        type: "POST",
                        //url: CONTEXT.ENABLE_SMS_URL,
                        url: "http://104.251.218.116:8080/woto-utility-rest/rest/sendSMS/text-message",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        crossDomain: false,
                        data: JSON.stringify(accountInfo),
                        dataType: 'json',
                        success: function (responseData, status, xhr) {
                            console.log(responseData);
                            $$("msgPanel").flash("SMS Sent to User Successfully...");
                            if (callback != undefined)
                                callback();
                        },
                        error: function (request, status, error) {
                            console.log(request.responseText);
                            $$("msgPanel").flash("SMS to User Sent Failed...");
                            if (callback != undefined)
                                callback();
                        }
                    });
                }
                else {
                    $$("msgPanel").flash("SMS Sent Failed Phone Number is Empty...");
                    if (callback != undefined)
                        callback();
                }
            } catch (e) {
                alert(e);
                if (callback != undefined)
                    callback();
            }
        }
    });
}
