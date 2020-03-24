$.fn.salesExecutiveReward = function () {
    return $.pageController.getPage(this, function (page, $$, e) {
        //page.salesExecutiveRewardService = new SalesExecutiveRewardService();
        page.salesExecutiveRewardPlanAPI = new SalesExecutiveRewardPlanAPI();

        document.title = "ShopOn - Sales Executive Reward";
        $("body").keydown(function (e) {
            //well you need keep on mind that your browser use some keys 
            //to call some function, so we'll prevent this


            //now we caught the key code
            var keyCode = e.keyCode || e.which;

            //your keyCode contains the key code, F1 to F2 
            //is among 112 and 123. Just it.
            //console.log(keyCode);
            if (keyCode == 112) {
                e.preventDefault();
                page.events.btnNewReward_click();
            }
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnSave_click();
            }
            if (e.keyCode == 82 && e.ctrlKey) {
                e.preventDefault();
                page.events.btnBeforeDelete_click();
            }

        });
        page.select = function (item) {
            
            $$("hdnRewardPlanid").val(nvl(item.reward_plan_id, ""));
            $$("txtRewardPlanName").value(nvl(item.reward_plan_name, ""));
            $$("txtRewardPlanPoint").value(nvl(item.reward_plan_point, ""));
            $$("txtRewardPlanType").value(nvl(item.reward_plan_type, ""));
            $$("msgPanel").hide();
            $$("txtRewardPlanName").focus();
        };

        page.delete = function (callback) {
            if ($$("hdnRewardPlanid").val() != "") {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Removing reward...");
                //page.salesExecutiveRewardService.deleteReward($$("hdnRewardPlanid").val(), function (data) {
                page.salesExecutiveRewardPlanAPI.deleteValue($$("hdnRewardPlanid").val(), { reward_plan_id: $$("hdnRewardPlanid").val() }, function (data) {
                    //$(".detail-info").progressBar("hide")
                    $$("msgPanel").show("Reward removed successfully...!");
                    //page.events.btnSearch_click();
                    $$("hdnRewardPlanid").val('');
                    $$("txtRewardPlanName").val('');
                    $$("txtRewardPlanPoint").val('');
                    $$("txtRewardPlanType").val('');
                    //page.salesExecutiveRewardService.getCustomerRewardByAll($$("txtRewardSearch").value(), function (item) {
                    page.salesExecutiveRewardPlanAPI.searchValues("", "", "", "", function (data) {
                        page.controls.grdRewardMaintan.dataBind(data);
                        $$("msgPanel").hide();
                    });
                });
            } else {
                $$("msgPanel").show("Please select reward to remove...");
            }
        }
        page.save = function (callback) {
            var result = 0;
            var data = {
                reward_plan_name: $$("txtRewardPlanName").val(),
                reward_plan_point: $$("txtRewardPlanPoint").val(),
                reward_plan_type: $$("txtRewardPlanType").val(),
                comp_id: localStorage.getItem("user_company_id")
            }
            var planid = $$("hdnRewardPlanid").val();
            var planname = $$("txtRewardPlanName").val();
            var planpoint = $$("txtRewardPlanPoint").val();
            var plantype = $$("txtRewardPlanType").val();
            

         /*   $(page.controls.grdRewardMaintan.getAllRows()).each(function (i, row) {
               var str1 = $$("txtRewardPlanName").val();
                var str2 = $(row).find("[datafield=reward_plan_name]").find("div").html();
                if (str1.toUpperCase() == str2.toUpperCase()) {
                    result++;
                }
                else if ($$("txtRewardPlanPoint").val() == $(row).find("[datafield=reward_plan_point]").find("div").html()) {
                    $$("txtRewardPlanPoint").focus();
                    result=2;
                }
            });*/
            if(result==0){
                if ($$("hdnRewardPlanid").val() != "" && $$("hdnRewardPlanid").val() != null && $$("hdnRewardPlanid").val() != undefined)
                {
                    data.reward_plan_id = $$("hdnRewardPlanid").val();
                    $$("msgPanel").flash("Updating reward...");
                    //page.salesExecutiveRewardService.updateReward(data, function (data1) {
                    page.salesExecutiveRewardPlanAPI.putValue($$("hdnRewardPlanid").val(),data,function(data1){
                        $$("msgPanel").flash("Reward updated successfully...!");
                        //page.salesExecutiveRewardService.getRewardPlanById($$("hdnRewardPlanid").val(), function (data) {
                        page.salesExecutiveRewardPlanAPI.getValue({ reward_plan_id: $$("hdnRewardPlanid").val() },function(data){
                            $$("grdRewardMaintan").updateRow($$("grdRewardMaintan").selectedRowIds()[0], data[0]);
                            $$("grdRewardMaintan").selectedRows()[0].click();
                            $$("msgPanel").hide();
                            //page.events.btnSearch_click();
                            //$$("txtRewardPlanName").focus();
                        });
                    });
                }
                else {
                    //$(".detail-info").progressBar("show")
                    $$("msgPanel").flash("Inserting new reward...");
                    //page.salesExecutiveRewardService.insertReward(data, function (data1) {
                    page.salesExecutiveRewardPlanAPI.postValue(data, function (data1) {
                        $$("msgPanel").flash("Reward saved successfully...!");
                        //page.salesExecutiveRewardService.getRewardPlanById(data1[0].key_value, function (data) {
                        page.salesExecutiveRewardPlanAPI.getValue({ reward_plan_id: data1[0].key_value }, function (data) {
                            $$("grdRewardMaintan").dataBind(data);
                            page.select([]);
                            //page.events.btnSearch_click();
                            $$("grdRewardMaintan").getAllRows()[0].click();
                            //$$("msgPanel").flash("Saved successfully...");
                            //$$("msgPanel").hide();
                        });
                        //$(".detail-info").progressBar("hide")
                    });
                
                }
            }
     /*       else if(result==1){
                $$("msgPanel").show("Reward Plan Already Exists...");
                page.select([]);
            }
            else if (result == 2) {
                $$("msgPanel").show("Reward Plan Point is Already Exists...");
                page.select([]);
            }*/
           /* if (planid=="" && planname==data.reward_plan_name && planpoint==data.reward_plan_point && plantype==data.reward_plan_type) 
                {
                    $$("msgPanel").show("Data Already Exists...");
                }
                else
            {
                if ($$("hdnRewardPlanid").val()) {
                    data.reward_plan_id = $$("hdnRewardPlanid").val();
                    $(".detail-info").progressBar("show")
                    $$("msgPanel").show("updating reward...");
                    page.salesExecutiveRewardService.updateReward(data, function (data1) {
                        $(".detail-info").progressBar("hide")
                        $$("msgPanel").show("Saved successfully...");
                    });
                }
                else {
                    $(".detail-info").progressBar("show")
                    $$("msgPanel").show("inserting new reward...");
                    page.salesExecutiveRewardService.insertReward(data, function (data1) {
                        $(".detail-info").progressBar("hide")
                        $$("msgPanel").show("Saved successfully...");
                    });

                }
                page.salesExecutiveRewardService.updateReward(data, function (data1) {
                    $(".detail-info").progressBar("hide")
                    $$("msgPanel").show("Updated successfully...");
                });
            }*/
            //} catch (e) {
            //    alert("There was an error in saving customer details!");
            //}

        };


        page.events = {
            btnSearch_click: function () {
                $$("msgPanel").show("Searching...");
                //page.salesExecutiveRewardService.getCustomerRewardByAll($$("txtRewardSearch").value(), function (item) {
                page.salesExecutiveRewardPlanAPI.searchValues("", "", "concat(reward_plan_no,reward_plan_name) like '%" + $$("txtRewardSearch").value()+"%'", "", function (data) {
                    page.controls.grdRewardMaintan.dataBind(data);
                    $$("msgPanel").hide();
                });
                //$$("btnNewReward").show();
                $$("btnSave").hide();
                $$("btnRemove").hide();
                $(".basic-info").hide();
            },
            grdRewardMaintan_select: function (row, item) {
                //$$("msgPanel").show("Details of the reward...");
                $$("hdnRewardPlanid").val(item.reward_plan_id);
                $(".basic-info").show();
                page.select(item);
                //$$("btnNewReward").show();
                $$("btnSave").show();
                $$("btnRemove").show();
            },
            btnNewReward_click: function (row, item) {
                $$("txtRewardPlanName").focus();
                //$$("btnSave").show();
                $$("btnRemove").hide();
                $(".basic-info").show();
                //page.events.btnSearch_click();
                page.select({});
                //page.controls.grdRewardMaintan.dataBind([]);
                //$$("btnNewReward").show();
                $$("btnSave").show();
                $$("txtRewardPlanName").focus();
            },
            btnSave_click: function () {
                var reward_point = $$("txtRewardPlanPoint").val();
                var reward_name = $$("txtRewardPlanName").val();
                if (reward_name=="")
                {
                    $$("msgPanel").show("Reward plan name is mandatory...!");
                    $$("txtRewardPlanName").focus();
                }
                else if (reward_name != "" && isInt(reward_name)) {
                    $$("msgPanel").show("Reward plan name should only contains characters ...!");
                    $$("txtRewardPlanName").focus();
                }
                else if (reward_point == "")
                {
                    $$("msgPanel").show("Reward plan point is mandatory...!");
                    $$("txtRewardPlanPoint").focus();
                }
                else if (reward_point == 0) {
                    $$("msgPanel").show("Reward plan point is invalid number...!");
                    $$("txtRewardPlanPoint").focus();
                }
                else if (isNaN(reward_point)) {
                    $$("msgPanel").show("Reward plan point is invalid...!");
                    $$("txtRewardPlanPoint").focus();
                }
                
                else {
                    page.save();
                    //page.salesExecutiveRewardService.getCustomerRewardByAll($$("txtRewardSearch").value(), function (item) {
                    //    page.controls.grdRewardMaintan.dataBind(item);
                    //    $$("msgPanel").hide();
                    //});
                    $$("btnRemove").show();
                    $$("txtRewardPlanName").focus();
                }
                
               
            },
            btnBeforeDelete_click: function () {
                page.controls.pnlRemoveConfirmPopup.open();
                page.controls.pnlRemoveConfirmPopup.title("Remove Alert");
                page.controls.pnlRemoveConfirmPopup.rlabel("Remove Alert");
                page.controls.pnlRemoveConfirmPopup.width(540);
                page.controls.pnlRemoveConfirmPopup.height(200);
                if (CONTEXT.ENABLE_REMOVE) {
                    $$("btnRemoveAlertPopupSave").show();
                }
                else {
                    $$("btnRemoveAlertPopupSave").hide();
                }
            },
            btnRemoveConfirmPopupClose_click: function () {
                page.controls.pnlRemoveConfirmPopup.close();
            },
            btnRemove_click: function () {
                page.delete();
                page.controls.pnlRemoveConfirmPopup.close();

                //page.salesExecutiveRewardService.getCustomerRewardByAll($$("txtRewardSearch").value(), function (item) {
                page.salesExecutiveRewardPlanAPI.searchValues("", "", "", "", function (data) {
                    page.controls.grdRewardMaintan.dataBind(data);
                });
                $$("btnRemove").hide();
                $$("btnSave").hide();
                //$$("btnNewReward").hide();
                $(".basic-info").hide();
            },
            page_load: function () {
                //setTimeout(function () {
                    $$("btnSave").hide();
                    $$("btnRemove").hide();
                    $(".basic-info").hide();
                    //page.events.btnNewReward_click();
                    page.controls.grdRewardMaintan.width("100%");
                    page.controls.grdRewardMaintan.height("470px");
                    page.controls.grdRewardMaintan.setTemplate({
                        selection: "Single", paging: true, pageSize: 50,
                        columns: [
                            { 'name': "Plan Id", 'rlabel': 'Plan Id', 'width': "100px", 'dataField': "reward_plan_id", visible: false },
                            { 'name': "Plan Id", 'rlabel': 'Plan Id', 'width': "100px", 'dataField': "reward_plan_no" },
                            { 'name': "Plan Name", 'rlabel': 'Plan Name', 'width': "150px", 'dataField': "reward_plan_name" },
                            { 'name': "Plan Point", 'rlabel': 'Plan Point', 'width': "100px", 'dataField': "reward_plan_point" },
                        ]
                    });

                    page.controls.grdRewardMaintan.selectionChanged = page.events.grdRewardMaintan_select;
                    page.controls.grdRewardMaintan.dataBind([]);
                    page.select([]);
                    //page.salesExecutiveRewardService.getRewardByAll("%", function (data) {
                    page.salesExecutiveRewardPlanAPI.searchValues("","","","",function(data){
                        page.controls.grdRewardMaintan.dataBind(data);
                    });
                    //var dataSourceCustomer = {
                    //    getData: function (term, callback) {
                    //        page.salesExecutiveRewardService.getCustomerRewardByAll(term, callback);
                    //    }
                    //};
                    $$("txtRewardSearch").focus();
                //}, 1000);

                    //$$("txtRewardSearch").keyup(function () {
                    //    //page.salesExecutiveRewardService.getCustomerRewardByAll($$("txtRewardSearch").value(), function (item) {
                    //    page.salesExecutiveRewardPlanAPI.searchValues("", "", "concat(reward_plan_id,reward_plan_name) like '%" + $$("txtRewardSearch").value() + "%'", "", function (data) {
                    //        page.controls.grdRewardMaintan.dataBind(data);
                    //        $$("msgPanel").hide();
                    //    });
                    //})
            }

        };
     

    });
}