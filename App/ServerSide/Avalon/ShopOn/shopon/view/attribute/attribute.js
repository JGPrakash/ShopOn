/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.attributePage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.itemAttributeAPI = new ItemAttributeAPI();
        page.attr_no_key = null;
        document.title = "ShopOn - Attribute";
        $("body").keydown(function (e) {
            //now we caught the key code
            var keyCode = e.keyCode || e.which;
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

        //To search the Vendor
        page.events.btnSearch_click = function () {
            $(".detail-info").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("msgPanel").show("Searching...");

            //Load the search result in grid
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "concat(ifnull(attr_no_key,''),ifnull(attr_name,''),ifnull(attr_type,'')) like '%" + $$("txtSearchInput").value() + "%' and attr_no_key not in(1,2,3,4,5,6,100,101,102)",
                sort_expression: ""
            }
            page.itemAttributeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression,"", function (data) {
                $$("grdSearchResult").dataBind(data);
                $$("msgPanel").hide();
            });
        };

        //To create a new vendor
        page.events.btnNew_click = function () {
            //Show the panel
            $(".detail-info").show();
            //Show the Save button and hide delete button
            $$("btnSave").show();
            $$("btnDelete").hide();
            //Clear all textbox
            $$("lblAttributeNo").value('');
            $$("txtAttributeName").focus();
            $$("txtAttributeName").val('');
            $$("txtAttributeType").val('');
            //Set the curent vendor no to null
            page.attr_no_key = null;
        };

        //To insert or update a vendor
        page.events.btnSave_click = function () {
            $$("btnSave").disable(true);
            var error_count = 0;
            var attribute = {
                attr_name: $$("txtAttributeName").value(),
                attr_type: $$("txtAttributeType").value(),
                //comp_id:getCookie("user_company_id")
            };
            if (attribute.attr_name == "") {
                $$("msgPanel").show("Attribute name is mandatory ...!");
                $$("txtAttributeName").focus();
                $$("btnSave").disable(false);
                error_count++;
            }
            else if (attribute.attr_name != "" && isInt(attribute.attr_name)) {
                $$("msgPanel").show("Attribute name should only contains characters ...!");
                $$("txtAttributeName").focus();
                $$("btnSave").disable(false);
                error_count++;
            }
            else if (attribute.attr_type == "") {
                $$("msgPanel").show("Attribute type is mandatory ...!");
                $$("txtAttributeType").focus();
                $$("btnSave").disable(false);
                error_count++;
            }
            else if (attribute.attr_type != "" && isInt(attribute.attr_type)) {
                $$("msgPanel").show("Attribute type should only contains characters ...!");
                $$("txtAttributeType").focus();
                $$("btnSave").disable(false);
                error_count++;
            }
            else {
                if (error_count == 0) {
                    $$("msgPanel").show("Inserting new attribute...");
                    if (page.attr_no_key == null || page.attr_no_key == '') {
                        page.itemAttributeAPI.postValue(attribute, function (data) {
                            $$("msgPanel").show("Attribute saved successfully...!");
                            $$("btnSave").disable(false);
                            var attribute = {
                                attr_no_key: data[0].key_value
                            }
                            page.itemAttributeAPI.getValue(attribute, function (data) {
                                // Add the new data to Grid
                                $$("grdSearchResult").dataBind(data);
                                $$("grdSearchResult").getAllRows()[0].click();
                                $$("msgPanel").hide();
                                $$("txtAttributeName").focus();
                            });
                        });

                    } else {
                        $$("msgPanel").show("Updating attribute...");
                        attribute.attr_no_key = page.attr_no_key;
                        page.itemAttributeAPI.putValue(attribute, function (data1) {
                            $$("msgPanel").show("Attribute updated successfully...!");
                            $$("btnSave").disable(false);
                            var attribute = {
                                attr_no_key: page.attr_no_key
                            }
                            page.itemAttributeAPI.getValue(attribute, function (data) {
                                // Update the new data to Grid
                                $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                                $$("grdSearchResult").selectedRows()[0].click();
                                $$("msgPanel").hide();
                                $$("txtVendorName").focus();
                            });
                        });
                    }
                }
                else {
                    $$("btnSave").disable(false);
                }
                $$("btnDelete").show();
            }
        };
        //To Remove a vendor
        page.events.btnDelete_click = function () {

            if (page.attr_no_key != null && page.attr_no_key != '') {
                $$("msgPanel").show("Removing attribute...");
                var data = {
                    attr_no_key: page.attr_no_key
                }
                page.itemAttributeAPI.deleteValue(data, function (data) {
                    //Delete from grid
                    $$("grdSearchResult").deleteRow($$("grdSearchResult").selectedRowIds()[0]);
                    $(".detail-info").hide();

                    $$("btnSave").hide();
                    $$("btnDelete").hide();
                    $$("msgPanel").show("Attribute removed successfully...!");
                    $$("msgPanel").hide();

                });
            }
            else {
                $$("msgPanel").show("Select a attribute first...!");
            }
        };
             
        page.events.page_load = function () {
            $$("grdSearchResult").width("100%");
            $$("grdSearchResult").height("500px");
            $$("grdSearchResult").setTemplate({
                selection: "Single", paging: true, pageSize: 50,
                columns: [
                    { 'name': "ID", 'width': "60px", 'rlabel': 'No', 'dataField': "attr_no_key" },
                    { 'name': "Name", 'width': "150px", 'rlabel': 'Name', 'dataField': "attr_name" },
                    { 'name': "Type", 'width': "130px", 'rlabel': 'Type', 'dataField': "attr_type" },
                ]
            });
            $$("grdSearchResult").selectionChanged = function (row, item) {
                $(".detail-info").show();
                //When selected show save and delete button
                $$("btnSave").show();
                $$("btnDelete").show();
                //Set the current vendor
                page.attr_no_key = item.attr_no_key;
                //Load the data
                $$("lblAttributeNo").value(item.attr_no_key);
                $$("txtAttributeName").value(item.attr_name);
                $$("txtAttributeType").value(item.attr_type);
                $$("txtAttributeName").focus();
            };
            $$("grdSearchResult").dataBind([]);
            page.events.btnSearch_click();
            $$("txtSearchInput").focus();

            //$$("txtSearchInput").keyup(function () {
            //    //Load the search result in grid
            //    var data = {
            //        start_record: 0,
            //        end_record: "",
            //        filter_expression: "concat(ifnull(vendor_no,''),ifnull(vendor_name,''),ifnull(vendor_phone,'')) like '%" + $$("txtSearchInput").value() + "%'",
            //        sort_expression: ""
            //    }
            //    page.itemAttributeAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
            //        $$("grdSearchResult").dataBind(data);
            //        $$("msgPanel").hide();
            //    });
            //})
        };
        function selectRow(up) {
            var t = $$("grdSearchResult");
            var count = t.grid.dataCount;
            var selected = t.selectedRowIds()[0];
            if (selected) {
                var index = parseInt(t.selectedRowIds()[0])-1;
                index = parseInt(index) + parseInt(up ? -1 : 1);
                if (index < 0) index = 0;
                if (index >= count) index = count - 1;
                t.getAllRows()[index].click();
            } else {
                var index;
                index = parseInt(up ? count - 1 : 0);
                t.getAllRows()[index].click();
            }
        }
        var panel = $("[controlid=grdSearchResult]").attr('tabindex', 0).focus();
        panel.bind('keydown', function (e) {
            switch (e.keyCode) {
                case 38:    // up
                    selectRow(true);
                    return false;
                case 40:    // down
                    selectRow(false);
                    return false;
            }
        });
       
    });
};
