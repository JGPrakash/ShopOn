/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.businessServicesPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.shopKeeperAPI = new ShopKeeperAPI();
        page.shopKeeperRequestAPI = new ShopKeeperRequestAPI();
        page.searchMethod = "Date";
        page.service_no = "0";
        page.shopkeeperno = "0";
        page.events = {
            page_load: function () {
                $(".footer").html(footerTemplate.join(""));

                if (localStorage.getItem("business_user_id") != null && typeof localStorage.getItem("business_user_id") != "undefined" && localStorage.getItem("business_user_id") != "") {
                    page.shopKeeperAPI.searchValues("", "", "user_id = '" + localStorage.getItem("business_user_id") + "'", "", function (data) {
                        page.shopkeeperno = data[0].shopkeeper_no;
                        page.shopKeeperRequestAPI.searchValues("", "", "srt.shopkeeper_no = '" + page.shopkeeperno + "' and  srt.cre_date>=DATE_SUB(sysdate(),INTERVAL 30 DAY)", "", function (data) {
                            page.view.selectedServiceGrid(data);
                        });
                    });
                }
                else {
                    window.location.href = './business-signin.html';
                }


                $$("ddlServiceDate").selectionChange(function () {
                    page.events.btnSearch_click();
                });

                page.view.selectedSearchMethod("Date");
            },
            btnSearch_click: function () {
                if ($$("txtServiceId").value() != "") {
                    page.shopKeeperRequestAPI.searchValues("", "", "shopkeeper_no = '" + page.shopkeeperno + "' and shopkeeper_request_no = '" + $$("txtServiceId").value() + "'", "", function (data) {
                        page.view.selectedServiceGrid(data);
                    });
                }
                else {
                    var add_search = "", limit_search = "";
                    if (page.searchMethod == "Open")
                        add_search = " and srt.state_no not in (5,6)";
                    if (page.searchMethod == "Date") {
                        if ($$("ddlServiceDate").selectedValue() == "1") {
                            limit_search = " and srt.cre_date>=DATE_SUB(sysdate(),INTERVAL 30 DAY)";
                        }
                        else if ($$("ddlServiceDate").selectedValue() == "2") {
                            limit_search = " and srt.cre_date>=DATE_SUB(sysdate(),INTERVAL 100 DAY)";
                        }
                    }
                    page.shopKeeperRequestAPI.searchValues("", "", "srt.shopkeeper_no = '" + page.shopkeeperno + "'" + add_search + limit_search, "", function (data) {
                        page.view.selectedServiceGrid(data);
                    });
                }
            },
            btnServiceDateSearch_click: function () {
                page.view.selectedSearchMethod("Date");
                page.events.btnSearch_click();
            },
            btnOpenServices_click: function () {
                page.view.selectedSearchMethod("Open");
                page.events.btnSearch_click();
            },
            //btnOpenConfirmation_click: function () {
            //    page.controls.pnlConfirmation.open();
            //    page.controls.pnlConfirmation.title("Message");
            //    page.controls.pnlConfirmation.width(600);
            //    page.controls.pnlConfirmation.height(350);
            //},
            //btnCloseConfirmation_click: function () {
            //    page.controls.pnlConfirmation.close();
            //},
            //btnConfirmCancel_click: function () {
            //    try{
            //        if ($$("txtCancelReason").val() == "" || $$("txtCancelReason").val() == null || typeof $$("txtCancelReason").val() == "undefined")
            //            throw "Cancel Reason Is Not Valid...!!!";;
            //        var data = {
            //            cancel_reason: $$("txtCancelReason").val(),
            //            state_no: "7",
            //            service_no:page.service_no
            //        }
            //        page.serviceAPI.putValue(page.service_no, data, function (data) {
            //            page.events.btnCloseConfirmation_click();
            //            page.events.btnOpenSuccess_click();
            //        });
            //    }
            //    catch (e) {
            //        page.events.btnOpenAlert_click(e);
            //    }
            //},
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
            btnOpenSuccess_click: function () {
                page.controls.pnlSuccess.open();
                page.controls.pnlSuccess.title("Message");
                page.controls.pnlSuccess.width(500);
                page.controls.pnlSuccess.height(200);
            },
            btnCloseSuccess_click: function () {
                page.controls.pnlSuccess.close();
                page.events.btnSearch_click();
            },
            btnNewRequest_click: function () {
                page.controls.pnlNewServices.open();
                page.controls.pnlNewServices.title("New Services");
                page.controls.pnlNewServices.width(600);
                page.controls.pnlNewServices.height(320);
            },
            btnDiscardServiceRequest_click: function () {
                page.controls.pnlNewServices.close();
            },
            btnSaveServiceRequest_click: function () {
                try{
                    if ($$("txtNewServiceDetails").value() == "" || $$("txtNewServiceDetails").value() == null || typeof $$("txtNewServiceDetails").value() == "undefined") {
                        throw "Service Details Is Not Valid...";
                    }
                    var data = {
                        shopkeeper_request: $$("txtNewServiceDetails").value(),
                        state_no: "1",
                        shopkeeper_no: page.shopkeeperno,
                        default:"1"
                    }
                    page.shopKeeperRequestAPI.postValue(data, function (data) {
                        page.events.btnDiscardServiceRequest_click();
                        $$("txtNewServiceDetails").value("");
                        page.events.btnOpenSuccess_click();
                    });
                }
                catch (e) {
                    page.events.btnOpenAlert_click(e);
                }
            }
        }

        page.view = {
            selectedServiceGrid: function (data) {
                $$("grdServices").width("98%");
                $$("grdServices").height("auto;min-height:100px;overflow-y:auto;overflow-x:hidden;");
                page.controls.grdServices.setTemplate({
                    selection: "Single", sort: false,
                    columns: [
                        { 'name': "", 'width': "0px", 'dataField': "qty", visible: false },

                        { 'name': "", 'width': "100%;margin: 0px;padding: 15px;border: 1px solid #c1bfbf;", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                    ]
                });
                page.controls.grdServices.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    
                }
                page.controls.grdServices.rowBound = function (row, item) {
                    var htmlTemplate = [];
                    if (window.mobile) {
                        htmlTemplate.push('<div class="col-xs-12">');
                        htmlTemplate.push('<span class="order-list-style1 col-xs-12">Service Placed</span><h4 class="order-date col-xs-12">' + convertDBDateToNormalString(item.cre_date) + '</h4><hr class="col-xs-12"><span class="order-list-style1 col-xs-12"><b>Service Id:</b>&nbsp;' + item.shopkeeper_request_no + '</span>');
                        htmlTemplate.push('</div>');
                        htmlTemplate.push('<div class="col-xs-12">');
                        htmlTemplate.push('<h2 class="state-text col-xs-12">Service Details:</h2>');
                        htmlTemplate.push('<hr class="col-xs-12">');
                        htmlTemplate.push('<span class="order-list-style1 col-xs-12"><b>' + item.shopkeeper_request + '</b></span>');
                        htmlTemplate.push('</div>');
                        htmlTemplate.push('<div class="col-xs-12">');
                        htmlTemplate.push('<h2 class="state-text col-xs-12">Service Status: ' + item.state_name + '</h2>');
                        htmlTemplate.push('</div>');
                    }
                    else {
                        htmlTemplate.push('<div class="col-xs-3">');
                        htmlTemplate.push('<span class="order-list-style1 col-xs-12">Service Placed</span><h4 class="order-date col-xs-12">' + convertDBDateToNormalString(item.cre_date) + '</h4><hr class="col-xs-12"><span class="order-list-style1 col-xs-12"><b>Service Id:</b>&nbsp;' + item.shopkeeper_request_no + '</span>');
                        htmlTemplate.push('</div>');
                        htmlTemplate.push('<div class="col-xs-6">');
                        htmlTemplate.push('<h2 class="state-text col-xs-12">Service Details:</h2>');
                        htmlTemplate.push('<hr class="col-xs-12">');
                        htmlTemplate.push('<span class="order-list-style1 col-xs-12"><b>' + item.shopkeeper_request + '</b></span>');
                        htmlTemplate.push('</div>');
                        htmlTemplate.push('<div class="col-xs-3">');
                        htmlTemplate.push('<span class="order-list-style1 col-xs-12">Service Status</span><h4 class="order-date col-xs-12">' + item.state_name + '</h4>');
                        htmlTemplate.push('</div>');
                    }
                    $(row).find("[id=prdDetail]").html(htmlTemplate.join(""));

                };

                $$("grdServices").dataBind(data);

                if ($$("txtServiceId").value() == "") {
                    if (page.searchMethod == "Date") {
                        if ($$("ddlServiceDate").selectedValue() == "1") {
                            $$("lblNoOfServices").html(data.length + " services placed in the last 30 days");
                        }
                        else if ($$("ddlServiceDate").selectedValue() == "2") {
                            $$("lblNoOfServices").html(data.length + " services placed in the last 100 days");
                        }
                        else {
                            $$("lblNoOfServices").html(data.length + " services placed");
                        }
                    }
                    else {
                        $$("lblNoOfServices").html(data.length + " services placed in open");
                    }
                }
                else {
                    $$("lblNoOfServices").html("Result For Search Service Id&nbsp;" + $$("txtServiceId").value());
                }
            },
            selectedSearchMethod: function (method,callback) {
                $$("btnServiceDateSearch").selectedObject.removeClass("active-color");
                $$("btnOpenServices").selectedObject.removeClass("active-color");
                if (method == "Date") {
                    $$("btnServiceDateSearch").selectedObject.addClass("active-color");
                    page.searchMethod = "Date";
                }
                else {
                    $$("btnOpenServices").selectedObject.addClass("active-color");
                    page.searchMethod = "Open";
                }
            }
        }

        //page.printJasper = function (bill_no) {
        //    var billdata = {
        //        bill_no: bill_no,
        //    }
        //    page.billService.getSalesPrint(billdata, function (data) {
        //        page.events.btnPrintInvoice(data);
        //    });
        //}

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
}

function ShopKeeperRequestAPI() {
    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("services/shopkeeperrequest/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("services/shopkeeperrequest/", data, callback, errorCallback);
    }
    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("services/shopkeeperrequest/" + id, data, callback, errorCallback);
    }
}

function datediff(first_date) {
    var current_date = new Date();
    var mdy = first_date.split('-');
    var start_date = new Date(mdy[2], mdy[1]-1, mdy[0]);
    return Math.round((current_date - start_date) / (1000 * 60 * 60 * 24));
}


