
$.fn.itemHierarchyPage = function () {
    return $.pageController.getPage(this, function (page, $$, e) {
        page.itemHieAPI = new ItemHierarchyAPI();
        page.itemAttrCacheAPI = new ItemAttrCacheAPI();
        page.itemCategoryAPI = new ItemCategoryAPI();
        page.itemAttributeAPI = new ItemAttributeAPI();

        $("body").keydown(function (e) {

            var keyCode = e.keyCode || e.which;
        });
        

        page.events = {
            page_load: function () {
                page.loadItemHierarchy();
                $$("ddlType").selectionChange(function () {
                    page.events.btnSearch_click();
                })
                $$("ddlCategory").selectionChange(function () {
                    page.cat_level = page.controls.ddlCategory.selectedData().cat_level;
                    //page.loadAttrForCategoryLink();
                })
                $$("ddlAttrCategory").selectionChange(function () {
                    page.loadAttributeForAttr();
                })
                page.loadCategory();
                page.loadAttribute();
                page.loadCategoryForAttr();
                page.loadAttributeForAttr();
            },
            btnSearch_click : function(){
                page.loadItemHierarchy();
                $(".basic-info").hide();
            },
            grditemHierarchy_select: function (row,item) {
                $(".basic-info").show();
                page.items = item;
                page.row = row;
                page.type=item.type;
                page.t_no = item.t_no;
                page.gridAttrData = [];
                page.loadAttrCache(item.type, item.mpt_no, item.ptype_no, item.item_no, function (allAttrData) {
                    var attr_nos = "";
                    if (allAttrData.length > 0) {
                        for (var i = 0; i < allAttrData.length; i++) {
                            var filter = "";

                            filter = " attr_no_key in(" + allAttrData[i].attr_nos + ") and attr_no_key not in(1,2,3,4,5,6,100,101,102) ";
                            var attrData = {
                                start_record: 0,
                                end_record: "",
                                filter_expression: filter,
                                sort_expression: " attr_no_key,attr_name ",
                                i: i
                            }

                            page.itemAttributeAPI.searchValue(attrData.start_record, attrData.end_record, attrData.filter_expression, attrData.sort_expression, attrData.i, function (data) {
                                if (data.length > 0) {
                                    $(data).each(function (i, item) {
                                        var filter = page.gridAttrData.filter(function (n) {
                                            return n.attr_no == item.attr_no_key && n.item_no == allAttrData[item.i].item_no && n.type == page.items.type && n.attr_name == item.attr_name && n.cat_name == allAttrData[item.i].cat_name
                                        })
                                        if (filter.length <= 0) {
                                            page.gridAttrData.push({
                                                item_attr_no: "",
                                                item_no: allAttrData[item.i].item_no,
                                                attr_no: item.attr_no_key,
                                                cat_no: allAttrData[item.i].attr_value,
                                                attr_value: "",
                                                state_no: allAttrData[item.i].state_no,
                                                attr_text: "",
                                                type: allAttrData[item.i].type,
                                                attr_name: item.attr_name,
                                                inheritedfrom: allAttrData[item.i].inheritedfrom,
                                                cat_name: allAttrData[item.i].cat_name,
                                                cat_no_par: allAttrData[item.i].cat_no_par
                                            })
                                        }

                                    })
                                }
                                page.loadLinkedAttr(page.items.type, page.items.mpt_no, page.items.ptype_no, page.items.item_no, page.gridAttrData)
                            });
                        }
                    }
                    else {
                        page.loadLinkedAttr(page.items.type, page.items.mpt_no, page.items.ptype_no, page.items.item_no, [])
                    }
                    /*
                    $(allAttrData).each(function (i, item) {
                        //var filter = "";

                        //if (item.attr_value != "" && item.attr_value != null && item.attr_value != undefined) {
                        //    filter = filter + " cat_no =" + item.attr_value;
                        //    var catData = {
                        //        start_record: 0,
                        //        end_record: "",
                        //        filter_expression: filter,
                        //        sort_expression: " "
                        //    }
                        //    page.itemCategoryAPI.searchValue(catData.start_record, catData.end_record, catData.filter_expression, catData.sort_expression, function (data) {
                                if (attr_nos=="")
                                    attr_nos = item.attr_nos;
                                else
                                    attr_nos = attr_nos + "," + item.attr_nos;

                        //    })
                        //}

                    })
                    var filter = "";
                    filter = " attr_no in(" + attr_nos + ")";
                    var attrData = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: filter,
                        sort_expression: " attr_no,attr_name "
                    }
                    
                    page.itemAttributeAPI.searchValue(attrData.start_record, attrData.end_record, attrData.filter_expression, attrData.sort_expression, function (data) {
                        if (data.length > 0) {
                            $(data).each(function(i,item){
                                page.gridAttrData.push({
                                    item_attr_no: "",
                                    item_no: page.items.t_no,
                                    attr_no: item.attr_no,
                                    attr_value: "",
                                    state_no: "",
                                    attr_text: "",
                                    type: page.items.type,
                                    attr_name: item.attr_name,
                                    inheritedfrom: "",
                                    cat_name: "",
                                    cat_no_par: ""
                                })
                            })
                            page.loadLinkedAttr(page.items.type, page.items.mpt_no, page.items.ptype_no, page.items.item_no,page.gridAttrData)
                            }
                    
                            
                    })
                    */
                    //setTimeout(
                        
                      //  , 20000);//type,mpt_no,ptype_no,item_no
                });//type,mpt_no,ptype_no,item_no
                

            },
            btnAddCategory_click: function () {
                page.controls.pnlCategoryPopup.open();
                page.controls.pnlCategoryPopup.title("Link Category");
                page.controls.pnlCategoryPopup.height("400");
                page.controls.pnlCategoryPopup.width("400");
            },
            btnSaveCategory_click: function () {
                if ($$("ddlCategory").selectedValue() == -1) {
                    alert("Please select category...!");
                }
                //else if ($$("ddlLinkAttribute").selectedValue() == -1) {
                //    alert("Please select attribute...!");
                //}
                //else if ($$("txtAttributeText").value() == "") {
                //    alert("Please enter attribute text to continue...!");
                //}
                else {
                    var attrCacheData = {
                        type: page.type,
                        item_no: page.t_no,
                        attr_no: (page.controls.ddlCategory.selectedData().cat_level == 1) ? 100 : (page.controls.ddlCategory.selectedData().cat_level == 2) ? 101 : 102,
                        attr_value: $$("ddlCategory").selectedValue(),
                        attr_text: $$("ddlCategory").selectedData(0).cat_text,
                        comp_id: getCookie("user_company_id")
                    }

                    page.itemAttrCacheAPI.postValue(attrCacheData, function () {
                        alert("New Category Linked Successfully...!");
                        page.events.grditemHierarchy_select(page.row, page.items);
                        page.controls.pnlCategoryPopup.close();
                    })
                }
            },
            btnAddAttribute_click: function () {
                page.controls.pnlAttributePopup.open();
                page.controls.pnlAttributePopup.title("Link Attribute");
                page.controls.pnlAttributePopup.height("400");
                page.controls.pnlAttributePopup.width("400");
            },
            btnSaveAttr_click: function () {
                var row = page.controls.grditemAttributes.getAllRows();
                var data = page.attrLinkedData;
                var putData = [];
                var postData = [];
                $(row).each(function (i, item) {
                    a = [];
                    a.type = page.items.type;
                    a.item_no = page.items.t_no;
                    a.attr_no = $(item).find("[datafield=attr_no]").find("div").html();
                    a.attr_value = $(item).find("[datafield=attr_value]").find("input").val();
                    a.attr_text = $(item).find("[datafield=attr_text]").find("input").val();
                    //a.item_attr_no = $(item).find("[datafield=item_attr_no]").find("div").html()
                    a.comp_id=getCookie("user_company_id")
                    if (a.attr_value != "" && a.attr_text != "") {
                        if (a.attr_value != data[i].attr_value || a.attr_text != data[i].attr_text) {
                            var attrCacheData = {
                                type: a.type,
                                item_no: a.item_no,
                                attr_no: a.attr_no,
                                attr_value: a.attr_value,
                                attr_text: a.attr_text,
                                comp_id: a.comp_id
                            }
                            /*
                            if (a.item_attr_no != "") {
                                attrCacheData.item_attr_no = a.item_attr_no;
                                putData.push(attrCacheData);
                                page.itemAttrCacheAPI.putValue(attrCacheData, function () {
                                })
                            }
                            else {
                                postData.push(attrCacheData);
                                */
                            page.itemAttrCacheAPI.postValue(attrCacheData, function () {
                            })
                            // }
                        }
                    }

                    
                })
                page.events.grditemHierarchy_select(page.row, page.items);
                alert("Changed made successfully...!");                /*
                if ($$("ddlAttrCategory").selectedValue() == -1) {
                    alert("Please select category...!");
                }
                else if ($$("ddlAttribute").selectedValue() == -1) {
                    alert("Please select attribute...!");
                }
                else if ($$("txtAttrValue").value() == "") {
                    alert("Please enter attribute value ...!");
                }
                else if ($$("txtAttrAttributeText").value() == "") {
                    alert("Please enter attribute text to continue...!");
                }
                else {
                    var attrCacheData = {
                        type: page.type,
                        item_no: page.t_no,
                        attr_no: $$("ddlAttribute").selectedValue(),
                        attr_value: $$("txtAttrValue").value(),
                        attr_text: $$("txtAttrAttributeText").value()
                    }

                    page.itemAttrCacheAPI.postValue(attrCacheData, function () {
                        alert("New Attribute Linked Successfully...!");
                        page.events.grditemHierarchy_select(page.row, page.items);
                    })
                    
                }
                */
            }

        }
        page.loadCategory = function () {
            var filter = "";

            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: filter,
                sort_expression: " cat_no_par "
            }
            page.itemCategoryAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                var catArray = [];
                var cat1 = data.filter(function (i) {
                    return i.cat_no_par==null
                })
                $(cat1).each(function (j, item1) {
                    item1.cat_name = "."+ item1.cat_name;
                    //item1.cat_text = item1.cat_name;
                    item1.cat_level = 1;
                    catArray.push(item1);
                    var cat2 = data.filter(function (k) {
                        return k.cat_no_par == item1.cat_no;
                    })
                    $(cat2).each(function (l, item2) {
                        item2.cat_level = 2;
                        item2.cat_name = "-- " + item2.cat_name;
                        //item2.cat_text = item2.cat_name;
                        catArray.push(item2);
                        var cat3 = data.filter(function (m) {
                            return m.cat_no_par == item2.cat_no;
                        })
                        $(cat3).each(function (n, item3) {
                            item3.cat_level = 3;
                            item3.cat_name = "---- " + item3.cat_name;
                            //item3.cat_text = item3.cat_name;
                            catArray.push(item3);
                        });
                    })
                    
                })
                $$("ddlCategory").dataBind(catArray, "cat_no", "cat_name");
            })
        }
        page.loadCategoryForAttr = function () {
            var filter = "";

            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: filter,
                sort_expression: " cat_no,cat_name "
            }
            page.itemCategoryAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                $$("ddlAttrCategory").dataBind(data, "cat_no", "cat_name");
            })
        }
        page.loadAttribute = function () {
            var filter = " attr_no_key in(100,101,102)";
            if ($$("ddlCategory").selectedValue() != -1 && $$("ddlCategory").selectedValue() != null)
                filter = filter + " or attr_no_key in(" + $$("ddlCategory").selectedData(0).attr_nos + ")";

            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: filter,
                sort_expression: " attr_no_key,attr_name "
            }
            page.itemAttributeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression,"", function (data) {
                //$$("ddlLinkAttribute").dataBind(data, "attr_no_key", "attr_name");
                $$("ddlAttribute").dataBind(data, "attr_no_key", "attr_name");
            })
        }
        //page.loadAttrForCategoryLink = function () {
        //    var filter = " attr_no in(1,2,3)";

        //    var data = {
        //        start_record: 0,
        //        end_record: "",
        //        filter_expression: filter,
        //        sort_expression: " attr_no,attr_name "
        //    }
        //    page.itemAttributeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
        //        $$("ddlLinkAttribute").dataBind(data, "attr_no", "attr_name");
        //    })
        //}
        page.loadAttributeForAttr = function () {
            var filter = " attr_no_key not in(1,2,3,4,5,6,100,101,102)";
            if ($$("ddlCategory").selectedValue() != -1 && $$("ddlCategory").selectedValue() != null)
                filter = filter+ " and attr_no_key in(" + $$("ddlCategory").selectedData(0).attr_nos + ")";


            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: filter,
                sort_expression: " attr_no_key,attr_name "
            }
            page.itemAttributeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression,"", function (data) {
                $$("ddlAttribute").dataBind(data, "attr_no_key", "attr_name");
            })
        }

        page.loadLinkedCategory = function (type, mpt_no, ptype_no, item_no, callback) {
            var filter = "";
            if (type == "MPT")
                filter = " (type,item_no) in ( ('MPT'," + mpt_no + ") ) and attr_no in (100,101,102)";
            else if (type == "PT")
                filter = " (type,item_no) in ( ('MPT'," + mpt_no + ")  ,('PT'," + ptype_no + ")) and attr_no in (100,101,102)";
            else
                filter = " (type,item_no) in ( ('MPT'," + mpt_no + ") ,('PT'," + ptype_no + "),('Item'," + item_no + ")) and attr_no in (100,101,102)";

            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: filter,
                sort_expression: " attr_value "
            }
            page.itemAttrCacheAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                if (callback == undefined)
                    callback(data);
            })
        }
        page.loadAttrCache = function (type,mpt_no,ptype_no,item_no,callback) {
            var filter = "";
            if(type=="MPT")
                filter = " (type,item_no) in ( ('MPT'," + mpt_no + ") ) and attr_no in (100,101,102)";
            else if (type == "PT")
                filter = " (type,item_no) in ( ('MPT'," + mpt_no + ")  ,('PT'," + ptype_no + ")) and attr_no in (100,101,102)";
            else
                filter = " (type,item_no) in ( ('MPT'," + mpt_no + ") ,('PT'," + ptype_no + "),('Item'," + item_no + ")) and attr_no in (100,101,102)";

            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: filter,
                sort_expression: " attr_value "
            }
            page.itemAttrCacheAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                page.loadGridItemCategory(data);
                if(callback!=undefined)
                    callback(data);
            })
        }
        page.loadLinkedAttr = function (type, mpt_no, ptype_no, item_no,attrData) {
            var filter = "";
            var gridAttrData;
            if (type == "MPT")
                filter = " (type,item_no) in ( ('MPT'," + mpt_no + ") ) and attr_no not in(1,2,3,4,5,6,100,101,102)";
            else if (type == "PT")
                filter = " (type,item_no) in ( ('MPT'," + mpt_no + ")  ,('PT'," + ptype_no + ")) and attr_no not in (1,2,3,4,5,6,100,101,102)";
            else
                filter = " (type,item_no) in ( ('MPT'," + mpt_no + ") ,('PT'," + ptype_no + "),('Item'," + item_no + ")) and attr_no not in (1,2,3,4,5,6,100,101,102)";

            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: filter,
                sort_expression: " "
            }
            page.itemAttrCacheAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                var prioData = [];
               
                $(data).each(function (j, itemData) {
                    var pData = prioData.filter(function (fData) {
                        return fData.attr_no == itemData.attr_no;
                    })
                    if (pData.length <= 0) {
                        var attr1Data = data.filter(function (iData) {
                            return iData.attr_no == itemData.attr_no;
                        })
                        if (page.items.type == "ITEM") {
                            var aItemData = attr1Data.filter(function (aIData) {
                                return aIData.type == "ITEM";
                            })
                            if (aItemData.length > 0) {
                                prioData.push(aItemData[0]);
                            }
                            else {
                                var aPTData = attr1Data.filter(function (aPData) {
                                    return aPData.type == "PT";
                                })
                                if (aPTData.length > 0) {
                                    prioData.push(aPTData[0]);
                                }
                                else {
                                    var aMPTData = attr1Data.filter(function (aMPTData) {
                                        return aMPTData.type == "MPT";
                                    })
                                    if (aMPTData.length > 0) {
                                        prioData.push(aMPTData[0]);
                                    }
                                }
                            }
                        }
                        else if (page.items.type == "PT") {
                            var aPTData = attr1Data.filter(function (aPData) {
                                return aPData.type == "PT";
                            })
                            if (aPTData.length > 0) {
                                prioData.push(aPTData[0]);
                            }
                            else {
                                var aMPTData = attr1Data.filter(function (aMPTData) {
                                    return aMPTData.type == "MPT";
                                })
                                if (aMPTData.length > 0) {
                                    prioData.push(aMPTData[0]);
                                }
                            }
                        }
                        else {
                            var aMPTData = attr1Data.filter(function (aMPTData) {
                                return aMPTData.type == "MPT";
                            })
                            if (aMPTData.length > 0) {
                                prioData.push(aMPTData[0]);
                            }
                        }
                    }

                })
                
                var data = prioData;
               
                if (attrData != undefined)
                    $(attrData).each(function (i, item) {
                   
                        var exsData = data.filter(function (fil) {
                            return item.attr_no == fil.attr_no// && item.type == fil.type
                            
                        })
                        
                        if (exsData.length <= 0)
               
                            data.push(item);
                    });
                    
                    page.loadGridItemAttr(data);
                /*
                gridAttrData = data;
                var filter = "";
                var cat;
                if (type == "MPT")
                    filter = " (type,item_no) in ( ('MPT'," + mpt_no + ") ) and attr_no in (1,2,3)";
                else if (type == "PT")
                    filter = " (type,item_no) in ( ('MPT'," + mpt_no + ") ) ,('PT'," + ptype_no + ")) and attr_no in (1,2,3)";
                else
                    filter = " (type,item_no) in ( ('MPT'," + mpt_no + ") ,('PT'," + ptype_no + "),('Item'," + item_no + ")) and attr_no in (1,2,3)";

                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: filter,
                    sort_expression: " "
                }
                page.itemAttrCacheAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    $(data).each(function (i, item) {
                        if(i==0)
                            cat = item.attr_value
                        else
                            cat = cat+"," + item.attr_value
                    })
                    var filter = " attr_no in(" + cat + ")";

                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: filter,
                        sort_expression: " attr_no,attr_name "
                    }
                    page.itemAttributeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        gridAttrData.push(data)
                        $(data).each(function (i, item) {
                            gridAttrData.push({
                                item_attr_no: "",
                                item_no:page.t_no,
                                attr_no: item.attr_no,
                                attr_value: item.attr_value,
                                state_no: item.state_no,
                                attr_text: item.attr_text,
                                type: item.type,
                                attr_name: item.attr_name,
                                inheritedfrom: item.inheritedfrom,
                                cat_name: item.cat_name,
                                cat_no_par: item.cat_no_par
                            })
                        })
                        page.loadGridItemAttr(gridAttrData);
                    });
                })
                */
            })
        }
        page.loadItemHierarchy = function () {
            var filter = "";

            filter = " concat(ifnull(type,''),ifnull(name,'')) like '%" + $$("txtSearch").value() + "%'";

            if ($$("ddlType").selectedValue() != "All") {
                filter = filter + " and type='" + $$("ddlType").selectedValue()+"'";
            }
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: filter,
                sort_expression: " type,t_no "
            }
            page.itemHieAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                page.loadGridItemHierarchy(data);
            })
        }
        page.loadGridItemCategory = function (grddata,callback) {

            page.controls.grditemCategory.width("100%");
            page.controls.grditemCategory.height("200px");
            page.controls.grditemCategory.setTemplate({
                selection: "Single",
                paging: true,
                pageSize: 50,
                columns: [
                    { 'name': "C No", 'width': "80px", 'dataField': "attr_value" },
                    { 'name': "Category", 'width': "150px", 'dataField': "cat_name" },
                    { 'name': "Attr Text", 'width': "150px", 'dataField': "attr_text" },
                    { 'name': "Inherited From", 'width': "150px", 'dataField': "inheritedfrom" },
                    { 'name': "", 'width': "0px", 'dataField': "item_attr_no" },
                    { 'name': "", 'width': "60px", 'dataField': "remove", itemTemplate: "<input type='button' class='grid-button' value='' action='Remove' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" },
                ]
            });
            page.controls.grditemCategory.rowBound = function (row, item) {
                row.css("cursor", "pointer");
                row.click(function () {
                    row.parent().children("div").css("background-color", "");

                });
            }
            page.controls.grditemCategory.rowCommand = function (action, actionElement, rowId, row, rowData) {
                if (action == "Remove") {
                    if(confirm("Are you sure want to remove is category?")){
                        var attrCacheData = {
                           item_attr_no: rowData.item_attr_no
                        }
                        page.itemAttrCacheAPI.deleteValue(attrCacheData, function () {
                            $$("msgPanel").flash("Attribute Deleted Sucessfully...!");
                            page.events.grditemHierarchy_select(page.row, page.items);
                        })
                    }

                }
            }
            page.controls.grditemCategory.dataBind(grddata);
            
            if (callback != undefined)
                callback();
        }
        page.loadGridItemAttr = function (data,callback) {
            page.controls.grditemAttributes.width("100%");
            page.controls.grditemAttributes.height("200px");
            page.controls.grditemAttributes.setTemplate({
                selection: "Single",
                paging: true,
                pageSize: 50,
                columns: [
                    { 'name': "Attr No", 'width': "80px", 'dataField': "attr_no" },
                    { 'name': "Attr", 'width': "100px", 'dataField': "attr_name" },
                    { 'name': "Attr Value", 'width': "120px", 'dataField': "attr_value" ,editable:true},
                    { 'name': "Attr Text", 'width': "120px", 'dataField': "attr_text", editable: true },
                    { 'name': "Inherited From", 'width': "120px", 'dataField': "inheritedfrom" },
                    //{ 'name': "Cat Name", 'width': "120px", 'dataField': "cat_name" },
                    { 'name': "", 'width': "0px", 'dataField': "item_no" },
                    { 'name': "", 'width': "0px", 'dataField': "type" },
                    { 'name': "", 'width': "0px", 'dataField': "item_attr_no" },
                   // { 'name': "", 'width': "60px", 'dataField': "remove", itemTemplate: "<input type='button' class='grid-button' value='' action='Remove' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" },
                ]
            });
            page.controls.grditemAttributes.rowBound = function (row, item) {
                row.css("cursor", "pointer");
                row.click(function () {
                    row.parent().children("div").css("background-color", "");

                });
            }
            page.controls.grditemAttributes.rowCommand = function (action, actionElement, rowId, row, rowData) {
                if (action == "Remove") {
                    if (confirm("Are you sure want to remove is category?")) {
                        var attrCacheData = {
                            item_attr_no: rowData.item_attr_no
                        }
                        page.itemAttrCacheAPI.deleteValue(attrCacheData, function () {
                            $$("msgPanel").flash("Category Deleted Sucessfully...!");
                            page.events.grditemHierarchy_select(page.row, page.items);
                        })
                    }

                }
            }
            page.controls.grditemAttributes.dataBind(data);
            page.attrLinkedData = data;

            page.controls.grditemAttributes.edit(true);
            if (callback != undefined)
                callback();
        }
        page.loadGridItemHierarchy = function (data) {

            page.controls.grditemHierarchy.width("100%");
            page.controls.grditemHierarchy.height("530px");
            page.controls.grditemHierarchy.setTemplate({
                selection: "Single",
                paging: true,
                pageSize: 50,
                columns: [
                    { 'name': "No",  'width': "100px", 'dataField': "t_no" },
                    //{ 'name': "Type", 'width': "80px", 'dataField': "type" },
                    { 'name': "Name",  'width': "300px", 'dataField': "name" },
                    //{ 'name': "MPT No", 'width': "60px", 'dataField': "mpt_no" },
                    //{ 'name': "Item No",  'width': "60px", 'dataField': "item_no" },
                    //{ 'name': "PT No", 'width': "60px", 'dataField': "ptype_no" },
                    
                ]
            });
            page.controls.grditemHierarchy.rowBound = function (row, item) {
                row.css("cursor", "pointer");
                row.click(function () {
                    row.parent().children("div").css("background-color", "");

                });
            }
            page.controls.grditemHierarchy.selectionChanged = page.events.grditemHierarchy_select;
            page.controls.grditemHierarchy.dataBind(data);
        }
    });
}
