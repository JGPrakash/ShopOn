$.fn.itemPackage = function () {
    document.activeElement.msGetInputContext;
   
    return $.pageController.getControl(this, function (page, $$) {
        page.template("/" + appConfig.root + "/shopon/view/product/item-list/item-package/item-package.html?" + new Date());
        page.itemAPI = new ItemAPI();
        page.translateAPI = new TranslateAPI();
        page.itemList = [];

        var inputs = $(':input').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                var nextInput = inputs.get(inputs.index(document.activeElement) + 1);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
        var typingTimer;                //timer identifier
        var doneTypingInterval = 250;
        var $inputItemCount = $("[controlid=txtItemCount]");
        $inputItemCount.on('keydown', function (e) {
            if (e.which == 13) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () {
                    if ($$("txtItemCount").value() == "" || parseFloat($$("txtItemCount").value()) < 0) {
                        $$("txtItemCount").value(0);
                    }
                }, doneTypingInterval);
            }
        });

        page.events = {
            page_load: function () {
                page.controls.txtProductName.dataBind({
                    getData: function (term, callback) {
                        callback(page.itemList);
                    }
                });
            },
            btnNewPackage_click: function () {
                $$("pnlProductDetails").show();
                $$("txtProductName").selectedObject.val("");
                $$("txtProductName").selectedObject.focus();
            },
            btnAddItem_click: function () {
                try{
                    var len = page.controls.grdItemPackage.allData().length;
                    if (parseInt($$("txtItemCount").value()) < len) {
                        throw "Sorry You Have Reached Maximum Number Of Packaged Count Or Increase The Package Count";
                    }
                    var data = {
                        item_no: $$("txtProductName").selectedValue(),
                        item_name: $$("txtProductName").selectedObject.val()
                    };
                    page.controls.grdItemPackage.createRow(data);
                    $$("txtProductName").selectedObject.val("");
                    $$("txtProductName").selectedObject.focus();
                }
                catch (e) {
                    alert(e);
                }
            },
            btnSavePackage_click: function () {
                try{
                    var len = page.controls.grdItemPackage.allData().length;
                    if (parseInt($$("txtItemCount").value()) < len) {
                        throw "Sorry You Have Reached Maximum Number Of Packaged Count Or Increase The Package Count";
                    }
                    var package_item = "";
                    $(page.controls.grdItemPackage.allData()).each(function (i, item) {
                        package_item = (package_item == "") ? item.item_no : package_item + "||" + item.item_no
                    });
                    var data = {
                        item_no: page.item_no,
                        package_item: (package_item == "") ? "null" : package_item,
                        package_count: parseInt($$("txtItemCount").value())
                    }
                    page.itemAPI.putValue(page.item_no, data, function (data) {
                        alert("Package Saved Successfully");
                        page.interface.load(page.item_no, package_item, parseInt($$("txtItemCount").value()));
                        page.clearPage();
                    });
                }
                catch (e) {
                    alert(e);
                }
            },
        };

        page.interface.load = function (itemNo, package_item,package_count) {
            page.item_no = itemNo;
            page.itemAPI.getValue(page.item_no, function (data) {
                package_item = data[0].package_item;
                package_count = data[0].package_count;
                $$("txtItemCount").value(package_count);
                if (package_item == "null" || package_item == null || package_item == "") {
                    page.view.selectedPackage([]);
                }
                else {
                    var items = package_item.split('||');
                    var filterExpression = "";
                    $(items).each(function (i, item) {
                        filterExpression = (filterExpression == "") ? item : filterExpression + "," + item;
                    });
                    filterExpression = " item_no in (" + filterExpression + ") ";
                    page.itemAPI.searchValues("", "", filterExpression, "item_no", function (data) {
                        page.view.selectedPackage(data);
                    });
                }
                $$("msgPanel").show("Searching The Items Please Wait...");
                page.itemAPI.searchValues("", "", "", "item_no", function (data) {
                    page.itemList = data;
                    $$("msgPanel").hide();
                });
            });
        };
        page.view = {
            selectedPackage: function (data) {
                page.controls.grdItemPackage.width("100%");//1500px;
                page.controls.grdItemPackage.height("500px");
                page.controls.grdItemPackage.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "No", 'rlabel': 'No', 'width': "150px", 'dataField': "item_no" },
                        { 'name': "Name", 'rlabel': 'Name', 'width': "250px", 'dataField': "item_name" },
                        { 'name': "", 'width': "40px", 'dataField': "", itemTemplate: "<input type='button'  class='grid-button' value='' action='Delete' style='background-image: url(BackgroundImage/cancel.png);    background-size: contain;    background-color: transparent;    width: auto;background-repeat: no-repeat;    width: 15px;    border: none;    cursor: pointer;'/>" },
                    ]
                });
                page.controls.grdItemPackage.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "Delete") {
                        page.controls.grdItemPackage.deleteRow(rowId);
                    }
                }
                page.controls.grdItemPackage.dataBind(data);
        },
        }
        page.clearPage = function () {
            $$("pnlProductDetails").hide();
            $$("txtProductName").selectedObject.val("");
        }
    });



}