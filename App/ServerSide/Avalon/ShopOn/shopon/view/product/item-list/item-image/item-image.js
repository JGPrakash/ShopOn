$.fn.itemImage = function () {
    document.activeElement.msGetInputContext;
   
    return $.pageController.getControl(this, function (page, $$) {
        page.template("/" + appConfig.root + "/shopon/view/product/item-list/item-image/item-image.html?");
        page.itemAPI = new ItemAPI();
        page.itemImageAPI = new ItemImageAPI();
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
                
            },
            btnUploadImage_click: function () {
                var data = new FormData();

                var files = $("#fileUpload").get(0).files;

                // Add the uploaded image content to the form data collection
                if (files.length > 0) {
                    data.append("file", files[0]);

                    // Make Ajax request with the contentType = false, and procesDate = false
                    var ajaxRequest = $.ajax({
                        type: "POST",
                        //url: "http://104.251.218.116:8080/FileUploaderRESTService/rest/image/upload",
                        url: CONTEXT.ENABLE_IMAGE_UPLOAD_URL,
                        headers: {
                            //'file-path': '/usr/shopon/upload/images/' + $$("lblItemNo").value() + '/'
                            'file-path': CONTEXT.ENABLE_IMAGE_FILE_PATH + page.item_no + '/'
                        },
                        contentType: false,
                        processData: false,
                        data: data
                    });

                    ajaxRequest.done(function (xhr, textStatus) {
                        var data = {
                            item_no: page.item_no,
                            item_image_name: files[0].name
                        }
                        page.itemImageAPI.postValue(data, function (data) {
                            $$("msgPanel").show("Picture uploaded successfully...!");
                            page.interface.load(page.item_no);
                        })
                        
                    });
                }
                else {
                    //alert('Please select only the images before uploading it');
                    $$("msgPanel").show("Please select only the images before uploading it");
                }
            }
        };

        page.interface.load = function (itemNo) {
            page.item_no = itemNo;
            page.itemImageAPI.searchValues("", "", "item_no = " + page.item_no, "", function (data) {
                page.view.selectedImage(data);
            })
        };
        page.view = {
            selectedImage: function (data) {
                page.controls.grdItemImage.width("100%");//1500px;
                page.controls.grdItemImage.height("500px");
                page.controls.grdItemImage.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "",'width': "0px", 'dataField': "item_image_no",visible:false },
                        { 'name': "Image", 'width': "300px", 'dataField': "item_image_name", itemTemplate: "<div  id='prdItemName' style='height:auto;'></div>" },
                        {
                            'name': "Action",
                            'width': "50px",
                            'dataField': "attr_no",
                            itemTemplate: "<input action='delete' style='padding:0px;font-size: 10px;' type='button' class='buttonSecondary' title ='Remove' value='Remove' /> "
                        }
                    ]
                });
                page.controls.grdItemImage.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "delete") {
                        if (confirm("Are You Sure Want To Remove This Image...")) {
                            page.itemImageAPI.deleteValue(rowData.item_image_no, { item_image_no: rowData.item_image_no }, function (data) {
                                $$("msgPanel").flash("Image Removed Successfully...");
                                page.controls.grdItemImage.deleteRow(rowId);
                                page.interface.load(page.item_no);
                            });
                        }
                    }
                }
                page.controls.grdItemImage.rowBound = function (row, item) {
                    var htmlTemplate = [];
                    htmlTemplate.push('<img src=' + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + page.item_no + '/' + item.item_image_name + ' width="100%;" />')
                    $(row).find("[id=prdItemName]").html(htmlTemplate.join(""));
                };
                page.controls.grdItemImage.dataBind(data);
            },
        }
    });



}