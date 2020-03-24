/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.fn.manufacturePage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.manufactureService = new ManufactureService();
        page.manufactureAPI = new ManufactureAPI();
        page.customerService = new CustomerService();
        page.cityAPI = new CityAPI();
        page.citystateAPI = new CityStateAPI();
        page.man_no = null;
        document.title = "ShopOn - Manufacture";
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

        page.events.btnNew_click = function ()
        {
            $$("btnSave").show();
            $$("btnDelete").hide();
            $(".detail-info").show();
            //$$("msgPanel").show("Clearing all fields to get new data..");
            var data = '';
            page.man_no = null;
            $$("txtManufactureName").val('');
            $$("txtManufactureName").focus();
            $$("txtManufacturePhoneNo").val('');
            $$("txtManufactureEmail").val('');
            $$("txtManufactureAddress").val('');
            $$("txtAddressLine1").value("");
            $$("txtAddressLine2").value("");
            $$("txtCity").selectedObject.val("");
            $$("txtState").selectedObject.val("");
            $$("txtPincode").selectedObject.val("");
            $$("txtSearchInput").value('');
            $$("chkActive").prop('checked', true);
            //$$("btnNew").hide();
            $("#fileUpload").val("");

        };
        var data = {
            start_record: 0,
            end_record: "",
            filter_expression: "",
            sort_expression: ""
        }
        page.manufactureAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
            //page.manufactureService.getManufacture(function (data) {
            $$("grdSearchResult").dataBind(data);
        });
        page.events.page_load = function () {

            $$("btnSave").hide();
            $$("btnDelete").hide();
            $(".detail-info").hide();
            $$("txtSearchInput").selectedObject.focus()

            $$("grdSearchResult").width("100%");
            $$("grdSearchResult").height("480px");
            $$("grdSearchResult").setTemplate({
                selection: "Single", paging: true, pageSize: 50,
                columns: [
                    //{ 'name': "No", 'rlabel': 'No', 'width': "100px", 'dataField': "man_no" },
                    { 'name': "No", 'rlabel': 'No', 'width': "100px", 'dataField': "man_id" },
                    { 'name': "Name", 'rlabel': 'Name', 'width': "120px", 'dataField': "man_name" }
                ]
            });

            $$("grdSearchResult").selectionChanged = function (row, item) {
                $$("btnSave").show();
                $$("btnDelete").show();
                $$("txtManufactureName").focus();
                //$$("btnNew").show();
                $(".detail-info").show();
                page.man_no = item.man_no;
                page.selectedRowId = row.attr("row_id");

                $$("txtManufactureName").value(item.man_name);
                $$("txtManufactureAddress").value(item.man_address);
                $$("txtManufactureEmail").value(item.man_email);
                $$("txtAddressLine1").value(item.address1);
                $$("txtAddressLine2").value(item.address2);
                $$("txtCity").selectedObject.val(item.city);
                $$("txtState").selectedObject.val(item.state);
                $$("txtPincode").selectedObject.val(item.zip_code);
                var mobile1 = item.man_phone;
                (mobile1 == "" || mobile1 == null) ? $$("txtManufacturePhoneNo").value('') : $$("txtManufacturePhoneNo").value(nvl(mobile1, ""));
                //$$("txtManufacturePhoneNo").value(item.man_phone);
                if (item.man_active == "1") {
                    $$("chkActive").prop('checked', true);
                }
                else {
                    $$("chkActive").prop('checked', false);
                }
                if (item.man_image != undefined && item.man_image != null && item.man_image != '')
                    $("#output").attr("src", CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + page.man_no + '/' + item.man_image);
                $$("txtManufactureName").focus();
            };
            $$("grdSearchResult").dataBind([]);

            //$$("txtSearchInput").keyup(function () {
            //    var data = {
            //        start_record: 0,
            //        end_record: "",
            //        filter_expression: "concat(ifnull(man_no,''),ifnull(man_name,'')) like '%" + $$("txtSearchInput").value() + "%'",
            //        sort_expression: ""
            //    }
            //    page.manufactureAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
            //        //page.manufactureService.getManuByNamePhone($$("txtSearchInput").value(), function (data) {
            //        $$("grdSearchResult").dataBind(data);
            //        $$("msgPanel").hide();
            //    });
            //});
            page.events.btnSearch_click();
            //Get Pincode Data
            page.customerService.getPincodeMapping("", function (data) {
                page.pincodeList = data;
            });
            page.controls.txtPincode.dataBind({
                getData: function (term, callback) {
                    callback(page.pincodeList);
                }
            });
            page.controls.txtPincode.select(function (item) {
                if (item != null) {
                    $$("txtCity").selectedObject.val(item.city);
                    $$("txtState").selectedObject.val(item.state);
                    $$("txtPincode").selectedObject.val(item.pincode);
                }
            });
            page.controls.txtPincode.allowCustomText(function (item) {
                page.controls.txtPincode.selectedObject.val(item.val());
            });
            //End Pincode Data
            //TODO: Start city code
            page.cityAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                page.cityList = data;
            });
            page.controls.txtCity.dataBind({
                getData: function (term, callback) {
                    callback(page.cityList);
                }
            });
            //TODO : End City code
            //TODO : Start State Code
            page.citystateAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                page.stateList = data;
            });
            page.controls.txtState.dataBind({
                getData: function (term, callback) {
                    callback(page.stateList);

                }
            });
            //TODO : End State Code
        };

        page.events.btnSave_click = function () {
            $(".detail-info").show();
            var man_name = $$("txtManufactureName").value();
            var man_phone = $$("txtManufacturePhoneNo").value();
            var man_email = $$("txtManufactureEmail").value();

            var files = $("#fileUpload").get(0).files;

            if (man_name == "") {
                $$("msgPanel").show("Manufacturer name is mandatory ...!");
                $$("txtManufactureName").focus();
                //alert("Vendor Name is Mantatory");
            }
            else if (man_name != "" && isInt(man_name))
            {
                $$("msgPanel").show("Manufacturer name should only contains characters ...!");
                $$("txtManufactureName").focus();
            }
            
            else if (man_phone != "" && !isInt(man_phone)) {
                $$("msgPanel").show("Mobile no should only contain numbers ...!");
                $$("txtManufacturePhoneNo").focus();
            }
            //else if ((man_phone != "" || man_phone == "+91") && man_phone.substring(0, 3) != "+91") {
            //    $$("msgPanel").show("Phone no should contain '+91' as prefix ...!");
            //    $$("txtManufacturePhoneNo").focus();
            //}
            else if (man_phone != "" && man_phone.length < 10) {
                $$("msgPanel").show("Mobile no should be 10 in length...!");
                $$("txtManufacturePhoneNo").focus();
            }
            else if (man_email != "" && !ValidateEmail(man_email)) {
                $$("msgPanel").show("Email address is not valid...!!!");
                $$("txtManufactureEmail").focus();
            }
            else { 
                if (page.man_no == null || page.man_no == '') {
                    if ($$("txtManufacturePhoneNo").value() == "") {
                        page.save();
                    }
                    else {
                        page.manufactureAPI.searchValues("", "", "man_phone like '" + $$("txtManufacturePhoneNo").value() + "'", "", function (data) {
                            if (data.length == 0) {
                                page.save();
                            }
                            else {
                                if (confirm("This Mobile No " + $$("txtManufacturePhoneNo").value() + " is saved to another manufacture are you want to save it again")) {
                                    page.save();
                                }
                            }
                        });
                    }
                }
                else { //Update Values
                    if ($$("txtManufacturePhoneNo").value() == "") {
                        page.update();
                    }
                    else {
                        page.manufactureAPI.searchValues("", "", "man_phone like '" + $$("txtManufacturePhoneNo").value() + "'", "", function (data) {
                            if (data.length == 0) {
                                page.update();
                            }
                            else {
                                if (data[0].man_no != page.man_no) {
                                    if (confirm("This Mobile No " + $$("txtManufacturePhoneNo").value() + " is saved to another manufacture are you want to save it again")) {
                                        page.update();
                                    }
                                }
                                else {
                                    page.update();
                                }
                            }
                        });
                    }
                }
            //$$("btnNew").show();
        }
            $$("btnSave").show();
            $$("btnDelete").show();
            //$$("btnNew").show();
        }
        page.events.btnBeforeDelete_click = function () {
            if (CONTEXT.ENABLE_REMOVE) {
                page.controls.pnlRemoveConfirmPopup.open();
                page.controls.pnlRemoveConfirmPopup.title("Remove Alert");
                page.controls.pnlRemoveConfirmPopup.rlabel("Remove Alert");
                page.controls.pnlRemoveConfirmPopup.width(540);
                page.controls.pnlRemoveConfirmPopup.height(200);
            }
            else {
                page.controls.pnlRemoveAlertPopup.open();
                page.controls.pnlRemoveAlertPopup.title("Remove Alert");
                page.controls.pnlRemoveAlertPopup.rlabel("Remove Alert");
                page.controls.pnlRemoveAlertPopup.width(540);
                page.controls.pnlRemoveAlertPopup.height(200);
            }
        }
        page.events.btnRemoveAlertPopupClose_click = function () {
            page.controls.pnlRemoveAlertPopup.close();
        }
        page.events.btnRemoveConfirmPopupClose_click = function () {
            page.controls.pnlRemoveConfirmPopup.close();
        }
        page.events.btnDelete_click = function () {
            page.controls.pnlRemoveConfirmPopup.close();
            //$(".detail-info").progressBar("show")
            if (page.man_no == null || page.man_no == '') {
                $$("msgPanel").show("Select a manufacturer first...!");
            }
            else {
                $$("msgPanel").show("Removing manufacturer...");
                var data = {
                    man_no: page.man_no
                }
                page.manufactureAPI.deleteValue(data.man_no, data, function (data) {
                    //page.manufactureService.deleteManufacture(page.man_no, function () {
                    //$(".detail-info").progressBar("hide")
                    $$("msgPanel").show("Manufacturer removed sucessfully...!");
                    //page.manufactureService.getManufacture(function (data) {
                    $$("grdSearchResult").deleteRow($$("grdSearchResult").selectedRowIds()[0]);
                    $(".detail-info").hide();
                    //$$("msgPanel").show("Updating new details...");
                    $$("msgPanel").hide();
                    //});
                    //page.events.btnNew_click();
                    //page.events.page_load();
                });
            }

        };
        page.events.btnSearch_click = function () {
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $(".detail-info").hide();
            $$("msgPanel").show("Searching...");
            var data = {
                start_record: 0,
                end_record: "",
                //filter_expression: "concat(ifnull(man_no,''),ifnull(man_name,'')) like '%" + $$("txtSearchInput").value() + "%'",
                filter_expression: "concat(ifnull(man_id,''),ifnull(man_name,'')) like '%" + $$("txtSearchInput").value() + "%'",
                sort_expression: ""
            }
            page.manufactureAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
            //page.manufactureService.getManuByNamePhone($$("txtSearchInput").value(), function (data) {
                $$("grdSearchResult").dataBind(data);
                $$("msgPanel").hide();
            });
            $$("txtSearchInput").selectedObject.focus()
        };

        page.save = function () {
            var files = $("#fileUpload").get(0).files;
            var fileName = "";
            if (files.length > 0) {
                fileName = files[0];
            }
            var data = {
                man_name: $$("txtManufactureName").value(),
                man_address: $$("txtManufactureAddress").value(),
                man_email: $$("txtManufactureEmail").value(),
                man_phone: ($$("txtManufacturePhoneNo").value() == "") ? "" : $$("txtManufacturePhoneNo").value(),
                comp_id: localStorage.getItem("user_company_id"),
                address1: $$("txtAddressLine1").value(),
                address2: $$("txtAddressLine2").value(),
                city: $$("txtCity").selectedObject.val(),
                state: $$("txtState").selectedObject.val(),
                zip_code: $$("txtPincode").selectedObject.val(),
                man_image: fileName.name
            };
            if ($$("chkActive").prop("checked")) {
                data.man_active = "1";
            } else {
                data.man_active = "0";
            }
            //$(".detail-info").progressBar("show")
            $$("msgPanel").show("Inserting new manufacturer...");
            page.manufactureAPI.postValue(data, function (data) {
                //page.manufactureService.insertManufacture(data, function (data){
                //$(".detail-info").progressBar("hide")
                $$("msgPanel").show("Manufacturer inserted sucessfully...!");
                var manufacture = {
                    man_no: data[0].key_value
                }
                page.man_no = data[0].key_value;
                if (fileName.name != "" && fileName.name != null && typeof fileName.name != "undefined") {
                    page.events.btnUploadImage_click();
                }
                page.manufactureAPI.getValue(manufacture, function (data) {
                    //page.manufactureService.getManufactureByNo(data[0].key_value, function (data) {
                    $$("grdSearchResult").dataBind(data);
                    $$("grdSearchResult").getAllRows()[0].click();
                    //page.manufactureService.getManufacture(function (data) {
                    //    $$("grdSearchResult").dataBind(data);
                    $$("msgPanel").hide();
                    $$("txtManufactureName").focus();
                });
            });
            //page.events.btnNew_click();
            //page.events.page_load();
        }
        page.update = function () {
            var files = $("#fileUpload").get(0).files;
            var fileName = "";
            if (files.length > 0) {
                fileName = files[0];
            }
            var data = {
                man_no: page.man_no,
                man_name: $$("txtManufactureName").value(),
                man_address: $$("txtManufactureAddress").value(),
                man_email: $$("txtManufactureEmail").value(),
                man_phone: ($$("txtManufacturePhoneNo").value() == "") ? "" : $$("txtManufacturePhoneNo").value(),
                comp_id: localStorage.getItem("user_company_id"),
                address1: $$("txtAddressLine1").value(),
                address2: $$("txtAddressLine2").value(),
                city: $$("txtCity").selectedObject.val(),
                state: $$("txtState").selectedObject.val(),
                zip_code: $$("txtPincode").selectedObject.val(),
                man_image: fileName.name
            };
            if ($$("chkActive").prop("checked")) {
                data.man_active = "1";
            } else {
                data.man_active = "0";
            }
            //$(".detail-info").progressBar("show")
            $$("msgPanel").show("updating manufacturer...");
            page.manufactureAPI.putValue(data.man_no, data, function (data1) {
                //page.manufactureService.updateManufacture(data, function (data1) {
                //$(".detail-info").progressBar("hide")
                $$("msgPanel").show("Manufacturer updated sucessfully...!");
                /* page.manufactureService.getManufacture(function (data) {
                     $$("grdSearchResult").dataBind(data);
                     $$("msgPanel").show("updating new details...");
                     //$$("grdSearchResult").updateRow( page.selectedRowId ,data);
                 });*/
                if (fileName.name != "" && fileName.name != null && typeof fileName.name != "undefined") {
                    page.events.btnUploadImage_click();
                }
                var manufacture = {
                    man_no: data.man_no
                }
                page.manufactureAPI.getValue(manufacture, function (data) {
                    //page.manufactureService.getManufactureByNo(data.man_no, function (data) {

                    // Update the new data to Grid
                    $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                    $$("grdSearchResult").selectedRows()[0].click();
                    $$("msgPanel").hide();
                    $$("txtManufactureName").focus();
                });
            });
            //page.events.btnNew_click();
            //page.events.page_load();
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
                        'file-path': CONTEXT.ENABLE_IMAGE_FILE_PATH + page.man_no + '\\'
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

        function selectRow(up) {
            var t = $$("grdSearchResult");
            var count = t.grid.dataCount;
            var selected = t.selectedRowIds()[0];
            if (selected) {
                var index = parseInt(t.selectedRowIds()[0]) - 1;
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

