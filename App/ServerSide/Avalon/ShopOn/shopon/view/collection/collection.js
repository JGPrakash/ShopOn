/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.collectionPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.collectionAPI = new CollectionAPI();
        page.collectionItemAPI = new CollectionItemAPI();
        page.salesItemAPI = new SalesItemAPI();
        page.collection_id = null;
        page.itemList - [];
        page.collection_item_sku_no = null;
        page.collection_item_no = null;
        document.title = "ShopOn - Collection";
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
            $$("pnlItem").hide();
            $$("msgPanel").show("Searching...");

            //Load the search result in grid
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "concat(ifnull(collection_no,''),ifnull(collection_name,'')) like '%" + $$("txtSearchInput").value() + "%'",
                sort_expression: ""
            }
            page.collectionAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //page.itemService.getMainProductByName($$("txtSearchInput").value(), function (data) {
                $$("grdSearchResult").dataBind(data);
                $$("msgPanel").hide();
            });

            
            page.salesItemAPI.searchValues("", "", "", "","text", function (data) {
                page.itemList = data;
            });
        };

        //To create a new mpt_name
        page.events.btnNew_click = function () {
            //Show the panel
            $(".detail-info").show();
            //Show the Save button and hide delete button
            $$("btnSave").show();
            $$("btnDelete").hide();
            $$("pnlItem").hide();

            //Clear all textbox
            //$$("msgPanel").show("Clearing all fields to get new mpt_name data..");
            $$("txtName").val('');
            $$("txtSortOrder").val('');
            $$("ddlCollectionType").selectedValue('-1'); 
            $$("ddlCollectionStyle").selectedValue('1');
            $$("txtName").focus();


            //Set the curent mainproduct no to null
            page.collection_id = null;


        };

        //To insert or update a mainproduct
        page.events.btnSave_click = function () {
            var files = $("#fileUpload").get(0).files;
            var fileName = "";
            if (files.length > 0) {
                fileName = files[0];
            }
            var data = {
                collection_name: $$("txtName").value(),
                comp_id: localStorage.getItem("user_company_id"),
                collection_type: $$("ddlCollectionType").selectedValue(),
                store_no: localStorage.getItem("user_fulfillment_store_no"),
                sort_order: $$("txtSortOrder").value(),
                collection_style: $$("ddlCollectionStyle").selectedValue(),
                collection_image: fileName.name
            };
            if (data.collection_name == "" || data.collection_name == null || data.collection_name == undefined) {
                $$("msgPanel").show("collection name is mandatory ...!");
                $$("txtName").focus();
            }
            else if ($$("ddlCollectionType").selectedValue() == "-1") {
                $$("msgPanel").show("collection type is mandatory ...!");
            }
            else {

                $$("msgPanel").show("Inserting new collection...");
                if (page.collection_id == null || page.collection_id == '') {

                    //insert data
                    page.collectionAPI.postValue(data, function (data) {
                        //page.itemService.insertMainProduct(mainproduct, function (data) {
                        if (fileName.name != "" && fileName.name != null && typeof fileName.name != "undefined") {
                            page.events.btnUploadImage_click();
                        }

                        $$("msgPanel").show("Collection saved successfully...!");

                        //Get the updated data
                        var data1 = {
                            collection_id: data[0].key_value
                        }
                        page.collectionAPI.getValue(data1, function (data) {
                            //page.itemService.getMainProductByNo(data[0].key_value, function (data) {

                            // Add the new data to Grid
                            $$("grdSearchResult").dataBind(data);
                            $$("grdSearchResult").getAllRows()[0].click();
                            $$("msgPanel").hide();
                            $$("txtName").focus();
                        });
                    });

                } else {

                    $$("msgPanel").show("Updatingcollection...");
                    data.collection_id = page.collection_id;
                    page.collectionAPI.putValue(data.collection_id, data, function (data1) {
                        $$("msgPanel").show("Collection updated successfully...!");
                        var data = {
                            collection_id: page.collection_id
                        }
                        page.collectionAPI.getValue(data, function (data) {
                            // Update the new data to Grid
                            $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                            $$("grdSearchResult").selectedRows()[0].click();
                            $$("msgPanel").hide();
                            $$("txtName").focus();
                        });
                    });


                }
            }
            $$("btnDelete").show();
        };

        //To Remove a mainproduct
        page.events.btnDelete_click = function () {

            if (page.collection_id == null || page.collection_id == '')
                $$("msgPanel").show("Select a collection first...!");
            else {
                page.collectionItemAPI.searchValues("", "", "collection_id = " + page.collection_id, "", function (data) {
                    if (data.length == 0) {
                        $$("msgPanel").show("Removing carosal Please Wait...");
                        var data = {
                            collection_id: page.collection_id
                        }
                        page.collectionAPI.deleteValue(page.collection_id, data, function (data) {
                            $$("msgPanel").show("Collection removed successfully...!");
                            $$("grdSearchResult").deleteRow($$("grdSearchResult").selectedRowIds()[0]);
                            $(".detail-info").hide();

                            $$("btnSave").hide();
                            $$("btnDelete").hide();
                            $$("msgPanel").hide();
                            page.events.btnSearch_click();
                        });
                    }
                    else {
                        $$("msgPanel").show("This Collection Contains Item First Remove The Items And Delete It...!!!");
                    }
                });
            }
        };

        page.events.page_load = function () {


            $$("txtSearchInput").focus();
            $$("grdSearchResult").width("100%");
            $$("grdSearchResult").height("535px");
            $$("grdSearchResult").setTemplate({
                selection: "Single", paging: true, pageSize: 50,
                columns: [
                    { 'name': "ID", 'rlabel': 'No', 'width': "15%", 'dataField': "collection_no" },
                    { 'name': "Name", 'rlabel': 'Name', 'width': "75%", 'dataField': "collection_name" },
                ]
            });

            $$("grdSearchResult").selectionChanged = function (row, item) {

                //Show the right pael
                $(".detail-info").show();

                //When selected show save and delete button
                $$("btnSave").show();
                $$("btnDelete").show();
                $$("pnlItem").show();

                //Set the current Main Product
                page.collection_id = item.collection_id;

                //Load the data
                $$("txtName").value(item.collection_name);
                $$("ddlCollectionType").selectedValue(item.collection_type);
                $$("ddlCollectionStyle").selectedValue(item.collection_style);
                $$("txtSortOrder").value(item.sort_order);

                page.controls.txtItem.dataBind({
                    getData: function (term, callback) {
                        callback(page.itemList);
                    }
                });
                page.controls.txtItem.select(function (item) {
                    page.collection_item_sku_no = item.sku_no;
                    page.collection_item_no = item.item_no;
                });
                page.events.searchCarosalItem_click();
                
                $$("txtName").focus();

                //$$("msgPanel").show("Details of the Main Product...");
            };
            $$("grdSearchResult").dataBind([]);
            page.events.btnSearch_click();

        };

        
        page.events.btnAddItemCarosal_click = function () {
            try{
                if ($$("txtItem").selectedValue() == "" || $$("txtItem").selectedValue() == null || $$("txtItem").selectedValue() == undefined)
                    throw "Item Is Not Selected";
                var data = {
                    collection_id: page.collection_id,
                    sku_no: page.collection_item_sku_no,
                    item_no: page.collection_item_no
                }
                page.collectionItemAPI.postValue(data, function (data) {
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
            page.collectionItemAPI.searchValues("", "", "collection_id = " + page.collection_id, "", function (data) {
                page.view.selectedCarosalItem(data);
            });
        }

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
                        'file-path': CONTEXT.ENABLE_IMAGE_FILE_PATH + page.collection_id + '\\'
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

        page.view = {
            selectedCarosalItem: function (data) {
                $$("grdCarosalItems").width("100%");
                $$("grdCarosalItems").height("350px");
                $$("grdCarosalItems").setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "Item No", 'rlabel': 'Item No', 'width': "15%", 'dataField': "item_code" },
                        { 'name': "SKU No", 'rlabel': 'SKU No', 'width': "15%", 'dataField': "sku_no" },
                        { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "55%", 'dataField': "item_name" },
                        { 'name': "", 'width': "5%", 'dataField': "", itemTemplate: "<input type='button'  class='grid-button' value='' action='Delete' style='background-image: url(Image/cancel.png);    background-size: contain;    background-color: transparent;    width: auto;background-repeat: no-repeat;    width: 15px;    border: none;    cursor: pointer;'/>" },
                    ]
                });
                page.controls.grdCarosalItems.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "Delete") {
                        if (confirm("Are You Sure Want To Delete This Product")) {
                            var data = {
                                collection_item_id: rowData.collection_item_id
                            }
                            page.collectionItemAPI.deleteValue(rowData.collection_item_id, data, function (data) {
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
