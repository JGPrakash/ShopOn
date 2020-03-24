$.fn.itemProperty = function () {
    document.activeElement.msGetInputContext;
   
    return $.pageController.getControl(this, function (page, $$) {
        page.template("/" + appConfig.root + "/shopon/view/product/item-list/item-property/item-property.html?" + new Date());
        page.itemAPI = new ItemAPI();
        page.translateAPI = new TranslateAPI();
        page.itemPropertyAPI = new ItemPropertyAPI();
        page.propertyAPI = new PropertyAPI();
        page.propertyValueAPI = new PropertyValueAPI();
        page.itemCategoryAPI = new ItemCategoryAPI();
        page.categoryValueAPI = new CategoryValueAPI();
        page.itemList = [];
        page.item_property = null;

        var inputs = $(':input').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                var nextInput = inputs.get(inputs.index(document.activeElement) + 1);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
        var typingTimer;                //timer identifier
        var doneTypingInterval = 250;
        var $inputItemCount = $("[controlid=txtItemCount]");
        $inputItemCount.on('keydown', function (e) {
            if (e.which == 13) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () {
                    if ($$("txtItemCount").value() == "" || parseFloat($$("txtItemCount").value()) < 0) {
                        $$("txtItemCount").value(0);
                    }
                }, doneTypingInterval);
            }
        });

        page.events = {
            page_load: function () {
                $$("ddlPropertyName").selectionChange(function () {
                    page.categoryValueAPI.searchValue("", "", "cat_no = " + $$("ddlPropertyName").selectedValue(), "", function (data) {
                        page.controls.ddlPropertyValue.dataBind(data, "cat_val_id", "cat_value_name", "Select");
                    });
                });
            },
            btnNewItemProperty_click: function () {
                $$("ddlPropertyName").selectedValue("-1");
                $$("ddlPropertyValue").selectedValue("-1");
                page.item_property = null;
            },
            btnSaveItemProperty_click: function () {
                var data = {
                    item_no: page.item_no,
                    property_id: $$("ddlPropertyName").selectedValue(),
                    property_value_id: $$("ddlPropertyValue").selectedValue()
                }
                try{
                    if ($$("ddlPropertyName").selectedValue() == "-1" || $$("ddlPropertyName").selectedValue() == null || typeof $$("ddlPropertyName").selectedValue() == "undefined")
                        throw "Please Select The Property";
                    if ($$("ddlPropertyValue").selectedValue() == "-1" || $$("ddlPropertyValue").selectedValue() == null || typeof $$("ddlPropertyValue").selectedValue() == "undefined")
                        throw "Please Select The Property Value";
                    if (page.item_property == null) {
                        page.itemPropertyAPI.postValue(data, function (data) {
                            page.interface.load(page.item_no);
                        });
                    }
                    else {
                        data.item_property_id = page.item_property;
                        page.itemPropertyAPI.putValue(page.item_property,data, function (data) {
                            page.interface.load(page.item_no);
                        });
                    }
                }
                catch (e) {
                    alert(e);
                }
            }
        };

        page.interface.load = function (itemNo) {
            page.item_no = itemNo;
            page.itemPropertyAPI.searchValues("", "", "ipt.item_no = " + page.item_no, "", function (data) {
                page.view.selectedProperty(data);
            });
            //page.propertyAPI.searchValues("", "", "", "", function (data) {
            //    page.controls.ddlPropertyName.dataBind(data, "property_id", "property_name","Select");
            //});
            page.itemCategoryAPI.searchValue("", "", "", "", function (data) {
                page.controls.ddlPropertyName.dataBind(data, "cat_no", "cat_name", "Select");
            });
        };
        page.view = {
            selectedProperty: function (data) {
                page.controls.grditemProperty.width("100%");//1500px;
                page.controls.grditemProperty.height("460px");
                page.controls.grditemProperty.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "No", 'rlabel': 'No', 'width': "150px", 'dataField': "item_no" },
                        { 'name': "Name", 'rlabel': 'Name', 'width': "250px", 'dataField': "item_name" },
                        { 'name': "Property Name", 'width': "250px", 'dataField': "cat_name" },
                        { 'name': "Property Value Name", 'width': "250px", 'dataField': "cat_value_name" },
                        { 'name': "", 'width': "40px", 'dataField': "", itemTemplate: "<input type='button'  class='grid-button' value='' action='Delete' style='background-image: url(BackgroundImage/cancel.png);    background-size: contain;    background-color: transparent;    width: auto;background-repeat: no-repeat;    width: 15px;    border: none;    cursor: pointer;'/>" },
                    ]
                });
                page.controls.grditemProperty.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "Delete") {
                        if (confirm("Are You Sure Want To Delete This Property")) {
                            var data = {
                                item_property_id: page.item_property
                            }
                            page.itemPropertyAPI.deleteValue(page.item_property, data, function (data) {
                                page.interface.load(page.item_no);
                            });
                        }
                    }
                }
                page.controls.grditemProperty.selectionChanged = function (row, item) {
                    page.item_property = item.item_property_id;
                    $$("ddlPropertyName").selectedValue(item.property_id);
                    $$("ddlPropertyValue").selectedValue(item.property_value_id);

                }
                page.controls.grditemProperty.dataBind(data);
            },
        }
        page.clearPage = function () {
            $$("pnlProductDetails").hide();
            $$("txtProductName").selectedObject.val("");
        }
    });



}