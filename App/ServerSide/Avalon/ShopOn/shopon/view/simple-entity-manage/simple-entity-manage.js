$.fn.simpleEntityManage = function() {
    return $.pageController.getControl(this, function(page, $$) {

        page.template("/" + appConfig.root + "/shopon/view/simple-entity-manage/simple-entity-manage.html");
        page.simpleService = null;
        page.columns = [];
        page.screenName = null;
        page.keyColumn = null;
        if (page.uniqueId = "settingsManagePage_ucSimpleEntityManage") {
            screenName = "settingsScreen";
        }
        page.interface.load = function(entityManager) {
            page.simpleService = entityManager.service;
            page.keyColumn = entityManager.keyColumn;

            $(entityManager.columns).each(function(i, column) {
                var newColumn = {
                    name: column.name,
                    width: column.width,
                    dataField: column.dataField,

                };
                if (column.templateStyle == "TextBox") {
                    newColumn.itemTemplate = "<span style='width: 100%;word-wrap: break-word; display: block; white-space: normal; overflow-y: auto; max-height: 70px;' mode='view'>{" + newColumn.dataField + "}</span><textarea dataField='" + newColumn.dataField + "' mode='edit'  style=' margin-bottom: 5px;border:none;display:none;border: medium none; width: 100%; height: 20px;'  value='{" + newColumn.dataField + "}' ></textArea>";
                } else if (column.templateStyle == "Select") {
                    var optionHTML = "";
                    $(column.lookUpValues).each(function(j, lookupData) {
                        optionHTML = optionHTML + " <option value='" + lookupData.value + "'>" + lookupData.text + "</option>";
                    });
                    newColumn.itemTemplate = "<span mode='view'>{" + newColumn.dataField + "}</span><select dataField='" + newColumn.dataField + "'  valueDataField='" + column.valueDataField + "'  mode='edit' style='border:none;background-color:transparent;display:none;'>" + optionHTML + "</select>";

                }
                
                page.columns.push(newColumn);
            });

            page.columns.push({ 'name': "Action", 'width': "180px", 'dataField': "status", itemTemplate: "<input type='button' action='save' value='Save' style='display:none' /> <input type='button' action='cancel' value='Cancel' style='display:none'/> <input type='button' action='edit' value='Edit' /> <input type='button' action='delete' value='Delete'  />" });


            page.simpleService.getAllData(function(data) {
                $$("grdDataList").dataBind(data);
            });


        }


        page.events.page_load = function() {


            $$("grdDataList").width("100%");
            $$("grdDataList").height("400px");
            $$("grdDataList").setTemplate({
                selection: "Single",
                columns: page.columns
            });

            $$("grdDataList").selectedObject.on("change", "textarea[dataField]", function() {
                var data = $$("grdDataList").getRowData($(this).closest("[row_id]"));

                data[$(this).attr("dataField")] = $(this).val();


            });

            $$("grdDataList").selectedObject.on("change", "select[dataField]", function() {
                var data = $$("grdDataList").getRowData($(this).closest("[row_id]"));
                data[$(this).attr("dataField")] = $(this).find('option:selected').text();
                data[$(this).attr("valueDataField")] = $(this).val();


            });



            $$("grdDataList").rowCommand = function(obj) {

                if (obj.action == "edit") {
                    $(obj.currentRow).find("[action=save]").show();
                    $(obj.currentRow).find("[action=cancel]").show();

                    $(obj.currentRow).find("[action=edit]").hide();
                    $(obj.currentRow).find("[action=delete]").hide();


                    $(obj.currentRow).find("[dataField]").each(function(i, ctrl) {
                        if ($(ctrl).attr("valueDataField"))
                            $(ctrl).val(obj.currentData[$(ctrl).attr("valueDataField")]);
                        else
                            $(ctrl).val(obj.currentData[$(ctrl).attr("dataField")]);

                    });

                    $(obj.currentRow).find("[mode=view]").hide();
                    $(obj.currentRow).find("[mode=edit]").show();

                }
                if (obj.action == "save") {

                    if (typeof obj.currentData[page.keyColumn] == "undefined") {
                        page.simpleService.insertData(obj.currentData, function(data) {
                            obj.currentData[page.keyColumn] = data[0].key_value;

                            $$("grdDataList").updateRow(obj.currentRowId, obj.currentData);
                            $(obj.currentRow).find("[action=save]").hide();
                            $(obj.currentRow).find("[action=cancel]").hide();

                            $(obj.currentRow).find("[action=edit]").show();
                            $(obj.currentRow).find("[action=delete]").show();
                            $(obj.currentRow).find("[mode=view]").show();
                            $(obj.currentRow).find("[mode=edit]").hide();
                        });


                    } else {

                        page.simpleService.updateData(obj.currentData, function() {
                            $$("grdDataList").updateRow(obj.currentRowId, obj.currentData);
                            $(obj.currentRow).find("[action=save]").hide();
                            $(obj.currentRow).find("[action=cancel]").hide();

                            $(obj.currentRow).find("[action=edit]").show();
                            $(obj.currentRow).find("[action=delete]").show();
                            $(obj.currentRow).find("[mode=view]").show();
                            $(obj.currentRow).find("[mode=edit]").hide();
                        });


                    }







                }
                if (obj.action == "cancel") {
                    $(obj.currentRow).find("[action=save]").hide();
                    $(obj.currentRow).find("[action=cancel]").hide();

                    $(obj.currentRow).find("[action=edit]").show();
                    $(obj.currentRow).find("[action=delete]").show();
                    $(obj.currentRow).find("[mode=view]").show();
                    $(obj.currentRow).find("[mode=edit]").hide();

                }
                if (obj.action == "delete") {

                    page.simpleService.deleteData(obj.currentData[page.keyColumn], function() {
                        $$("grdDataList").deleteRow(obj.currentRowId);
                    });

                }

            };


            if(page.screenName="settingsScreen")
            {
                $$("grdDataList2").width("100%");
                $$("grdDataList2").height("100px");
                $$("grdDataList2").setTemplate({
                    selection: "Single",
                    columns: page.columns
                });

                $$("grdDataList2").selectedObject.on("change", "textarea[dataField]", function () {
                    var data = $$("grdDataList2").getRowData($(this).closest("[row_id]"));

                    data[$(this).attr("dataField")] = $(this).val();


                });

                $$("grdDataList2").selectedObject.on("change", "select[dataField]", function () {
                    var data = $$("grdDataList2").getRowData($(this).closest("[row_id]"));
                    data[$(this).attr("dataField")] = $(this).find('option:selected').text();
                    data[$(this).attr("valueDataField")] = $(this).val();


                });



                $$("grdDataList2").rowCommand = function (obj) {

                    if (obj.action == "edit") {
                        $(obj.currentRow).find("[action=save]").show();
                        $(obj.currentRow).find("[action=cancel]").show();

                        $(obj.currentRow).find("[action=edit]").hide();
                        $(obj.currentRow).find("[action=delete]").hide();


                        $(obj.currentRow).find("[dataField]").each(function (i, ctrl) {
                            if ($(ctrl).attr("valueDataField"))
                                $(ctrl).val(obj.currentData[$(ctrl).attr("valueDataField")]);
                            else
                                $(ctrl).val(obj.currentData[$(ctrl).attr("dataField")]);

                        });

                        $(obj.currentRow).find("[mode=view]").hide();
                        $(obj.currentRow).find("[mode=edit]").show();

                    }
                    if (obj.action == "save") {

                        if (typeof obj.currentData[page.keyColumn] == "undefined") {
                            page.simpleService.insertData(obj.currentData, function (data) {
                                obj.currentData[page.keyColumn] = data[0].key_value;

                                $$("grdDataList2").updateRow(obj.currentRowId, obj.currentData);
                                $(obj.currentRow).find("[action=save]").hide();
                                $(obj.currentRow).find("[action=cancel]").hide();

                                $(obj.currentRow).find("[action=edit]").show();
                                $(obj.currentRow).find("[action=delete]").show();
                                $(obj.currentRow).find("[mode=view]").show();
                                $(obj.currentRow).find("[mode=edit]").hide();
                            });


                        } else {

                            page.simpleService.updateData(obj.currentData, function () {
                                $$("grdDataList2").updateRow(obj.currentRowId, obj.currentData);
                                $(obj.currentRow).find("[action=save]").hide();
                                $(obj.currentRow).find("[action=cancel]").hide();

                                $(obj.currentRow).find("[action=edit]").show();
                                $(obj.currentRow).find("[action=delete]").show();
                                $(obj.currentRow).find("[mode=view]").show();
                                $(obj.currentRow).find("[mode=edit]").hide();
                            });


                        }







                    }
                    if (obj.action == "cancel") {
                        $(obj.currentRow).find("[action=save]").hide();
                        $(obj.currentRow).find("[action=cancel]").hide();

                        $(obj.currentRow).find("[action=edit]").show();
                        $(obj.currentRow).find("[action=delete]").show();
                        $(obj.currentRow).find("[mode=view]").show();
                        $(obj.currentRow).find("[mode=edit]").hide();

                    }
                    if (obj.action == "delete") {

                        page.simpleService.deleteData(obj.currentData[page.keyColumn], function () {
                            $$("grdDataList2").deleteRow(obj.currentRowId);
                        });

                    }

                };
            }


        }
        page.events.btnAdd_click = function() {
            var rowId = $$("grdDataList").createRow({}, true);
            $$("grdDataList").selectedObject.find("[row_id=" + rowId + "]").find("[action=edit]").click();






        }




    });
}