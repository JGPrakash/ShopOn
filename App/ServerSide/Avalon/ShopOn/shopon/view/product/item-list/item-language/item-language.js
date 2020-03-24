$.fn.itemLanguage = function () {
    document.activeElement.msGetInputContext;
   
    return $.pageController.getControl(this, function (page, $$) {
        page.template("/" + appConfig.root + "/shopon/view/product/item-list/item-language/item-language.html?" + new Date());
        page.itemAPI = new ItemAPI();
        page.translateAPI = new TranslateAPI();
        page.product_trans_code = null;

        var inputs = $(':input').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                var nextInput = inputs.get(inputs.index(document.activeElement) + 1);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });


        page.events = {
            page_load: function () {
                $$("txtProductName").keypress(function () {
                    if ($$("ddlProductCode").selectedValue() == "ta") {
                        convertThis(event);
                    }
                });
            },
            btnNewLanguage_click: function () {
                $$("pnlProductDetails").show();
                $$("txtProductName").val("");
                $$("ddlProductCode").selectedValue("en");
                page.product_trans_code = null;
            },
            btnSaveLanguage_click: function () {
                var data = {
                    trans_group: "ProductName",
                    trans_key: page.item_no,
                    trans_value: $$("txtProductName").val(),
                    trans_langcode: $$("ddlProductCode").selectedValue(),
                    comp_id: localStorage.getItem("user_company_id")
                }
                try {
                    if (data.trans_value == "" || data.trans_value == null || typeof data.trans_value == "undefined")
                        throw "Product Name Value Is Not Empty";
                    if (page.product_trans_code == null) {
                        page.translateAPI.postValue(data, function (data) {
                            alert("Language Saved Successfully");
                            page.interface.load(page.item_no);
                            page.clearPage();
                        });
                    }
                    else {
                        data.trans_id = page.product_trans_code;
                        page.translateAPI.putValue(page.product_trans_code, data, function (data) {
                            alert("Language Saved Successfully");
                            page.interface.load(page.item_no);
                            page.clearPage();
                        });
                    }
                }
                catch (e) {
                    alert(e);
                }
            },
            btnRemoveLanguage_click: function () {
                try{
                    if (page.product_trans_code == null || page.product_trans_code == "" || typeof page.product_trans_code == "undefined") {
                        throw "Please Choose The Product Name First";
                    }
                    var data = {
                        trans_id: page.product_trans_code
                    }
                    page.translateAPI.deleteValue(page.product_trans_code, data, function (data) {
                        alert("Product Name Deleted Successfully");
                        page.interface.load(page.item_no);
                        page.clearPage();
                    });
                }
                catch (e) {
                    alert(e);
                }
            }
        };

        page.interface.load = function (itemNo) {
            page.item_no = itemNo;
            page.translateAPI.searchValues("", "", "trans_group like 'ProductName' and trans_key =" + page.item_no, "", function (data) {
                page.view.selectedLanguage(data);
            });
        };
        page.view = {
            selectedLanguage: function (data) {
                page.controls.grdItemLanguage.width("100%");//1500px;
                page.controls.grdItemLanguage.height("500px");
                page.controls.grdItemLanguage.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        //{ 'name': "Name", 'rlabel': 'Name', 'width': "120px", 'dataField': "item_name" },
                        { 'name': "Group", 'rlabel': 'Group', 'width': "150px", 'dataField': "trans_group" },
                        { 'name': "Trans Word", 'rlabel': 'Trans Word', 'width': "200px", 'dataField': "trans_value" },
                        { 'name': "Code", 'rlabel': 'Code', 'width': "100px", 'dataField': "trans_langcode" },
                    ]
                });
                $$("grdItemLanguage").selectionChanged = function (row, item) {
                    page.product_trans_code = item.trans_id;
                    $$("pnlProductDetails").show();
                    $$("txtProductName").val(item.trans_value);
                    $$("ddlProductCode").selectedValue(item.trans_langcode);
                }
                page.controls.grdItemLanguage.dataBind(data);
        },
        }
        page.clearPage = function () {
            $$("pnlProductDetails").hide();
            $$("txtProductName").val("");
            $$("ddlProductCode").selectedValue("en");
            page.product_trans_code = null;
        }
    });



}