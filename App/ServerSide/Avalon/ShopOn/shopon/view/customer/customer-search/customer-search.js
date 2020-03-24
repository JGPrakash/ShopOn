
$.fn.manageCustomer = function () {
    return $.pageController.getPage(this, function (page, $$, e) {
        page.customerService = new CustomerService();



        page.events = {
            btnSearch_click: function () {
                page.customerService.getCustomerByAll($$("txtCustomerSearch").selectedValue(), function (item) {
                    page.controls.grdCustomer.dataBind(item);
                });
            },
            grdCustomer_select: function (row,item) {
                page.controls.ucCustomerEdit.select(item);
            },
           btnNewCustomer_click : function (item) {
               page.controls.ucCustomerEdit.select({});
                page.controls.grdCustomer.dataBind([]);
            }         
           ,btnSave_click:function () {
               page.controls.ucCustomerEdit.save();
                page.customerService.getCustomerByAll($$("txtCustomerSearch").selectedValue(), function (item) {
                    page.controls.grdCustomer.dataBind(item);
                });

            },
            btnRemove_click:function () {
               /* var selData = page.controls.grdCustomer.selectedData();
                page.customerService.deleteCustomer(selData[0].cust_no, function (data) {
                    alert("Customer data is removed");
                    page.events.btnSearch_click();

                });*/
                page.controls.ucCustomerEdit.delete();
                //page.events.btnSearch_click();

                page.controls.ucCustomerEdit.select({});

                page.customerService.getCustomerByAll($$("txtCustomerSearch").selectedValue(), function (item) {
                    page.controls.grdCustomer.dataBind(item);
                });



            },

            page_load: function () {
        $$("txtCustomerSearch").dataBind ({
                   getData: function (term, callback) {
                          page.customerService.getCustomerByAll(term, callback);
                      }
               });
                page.controls.grdCustomer.width("500px");
                page.controls.grdCustomer.height("500px");
                page.controls.grdCustomer.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Cust No", 'width': "80px", 'dataField': "cust_no" },
                        { 'name': "Cust Name", 'width': "120px", 'dataField': "cust_name" },
                        { 'name': "Mobile N0", 'width': "100px", 'dataField': "phone_no" },
                        { 'name': "Address", 'width': "120px", 'dataField': "address" },
                        //{ 'name': "Item Name", 'width': "40px", 'dataField': "item_no", itemTemplate: "<input type='button' action='select' value='Select' />" },

                    ]
                });
                page.controls.grdCustomer.selectionChanged = page.events.grdCustomer_select;
                page.controls.grdCustomer.dataBind([]);

                var dataSourceCustomer = {
                    getData: function (term, callback) {
                        page.customerService.getCustomerByAll(term, callback);
                    }
                };




            }
        };

   
    });
}
