/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.OfferPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.offerAPI = new OfferAPI();
        page.offer_id = null;
        document.title = "ShopOn - offer";
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

        //To search the offer
        page.events.btnSearch_click = function () {
            $(".detail-info").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("msgPanel").show("Searching...");

            //Load the search result in grid
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "concat(ifnull(offer_id,''),ifnull(offer_name,'')) like '%" + $$("txtSearchInput").value() + "%'",
                sort_expression: ""
            }
            page.offerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                $$("grdSearchResult").dataBind(data);
                $$("msgPanel").hide();
            });
        };

        //To create a new offer
        page.events.btnNew_click = function () {
            //Show the panel
            $(".detail-info").show();
            //Show the Save button and hide delete button
            $$("btnSave").show();
            $$("btnDelete").hide();
            page.offer_image = null;
            //Clear all textbox
            $$("txtOfferName").val('');
            $$("txtOfferValue").val('');
            $$("txtOfferDescription").val('');
            $$("txtOfferName").focus();
            $$("chkActive").prop('checked', true);
            $("#output").attr("src", "");
            //Set the curent offer no to null
            page.offer_id = null;
           
            
        };

        //To insert or update a offer
        page.events.btnSave_click = function () {
            $$("btnSave").disable(true);
            var error_count = 0;
            var offer = {
                offer_name: $$("txtOfferName").value(),
                offer_value: $$("txtOfferValue").value(),
                offer_description: $$("txtOfferDescription").val(),
            };
            if ($$("chkActive").prop("checked")) {
                offer.state_no = 100;
            }
            else {
                offer.state_no = 200;
            }
            var files = $("#fileUpload").get(0).files;
            var fileName = "";
            if (files.length > 0) {
                fileName = files[0];
            }
            if (fileName.name != "" || fileName.name != null || fileName.name != undefined) {
                offer.offer_image = fileName.name
            }
            if (offer.offer_name == "") {
                $$("msgPanel").show("offer name is mandatory ...!");
                $$("txtOfferName").focus();
                error_count++;
            }
            if(error_count==0) {
                $$("msgPanel").show("Inserting new offer...");
                if (page.offer_id == null || page.offer_id == '') {
                    page.offerAPI.postValue(offer, function (data) {
                        $$("msgPanel").show("Offer saved successfully...!");
                        $$("btnSave").disable(false);
                        var offer = {
                            offer_id: data[0].key_value
                        }
                        page.offer_id = data[0].key_value;
                        page.UploadImage(function () {
                            var data = {
                                start_record: 0,
                                end_record: "",
                                filter_expression: "offer_id=" + page.offer_id,
                                sort_expression: ""
                            }
                            page.offerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            //page.offerAPI.getValue(offer, function (data) {
                                // Add the new data to Grid
                                $$("grdSearchResult").dataBind(data);
                                $$("grdSearchResult").getAllRows()[0].click();
                                $$("msgPanel").hide();
                                $$("txtOfferName").focus();
                            });
                        });
                    });

                } else {

                    $$("msgPanel").show("Updating offer...");
                    offer.offer_id = page.offer_id;
                    page.offerAPI.putValue(offer.offer_id, offer, function (data1) {
                        $$("msgPanel").show("Offer updated successfully...!");
                        $$("btnSave").disable(false);
                        var offer = {
                            offer_id: page.offer_id
                        }
                        page.UploadImage(function () {
                            var data = {
                                start_record: 0,
                                end_record: "",
                                filter_expression: "offer_id=" + page.offer_id,
                                sort_expression: ""
                            }
                            page.offerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            //page.offerAPI.getValue(offer, function (data) {
                                // Update the new data to Grid
                                $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                                $$("grdSearchResult").selectedRows()[0].click();
                                $$("msgPanel").hide();
                                $$("txtOfferName").focus();
                            });
                        });
                    });
                } 
            }
            else {
                $$("btnSave").disable(false);
            }
            $$("btnDelete").show();
        };
        page.UploadImage = function (callback) {
            var photo_data = new FormData();
            var files = $("#fileUpload").get(0).files;
            // Add the uploaded image content to the form data collection
            if (files.length > 0) {
                photo_data.append("file", files[0]);
                // Make Ajax request with the contentType = false, and procesDate = false
                var ajaxRequest = $.ajax({
                    type: "POST",
                    //url: "http://104.251.212.122:8080/FileUploaderRESTService/rest/image/upload",
                    url:
                    //CONTEXT.ImageUploadURL,
                    "http://104.251.218.116:8080/FileUploaderRESTService/rest/image/upload",
                    //"http://104.251.212.122:8080/FileUploaderRESTService/rest/image/upload",
                    headers: {
                        //'file-path': '/usr/shopon/upload/images/' + $$("lblItemNo").value() + '/'
                        'file-path': '/opt/tomcat/webapps/images/upload/shopondev/offer/' + 'offer_' + page.offer_id + '/'
                        //'file-path': '/var/lib/tomcat8/webapps/images/upload/blisstree/' + page.people_id + '/'
                        //CONTEXT.ImageFilePath + $$("lblItemNo").value() + '/'
                        //'file-path': CONTEXT.ImageFilePath + 'patient_' + $$("txtPatientId").value() + '/'

                    },
                    contentType: false,
                    processData: false,
                    data: photo_data
                });

                ajaxRequest.done(function (xhr, textStatus) {
                    if (callback != undefined) {
                        callback();
                    }
                });
            }
            else {
                if (callback != undefined) {
                    callback();
                }
            }
        }
        //To Remove a offer
        page.events.btnDelete_click = function () {

            if (page.offer_id != null && page.offer_id != '') {
                $$("msgPanel").show("Removing offer...");
                var data = {
                    offer_id: page.offer_id
                }
                page.offerAPI.deleteValue(page.offer_id, data, function (data) {
                    //Delete from grid
                    $$("grdSearchResult").deleteRow($$("grdSearchResult").selectedRowIds()[0]);
                    $(".detail-info").hide();
                    $$("btnSave").hide();
                    $$("btnDelete").hide();
                    $$("msgPanel").show("Offer removed successfully...!");
                    $$("msgPanel").hide();

                });
            }
            else {
                $$("msgPanel").show("Select a offer first...!");
            }
        };
             
        page.events.page_load = function () {
            $$("grdSearchResult").width("100%");
            $$("grdSearchResult").height("500px");
            $$("grdSearchResult").setTemplate({
                selection: "Single", paging: true, pageSize: 50,
                columns: [
                    //{ 'name': "ID", 'width': "60px", 'rlabel': 'No', 'dataField': "offer_id" },
                    { 'name': "ID", 'rlabel': 'ID', 'width': "100px", 'dataField': "offer_id" },
                    { 'name': "Offer Name", 'rlabel': 'Offer Name', 'width': "150px", 'dataField': "offer_name" },
                ]
            });
            $$("grdSearchResult").selectionChanged = function (row, item) {
                $(".detail-info").show();
                $('#fileUpload').val("")
                //When selected show save and delete button
                $$("btnSave").show();
                $$("btnDelete").show();
                //Set the current offer
                page.offer_id = item.offer_id;
                //Load the data
                $$("txtOfferName").value(item.offer_name);
                $$("txtOfferValue").value(item.offer_value);
                $$("txtOfferDescription").value(item.offer_description);
                if (item.state_no == "100") {
                    $$("chkActive").prop('checked', true);
                }
                else {
                    $$("chkActive").prop('checked', false);
                }
                if (item.offer_image != undefined && item.offer_image != null && item.offer_image != '') {
                    $("#output").attr("src", "http://104.251.218.116:8080/images/upload/shopondev/offer/" + 'offer_' + item.offer_id + '/' + item.offer_image);
                    page.offer_image = item.offer_image;
                }
                else {
                    $('#fileUpload').val("")
                    $("#output").attr("src", "http://104.251.218.116:8080/images/upload/shopondev/category/" + '/No_Image_Available.png');
                }
                $$("txtOfferName").focus();
            };
            $$("grdSearchResult").dataBind([]);
            page.events.btnSearch_click();
            $$("txtSearchInput").focus();

            //$$("txtSearchInput").keyup(function () {
            //    //Load the search result in grid
            //    var data = {
            //        start_record: 0,
            //        end_record: "",
            //        filter_expression: "concat(ifnull(offer_id,''),ifnull(offer_name,''),ifnull(offer_phone,'')) like '%" + $$("txtSearchInput").value() + "%'",
            //        sort_expression: ""
            //    }
            //    page.offerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
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
