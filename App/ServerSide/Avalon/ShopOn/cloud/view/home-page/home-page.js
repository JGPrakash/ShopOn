$.fn.homePage = function () {
    return $.pageController.getControl(this, function (page, $$) {
        //Import Services required
        page.compProductAPI = new CompanyProductAPI();
        page.productAPI = new ProductAPI();
        page.batchAPI = new BatchAPI();
        page.priceplanAPI = new PricePlanAPI();
        page.instancesAPI = new InstancesAPI();
        page.companyAPI = new CompanyAPI();
        page.UserGroupAPI = new UserGroupAPI();
        page.cloudIntegrationAPI = new CloudIntegrationAPI();
        page.groupAPI = new GroupAPI();
        page.comp_prod_uri = null;
        page.instance_id = 0;
        page.comp_prod_name = "";
        page.events = {
            btnNewProductSave_click: function () {
            var data = {
                comp_id: page.comp_id,
                prod_id: $$("ddlProducts").selectedValue(),
                comp_prod_name: $$("txtProductName").value(),
                instance_id: $$("ddlInstances").selectedValue(),
                price_plan_id: $$("ddlPricePlan").selectedData(0).prod_plan_id,//$$("ddlPricePlan").selectedValue(),
            };
            page.sms_product_name = $$("ddlProducts").selectedData(0).prod_name;
            page.compProductAPI.postValue(data, function (data) {
                var comp_prod_id = data[0].i_comp_prod_id;
                page.company_product_id = data;
                  page.instancesAPI.getValue($$("ddlInstances").selectedValue(), function (ins_data) {
                    var finfacts_data = {
                        comp_name: $$("txtProductName").value(),
                        user_id: comp_prod_id
                    }
                    page.cloudIntegrationAPI.postValueWithURL(ins_data[0].server + "//" + ins_data[0].service3, finfacts_data, function (fin_data) {
                        var shopon_data = {
                            comp_name: $$("txtProductName").value(),
                            user_id: comp_prod_id,
                            finfacts_comp_id: fin_data[0].comp_id,
                            finfacts_per_id: fin_data[0].comp_per_id,
                            comp_prod_id: comp_prod_id,
                            comp_prod_name: $$("ddlProducts").selectedData().prod_name,
                            price_plan_id: $$("ddlPricePlan").selectedValue(),
                        }
                        page.cloudIntegrationAPI.postValueWithURL(ins_data[0].server + "//" + ins_data[0].service1, shopon_data, function (data) {
                            var data = {
                                start_record: 0,
                                end_record: "",
                                filter_expression: "",
                                sort_expression: ""
                            }
                            page.compProductAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                                data.splice(0, 0, { prod_img: "Image/new.png", comp_prod_id: 0, prod_name: "New Product", comp_prod_name: "+" })
                                page.sendSMSNewProduct();
                                page.sendEmailNewProduct();
                                $$("grdMyProduct").dataBind(data);
                                alert("success");
                                $$("pnlNewProduct").close();
                            });
                        });
                    });
                });
                $(page.company_product_id).each(function (i, item) {
                    //if (item.group_name != "" || item.group_name != undefined || item.group_name != null && (item.group_name).toUpperCase() == ("Admin").toUpperCase()) {
                    var group_comp_prod_id = item.i_comp_prod_id;
                    var menugroup = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "comp_prod_id=" + group_comp_prod_id+" and group_name='Admin'",
                        sort_expression: "",
                    }
                    page.groupAPI.searchValues(menugroup.start_record, menugroup.end_record, menugroup.filter_expression, menugroup.sort_expression, function (group_data) {
                        var groupid = group_data[0].group_id;
                        if (group_data.length != 0) {
                            var member = {
                                user_id: JSON.parse(getCookie("admin_data"))[0].user_id,
                                comp_prod_id: group_comp_prod_id,
                                group_id: groupid,
                            };
                            page.UserGroupAPI.postValue(member, function (data) {
                            });
                            }
                        });
                        //}
                    });
                });
            },
            page_load: function () {
                $$("grdMyCompany").width("100%");
                $$("grdMyCompany").height("auto");
                $$("grdMyCompany").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Comp Id", 'width': "calc(100% - 20px)", 'dataField': "comp_id,comp_name", itemTemplate: "<div style='height:150px;border:solid 1px lightgrey'><div style='margin:auto;width:100%;text-align:center;margin-top:30%'>{comp_name}</div></div>" },

                    ]
                });
                $$("grdMyCompany").selectionChanged = function (row, item) {
                    $$("pnlMyProduct").show();
                    page.comp_id = item.comp_id;
                    document.cookie = "comp_id=" + page.comp_id + ";path=/";
                    //Get my product
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "",
                        sort_expression: ""
                    }
                    page.compProductAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        data.splice(0, 0, { prod_img: "Image/new.png", comp_prod_id: 0, prod_name: "New Product", comp_prod_name: "+" })
                        $$("grdMyProduct").dataBind(data);
                    });
                }
                $$("ddlProducts").selectionChange(function (item) {
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "prod_id=" + item.prod_id,
                        sort_expression: ""
                    }
                    page.priceplanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        $$("ddlPricePlan").dataBind(data, "plan_id", "plan_type");
                    });
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "prod_id=" + item.prod_id+" and shared_flag=1",
                        sort_expression: ""
                    }
                    page.instancesAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        $$("ddlInstances").dataBind(data, "instance_id", "instance_name");
                    });
                    $$("txtProductName").focus();
                });
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "user_id=" + JSON.parse(getCookie("admin_data"))[0].user_id,
                    sort_expression: ""
                }
                //Get My Company
                page.companyAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    $$("grdMyCompany").dataBind(data);
                    if (data.length > 0)
                    {
                        var row_id = $($$("grdMyCompany").getAllRows()[0]).attr("row_id");
                        $$("grdMyCompany").selectRow(row_id);
                    }
                    if (data.length == 1)
                    {
                        $$("pnlMyCompany").hide();
                    }
                });
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.productAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    $$("ddlProducts").dataBind(data,"prod_id","prod_name");
                });
                $$("grdMyProduct").width("100%");
                $$("grdMyProduct").height("auto");
                $$("grdMyProduct").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Comp Id", 'width': "calc(100% - 20px)", 'dataField': "prod_img,comp_prod_id,prod_name,comp_prod_name", itemTemplate: "<div style='height:180px;border:solid 1px lightgrey'><div style='margin-top: 5px;width:100%;text-align:center;'><img src='{prod_img}' height='50%' width='50%' class='icon-image'/></div><div style='margin:auto;width:100%;text-align:center;'>{prod_name}<br>{comp_prod_name}</div></div>" },
                    ]
                });
                $$("grdMyProduct").selectionChanged = function (row, item) {
                    if (item.comp_prod_id == 0)
                    {
                        $$("pnlNewProduct").open();
                        $$("pnlNewProduct").title("New Product");
                        $$("pnlNewProduct").width("400px");
                        $$("pnlNewProduct").height(290);
                        $$("ddlProducts").selectedValue("-1");
                        $$("ddlPricePlan").selectedValue("-1");
                        $$("ddlInstances").selectedValue("-1");
                        $$("txtProductName").value("");
                    }
                    else {
                        $$("pnlMyCompany").hide();
                        $$("pnlMyProduct").hide();
                        $$("pnlProductDetails").show();
                        document.cookie = "comp_prod_id=" + item.comp_prod_id + ";path=/";
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "comp_prod_id=" + item.comp_prod_id,
                            sort_expression: ""
                        }
                        page.compProductAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            (data[0].comp_name == "" || data[0].comp_name == null || data[0].comp_name == undefined) ? $$("lblCompanyName").value("") : $$("lblCompanyName").value(data[0].comp_name);
                            (data[0].prod_name == "" || data[0].prod_name == null || data[0].prod_name == undefined) ? $$("lblProductName").value("") : $$("lblProductName").value(data[0].prod_name);
                            (data[0].user_name == "" || data[0].user_name == null || data[0].user_name == undefined) ? $$("lblUserName").value("") : $$("lblUserName").value(data[0].user_name);
                            (data[0].price_plan == "" || data[0].price_plan == null || data[0].price_plan == undefined) ? $$("lblPricePlan").value("") : $$("lblPricePlan").value(data[0].price_plan);
                            page.instance_id = data[0].instance_id;
                        });
                        page.comp_prod_name = item.comp_prod_name;
                        page.comp_prod_uri = item.comp_prod_uri + item.prod_uri;
                        page.comp_prod_id = item.comp_prod_id;
                        page.prod_id = item.prod_id;
                        if(item.prod_id==2)
                            document.cookie = "iam_comp_prod_id=" + item.comp_prod_id + ";path=/";
                    }
                     //   window.location.href = item.comp_prod_uri;
                }
            }
        }
        page.sendEmailNewProduct = function () {
            try {
                if ([JSON.parse(getCookie("admin_data"))[0].email_id] != "") {
                    var accountInfo =
                    {
                        "appName": "WoToCloud",
                        "companyId": "1",
                        "clientAddress": "-",
                        "customerNumber": JSON.parse(getCookie("admin_data"))[0].user_id,
                        "customerName": JSON.parse(getCookie("admin_data"))[0].user_name,
                        "planName": "User",
                        "totalRewardPoint": "-",
                        "subject": "WoTo Cloud Registration",
                        "emailAddressList": [JSON.parse(getCookie("admin_data"))[0].email_id],
                        //["sam.info85@gmail.com"],
                        //["immanuvel.kalaiarasan@gmail.com"],
                        //["sundaralingam48@gmail.com", "wototech@outlook.com", "balumanoj85@gmail.com", "ram.vegeta@gmail.com", "sam.info85@gmail.com"]
                    };
                    accountInfo.message = "Dear " + JSON.parse(getCookie("admin_data"))[0].user_name + "(User ID-" + JSON.parse(getCookie("admin_data"))[0].user_id + "). Your product " + page.sms_product_name + " has purchased successfully. For Login " + page.sms_product_name + " to use User ID is " + JSON.parse(getCookie("admin_data"))[0].user_id + " and Password is " + JSON.parse(getCookie("admin_data"))[0].password + "." + "\n" + "Thank You." + "\n" + "Regards, WOTOTECH";
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
                        },
                        error: function (request, status, error) {
                            console.log(request.responseText);
                            $$("msgPanel").flash("E-mail to User Sent Failed...");
                        }
                    });
                }
                else {
                    $$("msgPanel").flash("Email Sent Failed Email ID is Empty...");
                }
            } catch (e) {
                alert(e);
            }
        }
        page.sendSMSNewProduct = function () {
            try {
                if (JSON.parse(getCookie("admin_data"))[0].phone_no != "") {
                    var accountInfo =
                    {
                        "appName": "WoToCloud",
                        "senderNumber": "WT-WOTOLT",
                        "companyId": "WT-WOTOLTD",
                        "receiverNumber": "+91" + JSON.parse(getCookie("admin_data"))[0].phone_no,
                        /*"91+" + "9442733772"*/
                        //"+919486342575"
                        //"9003300929",//9894692492
                    };
                    //accountInfo.message = "Dear " + JSON.parse(getCookie("admin_data"))[0].user_name + "(User ID" + JSON.parse(getCookie("admin_data"))[0].user_id + "). Your product" + page.sms_product_name+" has purchase successfully. " + "\n" + " Your Regsitered Email ID is " + JSON.parse(getCookie("admin_data"))[0].email_id + " and Password is " + JSON.parse(getCookie("admin_data"))[0].password + "." + "\n" + "Thank You." + "\n" + "Regards, WOTOTECH";
                    //accountInfo.message = "Dear " + JSON.parse(getCookie("admin_data"))[0].user_name + "(User ID-" + JSON.parse(getCookie("admin_data"))[0].user_id + "). Your product " + page.sms_product_name + " has purchase successfully. Your Regsitered User ID is " + JSON.parse(getCookie("admin_data"))[0].user_id + " and Password is " + JSON.parse(getCookie("admin_data"))[0].password + "." + "\n" + "Thank You." + "\n" + "Regards, WOTOTECH";
                    accountInfo.message = "Dear " + JSON.parse(getCookie("admin_data"))[0].user_name + "(User ID-" + JSON.parse(getCookie("admin_data"))[0].user_id + "). Your product " + page.sms_product_name + " has purchased successfully. For Login " + page.sms_product_name + " to use User ID is " + JSON.parse(getCookie("admin_data"))[0].user_id + " and Password is " + JSON.parse(getCookie("admin_data"))[0].password + "." + "\n" + "Thank You." + "\n" + "Regards, WOTOTECH";
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
                        },
                        error: function (request, status, error) {
                            console.log(request.responseText);
                            $$("msgPanel").flash("SMS to User Sent Failed...");
                        }
                    });
                }
                else {
                    $$("msgPanel").flash("SMS Sent Failed Phone Number is Empty...");
                }
            } catch (e) {
                alert(e);
            }
        }
        page.events.btnGoToSite_click =function(){
           //window.location.href = page.comp_prod_uri;
           window.open( page.comp_prod_uri);
        }
        page.events.btnPrepareOffline_click = function () {
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "instance_id=" + page.instance_id,
                sort_expression: ""
            }
            page.instancesAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
            //page.instancesAPI.getValue(page.instance_id, function (data) {
                var data = {
                    batch_name: "Offline",
                    status: "Not Started",
                    param1: data[0].service1,
                    param2: data[0].service2,
                    param3: data[0].service3,
                    param4: data[0].service4,
                    param5: data[0].service5,
                    param6: data[0].service6,
                    param7: data[0].service7,
                    param8: data[0].db1,
                    param9: data[0].db2,
                    param10: data[0].db3,
                    param11: data[0].db4,
                    param12: page.comp_prod_id,
                    param13: page.comp_id,
                    param14: page.prod_id,
                    param15: data[0].server,
                    param16: data[0].physical_path,
                    // param17: page.comp_prod_name,
                    param17: "ShopOnDev",
                }
                page.batchAPI.postValue(data, function (data) {
                    alert("Data Entered Successfully");
                })
            })
        }
        page.events.btnBack_click = function () {
            $$("pnlMyCompany").hide();
            $$("pnlMyProduct").show();
            $$("pnlProductDetails").hide();
        }
        page.events.btnDownloadProject_click = function () {
            window.open("http://104.251.218.116:9080/CloudIAMRestAPI/offline.jsp?auth-token=" + getCookie("auth_token") + "&comp_prod_id=" + page.comp_prod_id);
        }
    });
}
