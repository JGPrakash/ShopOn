$.fn.manageCustomerPromotion = function () {
    return $.pageController.getPage(this, function (page, $$, e) {
        page.customerPromotion = new CustomerPromotion();

        
        $("body").keydown(function (e) {
            var keyCode = e.keyCode || e.which;

            if (keyCode == 112) {
                e.preventDefault();
            }
            if (keyCode == 113) {
                e.preventDefault();
            }
            if (keyCode == 119) {
                e.preventDefault();
            }
        });
        document.title = "ShopOn - Customer Promotion";

        page.select = function (item) {
            $$("txtSenderNumber").val("919003300929");
            
                if (item.reward_plan_id == 1)
                    $$("ddlmyrewardplans").selectedObject.val(1);

                if (item.reward_plan_id == 2)
                    $$("ddlmyrewardplans").selectedObject.val(2);
                if (item.reward_plan_id == 3)
                    $$("ddlmyrewardplans").selectedObject.val(3);
                if (item.reward_plan_id == 4)
                    $$("ddlmyrewardplans").selectedObject.val(4);
                if (item.reward_plan_id == 5)
                    $$("ddlmyrewardplans").selectedObject.val(5);
                if (item.reward_plan_id == 6)
                    $$("ddlmyrewardplans").selectedObject.val(6);
                
        };
        page.events = {
           
            btnClearM_click: function () {
                $$("ddlmyrewardplans").selectedValue('');
                $$("txtMSubject").val('');
                $$("txtMMessage").val('');
            },
            btnClear_click: function () {
                $$("ddlmyrewardplan").selectedValue('');
                $$("txtMessage").val('');
            },
            btnSendSMS_click: function () {
                if ($$("txtMessage").val() == "") {
                   $$("msgPanel").show("Fill the Subject and Message...");
                } else {
                    $(page.controls.grdSenderDetails.allData()).each(function (i, item) {

                //page.customerPromotion.getCustomerByAll($$("ddlmyrewardplan").selectedValue(), function (itemList) {
                    //$(itemList).each(function (i, item) {
                    var accountInfo =
                    {
                        "appName": CONTEXT.COMPANY_NAME,
                        "senderNumber": 
                            //"919486342575",
                        $$("txtSenderNumber").val(),
                        "message": //"Hai",
                        $$("txtMessage").val(),
                        "receiverNumber": item.phone_no,
                            //"919003300929",
                        //$$("txtReceiverNumber").val(),
                        //"mobileNumber"://"9486342575",
                            //"7338898011",
                    };
                    var accountInfoJson = JSON.stringify(accountInfo);

                    $.ajax({
                        type: "POST",
                        url: "http://104.251.218.116:8080/woto-utility-rest/rest/sendSMS/text-message",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        crossDomain: false,
                        data: JSON.stringify(accountInfo),
                        dataType: 'json',
                        success: function (responseData, status, xhr) {
                            console.log(responseData);
                            $(".detail-info").progressBar("hide");
                            $$("msgPanel").show("SMS Sent Successfully..." );
                        },
                        error: function (request, status, error) {
                            console.log(request.responseText);
                            $(".detail-info").progressBar("hide");
                            $$("msgPanel").show("SMS Sent Failed..." );
                        }
                    });

                    });
                //});
                }
            },
            grdSenderDetails_select: function (row, item) {
                $$("ddlmyrewardplan").selectedValue(item.reward_plan_id);
                $$("txtReceiverNumber").val(item.phone_no);
                page.select(item);
            },
            grdEmailDetails_select: function (row, item) {
                $$("ddlmyrewardplans").selectedValue(item.reward_plan_id);
                $$("txtMEmail").val(item.email);
                page.select(item);
            },
            btnSendMail_click: function () {
                if ($$("txtMSubject").val() == " " && $$("txtMMessage").val() == " ") {
                    $$("msgPanel").show("Fill the Subject and Message...");
                } else {
                    $(page.controls.grdEmailDetails.allData()).each(function (i, item) {
                    //page.customerPromotion.getCustomerByAll($$("ddlmyrewardplans").selectedValue(), function (itemList) {
                        //$(itemList).each(function (i, item) {
                            var accountInfo = {
                                "appName": CONTEXT.COMPANY_NAME,
                                "clientAddress": CONTEXT.ClientAddress,
                                "customerNumber": item.cust_no,
                                //"1111",
                                "customerName": item.cust_name,
                                //"Sundar",
                                "planName": item.reward_plan_name,
                                //"Gold Reward Plan",
                                "totalRewardPoint": item.total_reward_point,
                                //"2300",
                                "subject": $$("txtMSubject").val(),
                                //"Special Customer of Shopon",
                                "message": $$("txtMMessage").val(),
                                //"We have an excellent offer at our store in Tiruchendur this Saturday on  10-May-2017. 
                                //We will double your reward point for all your purchase and also will provide you an unbelivable gift. 
                                //Dont miss out this offer.Following are your details",
                                "emailAddressList": //["vigneshviki50@gmail.com"],
                                    //[$$("txtMEmail").val()],
                                    [item.email],
                                    //["sam.info85@gmail.com"],
                                //["immanuvel.kalaiarasan@gmail.com"],
                                //["sundaralingam48@gmail.com", "wototech@outlook.com", "balumanoj85@gmail.com", "ram.vegeta@gmail.com", "sam.info85@gmail.com"]
                            };
                            var accountInfoJson = JSON.stringify(accountInfo);

                            $.ajax({
                                type: "POST",
                                url: "http://104.251.218.116:8080/woto-utility-rest/rest/sendEmail/promotion-email",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                crossDomain: false,
                                data: JSON.stringify(accountInfo),
                                dataType: 'json',
                                success: function (responseData, status, xhr) {
                                    console.log(responseData);
                                    $(".detail-info").progressBar("hide");
                                    $$("msgPanel").show("Email Sent Successfully..." + item.cust_name + " " + item.email + " " + CONTEXT.COMPANY_NAME);
                                },
                                error: function (request, status, error) {
                                    console.log(request.responseText);
                                    $(".detail-info").progressBar("hide");
                                    $$("msgPanel").show("Email Sent Failed..." + item.cust_name + " " + item.email + " " + CONTEXT.COMPANY_NAME);
                                }
                            });

                        });

                    //});


                }
            },
        
            page_load: function () {
                $$("ddlcommunicationtype").selectedValue("Select");
                
                    
                page.customerPromotion.getRewardByAll("%", function (data) {
                    $$("ddlmyrewardplans").dataBind(data, "reward_plan_id", "reward_plan_name", "All");
                    $$("ddlmyrewardplan").dataBind(data, "reward_plan_id", "reward_plan_name", "All");
                });

                $$("ddlcommunicationtype").selectionChange(function () {
                    var plan = $$("ddlcommunicationtype").selectedValue();
                    switch (plan) {
                        case "SMS":
                            $$("pnlsearch").show();
                            $$("pnlsms").show();
                            $$("pnlemail").hide();
                            $$("pnlsearchE").hide();
                            break;
                        case "EMAIL":
                            $$("pnlsearch").hide();
                            $$("pnlsms").hide();
                            $$("pnlemail").show();
                            $$("pnlsearchE").show();
                            break;
                        default:
                            $$("pnlsearch").hide();
                            $$("pnlsms").hide();
                            $$("pnlemail").hide();
                            $$("pnlsearchE").hide();
                            break;
                    }
                });
                page.controls.grdSenderDetails.width("100%");
                page.controls.grdSenderDetails.height("300px");
                page.controls.grdSenderDetails.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Customer Name", 'width': "100px", 'dataField': "cust_name" },
                        { 'name': "Email", 'width': "180px",  'dataField': "email" },
                        { 'name': "Mobile No", 'width': "100px", 'dataField': "phone_no" },
                        { 'name': "Address", 'width': "100px", 'dataField': "address" },
                        { 'name': "Reward Points", 'width': "50px", 'dataField': "total_reward_point" },
                        {
                            'name': "Action",
                            'width': "40px",
                            'dataField': "cust_no",
                            itemTemplate: "<input action='delete' style='padding:0px;font-size: 10px;' type='button' class='buttonSecondary' title ='Remove' value='Remove' /> "
                        }
                    ]
                });
                page.controls.grdSenderDetails.selectionChanged = page.events.grdSenderDetails_select;
                page.controls.grdSenderDetails.dataBind([]);
                page.customerPromotion.getCustomerByAll(-1, function (item) {
                    page.controls.grdSenderDetails.dataBind(item);

                });
                page.controls.grdSenderDetails.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    //To Handle removing an item from list.
                    if (action == "delete") {
                        page.controls.grdSenderDetails.deleteRow(rowId);
                        
                    }
                }
                $$("aclMobileSearch").dataBind({
                    getData: function (term, callback) {
                        page.customerPromotion.getCustomerNameByAll(term, callback);
                        //page.controls.grdSenderDetails.dataBind(term);
                    }
                });
                page.controls.aclMobileSearch.select(function (item) {
                    var newitem = {
                        cust_name: item.cust_name,
                        email: item.email,
                        phone_no: item.phone_no,
                        address: item.address,
                        total_reward_point: item.total_reward_point,
                    };
                        page.controls.grdSenderDetails.createRow(newitem);
                        page.controls.grdSenderDetails.edit(true);
                        rows = page.controls.grdSenderDetails.getRow({
                            cust_name: newitem.cust_name,
                            email: newitem.email,
                            phone_no: newitem.phone_no,
                            address: newitem.address,
                            total_reward_point: newitem.total_reward_point,
                        });
                    page.controls.grdSenderDetails.dataBind(newitem);
                });
                $$("ddlmyrewardplan").selectionChange(function () {
                    var plan = $$("ddlmyrewardplan").selectedValue();
                    switch (plan) {
                        case "1":
                            page.customerPromotion.getCustomerByAll($$("ddlmyrewardplan").selectedValue(), function (item) {
                                page.controls.grdSenderDetails.dataBind(item);
                            });
                            break;
                        case "2":
                            page.customerPromotion.getCustomerByAll($$("ddlmyrewardplan").selectedValue(), function (item) {
                                page.controls.grdSenderDetails.dataBind(item);
                            });
                            break;
                        case "3":
                            page.customerPromotion.getCustomerByAll($$("ddlmyrewardplan").selectedValue(), function (item) {
                                page.controls.grdSenderDetails.dataBind(item);
                            });
                            break;
                        case "4":
                            page.customerPromotion.getCustomerByAll($$("ddlmyrewardplan").selectedValue(), function (item) {
                                page.controls.grdSenderDetails.dataBind(item);
                            });
                            break;
                        case "5":
                            page.customerPromotion.getCustomerByAll($$("ddlmyrewardplan").selectedValue(), function (item) {
                                page.controls.grdSenderDetails.dataBind(item);
                            });
                            break;
                        case "6":
                            page.customerPromotion.getCustomerByAll($$("ddlmyrewardplan").selectedValue(), function (item) {
                                page.controls.grdSenderDetails.dataBind(item);
                            });
                            break;
                        default:
                            page.customerPromotion.getCustomerByAll($$("ddlmyrewardplan").selectedValue(), function (item) {
                                page.controls.grdSenderDetails.dataBind(item);
                            });
                            break;
                    }
                });                
                //$$("txtCustomerName").select(function () {

                    page.controls.grdEmailDetails.width("100%");
                    page.controls.grdEmailDetails.height("300px");
                    page.controls.grdEmailDetails.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Customer Name", 'width': "100px", 'dataField': "cust_name" },
                            { 'name': "Email", 'width': "120px", 'dataField': "email" },
                            { 'name': "Mobile No", 'width': "100px", 'dataField': "phone_no" },
                            { 'name': "Address", 'width': "100px", 'dataField': "address" },
                            { 'name': "Reward Points", 'width': "30px", 'dataField': "total_reward_point" },
                            {
                                'name': "Action",
                                'width': "100px",
                                'dataField': "cust_no",
                                itemTemplate: "<input action='delete' style='padding:0px;font-size: 10px;' type='button' class='buttonSecondary' title ='Remove' value='Remove' /> "
                            }
                        ]
                    });
                //});
                    page.controls.grdEmailDetails.selectionChanged = page.events.grdEmailDetails_select;
                    page.controls.grdEmailDetails.dataBind([]);
                    page.customerPromotion.getCustomerByAll(-1, function (item) {
                        page.controls.grdEmailDetails.dataBind(item);

                    });
                    page.controls.grdEmailDetails.rowCommand = function (action, actionElement, rowId, row, rowData) {
                        if (action == "delete") {
                            page.controls.grdEmailDetails.deleteRow(rowId);

                            //Recalculate after deleting a item
                            //page.calculate();

                        }
                    }
                    $$("aclEmailSearch").dataBind({
                        getData: function (term, callback) {
                            page.customerPromotion.getCustomerNameByAll(term, callback);
                           // page.controls.grdEmailDetails.dataBind(term);
                        }
                    });
                    page.controls.aclEmailSearch.select(function (item) {
                        var newitem = {
                            cust_name: item.cust_name,
                            email: item.email,
                            phone_no: item.phone_no,
                            address: item.address,
                            total_reward_point: item.total_reward_point,
                        };
                        page.controls.grdEmailDetails.createRow(newitem);
                        page.controls.grdEmailDetails.edit(true);
                        rows = page.controls.grdEmailDetails.getRow({
                            cust_name: newitem.cust_name,
                            email: newitem.email,
                            phone_no: newitem.phone_no,
                            address: newitem.address,
                            total_reward_point: newitem.total_reward_point,
                        });
                        page.controls.grdEmailDetails.dataBind(newitem);
                        
                    });
                    $$("ddlmyrewardplans").selectionChange(function () {
                        var plan = $$("ddlmyrewardplans").selectedValue();
                        switch (plan) {
                            case "1":
                                page.customerPromotion.getCustomerByAll($$("ddlmyrewardplans").selectedValue(), function (item) {
                                    page.controls.grdEmailDetails.dataBind(item);
                                });
                                break;
                            case "2":
                                page.customerPromotion.getCustomerByAll($$("ddlmyrewardplans").selectedValue(), function (item) {
                                    page.controls.grdEmailDetails.dataBind(item);
                                });
                                break;
                            case "3":
                                page.customerPromotion.getCustomerByAll($$("ddlmyrewardplans").selectedValue(), function (item) {
                                    page.controls.grdEmailDetails.dataBind(item);
                                });
                                break;
                            case "4":
                                page.customerPromotion.getCustomerByAll($$("ddlmyrewardplans").selectedValue(), function (item) {
                                    page.controls.grdEmailDetails.dataBind(item);
                                });
                                break;
                            case "5":
                                page.customerPromotion.getCustomerByAll($$("ddlmyrewardplans").selectedValue(), function (item) {
                                    page.controls.grdEmailDetails.dataBind(item);
                                });
                                break;
                            case "6":
                                page.customerPromotion.getCustomerByAll($$("ddlmyrewardplans").selectedValue(), function (item) {
                                    page.controls.grdEmailDetails.dataBind(item);
                                });
                                break;
                            default:
                                page.customerPromotion.getCustomerByAll($$("ddlmyrewardplans").selectedValue(), function (item) {
                                    page.controls.grdEmailDetails.dataBind(item);
                                });
                                break;
                        }
                    });
            }
            
        };
    });
}