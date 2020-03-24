$.fn.registerPage = function () {
    return $.pageController.getControl(this, function (page,$$) {
        //Import Services required
        page.userService = new UserService();
        page.companyService = new CompanyService();
        page.productAPI = new ProductAPI();
        page.priceplanAPI = new PricePlanAPI();
        page.instancesAPI = new InstancesAPI();
        page.companyAPI = new CompanyAPI();
        page.objectPermissionAPI = new ObjectPermissionAPI();
        page.companyproductAPI = new CompanyProductAPI();
        page.cloudIntegrationAPI = new CloudIntegrationAPI();
        page.groupAPI = new GroupAPI();
        page.UserGroupAPI = new UserGroupAPI();

        $("body").css("background-image", "url('/" + appConfig.root + "/login/view/register-page/images/reg_background.png')");

        page.events = {
            page_load: function () {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "prod_id in (6,7,8,9,26,27,28,29,30,31,37)",
                    sort_expression: ""
                }
                page.productAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    $$("ddlProducts").dataBind(data, "prod_id", "prod_name");
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: /*"plan_id=6 and "*/"prod_id=" + $$("ddlProducts").selectedValue(),
                        sort_expression: ""
                    }
                    //page.priceplanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    //    $$("ddlPricePlan").dataBind(data, "plan_id", "plan_type");
                    //});
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "prod_id=" + $$("ddlProducts").selectedValue() + " and shared_flag=1",
                        sort_expression: ""
                    }
                    page.instancesAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        $$("ddlInstances").dataBind(data, "instance_id", "instance_name");
                    });
                    $$("ddlProducts").selectionChange(function (item) {
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "prod_id=" + $$("ddlProducts").selectedValue(),
                            sort_expression: ""
                        }
                        //page.priceplanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        //    $$("ddlPricePlan").dataBind(data, "plan_id", "plan_type");
                        //});
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "prod_id=" + $$("ddlProducts").selectedValue() + " and shared_flag=1",
                            sort_expression: ""
                        }
                        page.instancesAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            $$("ddlInstances").dataBind(data, "instance_id", "instance_name");
                        });
                    });
                });

                var load_data = [{ prod_id: "1", prod_name: "GENERAL", basic_plan: "1" }, { prod_id: "2", prod_name: "SUPER MARKET", basic_plan: "1" }, { prod_id: "3", prod_name: "TEXTILES", basic_plan: "1" }, { prod_id: "4", prod_name: "PHARMACY", basic_plan: "1" }, { prod_id: "5", prod_name: "RESTAURANT", basic_plan: "1" },
                    { prod_id: "6", prod_name: "SUBSCRIPTION SERVICES", basic_plan: "2" }, { prod_id: "7", prod_name: "FURNITURE", basic_plan: "1" }, { prod_id: "8", prod_name: "ELECTONICS", basic_plan: "1" },
                { prod_id: "9", prod_name: "RENTAL SERVICES", basic_plan: "1" }, ];//{ prod_id: "5", prod_name: "EMI" }, { prod_id: "3", prod_name: "HARDWARES" },
                //{ prod_id: "6", prod_name: "AGENCY" },
                //  { prod_id: "9", prod_name: "EGG SHOP" },
                //{ prod_id: "10", prod_name: "GAS" }, { prod_id: "12", prod_name: "BACKERY" }
                $$("ddlIndustry").dataBind(load_data, "prod_id", "prod_name");
                var plan_data = [{ plan_id: "1", plan_name: "Mini" }, { plan_id: "2", plan_name: "Basic" }, { plan_id: "3", plan_name: "Basic +" }, { plan_id: "4", plan_name: "Standard" }];//, { plan_id: "5", plan_name: "Standard +" }
                $$("ddlPricePlan").dataBind(plan_data, "plan_id", "plan_name");
                $$("ddlIndustry").selectionChange(function () {
                    var replan_data = [];
                    $(plan_data).each(function (i, item) {
                        if (parseInt(item.plan_id) >= parseInt($$("ddlIndustry").selectedData().basic_plan)) {
                            replan_data.push(item);
                        }
                    });
                    $$("ddlPricePlan").dataBind(replan_data, "plan_id", "plan_name");
                })
            }
        }
        page.events.btnRegister_click = function () {
            try {
                //if (!ValidateUserName($$("txtFullName").value())) {
                //    $$("txtFullName").focus();
                //    throw "Full Name Is Not Valid";
                //}
                //if (!ValidateDomainName($$("txtUserName").value())) {
                //    $$("txtUserName").focus();
                //    throw "Domain Name Is Not Valid";
                //}
                if (!ValidateEmail($$("txtEmailId").value())) {
                    $$("txtEmailId").focus();
                    throw "Email Id Is Not Valid";
                }
                if (!ValidateMobileNo($$("txtPhoneNo").value())) {
                    $$("txtPhoneNo").focus();
                    throw "Mobile No Is Not Valid";
                }
                if ($$("txtPassword").value() != $$("txtConfirmPassword").value()) {
                    $$("txtPassword").focus();
                    throw "Password Did Not Matched";
                }
                //if (!ValidateUserName($$("txtCompanyName").value())) {
                //    $$("txtCompanyName").focus();
                //    throw "Company Name Is Not Valid";
                //}
                //if (!ValidateUserName($$("txtProductName").value())) {
                //    $$("txtProductName").focus();
                //    throw "Product Name Is Not Valid";
                //}
                //if (!ValidateGSTNo($$("txtGstNo").value())) {
                //    $$("txtGstNo").focus();
                //    throw "GST No Is Not Valid";
                //}
                //if ($$("txtAddressLine1").value() == "") {
                //    $$("txtAddressLine1").focus();
                //    throw "Address Line1 Is Not Valid";
                //}
                //if ($$("txtAddressLine2").value() == "") {
                //    $$("txtAddressLine2").focus();
                //    throw "Address Line2 Is Not Valid";
                //}
                var registerData = {
                    full_name: page.controls.txtFullName.value(),
                    comp_name: page.controls.txtProductName.value(),
                    user_name: page.controls.txtUserName.value(),
                    email_id: page.controls.txtEmailId.value(),
                    phone_no: page.controls.txtPhoneNo.value(),
                    password: page.controls.txtPassword.value(),
                };
                page.companyAPI.postValue(registerData, function (comp_data) {
                    //shopON
                    var user_id = comp_data[0].user_id;
                    var data = {
                        comp_id: comp_data[0].comp_id,
                        prod_id: $$("ddlProducts").selectedValue(),
                        comp_prod_name: page.controls.txtProductName.value(),
                        instance_id: $$("ddlInstances").selectedValue(),
                        price_plan_id: $$("ddlPricePlan").selectedValue(),
                        industry_id: $$("ddlIndustry").selectedValue(),
                    };
                    page.companyproductAPI.postValue(data, function (data) {
                        var comp_prod_id = data[0].i_comp_prod_id
                        page.instancesAPI.getValue($$("ddlInstances").selectedValue(), function (ins_data) {
                            ins_data[0].server = "localhost:8080";
                            ins_data[0].service3 = "AvalonFinFactsRestAPI";
                            ins_data[0].service1 = "AvalonRestAPI";
                            ins_data[0].service2 = "AvalonCloudRestAPI";

                            var finfacts_data = {
                                comp_name: page.controls.txtProductName.val(),
                                user_id: comp_prod_id
                            }
                            page.cloudIntegrationAPI.postValueWithURL(ins_data[0].server + "//" + ins_data[0].service3, finfacts_data, function (fin_data) {
                                var shopon_data = {
                                    comp_name: page.controls.txtProductName.val(),
                                    user_id: comp_prod_id,
                                    finfacts_comp_id: fin_data[0].comp_id,
                                    finfacts_per_id: fin_data[0].comp_per_id,
                                    comp_prod_id: comp_prod_id,
                                    comp_prod_name: $$("ddlIndustry").selectedData().prod_name,
                                    price_plan_id: $$("ddlPricePlan").selectedValue(),//check it
                                    store_name: page.controls.txtCompanyName.val()
                                }
                                page.cloudIntegrationAPI.postValueWithURL(ins_data[0].server + "//" + ins_data[0].service1, shopon_data, function (store) {
                                    if (store.length > 0) {
                                        var Comp_Store = {
                                            perm_id: 1,
                                            obj_type: "Product::CompProd::Store",
                                            obj_id: $$("ddlProducts").selectedValue() + "::" + comp_prod_id + "::" + store[0].store_id,
                                            user_id: user_id,
                                        }
                                        page.objectPermissionAPI.postValue(Comp_Store, function (Object) {
                                            var data = {
                                                start_record: 0,
                                                end_record: "",
                                                filter_expression: "gt.prod_id=" + $$("ddlProducts").selectedValue() + " and gt.group_name like 'Admin%'",
                                                sort_expression: "",
                                            }
                                            page.groupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (group_data) {
                                                var member = {
                                                    user_id: user_id,
                                                    comp_prod_id: comp_prod_id,
                                                    group_id: group_data[0].group_id,
                                                };
                                                page.UserGroupAPI.postValue(member, function (data) {
                                                    //eShopOn Purchase and configure
                                                    var data = {
                                                        comp_id: comp_data[0].comp_id,
                                                        prod_id: 35,//eShopOn product id
                                                        comp_prod_name: page.controls.txtProductName.value(),
                                                        instance_id: 37,//eShopOn instance id
                                                        price_plan_id: 116,//eShopOn price plan id
                                                    };
                                                    page.companyproductAPI.postValue(data, function (data) {
                                                        var comp_prod_id = data[0].i_comp_prod_id
                                                        page.instancesAPI.getValue(37, function (ins_data) {
                                                            var finfacts_data = {
                                                                comp_name: page.controls.txtProductName.val(),
                                                                user_id: comp_prod_id
                                                            }
                                                            page.cloudIntegrationAPI.postValueWithURL(ins_data[0].server + "//" + ins_data[0].service3, finfacts_data, function (fin_data) {
                                                                var shopon_data = {
                                                                    comp_name: page.controls.txtCompanyName.val(),
                                                                    user_id: comp_prod_id,
                                                                    finfacts_comp_id: fin_data[0].comp_id,
                                                                    finfacts_per_id: fin_data[0].comp_per_id,
                                                                    comp_prod_id: comp_prod_id,
                                                                    comp_prod_name: "E-SHOPON",
                                                                    price_plan_id: 116,//eShopOn price plan id
                                                                }
                                                                page.cloudIntegrationAPI.postValueWithURL(ins_data[0].server + "//" + ins_data[0].service1, shopon_data, function (store) {
                                                                    if (store.length > 0) {
                                                                        var Comp_Store = {
                                                                            perm_id: 1,
                                                                            obj_type: "Product::CompProd::Store",
                                                                            obj_id: "35::" + comp_prod_id + "::" + store[0].store_id,
                                                                            user_id: user_id,
                                                                        }
                                                                        page.objectPermissionAPI.postValue(Comp_Store, function (Object) {
                                                                            var data = {
                                                                                start_record: 0,
                                                                                end_record: "",
                                                                                filter_expression: "gt.prod_id=35 and gt.group_name like 'Admin%'",
                                                                                sort_expression: "",
                                                                            }
                                                                            page.groupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (group_data) {
                                                                                var member = {
                                                                                    user_id: user_id,
                                                                                    comp_prod_id: comp_prod_id,
                                                                                    group_id: group_data[0].group_id,
                                                                                };
                                                                                page.UserGroupAPI.postValue(member, function (data) {
                                                                                    //alert("Thank You For Register, Your Register Id :" + user_id);
                                                                                    alert("Thank you for registering ShopOn. Please use your admin user id " + user_id + " to login and manage ShopOn.");
                                                                                    window.location.href = "/" + appConfig.root + "/login/view/login-page/login-page.html";
                                                                                });
                                                                            });
                                                                        });
                                                                    }
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    }
                                });
                            });
                        });
                    });
                }, function () {
                    alert("This Email Id or Phone No Is Already Registered.");
                });
            } catch (e) {
                alert(e);
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
            window.location.href = "/" + appConfig.root + "/login/view/login-page/login-page.html";
        }

    });



}
