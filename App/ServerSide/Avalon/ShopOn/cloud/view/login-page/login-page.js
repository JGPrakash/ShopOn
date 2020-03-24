$.fn.loginPage = function () {
    return $.pageController.getControl(this, function (page) {
        //Import Services required
        page.tokenAPI = new TokenAPI();
        page.userAPI = new UserAPI();
        $("body").css("background-image", "url('/" + appConfig.root + "/cloud/view/login-page/images/home-background.jpg')");
        $("body").css("height", "100%");
        $("body").css("background-position", "center");
        $("body").css("background-repeat", "no-repeat");
        $("body").css("background-size", "cover");
        page.events = {
            btnSignInBack_click: function () {
                $("#forgetpwd-panel").hide();
                $("#login-panel").show();
                page.controls.txtUserId.value("");
                page.controls.txtPassword.value("");
            },
            btnSignUp_click: function () {
                window.location.href = "/" + appConfig.root + "/cloud/view/sign-up/sign-up.html";
            },
            btnForgetPwdSubmit_click: function () {
                if (page.controls.txtEmailId.value() == "") {
                    alert("Enter Your Email ID...!");
                    page.controls.txtEmailId.focus();
                }
                else if (page.controls.txtEmailId.value() != "" && !ValidateEmail(page.controls.txtEmailId.value())) {
                    $$("msgPanel").show("Email address is not valid...!");
                    page.controls.txtEmailId.focus();
                }
                else {
                    var userData = {
                        email_id: page.controls.txtEmailId.value(),
                    }
                    page.userAPI.checkEmail(userData, function (data) {
                        $(data).each(function (i, item) {
                            var accountInfo =
                                {
                                    "appName": "WoToCloud",
                                    "companyId": "1",
                                    "clientAddress": "Working Together Technology Services Pvt Ltd, 78/3 North Car Street, \nTiruchendur-628215. ",
                                    "customerNumber": item.user_id,
                                    //"1111",
                                    "customerName": item.user_name,
                                    //"Sundar",
                                    "planName": "User",
                                    //"Gold Reward Plan",
                                    "totalRewardPoint": "5",
                                    //"2300",
                                    "subject": "Forget Password",
                                    //"Special Customer of Shopon",
                                    "message": "Hello " + item.user_name + "! your password details are : \n Current Password is : " + item.password,
                                    "emailAddressList": [item.email_id],
                                    //["sam.info85@gmail.com"],
                                    //["immanuvel.kalaiarasan@gmail.com"],
                                    //["sundaralingam48@gmail.com", "wototech@outlook.com", "balumanoj85@gmail.com", "ram.vegeta@gmail.com", "sam.info85@gmail.com"]
                                };

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
                                    //$(".detail-info").progressBar("hide");
                                    //$$("msgPanel").flash("E-mail sent successfully...!");
                                    alert("E-mail sent successfully...!");
                                    $("#forgetpwd-panel").hide();
                                    $("#login-panel").show();
                                    page.controls.txtUserId.value(accountInfo.emailAddressList[0]);
                                    //page.controls.txtUserId.value(page.controls.txtEmailId.value());
                                    page.controls.txtEmailId.value("");
                                    page.controls.txtPassword.value("");
                                    page.controls.txtPassword.focus();
                                },
                                error: function (request, status, error) {
                                    console.log(request.responseText);
                                    //$(".detail-info").progressBar("hide");
                                    alert("E-mail sent failed...");
                                    //$$("msgPanel").show("E-mail sent failed...");
                                }
                            });
                        });
                    });
                }
            },
            btnForgetPwd_click:function () {
                $("#login-panel").hide();
                $("#forgetpwd-panel").show();
                page.controls.txtEmailId.value("");
            },
            btnLogin_click: function () {
                var userData = {
                    email_id: page.controls.txtUserId.value(),
                    password: page.controls.txtPassword.value(),
                    scope: "shopon"
                };
                if (userData.email_id == "") {
                    alert("Enter Your Email ID...!");
                    page.controls.txtUserId.focus();
                }
                else if (userData.password == "") {
                    alert("Enter Your Password...!");
                    page.controls.txtPassword.focus();
                }
                else if (userData.email_id != "" && !ValidateEmail(userData.email_id)) {
                    alert("Email address is not valid...!");
                    page.controls.txtUserId.focus();
                }
                else {
                    page.tokenAPI.postValue(userData, function (data) {
                        if (data[0].email_id == page.controls.txtUserId.value()) {
                            document.cookie = "auth_token=" + data[0].auth_token + ";path=/";
                            document.cookie = "admin_data=" + JSON.stringify(data) + ";path=/";
                            localStorage.setItem("app_user_id", data[0].user_id);
                            window.location.href = "/" + appConfig.root + "/cloud/view/home-page/home-page.html";
                        }
                        else {
                            alert("Invalid username or password!");
                        }
                    }, function () {
                        alert("Invalid username or password!");
                    }
                    );
                }
            },
            page_load: function () {
                $("#forgetpwd-panel").hide();
            }
        }

    });



}
