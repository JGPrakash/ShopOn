/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.productTypePage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        //page.itemService = new ItemService();
        page.productTypeAPI = new ProductTypeAPI();
        page.mainproducttypeAPI = new MainProductTypeAPI();
        page.itemAPI = new ItemAPI();
        page.ptype_no = null;
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
                page.events.btnBeforeDelete_click();
            }

        });
        document.title = "ShopOn - Product Type";
        //To search the ptype_name
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
                //filter_expression: "concat(ifnull(ptt.ptype_no,''),ifnull(ptt.ptype_name,'')) like '%" + $$("txtSearchInput").value() + "%'",
                filter_expression: "concat(ifnull(ptt.ptype_id,''),ifnull(ptt.ptype_name,'')) like '%" + $$("txtSearchInput").value() + "%'",
                sort_expression: ""
            }
            page.productTypeAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
            //page.itemService.getProductTypeByName($$("txtSearchInput").value(), function (data) {
                $$("grdSearchResult").dataBind(data);
                $$("msgPanel").hide();
            });
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "",
                sort_expression: ""
            }
            page.mainproducttypeAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
            //page.itemService.getMainProductNameByAll("%", function (data) {
                $$("ddlmymainproduct").dataBind(data, "mpt_no", "mpt_name", "Select");
            });
        };

        //To create a new ptype_name
        page.events.btnNew_click = function () {
            //Show the panel
            $(".detail-info").show();
            //Show the Save button and hide delete button
            $$("btnSave").show();
            $$("btnDelete").hide();
            //Clear all textbox
            //$$("msgPanel").show("Clearing all fields to get new ptype_name data..");
            $$("txtProductTypeName").val('');
            $$("txtProductTypeName").focus();
            $$("ddlmymainproduct").selectedValue('-1');

            //Set the curent producttype no to null
            page.ptype_no = null;
           
        };

        //To insert or update a producttype
        page.events.btnSave_click = function () {
            var producttype = {
                ptype_name: $$("txtProductTypeName").value(),
                mpt_no:$$("ddlmymainproduct").selectedValue(),
            };
            if (producttype.ptype_name == "" || producttype.ptype_name == null || producttype.ptype_name == undefined) {
                $$("msgPanel").show("Product type name is mandatory ...!");
                $$("txtProductTypeName").focus();
                //alert("Vendor Name is Mantatory");
            }
            else if (producttype.ptype_name != "" && isInt(producttype.ptype_name)) {
                $$("msgPanel").show("Product type name should only contains characters ...!");
                $$("txtProductTypeName").focus();
            }
            else if (producttype.mpt_no == "" || producttype.mpt_no == null || producttype.mpt_no == undefined) {
                $$("msgPanel").show("Product type name is mandatory ...!");
                $$("ddlmymainproduct").selectedObject.focus();
                //alert("Vendor Name is Mantatory");
            }
            else {
                $$("msgPanel").show("Inserting new main product...");
                if (page.ptype_no == null || page.ptype_no == '') {

                    //insert data
                    page.productTypeAPI.postValue(producttype, function (data) {
                    //page.itemService.insertProductType(producttype, function (data) {

                        $$("msgPanel").show("Product type saved successfully...!");

                        //Get the updated data
                        var producttype = {
                            ptype_no: data[0].key_value
                        }
                        page.productTypeAPI.getValue(producttype, function (data) {
                        //page.itemService.getProductTypeByNo(data[0].key_value, function (data) {

                            // Add the new data to Grid
                            $$("grdSearchResult").dataBind(data);
                            $$("grdSearchResult").getAllRows()[0].click();
                            $$("msgPanel").hide();
                        });
                    });

                } else {

                    $$("msgPanel").show("Updating product type...");
                    producttype.ptype_no = page.ptype_no;
                    page.productTypeAPI.putValue(producttype.ptype_no, producttype, function (data1) {
                    //page.itemService.updateProductType(producttype, function (data) {
                        $$("msgPanel").show("Product type updated successfully...!");
                        var producttype = {
                            ptype_no: page.ptype_no
                        }
                        page.productTypeAPI.getValue(producttype, function (data) {
                        //page.itemService.getProductTypeByNo(producttype.ptype_no, function (data) {

                            // Update the new data to Grid
                            $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                            $$("grdSearchResult").selectedRows()[0].click();
                            $$("msgPanel").hide();
                        });
                    });


                }
                $$("txtProductTypeName").focus();
            }
            $$("btnDelete").show();
            
        };

        page.events.btnBeforeDelete_click = function () {
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
        }
        page.events.btnRemoveConfirmPopupClose_click = function () {
            page.controls.pnlRemoveConfirmPopup.close();
        }
        page.events.btnDelete_click = function () {
            if (page.ptype_no == null || page.ptype_no == '')
                $$("msgPanel").show("Select a product type first...!");
            else {
                $$("msgPanel").show("Removing product type...");
                var data = {
                    ptype_no: page.ptype_no
                }
                page.productTypeAPI.deleteValue(page.ptype_no, data, function (data) {
                    //page.itemService.deleteProductType(page.ptype_no, function () {
                    //Delete from grid
                    $$("msgPanel").show("Product type removed successfully...!");
                    $$("grdSearchResult").deleteRow($$("grdSearchResult").selectedRowIds()[0]);
                    $(".detail-info").hide();

                    $$("btnSave").hide();
                    $$("btnDelete").hide();
                    //$$("msgPanel").hide();
                    page.events.btnSearch_click();
                    page.controls.pnlRemoveConfirmPopup.close();
                });
            }
        };
             
        page.events.page_load = function () {
            $$("txtSearchInput").focus();
            $$("grdSearchResult").width("100%");
            $$("grdSearchResult").height("530px");
            $$("grdSearchResult").setTemplate({
                selection: "Single", paging: true, pageSize: 50,
                columns: [
                    //{ 'name': "ID", 'rlabel': 'No', 'width': "80px", 'dataField': "ptype_no" },
                    { 'name': "ID", 'rlabel': 'No', 'width': "15%", 'dataField': "ptype_id" },
                    { 'name': "Product Type Name", 'rlabel': 'Name', 'width': "75%", 'dataField': "ptype_name" },
                    //{ 'name': "Main Product Name", 'width': "180px", 'dataField': "mpt_name" },
                ]
            });

            $$("grdSearchResult").selectionChanged = function (row, item) {

                //Show the right pael
                $(".detail-info").show();

                //When selected show save and delete button
                $$("btnSave").show();
                $$("btnDelete").show();
              
                //Set the current Main Product
                page.ptype_no = item.ptype_no;
              
                //Load the data
                $$("txtProductTypeName").value(item.ptype_name);
                $$("ddlmymainproduct").selectedValue(item.mpt_no);
                $$("txtProductTypeName").focus();
                //$$("msgPanel").show("Details of the Main Product...");

                page.itemAPI.searchValues("", "", "it.mpt_no ="+item.mpt_no+" and it.ptype_no ="+item.ptype_no, "item_code", function (data) {
                    page.view.selectedItemResult(data);
                });

            };
            $$("grdSearchResult").dataBind([]);
            
            page.events.btnSearch_click();
            
            $$("ddlmymainproduct").selectionChange(function () {
                page.itemAPI.searchValues("", "", "it.mpt_no =" + $$("ddlmymainproduct").selectedValue() + " and it.ptype_no =" + page.ptype_no, "item_code", function (data) {
                    page.view.selectedItemResult(data);
                });
            })
        };

        page.view = {
            selectedItemResult: function (data) {
                $$("grdItemResult").width("100%");
                $$("grdItemResult").height("430px");
                $$("grdItemResult").setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "ID", 'rlabel': 'No', 'width': "20%", 'dataField': "item_code" },
                        { 'name': "Item Name", 'rlabel': 'Name', 'width': "45%", 'dataField': "item_name" },
                        { 'name': "Stock", 'rlabel': 'Stock', 'width': "20%", 'dataField': "stock" },
                    ]
                });
                $$("grdItemResult").dataBind(data);
            }
        }
    });
};
