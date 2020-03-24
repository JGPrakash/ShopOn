$.fn.itemAdd = function () {
    var context = $.pageController.getControlContext(this);
    var page = context.getControl();

    if (typeof page.controlName === "undefined") { //Do the intitialisation only one time.
        page.controlName = "itemAdd";
        page.view = {
         

        }

        page.events = {
            btnAddItem_click: function () {
                try {
                    var itemNo = page.itemService.insertItemName({ itemNo: $("#lblItemNo").html(), itemCode: $("#itemCode").val(), itemName: $("#itemName").val() })[0].key_value;
                    // page.itemService.insertItem({itemName: $("#itemName").val()});
                    page.controls.lblItemNo.html(parseInt(itemNo));

                    //alert("Item: " + itemNo + " added successfully!");
                    $$("msgPanel").flash("Item: " + itemNo + " added successfully!");
                } catch (e) {

                    //alert("There was an error in adding item details!");
                    $$("msgPanel").show("There was an error in adding item details!");
                }
            },
            page_init: function () {

            },
            page_load: function () {
            }
       
            };
        

        page.validation = {
          
        };

        page.interface = {
            load:function(){
                var data=page.itemService.getItemMaxNo();

                page.controls.lblItemNo.html( parseInt(data[0].maxItem)+1);

            }
        };

        page.itemService = new ItemService();
          page.selectedObject.loadHTML("view/pages/item-list/item-add/item-add.html");
        $.pageController.initControlAndEvents(page);
    }

    return page.interface;

}
