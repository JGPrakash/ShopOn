$.fn.rewardMaintenance = function () {
    return $.pageController.getPage(this, function (page, $$, e) {
        page.rewardService = new RewardService();
        page.rewardplanAPI = new RewardPlanAPI();
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
                page.events.btnBeforeRemove_click();
            }

        });
        document.title = "ShopOn - Reward Maintenance";
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
                var data = {
                    reward_plan_id: $$("hdnRewardPlanid").val()
                }
                page.rewardplanAPI.deleteValue(data.reward_plan_id, data, function (data) {
                //page.rewardService.deleteReward($$("hdnRewardPlanid").val(), function (data) {
                    //$(".detail-info").progressBar("hide")
                    $$("msgPanel").show("Reward removed successfully...!");
                    //page.events.btnSearch_click();
                    $$("hdnRewardPlanid").val('');
                    $$("txtRewardPlanName").val('');
                    $$("txtRewardPlanPoint").val('');
                    $$("txtRewardPlanType").val('');
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "concat(reward_plan_id,reward_plan_name,reward_plan_point) like '%" + $$("txtRewardSearch").value() + "%'",
                        sort_expression: ""
                    }
                    page.rewardplanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                    //page.rewardService.getCustomerRewardByAll($$("txtRewardSearch").value(), function (item) {
                        page.controls.grdRewardMaintan.dataBind(item);
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
                if ($$("hdnRewardPlanid").val()!="" &&$$("hdnRewardPlanid").val()!=null && $$("hdnRewardPlanid").val()!=undefined) {
                data.reward_plan_id = $$("hdnRewardPlanid").val();
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Updating reward...");
                page.rewardplanAPI.putValue(data.reward_plan_id, data, function (data1) {
                //page.rewardService.updateReward(data, function (data1) {
                    //$(".detail-info").progressBar("hide")
                    $$("msgPanel").show("Reward updated successfully...!");
                    var reward = {
                        reward_plan_id: data.reward_plan_id
                    }
                    page.rewardplanAPI.getValue(reward, function (data) {
                    //page.rewardService.getRewardPlanById($$("hdnRewardPlanid").val(), function (data) {
                        //page.controls.grdRewardMaintan.dataBind(data);
                        //page.select([]);
                        //$$("grdRewardMaintan").getAllRows()[0].click();
                        // Update the new data to Grid
                        $$("grdRewardMaintan").updateRow($$("grdRewardMaintan").selectedRowIds()[0], data[0]);
                        $$("grdRewardMaintan").selectedRows()[0].click();
                        $$("msgPanel").hide();
                        $$("txtRewardPlanName").focus();
                    });
                });
            }
            else {
                //$(".detail-info").progressBar("show")
                    $$("msgPanel").show("Inserting new reward...");
                    page.rewardplanAPI.postValue(data, function (data1) {
                //page.rewardService.insertReward(data, function (data1) {
                    $$("msgPanel").show("Reward saved successfully...!");
                    var reward = {
                        reward_plan_id: data1[0].key_value
                    }
                    page.rewardplanAPI.getValue(reward, function (data) {
                    //page.rewardService.getRewardPlanById(data1[0].key_value, function (data) {
                        $$("grdRewardMaintan").dataBind(data);
                        page.select([]);
                        $$("grdRewardMaintan").getAllRows()[0].click();
                        //alert("Saved successfully...");
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
                    page.rewardService.updateReward(data, function (data1) {
                        $(".detail-info").progressBar("hide")
                        $$("msgPanel").show("Saved successfully...");
                    });
                }
                else {
                    $(".detail-info").progressBar("show")
                    $$("msgPanel").show("inserting new reward...");
                    page.rewardService.insertReward(data, function (data1) {
                        $(".detail-info").progressBar("hide")
                        $$("msgPanel").show("Saved successfully...");
                    });

                }
                page.rewardService.updateReward(data, function (data1) {
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
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "concat(reward_plan_no,reward_plan_name,reward_plan_point) like '%" + $$("txtRewardSearch").value() + "%'",
                    sort_expression: ""
                }
                page.rewardplanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                //page.rewardService.getCustomerRewardByAll($$("txtRewardSearch").value(), function (item) {
                    page.controls.grdRewardMaintan.dataBind(item);
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
                    //page.rewardService.getCustomerRewardByAll($$("txtRewardSearch").value(), function (item) {
                    //    page.controls.grdRewardMaintan.dataBind(item);
                    //    $$("msgPanel").hide();
                    //});
                    $$("btnRemove").show();
                    $$("txtRewardPlanName").focus();
                }
                
               
            },
            btnBeforeRemove_click: function () {
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
                if (confirm("Are You Sure Want To Delete this Product type")) {
                    page.delete();
                    //page.events.btnSearch_click();
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "concat(reward_plan_id,reward_plan_name,reward_plan_point) like '%" + $$("txtRewardSearch").value() + "%'",
                        sort_expression: ""
                    }
                    page.rewardplanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                        //page.rewardService.getCustomerRewardByAll($$("txtRewardSearch").value(), function (item) {
                        page.controls.grdRewardMaintan.dataBind(item);
                        page.controls.pnlRemoveConfirmPopup.close();
                    });
                    $$("btnRemove").hide();
                    $$("btnSave").hide();
                    //$$("btnNewReward").hide();
                    $(".basic-info").hide();
                }
            },
            page_load: function () {
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
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "concat(reward_plan_id,reward_plan_name,reward_plan_point) like '%" + $$("txtRewardSearch").value() + "%'",
                    sort_expression: ""
                }
                page.rewardplanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //page.rewardService.getRewardByAll("%", function (data) {
                    page.controls.grdRewardMaintan.dataBind(data);

                });
                var dataSourceCustomer = {
                    getData: function (term, callback) {
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "",
                            sort_expression: ""
                        }
                        page.rewardplanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) { });
                        //page.rewardService.getCustomerRewardByAll(term, callback);
                    }
                };
                $$("txtRewardSearch").focus();
            }

        };
     

    });
}