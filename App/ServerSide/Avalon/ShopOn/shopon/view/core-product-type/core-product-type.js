/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.coreproductPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.itemService = new ItemService();
        page.coreproducttypeAPI = new CoreProductTypeAPI();
        page.cmpt_no = null;
        document.title = "Avalon - Core Product Type";
        $("body").keydown(function (e) {
            //well you need keep on mind that your browser use some keys 
            //to call some function, so we'll prevent this


            //now we caught the key codeore product name is mandatory
            var keyCode = e.keyCode || e.which;
     

            //your keyCode contains the key code, F1 to             //is among 112 and 123. Just it.
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
                filter_expression: "concat(ifnull(core_product_type_id,''),ifnull(core_product_type_name,'')) like '%" + $$("txtSearchInput").value() + "%'",
                sort_expression: ""
            }
            page.coreproducttypeAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
            //page.itemService.getMainProductByName($$("txtSearchInput").value(), function (data) {
                $$("grdSearchResult").dataBind(data);
                $$("msgPanel").hide();
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
            $$("txtMainProductName").val('');
            $$("txtOrderNo").val('');
            $$("txtMainProductName").focus();
            

            //Set the curent mainproduct no to null
            page.cmpt_no = null;
           
            
        };

        //To insert or update a mainproduct
        page.events.btnSave_click = function () {
            var mainproduct = {
                core_product_type_name: $$("txtMainProductName").value(),
                core_product_type_order: $$("txtOrderNo").value(),
            };
            //mainproduct.desc = "Main Product";
            //mainproduct.comp_id = localStorage.getItem("user_company_id");
            if (mainproduct.core_product_type_name == "" || mainproduct.core_product_type_name == null || mainproduct.core_product_type_name == undefined) {
                $$("msgPanel").show("Core product name is mandatory ...!");
                $$("txtMainProductName").focus();
                //alert("Vendor Name is Mantatory");
            }
            else if (mainproduct.core_product_type_name != "" && isInt(mainproduct.core_product_type_name)) {
                $$("msgPanel").show("Main product name should only contains characters ...!");
                $$("txtMainProductName").focus();
            }
            else {

                $$("msgPanel").show("Inserting new core product...");
                if (page.cmpt_no == null || page.cmpt_no == '') {

                    //insert data
                    page.coreproducttypeAPI.postValue(mainproduct, function (data) {
                    //page.itemService.insertMainProduct(mainproduct, function (data) {

                        $$("msgPanel").show("Main product saved successfully...!");

                        //Get the updated data
                        var data1 = {
                            core_product_type_id: data[0].key_value
                        }
                        page.coreproducttypeAPI.getValue(data1, function (data) {
                        //page.itemService.getMainProductByNo(data[0].key_value, function (data) {

                            // Add the new data to Grid
                            $$("grdSearchResult").dataBind(data);
                            $$("grdSearchResult").getAllRows()[0].click();
                            $$("msgPanel").hide();
                            $$("txtMainProductName").focus();
                        });
                    });

                } else {

                    $$("msgPanel").show("Updating main product...");
                    mainproduct.core_product_type_id = page.cmpt_no;
                    page.coreproducttypeAPI.putValue(mainproduct.core_product_type_id, mainproduct, function (data1) {
                    //page.itemService.updateMainProduct(mainproduct, function (data) {
                        $$("msgPanel").show("Main product updated successfully...!");
                        var data = {
                            core_product_type_id: mainproduct.core_product_type_id
                        }
                        page.coreproducttypeAPI.getValue(data, function (data) {
                        //page.itemService.getMainProductByNo(mainproduct.mpt_no, function (data) {

                            // Update the new data to Grid
                            $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                            $$("grdSearchResult").selectedRows()[0].click();
                            $$("msgPanel").hide();
                            $$("txtMainProductName").focus();
                        });
                    });


                }
            }
            $$("btnDelete").show();
        };

        //To Remove a mainproduct
        page.events.btnDelete_click = function () {

            if (page.cmpt_no == null || page.cmpt_no == '')
                $$("msgPanel").show("Select a main product first...!");
            else{
                $$("msgPanel").show("Removing main product...");
                var data = {
                    mpt_no: page.cmpt_no
                }
                page.coreproducttypeAPI.deleteValue(page.cmpt_no, data, function (data) {
            //page.itemService.deleteMainProduct(page.mpt_no, function () {
                //Delete from grid
                $$("msgPanel").show("Main product removed successfully...!");
                $$("grdSearchResult").deleteRow($$("grdSearchResult").selectedRowIds()[0]);
                $(".detail-info").hide();

                $$("btnSave").hide();
                $$("btnDelete").hide();
                $$("msgPanel").hide();
                page.events.btnSearch_click();
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
                    //{ 'name': "ID", 'rlabel': 'No', 'width': "80px", 'dataField': "mpt_no" },
                    { 'name': "ID", 'rlabel': 'No', 'width': "15%", 'dataField': "core_product_type_id" },
                    { 'name': "Main Product Name", 'rlabel': 'Name', 'width': "75%", 'dataField': "core_product_type_name" },
                ]
            });

            $$("grdSearchResult").selectionChanged = function (row, item) {

                //Show the right pael
                $(".detail-info").show();

                //When selected show save and delete button
                $$("btnSave").show();
                $$("btnDelete").show();
              
                //Set the current Main Product
                page.cmpt_no = item.core_product_type_id;
              
                //Load the data
                $$("txtMainProductName").value(item.core_product_type_name);
                $$("txtOrderNo").value(item.core_product_type_order);
                $$("txtMainProductName").focus();
                
                //$$("msgPanel").show("Details of the Main Product...");
            };
            $$("grdSearchResult").dataBind([]);
            page.events.btnSearch_click();

        };

       
    });
};
