/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.propertyPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.propertyAPI = new PropertyAPI();
        page.propertyValueAPI = new PropertyValueAPI();
        page.mainProductTypeAPI = new MainProductTypeAPI();
        page.property_id = null;
        
        page.property_value_id = null;
        document.title = "Property";
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
                page.events.btnNew_click();
            }
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnSave_click();
            }
            if (e.keyCode == 82 && e.ctrlKey) {
                e.preventDefault();
                page.events.btnDelete_click();
            }

        });
        //To search the mpt_name
        page.events.btnSearch_click = function () {
            //Hide the right side panel
            $(".detail-info").hide();
            //Hide Save and Delete button
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("msgPanel").show("Searching...");

            //Load the search result in grid
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "concat(ifnull(property_id,''),ifnull(property_name,'')) like '%" + $$("txtSearchInput").value() + "%'",
                sort_expression: ""
            }
            page.propertyAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //page.itemService.getMainProductByName($$("txtSearchInput").value(), function (data) {
                $$("grdSearchResult").dataBind(data);
                $$("msgPanel").hide();
            });

            page.mainProductTypeAPI.searchValues("", "", "", "", function (data) {
                $$("ddlMainProductName").dataBind(data, "mpt_no", "mpt_name");
            });
            
        };

        //To create a new mpt_name
        page.events.btnNew_click = function () {
            //Show the panel
            $(".detail-info").show();
            //Show the Save button and hide delete button
            $$("btnSave").show();
            $$("btnDelete").hide();


            //Clear all textbox
            //$$("msgPanel").show("Clearing all fields to get new mpt_name data..");
            $$("txtPropertyName").val('');
            $$("txtPropertyValue").val('');
            $$("txtPropertyValueSortOrder").val('');
            $$("txtPropertyName").focus();

            //Set the curent mainproduct no to null
            page.property_id = null;

            $$("pnlPropertyValue").hide();
        };

        //To insert or update a mainproduct
        page.events.btnSave_click = function () {
            var mainproduct = {
                property_name: $$("txtPropertyName").value(),
                comp_id: localStorage.getItem("user_company_id"),
                sort_order: $$("txtPropertySortOrder").value()
            };
            if (mainproduct.property_name == "" || mainproduct.property_name == null || typeof mainproduct.property_name == "undefined") {
                $$("msgPanel").show("Property name is mandatory ...!");
                $$("txtPropertyName").focus();
                //alert("Vendor Name is Mantatory");
            }
            else {

                $$("msgPanel").show("Inserting new property...");
                if (page.property_id == null || page.property_id == '') {

                    //insert data
                    page.propertyAPI.postValue(mainproduct, function (data) {
                        //page.itemService.insertMainProduct(mainproduct, function (data) {

                        $$("msgPanel").show("Property saved successfully...!");

                        //Get the updated data
                        var data1 = {
                            property_id: data[0].key_value
                        }
                        page.propertyAPI.getValue(data1, function (data) {
                            //page.itemService.getMainProductByNo(data[0].key_value, function (data) {

                            // Add the new data to Grid
                            $$("grdSearchResult").dataBind(data);
                            $$("grdSearchResult").getAllRows()[0].click();
                            $$("msgPanel").hide();
                            $$("txtPropertyName").focus();
                        });
                    });

                } else {

                    $$("msgPanel").show("Updating Property...");
                    mainproduct.property_id = page.property_id;
                    page.propertyAPI.putValue(mainproduct.property_id, mainproduct, function (data1) {
                        //page.itemService.updateMainProduct(mainproduct, function (data) {
                        $$("msgPanel").show("Property updated successfully...!");
                        var data = {
                            propertyAPI: mainproduct.propertyAPI
                        }
                        page.propertyAPI.getValue(data, function (data) {
                            //page.itemService.getMainProductByNo(mainproduct.mpt_no, function (data) {

                            // Update the new data to Grid
                            $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                            $$("grdSearchResult").selectedRows()[0].click();
                            $$("msgPanel").hide();
                            $$("txtPropertyName").focus();
                        });
                    });


                }
            }
            $$("btnDelete").show();
        };

        //To Remove a mainproduct
        page.events.btnDelete_click = function () {

            if (page.property_id == null || page.property_id == '')
                $$("msgPanel").show("Select a property first...!");
            else {
                page.propertyValueAPI.searchValues("", "", "property_id = " + page.property_id, "", function (data) {
                    if (data.length == 0) {
                        $$("msgPanel").show("Removing property Please Wait...");
                        var data = {
                            property_id: page.property_id
                        }
                        page.propertyAPI.deleteValue(page.property_id, data, function (data) {
                            $$("msgPanel").show("Property removed successfully...!");
                            $$("grdSearchResult").deleteRow($$("grdSearchResult").selectedRowIds()[0]);
                            $(".detail-info").hide();

                            $$("btnSave").hide();
                            $$("btnDelete").hide();
                            $$("msgPanel").hide();
                            page.events.btnSearch_click();
                        });
                    }
                    else {
                        $$("msgPanel").show("This Carosal Contains Item First Remove The Items And Delete It...!!!");
                    }
                });
            }
        };

        page.events.page_load = function () {


            $$("txtSearchInput").focus();
            $$("grdSearchResult").width("100%");
            $$("grdSearchResult").height("550px");
            $$("grdSearchResult").setTemplate({
                selection: "Single", paging: true, pageSize: 50,
                columns: [
                    //{ 'name': "ID", 'rlabel': 'No', 'width': "80px", 'dataField': "mpt_no" },
                    { 'name': "ID", 'rlabel': 'No', 'width': "80px", 'dataField': "property_id" },
                    { 'name': "Name", 'rlabel': 'Name', 'width': "180px", 'dataField': "property_name" },
                ]
            });

            $$("grdSearchResult").selectionChanged = function (row, item) {

                //Show the right pael
                $(".detail-info").show();

                //When selected show save and delete button
                $$("btnSave").show();
                $$("btnDelete").show();

                //Set the current Main Product
                page.property_id = item.property_id;

                //Load the data
                $$("txtPropertyName").value(item.property_name);
                $$("txtPropertySortOrder").value(item.sort_order);
                
                page.events.searchCarosalItem_click();
                
                $$("txtPropertyName").focus();
                $$("pnlPropertyValue").show();
                //$$("msgPanel").show("Details of the Main Product...");
            };
            $$("grdSearchResult").dataBind([]);
            page.events.btnSearch_click();

        };

        page.events.btnNewPropertyValue_click = function () {
            page.proerty_value_id = null;
            $$("txtPropertyValue").value("");
            $$("txtPropertyValueSortOrder").value("");
            $$("txtPropertyValue").focus();
        }
        page.events.btnAddPropertyValue_click = function () {
            try{
                if ($$("txtPropertyValue").value() == "" || $$("txtPropertyValue").value() == null || $$("txtPropertyValue").value() == undefined)
                    throw "Property Value Is Not Empty";
                if ($$("ddlMainProductName").selectedValue() == "-1")
                    throw "Main Product Type Is Not Selected";
                var data = {
                    property_id: page.property_id,
                    property_value: $$("txtPropertyValue").value(),
                    mpt_no: $$("ddlMainProductName").selectedValue(),
                    sort_order: $$("txtPropertyValueSortOrder").value(),
                }
                if (page.proerty_value_id == null) {
                    page.propertyValueAPI.postValue(data, function (data) {
                        $$("txtPropertyValue").value("");
                        $$("txtPropertyValueSortOrder").value("");
                        page.events.searchCarosalItem_click();
                    });
                }
                else {
                    data.proerty_value_id = page.proerty_value_id;
                    page.propertyValueAPI.putValue(page.proerty_value_id,data, function (data) {
                        $$("txtPropertyValue").value("");
                        $$("txtPropertyValueSortOrder").value("");
                        page.events.searchCarosalItem_click();
                    });
                }
            }
            catch (e) {
                $$("msgPanel").show(e);
            }
        }

        page.events.searchCarosalItem_click = function () {
            page.propertyValueAPI.searchValues("", "", "property_id = " + page.property_id, "", function (data) {
                page.view.selectedPropertyValue(data);
            });
        }

        page.view = {
            selectedPropertyValue: function (data) {
                $$("grdPropertyValue").width("100%");
                $$("grdPropertyValue").height("405px");
                $$("grdPropertyValue").setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "Prop Value No", 'width': "150px", 'dataField': "proerty_value_id" },
                        { 'name': "Prop No", 'width': "120px", 'dataField': "proerty_value_id",visible:false },
                        { 'name': "Value", 'width': "280px", 'dataField': "property_value" },
                        { 'name': "Main Product Name", 'width': "200px", 'dataField': "mpt_name" },
                        { 'name': "Sort Order", 'width': "120px", 'dataField': "sort_order" },
                        { 'name': "", 'width': "50px", 'dataField': "", itemTemplate: "<input type='button'  class='grid-button' value='' action='Delete' style='background-image: url(Image/cancel.png);    background-size: contain;    background-color: transparent;    width: auto;background-repeat: no-repeat;    width: 15px;    border: none;    cursor: pointer;'/>" },
                    ]
                });
                page.controls.grdPropertyValue.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "Delete") {
                        if (confirm("Are You Sure Want To Delete This Property Value")) {
                            var data = {
                                proerty_value_id: rowData.proerty_value_id
                            }
                            page.propertyValueAPI.deleteValue(rowData.proerty_value_id, data, function (data) {
                                page.events.searchCarosalItem_click();
                            });
                        }
                    }
                }
                $$("grdPropertyValue").selectionChanged = function (row, item) {
                    page.proerty_value_id = item.proerty_value_id;
                    $$("txtPropertyValue").value(item.property_value);
                    $$("ddlMainProductName").selectedValue(item.mpt_no);
                    $$("txtPropertyValueSortOrder").value(item.sort_order);
                }
                $$("grdPropertyValue").dataBind(data);
            }
        }

    });
};
