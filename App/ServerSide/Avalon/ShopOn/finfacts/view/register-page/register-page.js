$.fn.finfactsRegisterPage = function () {
    return $.pageController.getControl(this, function (page,$$) {
        //Import Services required
        page.userService = new UserService();
        page.companyService = new CompanyService();
        page.businessService = new BusinessService();

        $("body").css("background-image", "url('/" + appConfig.root + "/finfacts/view/register-page/images/reg_background.jpg')");
        document.title = "ShopOn - Register Page";
        page.events = {
            page_load: function () {
                page.businessService.getBusiness(function (data) {
                    $$("ddlBusiness").dataBind(data, "bus_id", "bus_name", "Select your business");
                })
            }
        }
        page.events.btnRegister_click = function () {
            try {
                var count = 0;
                page.companyService.getCompany(function (data) {
                    $(data).each(function (i, item) {
                        if (item.email == $$("txtEmail").val()) {
                            if (count == 0) {
                                $$("msgPanel").show("Sorry this email already used");
                                count++;
                            }
                            //throw "Sorry this email already used"
                        }
                    });
                    var regis_data = {
                        user_name: $$("txtName").val(),
                        password: $$("Password").val(),
                        full_name: $$("txtName").val(),
                        group_name: "finfacts",
                        comp_name: $$("txtCompanyName").val(),
                        obj_type: "Finfacts.Company",
                        perm_id: "1",
                        obj_type: "Finfacts.Company",
                        user_type: "User",
                        start_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                        group_id: "1",
                        phone_no: $$("txtPhone").val(),
                        email: $$("txtEmail").val(),
                        bus_id: $$("ddlBusiness").selectedValue()
                    }
                    if ($$("ddlBusiness").selectedValue() == "-1") {
                        $$("msgPanel").show("Please select your business");
                    }
                    else if ($$("txtPhone").val().length != 10 || isNaN($$("txtPhone").val())) {
                        $$("msgPanel").show("Mobile number should be integer and length is 10");
                        $$("txtPhone").focus();
                    }
                    else if ($$("txtEmail").val() == "" || $$("txtEmail").val() == null || $$("txtEmail").val() == undefined) {
                        $$("msgPanel").show("Email Id not provided");
                        $$("txtEmail").focus();
                    }
                    else if ($$("txtName").val() == "" || $$("txtName").val() == null || $$("txtName").val() == undefined) {
                        $$("msgPanel").show("Name not provided");
                        $$("txtName").focus();
                    }
                    else if ($$("txtCompanyName").val() == "" || $$("txtCompanyName").val() == null || $$("txtCompanyName").val() == undefined) {
                        $$("msgPanel").show("Company name not provided");
                        $$("txtCompanyName").focus();
                    }
                    else if ($$("Password").val() == "" || $$("Password").val() == null || $$("Password").val() == undefined) {
                        $$("msgPanel").show("Password not provided");
                        $$("Password").focus();
                    }
                    else {
                        if(count == 0)
                        page.userService.getMaxUserDetails(function (data) {
                            regis_data.user_id = data[0].user_id == null ? 1 : data[0].user_id;
                            regis_data.obj_id = data[0].user_id;
                            page.userService.insertUserDetails(regis_data, data[0].user_id, function (user_data) {
                                page.userService.insertUserGroupDetails(regis_data, function (grpdata) {
                                    page.companyService.insertCompany(regis_data, function (compdata) {
                                        page.userService.getMaxObjectDetails(function (objData) {
                                            regis_data.id = objData[0].id == null ? 1 : objData[0].id;
                                            page.userService.insertObjectDetails(regis_data, objData[0].id, function (objdata) {
                                                page.userService.getMaxObjectPermDetails(function (maxObjPerdata) {
                                                    regis_data.obj_perm_id = maxObjPerdata[0].obj_perm_id == null ? 1 : maxObjPerdata[0].obj_perm_id;
                                                    page.userService.insertObjectPermissionDetails(regis_data, maxObjPerdata[0].obj_perm_id, function (data) {
                                                        page.userService.insertShopOnCompany(regis_data, function (sdata) {
                                                            var comp_user = {
                                                                comp_id: sdata[0].key_value,
                                                                user_id:regis_data.user_id
                                                            }
                                                            page.userService.insertCompUser(comp_user, function (cudata) {
                                                                $$("msgPanel").show("Register Successfully Your ID: " + regis_data.user_id + "");
                                                                page.events.btnNew_click();
                                                                $$("txtCompanyName").focus();
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    }
                });
            }catch (e) {
                alert(e)
            }
        }
        page.events.btnNew_click = function () {
            $$("txtName").val('');
            $$("Password").val('');
            $$("txtName").val('');
            $$("txtCompanyName").val('');
            $$("txtPhone").val('');
            $$("txtEmail").val('');
            $$("ddlBusiness").selectedValue("-1");
        }
        page.events.btnBack_click = function () {
            window.location.href = "/" + appConfig.root + "/login/view/home-page/home-page.html";
        }

    });



}
