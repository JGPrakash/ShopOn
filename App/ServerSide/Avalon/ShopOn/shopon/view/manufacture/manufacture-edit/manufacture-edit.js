/// <reference path="customer-edit.html" />


$.fn.ManufactureEdit = function () {
        return $.pageController.getControl(this, function (page, $$, e) {

            //page.vendorService = new VendorService();
            //page.vendorAPI = new VendorAPI();
         //   document.write('<script src="/' + appConfig.root + '/shopon/service/sales/customer-service.js"><\/script>');
            page.manufactureAPI = new ManufactureAPI();
            page.cityAPI = new CityAPI();
            page.citystateAPI = new CityStateAPI();
            page.customerService = new CustomerService();
            page.template("/" + appConfig.root + '/shopon/view/manufacture/manufacture-edit/manufacture-edit.html');
            //page.customerService = new CustomerService();
            page.cityList = [];
            page.stateList = [];


            //page.interface.delete=function (callback) {
            //    if($$("hdnCustNo").val()!="") {
            //        page.customerService.deleteCustomer($$("hdnCustNo").val(), function (data) {
            //            alert("Customer data is removed");
            //            $$("hdnCustNo").val('');

            //            $$("txtFirstName").val('');
            //            $$("txtLastName").val('');
            //            $$("txtCompany").val('');
            //            $$("txtDOB").setDate('');
            //            $$("txtStreet").val('');
            //            $$("txtAddressLine2").val('');
            //            $$("txtCity").val('');
            //            $$("txtState").val('');
            //            $$("txtPincode").val('');
            //            $$("txtPhone").val('');
            //            $$("txtEmail").val('');
            //            //page.events.btnSearch_click();

            //        });
            //    }
            //    else{
            //        alert("Please select customer to delete");
            //    }
            //}
            page.interface.save = function (callback) {
                var error_count = 0;
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
                    man_active:"1"
                };
                page.manufactureAPI.postValue(data, function (data1) {
                    data.man_no = data1[0].key_value;
                    callback(data);
                });
            };

            page.interface.select = function (item) {

                $$("txtManufactureName").value(nvl(item.man_name, ""));
                $$("txtManufactureAddress").value(nvl(item.man_address, ""));
                $$("txtManufactureEmail").value(nvl(item.man_email, ""));
                $$("txtAddressLine1").value(nvl(item.address1, ""));
                $$("txtAddressLine2").value(nvl(item.address2, ""));
                $$("txtCity").selectedObject.val(nvl(item.city, ""));
                $$("txtState").selectedObject.val(nvl(item.state, ""));
                $$("txtPincode").selectedObject.val(nvl(item.zip_code, ""));

                $$("txtManufactureName").focus();
            };

            page.events.page_load = function () {
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


                $("input").keyup(function (event) {
                    if (event.keyCode == 13) {
                        textboxes = $("input");
                        currentBoxNumber = textboxes.index(this);
                        if (textboxes[currentBoxNumber + 1] != null) {
                            nextBox = textboxes[currentBoxNumber + 1];
                            nextBox.focus();
                            nextBox.select();
                        }
                        event.preventDefault();
                        return false;
                    }
                });
                $("[controlid=txtCity]").on('keyup', function (e) {
                    if (e.which == 9) {
                        $$("txtState").selectedObject.focus();
                    }
                });
            }

        });
    }
    