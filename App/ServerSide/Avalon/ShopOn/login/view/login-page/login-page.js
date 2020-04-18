$.fn.loginPage = function () {
    return $.pageController.getControl(this, function (page) {
        //Import Services required
        page.userService = new UserService();
        page.tokenAPI = new TokenAPI();
        page.companyproductAPI = new CompanyProductAPI();
        page.storeAPI = new StoreAPI();
        page.registerAPI = new RegisterAPI();
        page.instancesAPI = new InstancesAPI();
        page.userpermissionAPI = new UserPermissionAPI();
       
        $("body").css("background-image", "url('/" + appConfig.root + "/login/view/login-page/images/reg_background.jpg')");
        $("body").css("height", "100%");
        $("body").css("background-position", "center");
        $("body").css("background-repeat", "no-repeat");
        $("body").css("background-size", "cover");

        
        page.events = {
            btnLogin_click: function () {
                var userData;
                if (ValidateMobileNo(page.controls.txtUserId.value())) {
                    userData = {
                        phone_no: page.controls.txtUserId.value(),
                        password: page.controls.txtPassword.val(),
                        scope: "shopon",
                        default_branch:"105"
                    };
                }
                else if (ValidateEmail(page.controls.txtUserId.value())) {
                    userData = {
                        email_id: page.controls.txtUserId.value(),
                        password: page.controls.txtPassword.val(),
                        scope: "shopon",
                        default_branch: "105"
                    };
                }
                else if (isNaN(page.controls.txtUserId.value())) {
                    userData = {
                        user_name: page.controls.txtUserId.value(),
                        password: page.controls.txtPassword.val(),
                        scope: "shopon",
                        default_branch: "105"
                    };
                }
                else {
                    userData = {
                        user_id: page.controls.txtUserId.value(),
                        password: page.controls.txtPassword.val(),
                        scope: "shopon",
                        default_branch: "105"
                    };
                }
                page.tokenAPI.putValue(userData, function (data) {
                    //if (data[0].user_id == page.controls.txtUserId.value() || data[0].user_name == page.controls.txtUserId.value()) {
                    document.cookie = "auth_token=" + data[0].auth_token + ";path=/";
                    document.cookie = "admin_data=" + JSON.stringify(data) + ";path=/";
                    document.cookie = "app_user_id=" + data[0].user_id + ";path=/";
                    localStorage.setItem("comp_id", data[0].comp_id);
                    localStorage.setItem("app_user_id", data[0].user_id);
                    localStorage.setItem("user_comp_id", data[0].comp_prod_id);
                    localStorage.setItem("auth_token", data[0].auth_token);
                    localStorage.setItem("admin_data", JSON.stringify(data));
                    page.checkConfiguration(function (data) {
                        if (data) {
                            page.events.btnGetUserDetails_click();
                        }
                        else {
                            page.userService.getSettings(function (data) {
                                localStorage.setItem("company_settings", JSON.stringify(data));
                                var inputData = {
                                    obj_type: "Product::Privilege",
                                    obj_id: localStorage.getItem("prod_id"),
                                    comp_prod_id: localStorage.getItem("user_company_id")
                                };
                                page.userpermissionAPI.getValue(inputData, function (data) {
                                    localStorage.setItem("user_privilages", JSON.stringify(data));
                                    var inputData = {
                                        obj_type: "Product::Menu",
                                        obj_id: localStorage.getItem("prod_id"),
                                        comp_prod_id: localStorage.getItem("user_company_id")
                                    };
                                    page.userpermissionAPI.getValue(inputData, function (data) {
                                        localStorage.setItem("user_menu", JSON.stringify(data));
                                        page.userpermissionAPI.getPricePlanPrivilages({ start_record: "", end_record: "", filterExpression: " (cpt.comp_prod_id = " + localStorage.getItem("user_company_id") + " or ppat.comp_prod_id = " + localStorage.getItem("user_company_id") + ")", sort_expression: "" }, function (data) {
                                            localStorage.setItem("company_privilages", JSON.stringify(data));
                                            page.userService.getLicense(function (data) {
                                                localStorage.setItem("product_version", data.Version);
                                                window.location.href = "/" + appConfig.root + "/login/view/home-page/home-page.html";
                                            }, function (data) {
                                                localStorage.setItem("product_version", "Licensed");
                                            });
                                        });
                                        
                                    });
                                });
                            });
                        }
                    });
                    //}
                    //else {
                    //    alert("Invalid username or password!");
                    //}

                }, function () {
                    alert("Invalid username or password!");
                });
            },
            btnSignUp_click: function () {
                window.location.href = "/" + appConfig.root + "/login/view/register-page/register-page.html";
            },
            page_load: function () {
              
            }
        }
        page.events.btnGetUserDetails_click = function () {
            page.controls.pnlGetUserDetails.open();
            page.controls.pnlGetUserDetails.title("User Details Screen");
            page.controls.pnlGetUserDetails.width(340);
            page.controls.pnlGetUserDetails.height(300);
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "cpt.prod_id in (6,7,8,9,26,27,28,29,30,31,33,36,37)",
                sort_expression: ""
            }
            page.companyproductAPI.SearchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                page.controls.ddlCompanyName.dataBind(data, "comp_prod_id", "comp_prod_name", "Select");
                $("#ddlCompanyName").focus();
            });
            
            page.controls.ddlCompanyName.selectionChange(function () {
                localStorage.setItem("user_company_id", page.controls.ddlCompanyName.selectedValue());
                localStorage.setItem("prod_id", page.controls.ddlCompanyName.selectedData().prod_id);
                page.instancesAPI.getValue(page.controls.ddlCompanyName.selectedData().instance_id, function (ins_data) {
                    if (ins_data.length != 0) {
                        //window.instanceURL = ins_data[0].server;
                        //window.instanceShopOnDataService = ins_data[0].service6;
                        //window.instanceShopOnRestApi = ins_data[0].service1;
                        //window.instanceFinfactsRestApi = ins_data[0].service3;
                        //window.instanceeShopOnRestApi = ins_data[0].service7;
                        localStorage.setItem("instance_eshoponAPI", ins_data[0].service7);
                    }
                    var previlageData = {
                        obj_type: "Product::CompProd::Store",
                        obj_id: localStorage.getItem("prod_id"),
                        //comp_prod_id: localStorage.getItem("user_company_id")
                    };
                    page.userpermissionAPI.getValue(previlageData, function (store_data) {
                        var menu_ids = [];
                        $(store_data).each(function (i, item) {
                            item.obj_id = item.obj_id.split("::")[2];
                            menu_ids.push(item.obj_id);
                        });
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "store_no in ("+ menu_ids.join(",")+")",
                            sort_expression: ""
                        }
                        page.storeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            page.controls.ddlStoreName.dataBind(data, "store_no", "store_name", "Select");
                            localStorage.setItem("user_store_data", JSON.stringify(data));
                        });
                    });
                });
            });
            page.controls.ddlStoreName.selectionChange(function () {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "store_no=" + page.controls.ddlStoreName.selectedValue(),
                    sort_expression: ""
                }
                localStorage.setItem("user_store_no", page.controls.ddlStoreName.selectedValue());
                localStorage.setItem("temp_user_store_no", page.controls.ddlStoreName.selectedValue());
                localStorage.setItem("user_fulfillment_store_no", page.controls.ddlStoreName.selectedData().fulfillment_store.split(",")[0]);
                //localStorage.setItem("user_fulfillment_store_data", page.controls.ddlStoreName.selectedData().fulfillment_store);
                page.registerAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    page.controls.ddlRegister.dataBind(data, "reg_no", "reg_name");
                    localStorage.setItem("user_register_data", JSON.stringify(data));
                })
            });
        }
        page.events.btnConfirmDetails_click = function () {
            try {
                if (page.controls.ddlCompanyName.selectedValue() == "-1") {
                    throw "Company Name Is Not Selected";
                }
                if (page.controls.ddlStoreName.selectedValue() == "-1") {
                    throw "Store Name Is Not Selected";
                }
                if (page.controls.ddlRegister.selectedValue() == "-1") {
                    throw "Register Name Is Not Selected";
                }
                document.cookie = "user_company_id=" + page.controls.ddlCompanyName.selectedValue() + ";path=/";
                localStorage.setItem("prod_id", page.controls.ddlCompanyName.selectedData().prod_id);
                document.cookie = "user_store_id=" + page.controls.ddlStoreName.selectedValue() + ";path=/";
                document.cookie = "user_register_id=" + page.controls.ddlRegister.selectedValue() + ";path=/";
                localStorage.setItem("user_store_id", page.controls.ddlStoreName.selectedValue());
                localStorage.setItem("user_register_id", page.controls.ddlRegister.selectedValue());
                localStorage.setItem("user_store_name", page.controls.ddlStoreName.selectedData().store_name);
                localStorage.setItem("user_company_name", page.controls.ddlCompanyName.selectedData().comp_prod_name);
                localStorage.setItem("user_finfacts_comp_id", page.controls.ddlStoreName.selectedData().finfacts_company_id);
                localStorage.setItem("user_finfacts_per_id", page.controls.ddlStoreName.selectedData().finfacts_per_id);
                page.userService.getSettings(function (data) {
                    localStorage.setItem("company_settings", JSON.stringify(data));
                    var inputData = {
                        obj_type: "Product::Privilege",
                        obj_id: localStorage.getItem("prod_id"),
                        comp_prod_id: localStorage.getItem("user_company_id")
                    };
                    page.userpermissionAPI.getValue(inputData, function (data) {
                        localStorage.setItem("user_privilages", JSON.stringify(data));
                        var inputData = {
                            obj_type: "Product::Menu",
                            obj_id: localStorage.getItem("prod_id"),
                            comp_prod_id: localStorage.getItem("user_company_id")
                        };
                        page.userpermissionAPI.getValue(inputData, function (data) {
                            localStorage.setItem("user_menu", JSON.stringify(data));
                            page.userpermissionAPI.getPricePlanPrivilages({ start_record: "", end_record: "", filterExpression: " (cpt.comp_prod_id = " + localStorage.getItem("user_company_id") + " or ppat.comp_prod_id = " + localStorage.getItem("user_company_id") + ")", sort_expression: "" }, function (data) {
                                localStorage.setItem("company_privilages", JSON.stringify(data));
                                page.userService.getLicense(function (data) {
                                    localStorage.setItem("product_version", data.Version);
                                    window.location.href = "/" + appConfig.root + "/login/view/home-page/home-page.html";
                                }, function (data) {
                                    localStorage.setItem("product_version", "Licensed");
                                });
                            });
                        });
                    });
                });
            } catch (e) {
                alert(e);
            }

        };
        page.events.btnAddStore_click = function () {
            if (page.controls.ddlCompanyName.selectedValue() == "-1") {
                alert("Company Is Not Selected!!!");
            }
            else {
                page.controls.pnlAddStore.open();
                page.controls.pnlAddStore.title("User Details Screen");
                page.controls.pnlAddStore.width(340);
                page.controls.pnlAddStore.height(300);
            }
        }
        page.events.btnAddStoreConfirm_click = function () {
            //page.userService.getUserCompany(page.controls.txtUserId.val(), function (data1) {
            var data = {};
            data.store_name = $("#txtStoreName").val();
            data.state_no = 400;
            data.start_date = dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date()));
            data.comp_id = page.controls.ddlCompanyName.selectedValue();
            data.finfacts_company_id = page.controls.ddlCompanyName.selectedValue();
            var reg_data = {
                reg_name: "Register1",
                reg_type: "Register1"
            }
            page.storeAPI.postValue(data, function (data2) {
                //page.userService.insertUserStore(data, function (data2) {
                reg_data.store_no = data2[0].key_value;
                page.registerAPI.postValue(reg_data, function (data) {
                    //page.userService.insertUserRegister(data, function (data) {
                    alert("Store Details Added Successfully");
                    page.controls.pnlAddStore.close();
                })
            })
            // });
            
        };
        page.checkConfiguration = function(callback){
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "cpt.prod_id in (6,7,8,9,26,27,28,29,30,31,33,36,37)",
                sort_expression: ""
            }
            page.companyproductAPI.SearchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (comp_data) {
                if (comp_data.length == 1) {
                    localStorage.setItem("user_company_id", comp_data[0].comp_prod_id);
                    localStorage.setItem("prod_id", comp_data[0].prod_id);
                    var previlageData = {
                        obj_type: "Product::CompProd::Store",
                        obj_id: localStorage.getItem("prod_id"),
                    };
                    page.userpermissionAPI.getValue(previlageData, function (store_data) {
                        var menu_ids = [];
                        $(store_data).each(function (i, item) {
                                if (item.obj_id.startsWith("6"))
                                    item.obj_id = item.obj_id.split("::")[2];
                                else if (item.obj_id.startsWith("7"))
                                    item.obj_id = item.obj_id.split("::")[2];
                                else if (item.obj_id.startsWith("8"))
                                    item.obj_id = item.obj_id.split("::")[2];
                                else if(item.obj_id.startsWith("9"))
                                    item.obj_id = item.obj_id.split("::")[2];
                                else if(item.obj_id.startsWith("26"))
                                    item.obj_id = item.obj_id.split("::")[2];
                                else if(item.obj_id.startsWith("27"))
                                    item.obj_id = item.obj_id.split("::")[2];
                                else if(item.obj_id.startsWith("28"))
                                    item.obj_id = item.obj_id.split("::")[2];
                                else if(item.obj_id.startsWith("29"))
                                    item.obj_id = item.obj_id.split("::")[2];
                                else if(item.obj_id.startsWith("30"))
                                    item.obj_id = item.obj_id.split("::")[2];
                                else if (item.obj_id.startsWith("31"))
                                    item.obj_id = item.obj_id.split("::")[2];
                                else if (item.obj_id.startsWith("33"))
                                    item.obj_id = item.obj_id.split("::")[2];
                                else if(item.obj_id.startsWith("36"))
                                    item.obj_id = item.obj_id.split("::")[2];
                                else if (item.obj_id.startsWith("37"))
                                    item.obj_id = item.obj_id.split("::")[2];
                                menu_ids.push(item.obj_id);

                        });
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "store_no in (" + menu_ids.join(",") + ")",
                            sort_expression: ""
                        }
                        page.storeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (store_data) {
                            if (store_data.length == 1) {
                                localStorage.setItem("user_store_no", store_data[0].store_no); 
                                localStorage.setItem("temp_user_store_no", store_data[0].store_no);
                                localStorage.setItem("user_fulfillment_store_no", store_data[0].fulfillment_store.split(",")[0]);
                                //localStorage.setItem("user_fulfillment_store_data", store_data[0].fulfillment_store);
                                localStorage.setItem("user_store_data", JSON.stringify(store_data));
                                var data = {
                                    start_record: 0,
                                    end_record: "",
                                    filter_expression: "store_no=" + store_data[0].store_no,
                                    sort_expression: ""
                                }
                                page.registerAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (reg_data) {
                                    localStorage.setItem("user_register_data", JSON.stringify(reg_data));
                                    if (reg_data.length == 1) {
                                        document.cookie = "user_company_id=" + comp_data[0].comp_prod_id + ";path=/";
                                        localStorage.setItem("prod_id", comp_data[0].prod_id);
                                        document.cookie = "user_store_id=" + store_data[0].store_no + ";path=/";
                                        document.cookie = "user_register_id=" + reg_data[0].reg_no + ";path=/";
                                        localStorage.setItem("user_store_id", store_data[0].store_no);
                                        localStorage.setItem("user_register_id", reg_data[0].reg_no);
                                        localStorage.setItem("user_store_name", store_data[0].store_name);
                                        localStorage.setItem("user_company_name", comp_data[0].comp_prod_name);
                                        localStorage.setItem("user_finfacts_comp_id", store_data[0].finfacts_company_id);
                                        localStorage.setItem("user_finfacts_per_id", store_data[0].finfacts_per_id);
                                        callback(false);
                                    }
                                    else {
                                        callback(true);
                                    }
                                })
                            }
                            else {
                                callback(true);
                            }
                        })
                    });
                }
                else {
                    callback(true);
                }
            });
        };


        $("[controlid=pnlGetUserDetails]").on('keyup', function (e) {
            if (e.which == 13) {
                page.events.btnConfirmDetails_click();
            }
        });
    });



}
