$.fn.customPrintPage = function () {
    return $.pageController.getPage(this, function (page, $$, e) {
        
        page.customPrintService = new customPrintService();
        page.entityService = new EntityService();

        page.currentPrintId = null;
        page.printCount = 1;
        page.billDetails = null;

        function confirmManualDisc() {
            var defer = $.Deferred();

            $("#dialog-form").dialog({
                autoOpen: true,
                modal: true,
                buttons: {
                    "Ok": function () {
                        var text1 = $("#manualcount");
                        //Do your code here
                        page.printCount = text1.val();
                        defer.resolve("Ok");
                        $(this).dialog("close");
                    },
                    "Cancel": function () {
                        defer.resolve("Cancel");

                        $(this).dialog("close");
                    }
                }
            });

            //$("#dialog-form").dialog("open");

            return defer.promise();
        }

        page.events = {

            page_load: function () {
                $$("grdSearchResult").width("100%");
                $$("grdSearchResult").height("485px");
                $$("grdSearchResult").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "ID", 'width': "80px", 'dataField': "print_id" },
                        { 'name': "Name", 'width': "180px", 'dataField': "print_name" },
                    ]
                });
                page.controls.grdSearchResult.dataBind([]);
                //Selection Changed Events for Template
                $$("grdSearchResult").selectionChanged = function (row, item) {
                    //Set the current print
                    page.currentPrintId = item.print_id;
                    //Load the data
                    $$("txtTemplate").val(item.template);
                    $$("txtPrintName").value(item.print_name);
                    $$("txtCondition").val(item.condition);
                    $$("txtSortBy").val(item.sort_by);
                    $$("ddlEntity").selectedValue(item.entity_id);
                    page.customPrintService.getEntityProp(item.entity_id, function (data) {
                        var prop_data = [];
                        $(data).each(function (i, item) {
                            prop_data.push({
                                prop_name: item.prop_name,
                                prop_type: item.prop_type
                            })
                        })
                        $$("txtDataBinding").val(JSON.stringify(prop_data));
                    })
                    $("textarea").each(function () {
                        this.value = this.value.replace(/-/g, ",");
                        this.value = this.value.replace(/A/g, '[');
                        this.value = this.value.replace(/B/g, ']');
                    });
                };

                page.customPrintService.getAllEntity(function (data) {
                    page.controls.ddlEntity.dataBind(data, "entity_id", "entity_name", "Select");
                })

                page.controls.ddlEntity.selectionChange(function () {
                    
                    //var data = page.entityService.getEntity($$("ddlEntity").selectedValue(), $$("txtCondition").val(), $$("txtSortBy").val())
                    //$$("txtDataBinding").val(JSON.stringify(data));
                    page.customPrintService.getEntityProp($$("ddlEntity").selectedValue(), function (data) {
                        var prop_data = [];
                        $(data).each(function (i, item) {
                            prop_data.push({
                                prop_name: item.prop_name,
                                prop_type: item.prop_type
                            })
                        })
                        $$("txtDataBinding").val(JSON.stringify(prop_data));
                    })
                });

                //$$("txtDataBinding").disable(true);
            }
        };

        //To search the Template
        page.events.btnSearch_click = function () {
            //Load the search result in grid
            page.customPrintService.getAllPrint(function (data) {
                page.controls.grdSearchResult.dataBind(data);
            });
        };

        //New Template
        page.events.btnNew_click = function () {
            //Set the current print
            page.currentPrintId = null;
            //Clear all the details
            $$("txtTemplate").val('');
            $$("txtPrintName").val('');
            $$("txtCondition").val('');
            $$("txtSortBy").val('');
        };

        //Save Template
        page.events.btnSave_click = function () {
            $("textarea").each(function () {
                this.value = this.value.replace(/,/g, "-");
                this.value = this.value.replace(/\[.*?/g, 'A');
                this.value = this.value.replace(/\].*?/g, 'B');
            });
            //Get the details
            var data = {
                print_id: page.currentPrintId,
                print_name: $$("txtPrintName").val(),
                template: $$("txtTemplate").val(),
                condition: $$("txtCondition").val(),
                sort_by: $$("txtSortBy").val(),
                entity_id: $$("ddlEntity").selectedValue()
            }
            //Verify it is new or not
            $$("msgPanel").show("Inserting new data...");
            if (page.currentPrintId == null || page.currentPrintId == '') {
                //insert data
                page.customPrintService.insertPrint(data, function (data) {
                    $$("msgPanel").show("Template saved successfully...!");
                    //Get the updated data
                    page.customPrintService.getPrintByNo(data[0].key_value, function (data) {
                        // Add the new data to Grid
                        $$("grdSearchResult").dataBind(data);
                        $$("grdSearchResult").getAllRows()[0].click();
                        $$("msgPanel").hide();
                        $("textarea").each(function () {
                            this.value = this.value.replace(/-/g, ",");
                            this.value = this.value.replace(/A/g, '[');
                            this.value = this.value.replace(/B/g, ']');
                        });
                    });
                });
            } else {
                $$("msgPanel").show("Updating data...");
                page.customPrintService.updatePrint(data, function (data) {
                    $$("msgPanel").show("Template updated successfully...!");
                    page.customPrintService.getPrintByNo(page.currentPrintId, function (data) {
                        // Update the new data to Grid
                        $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                        $$("grdSearchResult").selectedRows()[0].click();
                        $$("msgPanel").hide();
                        $("textarea").each(function () {
                            this.value = this.value.replace(/-/g, ",");
                            this.value = this.value.replace(/A/g, '[');
                            this.value = this.value.replace(/B/g, ']');
                        });
                    });
                });
            }
        };
        //New Template
        page.events.btnDelete_click = function () {
            if (page.currentPrintId == null) {
                alert("Please select the template");
            }
            else {
                if (confirm("Are you sure to remove the template") == true) {
                    page.customPrintService.deletePrint(page.currentPrintId, function (data) {
                        $$("msgPanel").show("Template deleted successfully...!");
                    });
                }
            }
        };
        page.events.btnPrint_click = function () {

            page.entityService.getEntity($$("ddlEntity").selectedValue(), $$("txtCondition").val(), $$("txtSortBy").val(), function (data) {
                page.controls.pnlPrint.open();
                page.controls.pnlPrint.title("Printing Screen");
                page.controls.pnlPrint.width(1000);
                page.controls.pnlPrint.height(500);

                page.billDetails = data;
                page.view.selectedPrintGrid(data);
            })
        };

        page.events.btnPrintGrid_click = function () {

            var data = page.controls.grdPrint.selectedData();
            $(data).each(function (i, item) {
                
                if (page.controls.ddlEntity.selectedValue() == "1")
                    generatePrint(1, data, item.copies);
                else if (page.controls.ddlEntity.selectedValue() == "3")
                   // var template = JSON.parse($$("txtTemplate").val());
                    generateBarCodePrint(template, data, item.copies);
                
            })
            

        };

        page.view = {
            selectedPrintGrid: function (data) {

                $$("grdPrint").width("100%");
                $$("grdPrint").height("485px");
                if (page.controls.ddlEntity.selectedValue() == "1"){
                    $$("grdPrint").setTemplate({
                        selection: "Multiple",
                        columns: [
                            { 'name': "Bill No", 'width': "80px", 'dataField': "bill_no" },
                            { 'name': "Bill Date", 'width': "150px", 'dataField': "bill_date" },
                            { 'name': "Cust No", 'width': "80px", 'dataField': "cust_no" },
                            { 'name': "Cust Name", 'width': "180px", 'dataField': "cust_name" },
                            { 'name': "Copies", 'width': "80px", 'dataField': "copies", editable: true },
                        ]
                    });
                }
                if (page.controls.ddlEntity.selectedValue() == "3") {
                    $$("grdPrint").setTemplate({
                        selection: "Multiple",
                        columns: [
                            { 'name': "Item No", 'width': "80px", 'dataField': "item_no" },
                            { 'name': "Item Name", 'width': "150px", 'dataField': "item_name" },
                            { 'name': "Copies", 'width': "80px", 'dataField': "copies", editable: true },
                        ]
                    });
                }
                
                page.controls.grdPrint.dataBind(data);
                page.controls.grdPrint.edit(true);
            }
        };

    });
}