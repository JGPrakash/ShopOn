/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.carosalPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.carosalAPI = new CarosalAPI();
        page.carosalItemAPI = new CarosalItemAPI();
        page.salesItemAPI = new SalesItemAPI();
        page.collectionAPI = new CollectionAPI();
        page.carosal_id = null;
        page.itemList - [];
        page.carosal_item_var = null;
        document.title = "ShopOn - Carosal";
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
                filter_expression: "concat(ifnull(carosal_no,''),ifnull(carosal_name,'')) like '%" + $$("txtSearchInput").value() + "%'",
                sort_expression: ""
            }
            page.carosalAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //page.itemService.getMainProductByName($$("txtSearchInput").value(), function (data) {
                $$("grdSearchResult").dataBind(data);
                $$("msgPanel").hide();
            });
            page.collectionAPI.searchValues("", "", "collection_type = 1", "", function (data) {
                page.controls.ddlCollectionName.dataBind(data, "collection_id", "collection_name", "Select");
            });
            
            //page.salesItemAPI.searchValues("", "", "", "", function (data) {
            //    page.itemList = data;
            //});
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
            $$("txtCarosalName").val('');
            $("#fileUpload").val("");
            $$("txtCarosalKeyword").val('');
            $$("txtCarosalSortOrder").val('');
            $$("txtCarosalName").focus();
            $$("ddlCollectionName").selectedValue("-1");

            //Set the curent mainproduct no to null
            page.carosal_id = null;


        };

        //To insert or update a mainproduct
        page.events.btnSave_click = function () {
            var files = $("#fileUpload").get(0).files;
            var fileName = "";
            if (files.length > 0) {
                fileName = files[0];
            }

            var mainproduct = {
                carosal_name: $$("txtCarosalName").value(),
                comp_id: localStorage.getItem("user_company_id"),
                carosal_image: fileName.name,
                keywords: $$("txtCarosalKeyword").value(),
                sort_order: $$("txtCarosalSortOrder").value(),
                collection_id: $$("ddlCollectionName").selectedValue(),
                store_no: localStorage.getItem("user_store_no")
            };
            if (mainproduct.carosal_name == "" || mainproduct.carosal_name == null || mainproduct.carosal_name == undefined) {
                $$("msgPanel").show("carosal name is mandatory ...!");
                $$("txtCarosalName").focus();
                //alert("Vendor Name is Mantatory");
            }
            else if (mainproduct.carosal_name != "" && isInt(mainproduct.carosal_name)) {
                $$("msgPanel").show("carosal name should only contains characters ...!");
                $$("txtCarosalName").focus();
            }
            else if (mainproduct.collection_id == "" || mainproduct.collection_id == null || mainproduct.collection_id == undefined || mainproduct.collection_id == "-1") {
                $$("msgPanel").show("Collection Is Not Selected...!");
            }
            else {

                $$("msgPanel").show("Inserting new main product...");
                if (page.carosal_id == null || page.carosal_id == '') {

                    //insert data
                    page.carosalAPI.postValue(mainproduct, function (data) {
                        //page.itemService.insertMainProduct(mainproduct, function (data) {

                        $$("msgPanel").show("Carosal saved successfully...!");

                        //Get the updated data
                        var data1 = {
                            carosal_id: data[0].key_value
                        }
                        page.carosalAPI.getValue(data1, function (data) {
                            //page.itemService.getMainProductByNo(data[0].key_value, function (data) {

                            // Add the new data to Grid
                            $$("grdSearchResult").dataBind(data);
                            $$("grdSearchResult").getAllRows()[0].click();
                            $$("msgPanel").hide();
                            $$("txtCarosalName").focus();
                        });
                    });

                } else {

                    $$("msgPanel").show("Updating carosal...");
                    mainproduct.carosal_id = page.carosal_id;
                    page.carosalAPI.putValue(mainproduct.carosal_id, mainproduct, function (data1) {
                        //page.itemService.updateMainProduct(mainproduct, function (data) {
                        $$("msgPanel").show("Carosal updated successfully...!");
                        var data = {
                            carosal_id: mainproduct.carosal_id
                        }
                        page.carosalAPI.getValue(data, function (data) {
                            //page.itemService.getMainProductByNo(mainproduct.mpt_no, function (data) {

                            // Update the new data to Grid
                            $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                            $$("grdSearchResult").selectedRows()[0].click();
                            $$("msgPanel").hide();
                            $$("txtCarosalName").focus();
                        });
                    });


                }
            }
            $$("btnDelete").show();
        };

        //To Remove a mainproduct
        page.events.btnDelete_click = function () {

            if (page.carosal_id == null || page.carosal_id == '')
                $$("msgPanel").show("Select a carosal first...!");
            else {
                page.carosalItemAPI.searchValues("", "", "cit.carosal_id = " + page.carosal_id, "", function (data) {
                    if (data.length == 0) {
                        $$("msgPanel").show("Removing carosal Please Wait...");
                        var data = {
                            carosal_id: page.carosal_id
                        }
                        page.carosalAPI.deleteValue(page.carosal_id, data, function (data) {
                            $$("msgPanel").show("Carosal removed successfully...!");
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
            $$("grdSearchResult").height("350px");
            $$("grdSearchResult").setTemplate({
                selection: "Single", paging: true, pageSize: 50,
                columns: [
                    //{ 'name': "ID", 'rlabel': 'No', 'width': "80px", 'dataField': "mpt_no" },
                    { 'name': "ID", 'rlabel': 'No', 'width': "80px", 'dataField': "carosal_no" },
                    { 'name': "Name", 'rlabel': 'Name', 'width': "180px", 'dataField': "carosal_name" },
                ]
            });

            $$("grdSearchResult").selectionChanged = function (row, item) {

                //Show the right pael
                $(".detail-info").show();

                //When selected show save and delete button
                $$("btnSave").show();
                $$("btnDelete").show();

                //Set the current Main Product
                page.carosal_id = item.carosal_id;

                //Load the data
                $$("txtCarosalName").value(item.carosal_name);
                $$("txtCarosalKeyword").value(item.keywords);
                $$("txtCarosalSortOrder").value(item.sort_order);
                $$("ddlCollectionName").selectedValue(item.collection_id);
                if (item.carosal_image != undefined && item.carosal_image != null && item.carosal_image != '')
                    $("#output").attr("src", CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + page.carosal_id + '/' + item.carosal_image);

                page.controls.txtItem.dataBind({
                    getData: function (term, callback) {
                        callback(page.itemList);
                    }
                });
                page.controls.txtItem.select(function (item) {
                    page.carosal_item_var = item.var_no;
                });
                page.events.searchCarosalItem_click();
                
                $$("txtCarosalName").focus();

                //$$("msgPanel").show("Details of the Main Product...");
            };
            $$("grdSearchResult").dataBind([]);
            page.events.btnSearch_click();

        };

        page.events.btnUploadImage_click = function () {
            var data = new FormData();

            var files = $("#fileUpload").get(0).files;

            // Add the uploaded image content to the form data collection
            if (files.length > 0) {
                data.append("file", files[0]);

                var ajaxRequest = $.ajax({
                    type: "POST",
                    url: CONTEXT.ENABLE_IMAGE_UPLOAD_URL,
                    headers: {
                        'file-path': CONTEXT.ENABLE_IMAGE_FILE_PATH + page.carosal_id + '\\'
                    },
                    contentType: false,
                    processData: false,
                    data: data
                });

                ajaxRequest.done(function (xhr, textStatus) {
                    $$("msgPanel").show("Picture uploaded successfully...!");
                });
            }
            else {
                $$("msgPanel").show("Please select only the images before uploading it");
            }
        }

        page.events.btnAddItemCarosal_click = function () {
            try{
                if ($$("txtItem").selectedValue() == "" || $$("txtItem").selectedValue() == null || $$("txtItem").selectedValue() == undefined)
                    throw "Item Is Not Selected";
                var data = {
                    carosal_id: page.carosal_id,
                    var_no: page.carosal_item_var
                }
                page.carosalItemAPI.postValue(data, function (data) {
                    $$("txtItem").selectedObject.val("");
                    page.events.searchCarosalItem_click();
                });
            }
            catch (e) {
                $$("msgPanel").show(e);
            }
        }

        page.events.searchCarosalItem_click = function () {
            $$("txtItem").selectedObject.val("");
            page.carosalItemAPI.searchValues("", "", "cit.carosal_id = " + page.carosal_id, "", function (data) {
                page.view.selectedCarosalItem(data);
            });
        }

        page.view = {
            selectedCarosalItem: function (data) {
                $$("grdCarosalItems").width("100%");
                $$("grdCarosalItems").height("150px");
                $$("grdCarosalItems").setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "Item No", 'rlabel': 'Item No', 'width': "80px", 'dataField': "item_no" },
                        { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "230px", 'dataField': "item_name" },
                        { 'name': "Price", 'rlabel': 'Price', 'width': "150px", 'dataField': "price" },
                        { 'name': "", 'width': "50px", 'dataField': "", itemTemplate: "<input type='button'  class='grid-button' value='' action='Delete' style='background-image: url(Image/cancel.png);    background-size: contain;    background-color: transparent;    width: auto;background-repeat: no-repeat;    width: 15px;    border: none;    cursor: pointer;'/>" },
                    ]
                });
                page.controls.grdCarosalItems.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "Delete") {
                        if (confirm("Are You Sure Want To Delete This Product")) {
                            var data = {
                                carosal_item_no: rowData.carosal_item_no
                            }
                            page.carosalItemAPI.deleteValue(rowData.carosal_item_no,data, function (data) {
                                page.events.searchCarosalItem_click();
                            });
                        }
                    }
                }
                $$("grdCarosalItems").dataBind(data);
            }
        }

    });
};
