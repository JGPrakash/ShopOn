$.fn.itemDiscount = function () {
    return $.pageController.getPage(this, function (page, $$) {

        //Import Services required  
        page.discountAPI = new DiscountAPI();
        page.discountItemAPI = new DiscountItemAPI();
        page.itemAPI = new ItemAPI();
        page.items;

        document.title = "ShopOn - Discount";
        $("body").keydown(function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode == 112) {
                e.preventDefault();
                page.events.btnNewDiscount_click();
            }
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnSaveDiscount_click();
            }
            if (e.keyCode == 82 && e.ctrlKey) {
                e.preventDefault();
                page.events.btnBeforeRemoveDiscount_click();
            }
        });
        function saveSO() {
            var newiSO = {
                disc_value: page.controls.txtDiscountValue.value(),
                disc_name: page.controls.txtDiscountName.value(),
                disc_type: page.controls.itemDiscountType.selectedValue(),
                disc_level: page.controls.itemDiscountLevel.selectedValue(),
                start_date: $$("txtStartDate").getDate(),
                end_date: page.controls.txtEndDate.getDate(),
                comp_id: localStorage.getItem("user_company_id"),
                store_no: localStorage.getItem("user_store_no"),
            };
            if (!page.currentSO.disc_no) {
                $$("msgPanel").show("Inserting discount...!");
                page.discountAPI.postValue(newiSO, function (data) {
                    var discount = {
                        disc_no: data[0].key_value,
                    }
                    page.discountAPI.getValue(discount, function (data) {
                        $$("msgPanel").show("Discount inserted sucessfully...!");
                        $$("grdDiscountResult").dataBind(data);
                        $$("grdDiscountResult").getAllRows()[0].click();
                        $$("msgPanel").hide();
                        $$("txtDiscountName").focus();
                    });
                });
            }
            else {
                var newSO = {
                    disc_no: page.currentSO.disc_no,
                    disc_value: page.controls.txtDiscountValue.value(),
                    disc_name: page.controls.txtDiscountName.value(),
                    disc_type: page.controls.itemDiscountType.selectedValue(),
                    disc_level: page.controls.itemDiscountLevel.selectedValue(),
                    start_date: $$("txtStartDate").getDate(),
                    end_date: page.controls.txtEndDate.getDate(),
                    store_no: localStorage.getItem("user_store_no"),
                };
                $$("msgPanel").show("Updating discount...!");
                page.discountAPI.putValue(newSO.disc_no, newSO, function (data1) {
                    $$("msgPanel").show("Discount updated sucessfully...!");

                    var discount = {
                        disc_no: newSO.disc_no
                    }
                    page.discountAPI.getValue(discount, function (data) {
                        $$("grdDiscountResult").updateRow($$("grdDiscountResult").selectedRowIds()[0], data[0]);
                        $$("grdDiscountResult").selectedRows()[0].click();
                        $$("msgPanel").hide();
                        $$("txtDiscountName").focus();
                    });
                });
            }
        }

        function RemoveDiscount() {
            if (page.currentSO != null) {
                $$("msgPanel").show("Removing discount...!");
                var data = {
                    disc_no: page.currentSO.disc_no
                }
                page.discountAPI.deleteValue(data.disc_no, data, function (data) {
                    $$("msgPanel").show("Discount removed sucessfully...!");
                    page.events.btnSearch_click();
                    page.controls.txtDiscountValue.value('');
                    page.controls.txtDiscountName.value('');
                    page.controls.itemDiscountType.selectedValue('');
                });
            } else {
                $$("msgPanel").show("Please select the discount first...!");
            }
        }
        page.view = {
            searchInput: function () {
                return page.controls.txtDiscountSearch.val();
            },
            searchResult: function (data) {
                page.controls.grdDiscountResult.width("100%");
                page.controls.grdDiscountResult.height("480px");
                page.controls.grdDiscountResult.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "Id", 'rlabel': 'No', 'width': "30%", 'dataField': "disc_no", visible: false },
                        { 'name': "Id", 'rlabel': 'No', 'width': "20%", 'dataField': "disc_id" },
                        { 'name': "Discount Name", 'rlabel': 'Name', 'width': "60%", 'dataField': "disc_name" }
                    ]
                });
                page.controls.grdDiscountResult.selectionChanged = function (rowList, dataList) {
                    page.events.grdTrayResult_select(dataList);
                    if (dataList.disc_name == "Manual Discount of x value" || dataList.disc_name == "Manual Discount of x percent" || dataList.disc_name == "Manual Discount of x percent") {
                        $$("btnAddTransaction").hide();
                        $$("btnSaveDiscount").hide();
                        $$("btnRemoveDiscount").hide();
                        $("#itemLabel").hide();
                        $("#grdTransactions").hide();
                    }
                    else {
                        $$("btnAddTransaction").show();
                        $$("btnSaveDiscount").show();
                        $$("btnRemoveDiscount").show();
                        $$("btnNewDiscount").show();
                        $("#itemLabel").show();
                        $("#grdTransactions").show();
                    }
                }
                page.controls.grdDiscountResult.dataBind(data);
            },
            selectedSO: function (item) {
                if (item) {
                    var discvalue = parseFloat(item.disc_value).toFixed(2);
                    page.controls.lblDiscNo.html(item.disc_no);
                    page.controls.txtDiscountValue.value(discvalue);
                    page.controls.txtDiscountName.value(item.disc_name);
                    page.controls.txtDiscountName.focus();
                    $$("itemDiscountType").selectedValue(item.disc_type);
                    $$("itemDiscountLevel").selectedValue(item.disc_level);
                    $("#txtStartDate").val(item.start_date).change();
                    $("#txtEndDate").val(item.end_date).change();
                    page.selectedSO = item;
                    page.controls.grdTransactions.dataBind([]);
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "i.disc_no=" + page.currentSO.disc_no,
                        sort_expression: ""
                    }
                    page.discountItemAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        page.controls.grdTransactions.width("100%");
                        page.controls.grdTransactions.height("332px");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 50,
                            columns: [
                                { 'name': "D.Item No", 'rlabel': 'D.Item No', 'width': "90px", 'dataField': "disc_item_no" },
                                { 'name': "Trans Date", 'rlabel': 'Trans Date', 'width': "150px", 'dataField': "trans_date" },
                                //{ 'name': "Item No", 'rlabel': 'Item No', 'width': "100px", 'dataField': "item_no" },
                                { 'name': "Item No", 'rlabel': 'Item No', 'width': "100px", 'dataField': "item_code" },
                                { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "250px", 'dataField': "item_name" },
                                {
                                    'name': "Action", 'rlabel': 'Action',
                                    'width': "100px",
                                    'dataField': "trans_id",//<input action='delete' style='padding:0px;font-size: 10px;' type='button' class='buttonSecondary' title ='Delete' value='Remove' />
                                    itemTemplate: "<input type='button' title='Delete'  class='grid-button' value='' action='delete' style='    border: none;    background-color: transparent;    background-image: url(./delete.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' /> "
                                }
                            ]
                        });
                        if (data.length == 0) {
                            page.controls.grdTransactions.dataBind([]);
                        } else {
                            page.controls.grdTransactions.dataBind(data);
                        }
                    });
                }
                return page.selectedSO;
            },
            selectedSOItems: function (data) {
            },
        }
        page.events = {
            btnBeforeRemoveDiscount_click: function () {
                var result;
                result = page.controls.grdTransactions.allData().length;
                if (result == 0) {
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
                } else {
                    $$("lblAtert").html("This Discount Contains " + result + " Transactions, Please Remove The Transaction Then Delete This Discount");
                    page.controls.pnlRemoveAlertPopup.open();
                    page.controls.pnlRemoveAlertPopup.title("Remove Alert");
                    page.controls.pnlRemoveAlertPopup.rlabel("Remove Alert");
                    page.controls.pnlRemoveAlertPopup.width(540);
                    page.controls.pnlRemoveAlertPopup.height(200);
                }
            },
            btnRemoveAlertPopupClose_click: function () {
                page.controls.pnlRemoveAlertPopup.close();
            },
            btnRemoveConfirmPopupClose_click: function () {
                page.controls.pnlRemoveConfirmPopup.close();
            },
            btnRemoveDiscount_click: function () {
                RemoveDiscount();
                page.controls.pnlRemoveConfirmPopup.close();
                $$("btnAddTransaction").hide();
            },
            btnSearch_click: function () {
                $$("btnSaveDiscount").hide();
                $$("btnRemoveDiscount").hide();
                $$("btnAddTransaction").hide();
                $(".detail-info").hide();
                $$("msgPanel").show("Searching...");
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "concat(ifnull(disc_id,''),ifnull(disc_name,'')) like '%" + page.view.searchInput() + "%'",
                    sort_expression: ""
                }
                page.discountAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    page.view.searchResult(data);
                    $$("msgPanel").hide();
                });
                page.currentSO = null;
            },
            grdTrayResult_select: function (item) {
                $(".detail-info").show();
                page.currentSO = item;
                page.currentSOItem = [];
                var discount = {
                    disc_no: page.currentSO.disc_no,
                }
                page.discountAPI.getValue(discount, function (dataitem) {
                    if (dataitem.length > 0) {
                        page.view.selectedSO(dataitem[0]);
                    } else {
                        page.view.selectedSO([]);
                    }
                });
            },

            btnNewDiscount_click: function () {
                var date = new Date();
                $(".detail-info").show();
                $$("txtDiscountValue").val('');
                $$("txtDiscountName").val('');
                $$("itemDiscountType").selectedValue('');
                $$("itemDiscountLevel").selectedValue('Item');
                $$("txtEndDate").setDate('');
                $$("btnRemoveDiscount").hide();
                page.events.btnSearch_click();
                page.controls.lblDiscNo.html('');
                page.controls.txtStartDate.selectedObject.val("");
                page.controls.txtEndDate.selectedObject.val("");
                page.controls.grdDiscountResult.dataBind([]);
                $$("btnSaveDiscount").show();
                $(".detail-info").show();
                $("#itemLabel").hide();
                $("#grdTransactions").hide();
                $$("txtDiscountName").focus();
            },

            btnAddTransaction_click: function () {
                if (page.currentSO != null) {
                    page.controls.pnlItemDiscountPopup.open();

                    page.controls.pnlItemDiscountPopup.title("Map item to Discount");
                    page.controls.pnlItemDiscountPopup.rlabel("Map item to Discount");
                    page.controls.pnlItemDiscountPopup.width(340);
                    page.controls.pnlItemDiscountPopup.height(240);

                    $$("dsBillPayDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));
                    $$("btnDiscountItemOK").disable(false);
                    $$("ddlItem").selectedObject.val("");
                    $$("ddlItem").selectedObject.focus();
                } else {
                    $$("msgPanel").show("Please select the discount first to map item...!");
                }
            },
            btnDiscountItemOK_click: function () {
                $$("btnDiscountItemOK").disable(true);
                try {
                    var trans = {
                        trans_date: dbDateTime(page.controls.dsBillPayDate.getDate()),
                        disc_no: page.currentSO.disc_no,

                        item_no: page.controls.ddlItem.selectedValue(),
                    };
                    $$("msgPanel").show("Inserting  discount item...!");
                    page.discountItemAPI.postValue(trans, function (data) {
                        $$("msgPanel").show("Discount item details saved successfully...!");
                        page.controls.pnlItemDiscountPopup.close();
                        $$("btnDiscountItemOK").disable(false);
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "i.disc_no=" + page.currentSO.disc_no,
                            sort_expression: ""
                        }
                        page.discountItemAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            page.controls.grdTransactions.dataBind(data);
                            $$("msgPanel").hide();
                        });
                    }, function (error) {
                        page.controls.pnlItemDiscountPopup.close();

                        $$("msgPanel").show("This item is already mapped to the different discount. You cannot map the same item to multiple discount...!");
                        $$("btnDiscountItemOK").disable(false);
                    });
                }
                catch (e) {
                    page.controls.pnlItemDiscountPopup.close();
                    $$("msgPanel").flash("This item is already mapped to the different discount. You cannot map the same item to multiple discount...!");
                    $$("btnDiscountItemOK").disable(false);
                }
            },
            btnSaveDiscount_click: function () {
                 if ($$("txtDiscountName").val() == "") {
                    $$("msgPanel").show("Please fill discount name...!!!");
                    $$("txtDiscountName").focus();
                }
             else if ($$("txtDiscountValue").val() == "") {
                    $$("msgPanel").show("Please fill discount value...!!!");
                    $$("txtDiscountValue").focus();
                }

                else if ($$("txtStartDate").getDate() == "") {
                    $$("msgPanel").show("Start date is missing...!!!");
                }
                else {
                    if (page.currentSO != null) {
                        saveSO();
                    }
                    else {
                        var input = {
                            disc_name: page.controls.txtDiscountName.value(),
                            disc_value: page.controls.txtDiscountValue.value(),
                            disc_type: page.controls.itemDiscountType.selectedValue(),
                            disc_level: page.controls.itemDiscountLevel.selectedValue(),
                            start_date: $$("txtStartDate").getDate(),
                            end_date: page.controls.txtEndDate.getDate(),
                            comp_id: localStorage.getItem("user_company_id"),
                            store_no: localStorage.getItem("user_store_no"),
                        };
                        $$("msgPanel").show("Inserting discount...!");
                        page.discountAPI.postValue(input, function (data) {
                            var disc_no = data[0].key_value
                            $$("msgPanel").show("Discount saved sucessfully...!");
                            var discount = {
                                disc_no: data[0].key_value,
                            }
                            page.discountAPI.getValue(discount, function (data) {
                                page.view.searchResult(data);
                                page.controls.grdDiscountResult.getAllRows()[0].click();
                                $$("msgPanel").hide();
                                $$("txtDiscountName").focus();
                            });
                            page.controls.txtDiscName.val('');
                            page.controls.txtDiscValue.val('');
                        });
                        $$("msgPanel").show("Please select the discount first to proceed this...!");
                    }
                }
                $$("btnNewDiscount").show();
                $$("btnAddTransaction").show();
                $$("btnRemoveDiscount").show();
            },
            btnApplyDiscountToAllItems_click: function () {
                if ((confirm("Are You Sure Want To Apply This Discount To All Items Of Ok The Previous Added Items Will Be Deleted"))){
                    $$("msgPanel").flash("Removing discount item...!");
                    $($$("grdTransactions").allData()).each(function (i, item) {
                        var data = {
                            disc_item_no: item.disc_item_no
                        }
                        page.discountItemAPI.deleteValue(data.disc_item_no, data, function (data) {
                            $$("msgPanel").flash("Removing previous discount item...!");
                        });
                    });
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "",
                        sort_expression: ""
                    }
                    $(page.items).each(function (i, item) {
                        var trans = {
                            trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            disc_no: page.currentSO.disc_no,

                            item_no: item.item_no,
                        };
                        $$("msgPanel").flash("Inserting  discount item...!");
                        page.discountItemAPI.postValue(trans, function (data) {
                            if ((page.items.length - 1) == i) {
                                $$("msgPanel").flash("Inserting  discount item successfully...!");
                                page.discountItemAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                                    page.controls.grdTransactions.dataBind(data);
                                    $$("msgPanel").hide();
                                });
                            }
                        });
                    })
                }
            },
            page_init: function () { },

            page_load: function () {

                $$("txtDiscountSearch").focus();
                $$("btnSaveDiscount").hide();
                $$("btnRemoveDiscount").hide();
                $$("btnAddTransaction").hide();
                page.events.btnSearch_click();
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.itemAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    //$$("ddlItem").dataBind(data, "item_no", "item_name");
                    page.items = data;
                });
                page.controls.ddlItem.dataBind({
                    getData: function (term, callback) {
                        callback(page.items);
                    }
                });

                page.view.searchResult([]);
                if ($$("itemDiscountLevel").selectedValue() != "Item") {
                    $('#grdTransactions').hide();
                    $('#itemLabel').hide();

                }
                else {
                    $('#grdTransactions').show();
                    $('#itemLabel').show();
                }

                $$("grdTransactions").rowCommand = function (obj) {
                    if (obj.action == "delete") {
                        page.controls.pnlRemove1ConfirmPopup.open();
                        page.controls.pnlRemove1ConfirmPopup.title("Remove Alert");
                        page.controls.pnlRemove1ConfirmPopup.rlabel("Remove Alert");
                        page.controls.pnlRemove1ConfirmPopup.width(540);
                        page.controls.pnlRemove1ConfirmPopup.height(200);
                        if (CONTEXT.ENABLE_REMOVE) {
                            $$("btnRemove1AlertPopupSave").show();
                        }
                        else {
                            $$("btnRemove1AlertPopupSave").hide();
                        }
                    }
                }

                $$("itemDiscountLevel").selectionChange(function (data) {
                    if ($$("itemDiscountLevel").selectedValue() != "Item") {
                        if ($$("grdTransactions").allData().length == 0) {

                            $('#grdTransactions').hide();
                            $('#itemLabel').hide();

                        }
                        else {
                            $$("itemDiscountLevel").selectedValue("Item");
                            $$("msgPanel").show("This discount is mapped with item already. To change the discount level to Global, you need to delete all the mapped items...!");

                        }

                    }
                    else {
                        $('#grdTransactions').show();
                        $('#itemLabel').show();
                    }

                });

                //$$("txtDiscountSearch").keyup(function () {
                //    var data = {
                //        start_record: 0,
                //        end_record: "",
                //        filter_expression: "concat(ifnull(disc_no,''),ifnull(disc_name,'')) like '%" + page.view.searchInput() + "%'",
                //        sort_expression: ""
                //    }
                //    page.discountAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //        page.view.searchResult(data);
                //    });
                //});
            },
            btnRemove1ConfirmPopupClose_click:function(){
                page.controls.pnlRemove1ConfirmPopup.close();
            },
            btnRemove1Tray_click:function(){
                var data;
                $$("msgPanel").show("Removing discount item...!");
                var data = {
                    disc_item_no: $$("grdTransactions").selectedData()[0].disc_item_no
                }
                page.discountItemAPI.deleteValue(data.disc_item_no, data, function (data) {
                    $$("msgPanel").show("Discount item removed sucessfully...!");
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "i.disc_no=" + page.currentSO.disc_no,
                        sort_expression: ""
                    }
                    page.discountItemAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        page.controls.grdTransactions.dataBind(data);
                        $$("msgPanel").hide();
                        page.controls.pnlRemove1ConfirmPopup.close();
                    });
                });
            },
            btnAddDiscountOK_click: function () {

                //try {

                var input = {
                    disc_name: page.controls.txtDiscName.value(),
                    disc_value: page.controls.txtDiscValue.value(),
                    comp_id: localStorage.getItem("user_company_id"),
                };
                $$("msgPanel").show("Inserting discount...!");
                page.discountAPI.postValue(input, function (data) {
                    var disc_no = data[0].key_value
                    $$("msgPanel").show("Discount saved sucessfully...!");
                    var discount = {
                        disc_no: data[0].key_value,
                    }
                    page.discountAPI.getValue(discount, function (data) {
                        page.view.searchResult(data);
                        page.controls.grdDiscountResult.getAllRows()[0].click();

                    });
                    $$("pnlNewDiscountPopup").close();
                    page.controls.txtDiscName.val('');
                    page.controls.txtDiscValue.val('');
                });
            }
        }

        page.interface.load = function () {
            $(page.selectedObject).load("/view/pages/item-list/item-list.html");
        }
    });
}