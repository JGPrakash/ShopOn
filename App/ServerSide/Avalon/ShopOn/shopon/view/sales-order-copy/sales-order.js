$.fn.salesOrder = function () {
    return $.pageController.getPage(this, function (page, $$) {

        //Import Services required     
        page.itemService = new ItemService();
        page.customerService = new CustomerService();
        page.billService = new BillService();

        page.accService = new AccountingService();
        page.trayService = new TrayService();
        page.dynaReportService = new DynaReportService();
        page.purchaseService = new PurchaseService();
        page.inventoryService = new InventoryService();
        page.salesService = new SalesService();
        page.rewardService = new RewardService();
        page.finfactsService = new FinfactsService();
        page.finfactsEntry = new FinfactsEntry();
        page.stockAPI = new StockAPI();
        page.taxclassService = new TaxClassService();
        page.maximumIdAPI = new MaximumIdAPI();
        page.salesExecutiveRewardService = new SalesExecutiveRewardService();
        //variable for bill payment
        page.sales_tax = [];   //list of all taxclass for selected tax
        page.sales_tax_no = -1;
        page.discount = [];
        page.manualDiscountValue = 0;


        page.currentBillNo = null;
        page.discount_item_no = null;   //Current discount item
        page.selectedSO = null;
        page.selectedSOItems = {};
        page.selectedBill = {};


        page.fullfillMode = false;
        page.deliveryMode = false;
        page.trayMode = false;

        //page.tax = [];


        function confirmManualDisc() {
            var defer = $.Deferred();

            $("#dialog-form").dialog({
                autoOpen: true,
                modal: true,
                buttons: {
                    "Ok": function () {
                        var text1 = $("#manualDiscount");
                        //Do your code here
                        page.manualDiscountValue = text1.val();
                        defer.resolve("Ok");
                        $(this).dialog("close");
                    },
                    "Cancel": function () {
                        defer.resolve("Cancel");

                        $(this).dialog("close");
                    }
                }
            });

            //$("#dialog-form").dialog("open");

            return defer.promise();
        }

        page.events.btnBack_click = function () {
            $$("pnlDetail").hide();
            $$("pnlSearch").show();
        }



        //Create a new Sales Order
        page.events.btnAddSOOK_click = function () {
            $$("btnAddSOOK").disable(true);
            $$("btnAddSOOK").hide();
            try {
                //close the new popup and show success message
                $$("pnlNewSOPopup").close();
                $$("msgPanel").show("Fetching customer details...");

                //Get the customer company,phone_no,email & address from customer service
                page.customerService.getCustomerById($$("ddlCustomerName").selectedValue(), function (data) {
                    var id = {
                        table_name: "sal_order_t",
                        column_name: "order_no"
                    }
                    page.maximumIdAPI.getValue(id, function (id) {
                    
                    //Build the data for new Sales order to be created.Get sales tax from settings
                    var newSO = {
                        cust_no: $$("ddlCustomerName").selectedValue(),
                        expected_date: $$("dsExpectedDate").getDate(),
                        contact_no: data[0].phone_no,
                        shipping_address: data[0].address1 + "-" + data[0].address2 + "-" + data[0].city + "-" + data[0].zip_code,
                        delivery_address: data[0].address1 + "-" + data[0].address2 + "-" + data[0].city + "-" + data[0].zip_code,
                        email: data[0].email,
                        company: data[0].company,
                        sales_tax_no: CONTEXT.DEFAULT_SALES_TAX,
                        order_no: id[0].key_value
                    };

                    $$("msgPanel").show("Creating sales order...");
                    //Create a new sales order using sales service.
                    page.salesService.insertSalesOrder(newSO, function (data) {
                        var newOrderId = data[0].key_value

                        $$("msgPanel").show("New sales order is created with id " + newOrderId);
                        //Get the new Sales order data created to show in search result grid
                        page.salesService.getSOByNo(newOrderId, function (data) {
                            //Load the search result and load the new sales order in view
                            page.view.searchResult(data);
                            page.controls.grdSOResult.getAllRows()[0].click();

                            $$("msgPanel").hide();
                        });
                    });
                    });
                });

            } catch (e) {
                $$("msgPanel").show("Error occured.Please contact wototech support team.Details : " + e);
            }

        }

        //Revert from Ordered to Created
        page.events.btnRecreateSO_click = function () {
            try {
                $$("msgPanel").show("Changing the state...");
                page.billService.deleteBill(page.controls.lblSOIBillNo.html(), function (data) {
                    page.salesService.reCreateSO(page.selectedSO.order_id, function (data) {
                        $$("msgPanel").show("State is changed to created successfully...");
                        page.loadSalesOrder(page.selectedSO.order_id);
                    });
                });
            } catch (e) {
                $$("msgPanel").show("Error occured.Please contact wototech support team.Details : " + e);
            }

        }

        //Save sales order
        page.saveSalesOrder = function (callback) {

            //Validation : Qty is mandatory,Qty should positive number,qty should be <= stock
            $(page.controls.grdSOItems.allData()).each(function (i, item) {

                if (item.quantity == "" || item.quantity == null || typeof item.quantity == "undefined")
                    throw "Item quantity is mantatory for item: " + item.item_name + "";

                if (isNaN(item.quantity) || parseFloat(item.quantity) < 0)
                    throw "Quantity should be a number and non negative for item: " + item.item_name + ""

                if (item.free_qty == "" || item.free_qty == null || typeof item.free_qty == "undefined")
                    item.free_qty = 0;

                if (isNaN(item.free_qty) || parseFloat(item.free_qty) < 0)
                    throw "Quantity should be a number and non negative for item: " + item.item_name + ""


                if (parseFloat(item.quantity) + parseFloat(item.free_qty) > parseFloat(item.qty_stock)) {
                    if (CONTEXT.POS_SHOW_STOCK_EMPTY_ALERT == true) {
                        if (!confirm("Item Quanity cannot not be higher than stock level for " + item.item_name + ""))
                            throw "Please remove the item " + item.item_name + " to continue sales.";
                    }
                    else {
                        throw "Item quanity cannot not be higher than stock level for " + item.item_name + "";
                    }
                }

            });

            //Show progress

            var newSO = {
                //Order detail
                order_id: page.selectedSO.order_id,
                state_text: page.selectedSO.state_text,

                //Shipping details
                contact_no: page.controls.txtContactNo.value(),
                shipping_address: page.controls.txtShippingAddress.value(),
                delivery_address: page.controls.txtDeliveryAddress.value(),
                email: page.controls.txtEmail.value(),
                gst_no: page.controls.txtGst.value(),
                company: $$("txtSOCompany").value(),


            };


            if (page.selectedSO.state_text == "Created") {

                //Cust no
                newSO.cust_no = page.controls.ddlSOCustomer.selectedValue();

                //Order date details
                newSO.expected_date = page.controls.dsSOExpectedDate.getDate();
                newSO.ordered_date = page.controls.lblSOOrderedDate.getDate();

                //Tax Settings
                newSO.sales_tax_no = page.sales_tax_no;

                $$("msgPanel").show("Updating sales order...");
                page.salesService.updateSalesOrder(newSO, function () {

                    //Only in created state i can update item data
                    $$("msgPanel").show("Updating sales order items...");
                    var result = compareContents(page.selectedSOItems, page.controls.grdSOItems.allData(), "order_id,item_no", "order_id,item_no,quantity,price,tax_per,discount,total_price,tax_class_no,sales_tax_class_no,tray_id,unit,mrp,expiry_date,batch_no,free_qty,cost,variation_name,hsn_code,cgst,sgst,igst,man_date,unit_identity,var_no")
                    page.salesService.deleteSalesOrderItems(0, result.deletedDate, function () {
                        page.salesService.updateSalesOrderItems(0, result.updatedData, function () {
                            page.salesService.insertSalesOrderItems(0, result.addedData, function () {

                                page.billService.removeAllSODiscount(page.selectedSO.order_id, function () {
                                    page.billService.reinsertSODisount(page.selectedSO.order_id, 0, page.discount, function () {
                                        $$("msgPanel").show("Sales order is successfully updated!");

                                        callback();

                                    });
                                    $$("msgPanel").hide();
                                });

                            });
                        });

                    });
                });
            }
            else if (page.selectedSO.state_text == "Ordered") {
                $$("msgPanel").show("Updating sales order...");
                newSO.ordered_date = page.controls.lblSOOrderedDate.getDate();
                page.salesService.updateSalesOrder(newSO, function () {
                    callback();
                });
            }

        }

        page.events.btnSaveSO_click = function () {
            try {
                page.saveSalesOrder(function () {
                    page.loadSalesOrder(page.selectedSO.order_id, function () {
                        $$("msgPanel").hide();
                    });
                });
            }
            catch (e) {
                $$("msgPanel").show(e);

            }

        }

        //Change state to ordered.
        page.events.btnOrderSO_click = function () {
            try {

                if (page.controls.grdSOItems.allData().length == 0)
                    throw "No items is added to sales order.";

                //Show progress bar
                //$$("msgPanel").progress("show");
                $$("msgPanel").show("Updating sales order details...");
                //Save the order
                page.saveSalesOrder(function () {
                    $$("msgPanel").show("Changing sales order to ordered...");
                    //Change status to order
                    page.salesService.orderSalesOrder(page.selectedSO.order_id, page.controls.lblSOOrderedDate.getDate(), function (data2, callback) {

                        //Prepare bill data
                        var newBill = {
                            so_no: page.selectedSO.order_id,
                            bill_no: (page.controls.lblSOIBillNo.html() == undefined || page.controls.lblSOIBillNo.html() == "" || page.controls.lblSOIBillNo.html() == null) ? "0" : page.controls.lblSOIBillNo.html(),//page.controls.lblSOIBillNo.html(),
                            bill_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            store_no: getCookie("user_store_id"),
                            reg_no: localStorage.getItem("user_register_id"),
                            user_no: localStorage.getItem("app_user_id"),

                            sub_total: page.controls.lblSubTotal.value(),
                            total: page.controls.lblTotal.value(),
                            discount: page.controls.lblDiscount.value(),
                            tax: page.controls.lblTax.value(),

                            bill_type: "SaleSaved",
                            state_no: 200, //TODO : 200 is sales
                            round_off: page.controls.lblRndOff.value(),
                            sales_tax_no: page.sales_tax_no,
                            //store_no: CONTEXT.store_no,
                            //reg_no: CONTEXT.reg_no,
                            cust_no: page.selectedSO.cust_no,
                            cust_name: $$("ddlSOCustomer").selectedData().cust_name,
                            mobile_no: $$("txtContactNo").value(),
                            email_id: $$("txtEmail").value(),
                            cust_address: $$("txtDeliveryAddress").value().replace(/,/g, '-'),
                            gst_no: $$("txtGst").value(),
                            bill_no_par: "",
                            sales_executive: $$("ddlDeliveryBy").selectedValue(),
                        };

                        $$("msgPanel").show("Generating a new bill...");
                            var rbillItems = [];
                            $(page.controls.grdSOItems.allData()).each(function (i, billItem) {
                                rbillItems.push({
                                    var_no: billItem.var_no,
                                    item_no: billItem.item_no,
                                    qty: billItem.quantity,
                                    free_qty: billItem.free_qty,
                                    unit_identity: billItem.unit_identity,
                                    price: billItem.price,
                                    discount: billItem.discount,
                                    taxable_value: (parseFloat(billItem.total_price) * parseFloat(billItem.tax_per)) / 100,
                                    tax_per: billItem.tax_per,
                                    total_price: billItem.total_price,
                                    hsn_code: billItem.hsn_code,
                                    cgst: billItem.cgst,
                                    sgst: billItem.sgst,
                                    igst: billItem.igst,
                                    price_no: billItem.price_no,
                                    tax_class_no: billItem.tax_class_no,
                                    sub_total: parseFloat(billItem.item_sub_total),
                                });
                            });
                            newBill.bill_items = rbillItems;
                            newBill.discounts = page.discount;
                            var expense = [];
                            if ($$("txtExpenseName").value() != "" && $$("txtExpenseName").value() != null && $$("txtExpenseName").value() != undefined) {
                                expense.push({
                                    exp_name: $$("txtExpenseName").value(),
                                    amount: $$("txtExpense").value()
                                });
                            }
                            newBill.expenses = expense;
                            page.stockAPI.insertBill(newBill, function (data) {
                                page.currentBillNo = data;
                                //Update bill no in sales order
                                page.salesService.updateBillNo({ order_id: page.selectedSO.order_id, bill_no: page.currentBillNo }, function () {
                                    $$("msgPanel").show("Reloading data...");
                                    page.loadSalesOrder(page.selectedSO.order_id, function () {
                                        $$("msgPanel").flash("Sales order is successfully fulfilled. A new bill is generated with bill no " + page.currentBillNo);
                                    });
                                    if (CONTEXT.ENABLE_SALES_EXECUTIVE_REWARD == true) {
                                        var newItem = {};
                                        var sales_executive_no = page.controls.ddlDeliveryBy.selectedValue();
                                        if (sales_executive_no != "-1")
                                            page.salesExecutiveRewardService.getSalesExecutiveById(sales_executive_no, function (data) {
                                                page.salesExecutiveRewardService.getRewardById(data[0].reward_plan_id, function (data2) {
                                                    if (data2.length != 0) {
                                                        page.billService.getBill(page.currentBillNo, function (data1) {
                                                            newItem.sales_executive_no = sales_executive_no;
                                                            newItem.reward_plan_id = data[0].reward_plan_id;
                                                            newItem.bill_no = data1[0].bill_no;
                                                            newItem.trans_date = data1[0].bill_date;
                                                            newItem.points = data1[0].total / data2[0].reward_plan_point;
                                                            newItem.trans_type = "Credit";
                                                            newItem.description = "Credit";
                                                            newItem.setteled_amount = parseFloat(data1[0].total * data2[0].reward_plan_point) / 4;
                                                            page.salesExecutiveRewardService.insertSalesExecutiveRewardt(newItem, function (data) {
                                                                //page.msgPanel.show("Points added successfully.");
                                                            });
                                                        });
                                                    } else {
                                                        //page.msgPanel.show("Sales Executive cannot have reward plans.");
                                                    }
                                                });
                                            });
                                    }
                                });
                                $$("msgPanel").hide();
                            });
                    });
                });
            } catch (e) {
                $$("msgPanel").show(e);

            }
        }

        //Change state to confirmed => generate a bill => Insert stock entry  => Insert Tray transaction
        page.events.btnConfirmedSO_click = function () {
            try {
                //Show progress bar
                $$("msgPanel").show("Updating sales order details...");
                //Save the order
                page.saveSalesOrder(function () {

                    $$("msgPanel").show("Changing sales order to fulfilled...");

                    //Change status to confirmed and generate a bill
                    page.salesService.confirmedSalesOrder(page.selectedSO.order_id, page.controls.lblSOConfirmedDate.getDate(), function () {
                        var buying_cost = 0;

                        $(page.controls.grdSOItems.allData()).each(function (i, item) {
                            buying_cost = buying_cost + (parseFloat(item.cost) * (parseFloat(item.quantity)+ parseFloat(item.free_qty)));
                        })
                        var newBill = {

                            bill_no: page.controls.lblSOIBillNo.html(),
                            bill_type: "Sale",
                            state_no: 200, //200 is sales

                        };

                        page.billService.changeBillType(newBill, function (data) {
                            $$("msgPanel").show("Reloading data...");
                            page.loadSalesOrder(page.selectedSO.order_id, function () {

                                $$("msgPanel").flash("Sales order is successfully fulfilled. A new bill is generated with bill no " + page.currentBillNo);

                            });
                            $$("msgPanel").hide();
                        });

                        if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                            var s_with_tax = (parseFloat(page.controls.lblSubTotal.value()) - parseFloat(page.controls.lblDiscount.value())) - parseFloat(page.controls.lblRndOff.value());
                            var data1 = {
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                description: "Sales Order-" + page.currentBillNo,

                                sales_with_out_tax: parseFloat(s_with_tax).toFixed(5),
                                tax_amt: parseFloat(page.controls.lblTax.value()).toFixed(5),
                                buying_cost: buying_cost,
                                round_off: $$("lblRndOff").value(),
                               
                                key_1: page.currentBillNo,
                                key_2: $$("ddlSOCustomer").selectedValue(),
                                                 
                               
                            };
                            $$("msgPanel").show("Updating Finfacts...");
                            page.finfactsEntry.creditSales(data1, function (response) {
                                if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                                    var expenseData1 = {
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT_DEPTOR,
                                        expense_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_CATEGORY,
                                        amount: $$("txtExpense").value() == "" ? 0 : $$("txtExpense").value(),
                                        description: "POS Expense-" + page.currentBillNo,
                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                        key_1: page.currentBillNo,
                                        key_2: $$("ddlSOCustomer").selectedValue(),
                                    };
                                    page.accService.insertExpense(expenseData1, function (response) { });
                                }
                                //page.finfactsEntry.creditSaleStock(data1, function (res) {
                                //    $$("msgPanel").show("POS payment is recorded successfully.");
                                //});
                            //page.finfactsService.insertCreditSales(data1, function (response) {
                                //callback(page.currentBillNo);
                                

                            });
                        }
                        //Add Points for the customer
                        if (CONTEXT.ENABLE_REWARD_MODULE == true) {
                            var newItem = {};
                            page.customerService.getCustomerById(page.controls.ddlSOCustomer.selectedValue(), function (data) {
                                page.rewardService.getRewardById(data[0].reward_plan_id, function (data2) {
                                    if (data2.length != 0) {
                                        // page.billService.getBill(page.currentReturnBillNo, function (data1) {
                                        newItem.cust_no = data[0].cust_no;
                                        newItem.reward_plan_id = data[0].reward_plan_id;
                                        //page.customerList = data;
                                        newItem.bill_no = $$("lblSOIBillNo").html();
                                        newItem.trans_date = $.datepicker.formatDate("dd-mm-yy", new Date());
                                        newItem.points = parseFloat(page.controls.lblTotal.value()) / data2[0].reward_plan_point;
                                        newItem.trans_type = "Credit";
                                        newItem.setteled_amount = parseFloat(parseFloat(page.controls.lblTotal.value()) * data2[0].reward_plan_point) / 4;
                                        page.customerService.insertCustomerRewardt(newItem, function (data) {
                                            $$("msgPanel").flash("Points added successfully.");
                                        });
                                        //  });
                                    } else {
                                        $$("msgPanel").flash("Customer cannot have reward plans.");
                                    }

                                });
                            });
                        }

                    });

                });
            } catch (e) {
                $$("msgPanel").show(e);
            }


        }

        page.events.btnAddToFullfillAction_click = function () {
            $$("pnlAddToFullfillActions").show();
            $$("pnlAddToDeliveryActions").hide();
            $$("pnlReturnDeliveryActions").hide();
            $$("pnlAddToTrayActions").hide();
            $$("pnlItemActions").hide();
            $$("pnlReturnTrayActions").hide();

            page.fullfillMode = true;
            page.view.selectedSOItems(page.currentSOItems);
            page.fullfillMode = false;
        }
        page.events.btnAddToTrayAction_click = function () {
            $$("pnlAddToTrayActions").show();
            $$("pnlAddToFullfillActions").hide();
            $$("pnlAddToDeliveryActions").hide();
            $$("pnlReturnDeliveryActions").hide();
            $$("pnlItemActions").hide();
            $$("pnlReturnTrayActions").hide();

            page.trayMode = true;
            page.view.selectedSOItems(page.currentSOItems);
            page.trayMode = false;
        }
        page.events.btnReturnTray_click = function () {
            $$("pnlReturnTrayActions").show();
            $$("pnlAddToTrayActions").hide();
            $$("pnlAddToFullfillActions").hide();
            $$("pnlAddToDeliveryActions").hide();
            $$("pnlReturnDeliveryActions").hide();
            $$("pnlItemActions").hide();


            page.trayMode = true;
            page.view.selectedSOItems(page.currentSOItems);
            page.trayMode = false;
        }
        page.events.btnAddToFullfillCancel_click = function () {
            $$("pnlAddToDeliveryActions").hide();
            $$("pnlReturnTrayActions").hide();
            $$("pnlAddToFullfillActions").hide();
            $$("pnlReturnDeliveryActions").hide();
            $$("pnlAddToTrayActions").hide();
            $$("pnlItemActions").show();
            //page.fullfillMode = false;
            page.view.selectedSOItems(page.currentSOItems);
        }
        //
        //page.events.btnAddToFreeFullfillConfirm_click = function () {
        //    page.events.btnAddToFullfillConfirm_click("true")
        //}
        page.events.btnAddToFullfillConfirm_click = function (free) {
            if (typeof free == "undefined")
                free = "false";
            // var items = [];
            var flag = false;
            var tot_fin_amount = 0;
            var inventItems = [];
            try {
                $(page.controls.grdSOItems.allData()).each(function (index, item) {
                    if (typeof item.fullfilled == "undefined" || item.fullfilled == null || item.fullfilled == "")
                        item.fullfilled = 0;

                    if (typeof item.tofullfilled == "undefined" || item.tofullfilled == null || item.tofullfilled == "")
                        item.tofullfilled = 0;

                    if (parseFloat(item.tofullfilled) < 0) {
                        throw "To fullfill cannot be negative for item: " + item.item_name + "";
                    }


                    if ((parseFloat(item.temp_qty) + parseFloat(item.free_qty)) < (parseFloat(item.tofullfilled) + parseFloat(item.fullfilled))) {
                        throw "Item to fulfill cannot be greater than the order quanity for item: " + item.item_name + "";
                    }


                    if (item.tofullfilled > 0) {
                        flag = true;
                        //items.push({
                        //    order_item_id: item.order_item_id,
                        //    item_no: item.item_no,
                        //    order_id: page.selectedSO.order_id,
                        //    fullfilled: parseFloat(item.fullfilled) + parseFloat(item.tofullfilled),
                        //});
                        if (item.unit_identity == "1") {
                            item.tofullfilled = parseFloat(item.tofullfilled) * parseFloat(item.alter_unit_fact);
                        }

                        inventItems.push({
                            //item_no: item.item_no,
                            var_no: item.var_no,
                            //cost: item.cost,  //why needed
                            qty: item.tofullfilled,
                            //vendor_no: page.selectedSO.cust_no,
                            comments: "",
                            //invent_type: "Sale",
                            trans_type: "Sale",
                            trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            key1: page.controls.lblSOIBillNo.html(),
                            key2: item.item_no,
                            //FINFACTS ENTRY DATA
                            invent_type: "SaleCredit",
                            finfacts_comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            amount: (parseFloat(item.cost) * parseFloat(item.tofullfilled)),

                            //batch_no: item.batch_no,
                            //expiry_date: item.expiry_date,
                            //mrp: item.mrp,
                            //variation_name: item.variation_name,
                            //mode : "Credit"  //cash
                        });
                        //tot_fin_amount=tot_fin_amount+parseFloat(item.tofullfilled)*
                    }

                });
                if (flag == false)
                    throw "No items cannot be fulfilled";

                // page.salesService.updateSalesOrderItems(0, items, function () {

                //Make inventory entry
                var newBill = {
                    bill_type: "Sale"
                }
                newBill.bill_items = inventItems;
               // page.inventoryService.insertInventoryItems(0, inventItems, function (data) {
                page.stockAPI.insertStock(newBill, function (data) {
                    page.salesService.getSOItems(page.selectedSO.order_id, function (data) {

                        //if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                        //    //var s_with_tax = (parseFloat(page.controls.lblSubTotal.value()) - parseFloat(page.controls.lblDiscount.value())) - parseFloat(page.controls.lblRndOff.value());
                        //    var data1 = {
                        //        per_id: CONTEXT.PeriodId,
                        //        //target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                        //        //target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCredit,
                        //        //amount: parseFloat(page.controls.lblTotal.value()).toFixed(5),
                        //        sales_with_tax: parseFloat(page.controls.lblTotal.value()).toFixed(5),
                        //        sales_with_out_tax: parseFloat(s_with_tax).toFixed(5),
                        //        tax_amt: parseFloat(page.controls.lblTax.value()).toFixed(5),
                        //        description: "Sales Order-" + page.currentBillNo,
                        //        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                        //        key_1: page.currentBillNo,
                        //        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                        //        key_2: $$("ddlSOCustomer").selectedValue()
                        //    };
                        //    $$("msgPanel").show("Updating Finfacts...");
                        //    page.finfactsEntry.creditSales(data1, function (response) {
                        //        page.finfactsEntry.creditSaleStock(data1, function (res) {
                        //            $$("msgPanel").show("POS payment is recorded successfully.");
                        //        });
                        //        //page.finfactsService.insertCreditSales(data1, function (response) {
                        //        //callback(page.currentBillNo);


                        //    });
                        //}
                        //Keep the selected Items in page scope
                        page.selectedSOItems = $.util.clone(data);

                        //Bind the selected Items on view
                        page.view.selectedSOItems(data);

                        $$("pnlAddToFullfillActions").hide();
                        $$("pnlItemActions").show();
                        $$("msgPanel").flash("Sales order is successfully fulfilled...!");
                    });
                });
                //})
                //});


            } catch (e) {
                $$("msgPanel").show(e);

            }
        }


        page.events.btnAddToDeliveryAction_click = function () {
            $$("pnlAddToDeliveryActions").show();
            $$("pnlReturnTrayActions").hide();
            $$("pnlAddToFullfillActions").hide();
            $$("pnlReturnDeliveryActions").hide();
            $$("pnlAddToTrayActions").hide();
            $$("pnlItemActions").hide();

            page.deliveryMode = true;
            page.view.selectedSOItems(page.currentSOItems);
            page.deliveryMode = false;
        }
        page.events.btnAddToDeliveryCancel_click = function () {
            $$("pnlAddToDeliveryActions").hide();
            $$("pnlReturnTrayActions").hide();
            $$("pnlAddToFullfillActions").hide();
            $$("pnlReturnDeliveryActions").hide();
            $$("pnlAddToTrayActions").hide();
            $$("pnlItemActions").show();
            // page.deliveryMode = false;
            page.view.selectedSOItems(page.currentSOItems);
        }
        page.events.btnAddToDeliveryConfirm_click = function () {
            var items = [];
            var flag = false;
            try {
                //  var count = 0;
                //  var item_name;
                $(page.controls.grdSOItems.allData()).each(function (index, item) {

                    if (typeof item.delivered == "undefined" || item.delivered == null || item.delivered == "" || isNaN(item.delivered))
                        item.delivered = 0;

                    if (typeof item.todelivered == "undefined" || item.todelivered == null || item.todelivered == "") {
                        item.todelivered = 0;
                    }

                    if (parseFloat(item.fullfilled) < (parseFloat(item.todelivered) + parseFloat(item.delivered))) {
                        throw "Item to delivered cannot be greater than order fulfilled qty for item: " + item.item_name + "";
                    }

                    if (isNaN(item.todelivered) || parseFloat(item.todelivered) < 0) {
                        throw "To delivered should be a number and non negative for Item: " + item.item_name + "";
                    }

                    if (item.todelivered > 0) {
                        flag = true;
                        if (item.unit_identity == "1") {
                            item.todelivered = parseFloat(item.todelivered) * parseFloat(item.alter_unit_fact);
                        }
                    }
                        
                    items.push({
                        order_item_id: item.order_item_id,
                        var_no: item.var_no,
                        order_id: page.selectedSO.order_id,
                        delivered: parseFloat(item.delivered) + parseFloat(item.todelivered)
                    });
                });

                if (flag == false)
                    throw "No items cannot be delivered";
                //Show progress

                page.salesService.updateSalesOrderItems(0, items, function () {
                    $$("msgPanel").show("Reloading data...");

                    page.salesService.getSOItems(page.selectedSO.order_id, function (data) {

                        //Keep the selected Items in page scope
                        page.selectedSOItems = $.util.clone(data);

                        //Bind the selected Items on view
                        page.view.selectedSOItems(data);

                        $$("pnlAddToDeliveryActions").hide();
                        $$("pnlReturnTrayActions").hide();
                        $$("pnlAddToTrayActions").hide();
                        $$("pnlItemActions").show();
                        $$("msgPanel").flash("Sales order is successfully delivered...!");
                    });
                    $$("msgPanel").hide();

                });

                //update sales order based on what is allowed in particular state.
                /*    page.saveSalesOrder(function () {
                        page.loadSalesOrder(page.selectedSO.order_id);
                        $$("msgPanel").show("Sales Order Record Updated!");
                        $$("pnlAddToDeliveryActions").hide();
                        $$("pnlAddToFullfillActions").hide();
                        $$("pnlReturnDeliveryActions").hide();
                        $$("pnlItemActions").show();
                        page.deliveryMode = false;
                    });
                   */
                //});
                //   }
                //   else if(count == 1)
                //       alert("To Delivery should Not Be Emplty For Item: " + item_name + "");
                //   else if (count == 2)
                //       alert("Item To Delivered Cannot Be Greater Than Order Qty For Item: " + item_name + "");
                //   else if (count == 3)
                //       alert("Item To Delivered Cannot Be Greater Than Order Qty For Item: " + item_name + "");
                //   else if (count == 4)
                //       alert("Fullfilled is Number For Item: " + item_name + "")
                //  else if (count == 5)
                //       alert("Delivered is Number For Item: " + item_name + "");
                //   else if (count == 6)
                //      alert("To Fullfill Not Negative Number For Item: " + item_name + "");
                //  else
                //     alert("To Delivered Not Negative Number For Item: " + item_name + "");

            }
            catch (e) {
                $$("msgPanel").show(e);

            }

        }


        //Change state to fullfilled => generate a bill => Insert stock entry  => Insert Tray transaction
        page.events.btnFulfillSO_click = function () {
            try {
                //   var count = 0;
                $(page.controls.grdSOItems.allData()).each(function (i, item) {
                    if (item.free_qty == "" || item.free_qty == null || item.free_qty == undefined)
                        item.free_qty = 0;
                    if (item.unit_identity == "1") {
                        item.fullfilled = parseFloat(item.fullfilled) * parseFloat(item.alter_unit_fact);
                    }
                    if ((parseFloat(item.free_qty) + parseFloat(item.quantity)) != parseFloat(item.fullfilled))
                        throw "Qty ordered and qty fulfilled is not equal for the item: " + item.item_name + "";
                });


                $$("msgPanel").show("Updating sales order details...");
                page.salesService.fulfillSalesOrder(page.selectedSO.order_id, page.controls.lblSOFulfilledDate.getDate(), function (data2, callback) {
                    $$("msgPanel").flash("Order can be fulfilled successfully...");
                    page.loadSalesOrder(page.selectedSO.order_id, function () {

                    });
                });

                //Save the order
                /* page.saveSalesOrder(function () {

                     $$("msgPanel").show("Changing Sales Order to Fullfilled...");

                     //Change status to fullfilled and generate a bill
                     page.salesService.fulfillSalesOrder(page.selectedSO.order_id, page.controls.lblSOFulfilledDate.getDate(), function () {
                         $$("msgPanel").show("Reloading data...");
                         page.loadSalesOrder(page.selectedSO.order_id, function () {
                            
                             $$("msgPanel").show("Sales order is successfully fulfilled. A new bill is generated with bill no " + page.currentBillNo);

                         });
                         page.currentBillNo = page.controls.lblSOIBillNo.html();

                         //Insert bill discount
                         page.billService.reinsertBillDisount(page.currentBillNo, page.discount);

                         var rbillItems = [];
                         $(page.controls.grdSOItems.allData()).each(function (i, billItem) {
                             if (billItem.delivered == undefined || billItem.delivered == null || billItem.delivered == "")
                                 billItem.delivered = 0;
                             rbillItems.push({
                                 bill_no: page.currentBillNo,
                                 item_no: billItem.item_no,
                                 qty: (parseFloat(billItem.quantity) - parseFloat(billItem.delivered)), //- parseFloat(billItem.delivered),
                                 price: billItem.price,
                                 tax_class_no: billItem.tax_class_no,
                                 tax_per: billItem.tax_per,
                                 discount: billItem.discount,
                                 total_price: billItem.total_price
                             });
                         });
                         $$("msgPanel").show("Updating Stock...");
                         //Prepare inventory data
                         var inventItems = [];
                         $(rbillItems).each(function (i, data) {
                             inventItems.push({
                                 item_no: data.item_no,
                                 cost: data.price,  //why needed
                                 qty: data.qty,
                                 vendor_no: page.selectedSO.cust_no,
                                 comments: "",
                                 invent_type: "Sale",
                                 key1: page.currentBillNo
                             });
                         });

                         //Make inventory entry
                         page.inventoryService.insertInventoryItems(0, inventItems, function () {
                             if (CONTEXT.ENABLE_MODULE_TRAY == true) {

                                 //Prepare trayItems
                                 var trayItems = [];
                                 $(page.controls.grdSOItems.allData()).each(function (index, item) {
                                     if (item.tray_id != '' && item.tray_id != undefined) {
                                         var trayTrans = {
                                             tray_count: item.tray_count,
                                             trans_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                             trans_type: 'Customer Sales',
                                             tray_id: item.tray_id,
                                             cust_id: page.selectedSO.cust_no,
                                             bill_id: page.selectedSO.bill_no,   //TODO : billno or so no
                                         };
                                         trayItems.push(trayTrans);
                                     }
                                 });
                                 $("msgPanel").show("Updating Tray...");
                                 //Make tray entry
                                 page.trayService.insertEggTrayTransactions(0, trayItems, function () {

                                     $$("msgPanel").show("Reloading data...");
                                     //reload sales order
                                     page.loadSalesOrder(page.selectedSO.order_id, function () {
                                        
                                         $$("msgPanel").show("Sales order is successfully fulfilled. A new bill is generated with bill no " + page.currentBillNo);

                                     });
                                 })
                             } else {
                                 //reload data
                                 //reload sales order
                                 $$("msgPanel").show("Reloading data...");
                                 page.loadSalesOrder(page.selectedSO.order_id, function () {
                                    
                                     $$("msgPanel").show("Sales order is successfully fulfilled. A new bill is generated with bill no " + page.currentBillNo);

                                 });
                             }
                         })
                     });
                 });*/

            } catch (e) {
                $$("msgPanel").show(e);

            }
        }

        //Change state to delivered  
        page.events.btnDeliveredSO_click = function () {
            try {
                var count = 0;
                $(page.controls.grdSOItems.allData()).each(function (i, item) {
                    if (item.unit_identity == "1") {
                        item.delivered = parseFloat(item.delivered) * parseFloat(item.alter_unit_fact);
                    }
                    if ((parseFloat(item.free_qty) + parseFloat(item.quantity)) != parseFloat(item.delivered))
                        throw "Please verify the delivered quantity for item: " + item.item_name + "";
                });
                page.salesService.deliverSalesOrder(page.selectedSO.order_id, page.controls.lblSODeliveredDate.getDate(), function (data2, callback) {
                    $$("msgPanel").show("Order can be delivered successfully...");
                    page.loadSalesOrder(page.selectedSO.order_id, function () {


                    });
                });

                $$("msgPanel").show("Updating sales order details...");

                //Save the order
                /*  page.saveSalesOrder(function () {
                      $$("msgPanel").show("Changing Sales Order to Delivered...");
                      //Change state to Delivered
                      page.salesService.deliverSalesOrder(page.selectedSO.order_id, page.controls.lblSODeliveredDate.getDate(), function (data2) {

                          $$("msgPanel").show("Reloading data...");
                          //reload data
                          page.loadSalesOrder(page.selectedSO.order_id, function () {
                             
                              $$("msgPanel").show("Sales order is successfully Delivered.");
                          });



                      });

                  });*/
                //   } catch (e) {
                //      
                //   }
                //  else {
                //      alert("Please verify the delivered quantity")
                //  }

            } catch (e) {
                $$("msgPanel").show(e);
            }


        }

        //Make payment for current bill and previous bills 
        page.events.btnBillPaySOOK_click = function () {
            $$("btnBillPaySOOK").disable(true);
            $$("btnBillPaySOOK").hide();
            try {
                //Confirm the payment
                if (confirm("Are you sure to pay the Amount") == true) {

                    //Validations
                    if (isNaN(parseFloat($$("txtPayAmount").val()))) {
                        alert("Please Enter only digits for amount!");
                    } else if ($$("ddlPayFor").selectedValue() == "Current SalesOrder" && ((parseFloat(page.controls.lblTotalAmtPaid.value()) + parseFloat($$("txtPayAmount").val())) > parseFloat(page.controls.lblTotal.value()))) {
                        alert('Amount Exceeds total due amount:' + page.controls.lblTotal.value() + '--Total Paid amount is : ' + page.controls.lblTotalAmtPaid.value());
                    } else if (!(page.controls.ddlCollectorName.selectedValue() != '' && page.controls.txtPayAmount.value() != '' && page.controls.dsBillPayDate.getDate() != '' && page.controls.ddlPayType.selectedValue() != '')) {
                        alert('Please Enter Collector name, Amount, Pay date and pay type!');
                    } else {

                        //Show progress

                        page.controls.pnlBillPayPopup.close();

                        //If paying only for current sales order.
                        if ($$("ddlPayFor").selectedValue() == "Current SalesOrder") {
                            //Prepare for invoice payment
                            var billSO = {
                                collector_id: page.controls.ddlCollectorName.selectedValue(),
                                pay_desc: page.controls.txtPayDesc.value(),
                                amount: page.controls.txtPayAmount.value(),
                                bill_no: $$("lblSOIBillNo").html(),
                                pay_date: page.controls.dsBillPayDate.getDate(),
                                pay_type: page.controls.ddlPayType.selectedValue()
                            };

                            $$("msgPanel").show("Updating payments...");
                            //Pay for the correstponding bill_no
                            page.salesService.payInvoiceBillSalesOrder(billSO, function (data) {

                                //If finfacts module is enabled then make entry in finfacts.
                                if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                    var data1 = {
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                        //amount: parseFloat(page.controls.txtPayAmount.value()).toFixed(5),
                                        paid_amount: parseFloat(page.controls.txtPayAmount.value()).toFixed(5),
                                        description: "Sales Order-" + page.selectedSO.order_id,
                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                        key_1: $$("lblSOIBillNo").html(),
                                        comp_id: CONTEXT.FINFACTS_COMPANY
                                    };
                                    $$("msgPanel").show("Updating finfacts...");
                                    page.finfactsEntry.creditSalesPayment(data1, function (response) {
                                    //page.finfactsService.insertCreditReceipt(data1, function (response) {

                                        $$("msgPanel").show("Reloading data...");
                                        page.loadSalesOrder(page.selectedSO.order_id, function () {

                                            $$("msgPanel").flash("Sales order payment is recorded successfully.");
                                        });
                                    });
                                } else {
                                    $$("msgPanel").show("Reloading data...");
                                    page.loadSalesOrder(page.selectedSO.order_id, function () {

                                        $$("msgPanel").flash("Sales order payment is recorded successfully.");


                                    });

                                }

                            });
                        } else {
                            $$("msgPanel").show("Making payments for all pending sales order...");
                            //Previous payments yet to do. TODO
                            page.billService.payAllPendingBills($$("ddlSOCustomer").selectedValue(), $$("txtPayAmount").val(), function (msg, excessAmount) {

                                $$("msgPanel").show("Reloading data...");
                                page.loadSalesOrder(page.selectedSO.order_id, function () {

                                    $$("msgPanel").show("Payments made => " + msg);
                                });
                                if (excessAmount > 0) {
                                    alert("Amount " + excessAmount + " is excess and it is not utilised.");
                                }
                            });
                        }

                    }

                }
            } catch (e) {
                $$("msgPanel").show(e);
            }



        }

        //Make payment for current bill and previous bills 
        page.events.btnReturnBillPaySOOK_click = function () {
            if (page.controls.ddlReturnBillNo.selectedValue() == -1) {
                alert("Bill No mantatory");
            }
            else
                try {
                    //Confirm the payment
                    if (confirm("Are you sure to pay the Amount") == true) {

                        //Validations
                        if (isNaN(parseFloat($$("txtReturnPayAmount").val())) || parseFloat($$("txtReturnPayAmount").val()) <= 0) {
                            alert("Please Enter only digits for amount!");
                        }
                        else if (parseFloat($$("txtReturnPayAmount").val()) > parseFloat($$("txtReturnBillAmount").val())) {
                            alert("Bill Amount Should Not Exceed Than The Actual Amount!");
                        }
                        else if (!(page.controls.ddlReturnCollectorName.selectedValue() != '' && page.controls.txtReturnPayAmount.value() != '' && page.controls.dsReturnBillPayDate.getDate() != '' && page.controls.ddlReturnPayType.selectedValue() != '')) {
                            alert('Please Enter Collector name, Amount, Pay date and pay type!');
                        }
                        else {
                            //Show progress

                            page.controls.pnlReturnBillPayPopup.close();

                            //Prepare for invoice payment
                            var billSO = {
                                collector_id: page.controls.ddlReturnCollectorName.selectedValue(),
                                pay_desc: page.controls.txtReturnPayDesc.value(),
                                amount: page.controls.txtReturnPayAmount.value(),
                                bill_no: page.controls.ddlReturnBillNo.selectedValue(),
                                pay_date: page.controls.dsReturnBillPayDate.getDate(),
                                pay_type: page.controls.ddlReturnPayType.selectedValue()
                            };
                            $$("msgPanel").show("Updating Payments...");
                            //Pay for the correstponding bill_no
                            page.salesService.payInvoiceBillSalesOrder(billSO, function (data) {

                                //If finfacts module is enabled then make entry in finfacts.
                                if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                    var data1 = {
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                        //amount: parseFloat(page.controls.txtReturnPayAmount.value()).toFixed(5),
                                        paid_amount: parseFloat(page.controls.txtReturnPayAmount.value()).toFixed(5),
                                        description: "Sales Order Return-" + page.selectedSO.order_id,
                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                        key_1: page.controls.ddlReturnBillNo.selectedValue(),
                                        comp_id: localStorage.getItem("user_company_id")
                                    };
                                    $$("msgPanel").show("Updating Finfacts...");
                                    page.finfactsEntry.creditReturnSalesPayment(data1, function (response) {
                                    //page.finfactsService.insertCreditReturnReceipt(data1, function (response) {

                                        //Add Points for the customer
                                        if (CONTEXT.ENABLE_REWARD_MODULE == true) {
                                            var newItem = {};
                                            page.customerService.getCustomerById(page.controls.ddlSOCustomer.selectedValue(), function (data) {
                                                page.rewardService.getRewardById(data[0].reward_plan_id, function (data2) {
                                                    if (data2.length != 0) {
                                                        // page.billService.getBill(page.currentReturnBillNo, function (data1) {
                                                        newItem.cust_no = data[0].cust_no;
                                                        newItem.reward_plan_id = data[0].reward_plan_id;
                                                        //page.customerList = data;
                                                        newItem.bill_no = page.controls.ddlReturnBillNo.selectedValue();
                                                        newItem.trans_date = $.datepicker.formatDate("dd-mm-yy", new Date());
                                                        newItem.points = parseFloat(page.controls.txtReturnPayAmount.value()) / data2[0].reward_plan_point;
                                                        newItem.trans_type = "Debit";
                                                        newItem.setteled_amount = parseFloat(parseFloat(page.controls.txtReturnPayAmount.value()) * data2[0].reward_plan_point) / 4;
                                                        page.customerService.insertCustomerRewardt(newItem, function (data) {
                                                            $$("msgPanel").flash("Points added successfully.");
                                                        });
                                                        //  });
                                                    } else {
                                                        $$("msgPanel").flash("Customer cannot have reward plans.");
                                                    }

                                                });
                                            });
                                        }

                                        $$("msgPanel").show("Reloading data...");
                                        page.loadSalesOrder(page.selectedSO.order_id, function () {

                                            $$("msgPanel").flash("Sales Order payment is recorded successfully.");
                                        });
                                    });
                                } else {
                                    $$("msgPanel").show("Reloading data...");
                                    page.loadSalesOrder(page.selectedSO.order_id, function () {

                                        $$("msgPanel").flash("Sales Order payment is recorded successfully.");


                                    });
                                }
                            });
                        }

                    }
                } catch (e) {
                    $$("msgPanel").show(e);
                }
        }


        //Change state to Invoice Paid
        page.events.btnInvoicePaySO_click = function () {
            try {
                //Get the remaining amount to pay for sales order.
                var remainingAmount = page.controls.lblTotal.value() - page.controls.lblTotalAmtPaid.value();
                if (remainingAmount == 0) {

                    //Show progress bar

                    $$("msgPanel").show("Updating Sales Order Details...");

                    //Save the order
                    //   page.saveSalesOrder(function () {

                    $$("msgPanel").show("Changing Sales Order to Invoice Paid...");
                    page.salesService.invoicePaidSalesOrder(page.selectedSO.order_id, page.controls.lblSOInvoiceDate.getDate(), function () {

                        //reload sales order
                        page.loadSalesOrder(page.selectedSO.order_id, function () {

                            $$("msgPanel").show("Sales order is successfully marked as Paid.");
                        });

                    });
                    // });
                    var newItemPoint = {};
                    var cust_no = $$("ddlSOCustomer").selectedValue();
                    page.customerService.getCustomerById(cust_no, function (data) {
                        page.billService.getBill($$("lblSOIBillNo").html(), function (data1) {
                            page.rewardService.getRewardById(data[0].reward_plan_id, function (data2) {
                                newItemPoint.cust_no = data[0].cust_no;
                                newItemPoint.reward_plan_id = data[0].reward_plan_id;
                                //page.customerList = data;
                                newItemPoint.bill_no = data1[0].bill_no;
                                newItemPoint.trans_date = data1[0].bill_date;
                                newItemPoint.points = data1[0].total * data2[0].reward_plan_point;
                                newItemPoint.trans_type = "Credit";
                                newItemPoint.setteled_amount = parseFloat(data1[0].total * data2[0].reward_plan_point) / 4;

                                //Check Reward is enable or not
                                if (CONTEXT.ENABLE_REWARD_MODULE == true) {
                                    page.customerService.insertCustomerRewardt(newItemPoint, function (data) {
                                        $$("msgPanel").flash("Reward Points Added Successfully.");
                                    });
                                }

                                $$("msgPanel").hide();
                            });
                        });
                    });

                } else {
                    $$("msgPanel").show('Sales order cannot be marked as Paid until full payment for the order is made!. Total amount paid till date is: ' + page.controls.lblTotalAmtPaid.value() + '.Please pay remaining amount:' + remainingAmount);
                }
            } catch (e) {
                $$("msgPanel").show(e);
            }




        }

        //Change the status to Cancelled. Revert Stock,Payment,Egg Tray,Bill
        page.events.btnCancelSO_click = function () {
            page.billService.getReturnedBillByNo(page.selectedSO.order_id, page.selectedSO.bill_no, function (rdata) {

                page.events.btnReturnSOItemPopup_click(rdata);
                page.salesService.cancelSalesOrder(page.selectedSO.order_id, function (data1) {
                    $$("msgPanel").show("Order has been cancelled successfully...");
                    page.loadSalesOrder(page.selectedSO.order_id, function () {


                    });
                });
            });

            /*try {

                
                $$("msgPanel").show("Cancelling Sales Order...");

                //Change state to Delivered
                page.salesService.cancelSalesOrder(page.selectedSO.order_id, function (data2) {

                    //Prepare bill data
                    var newBill = {
                        bill_no: page.controls.lblSOIBillNo.html(),
                        so_no: page.selectedSO.order_id,
                        store_no: CONTEXT.store_no,
                        reg_no: CONTEXT.reg_no,
                        user_no: CONTEXT.user_no,

                        sub_total: page.controls.lblTotal.value(),
                        total: page.controls.lblTotal.value(),
                        discount: 0,
                        tax: 0,

                        bill_type: "Invalid",
                        cust_no: page.selectedSO.cust_no,
                        state_no: 300, //300 is return               
                        return_bill_no: page.selectedSO.bill_no,
                        sales_tax_no: page.sales_tax_no,



                    };

                    $$("msgPanel").show("Cancelling Bills...");
                    //Create a new Bill
                    page.billService.updateBill(newBill, function (data) {
                        page.currentBillNo = data[0].key_value



                        //Prepare for invoice payment
                        var billSO = {
                            collector_id: CONTEXT.user_no,  //TODO  leave it null
                            pay_desc: "Return of bill " + page.selectedSO.bill_no,
                            amount: page.controls.lblTotal.value(),
                            bill_id: page.controls.lblSOIBillNo.html(),
                            pay_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                            pay_type: "Return"
                        };


                        $$("msgPanel").show("Cancelling Payments...");
                        $$("msgPanel").show("Reloading data...");
                        $$("msgPanel").show("Cancelling Stock...");
                        page.loadSalesOrder(page.selectedSO.order_id, function () {
                           
                            $$("msgPanel").show("Sales order is successfully Cancelled. A new return bill is generated with bill no " + page.currentBillNo);

                        });
                        //Pay for the correstponding bill_no
                        //      page.salesService.payInvoiceBillSalesOrder(billSO, function (data) {
                        //Get original bill and do return bill
                        var rbillItems = [];
                        $(page.controls.grdSOItems.allData()).each(function (i, data) {
                            rbillItems.push({
                                bill_no: page.controls.lblSOIBillNo.html(),
                                item_no: data.item_no,
                                qty: data.quantity,
                                price: data.price,
                                //tax_class_no: billItem.tax_class_no,
                                tax_per: 0,
                                discount: 0,
                                total_price: data.total_price
                            });
                            //Get original bill and do return bill
                            page.billService.getBillItem(page.controls.lblSOIBillNo.html(), function (billItems) {
                                var rbillItems = [];
                                $(billItems).each(function (i, billItem) {
                                    rbillItems.push({
                                        bill_no: page.controls.lblSOIBillNo.html(),
                                        item_no: billItem.item_no,
                                        qty: billItem.qty,
                                        price: billItem.price,
                                        //tax_class_no: billItem.tax_class_no,
                                        tax_per: 0,
                                        discount: 0,
                                        total_price: billItem.total_price
                                    });
                                });

                                //Insert bill items one by one
                                page.billService.insertAllBillItems(page.controls.lblSOIBillNo.html(), 0, rbillItems, function () {

                                    //Update bill no in sales order
                                    page.salesService.updateReturnBillNo({ order_id: page.selectedSO.order_id, return_bill_no: page.controls.lblSOIBillNo.html() }, function () {

                                        //Prepare inventory data reversal
                                        var inventItems = [];
                                        $(rbillItems).each(function (i, data) {
                                            inventItems.push({
                                                item_no: data.item_no,
                                                cost: data.price,   //TODO : Price why needed
                                                qty: data.qty,
                                                vendor_no: page.selectedSO.cust_no,
                                                comments: "",
                                                invent_type: "SaleReturn",
                                                key1: page.currentBillNo
                                            });
                                        });

                                        //    $$("msgPanel").show("Cancelling Stock...");
                                        //Make inventory entry
                                        page.inventoryService.insertInventoryItems(0, inventItems, function () {
                                            if (CONTEXT.ENABLE_MODULE_TRAY == true) {

                                                //Prepare trayItems
                                                var trayItems = [];
                                                $(page.controls.grdSOItems.allData()).each(function (index, item) {
                                                    if (item.tray_id != '' && item.tray_id != undefined) {
                                                        var trayTrans = {
                                                            tray_count: item.tray_count,
                                                            trans_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                            trans_type: 'Customer Return',
                                                            tray_id: item.tray_id,
                                                            cust_id: page.selectedSO.cust_no,
                                                            bill_id: page.controls.lblSOIBillNo.html(),  //TODO : billno or so no
                                                        };
                                                        trayItems.push(trayTrans);
                                                    }
                                                });

                                                $$("msgPanel").show("Cancelling Tray...");
                                                //Make tray entry
                                                page.trayService.insertEggTrayTransactions(0, trayItems, function () {

                                                    //If state is Paid then need to rever payment also in journal and payment_t then 

                                                    $$("msgPanel").show("Reloading data...");
                                                    //reload sales order
                                                    page.loadSalesOrder(page.selectedSO.order_id, function () {
                                                       
                                                        $$("msgPanel").show("Sales order is successfully Cancelled. A new return bill is generated with bill no " + page.currentBillNo);

                                                    });
                                                })
                                            } else {
                                                //reload data
                                                //reload sales order

                                            }
                                        })

                                    });
                                });
                            });

                        });
                    });

                });
            } catch (e) {
               
            }*/
        }

        //Remove a  a Sales Order.Should be allowed only in created and ordered state.
        page.events.btnRemoveSO_click = function () {
            try {
                if (page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered") {
                    $$("msgPanel").show("Sales Order should be in either Created or Ordered state to completely remove an order.");
                } else {

                    //Confirm removing an order
                    if (confirm("Are you sure want to delete the Sales Order!")) {
                        var data = {
                            bill_no: page.controls.lblSOIBillNo.html(),
                            order_id: page.selectedSO.order_id
                        }
                        //Hard delete the order information
                        page.salesService.deleteSalesOrder(data, function (data) {

                            $$("msgPanel").show("Sales Order is completely removed.");
                            //page.events.page_load();
                            //Refresh Search again.
                            page.events.btnSearch_click();

                        });

                    }
                }
            } catch (e) {
                $$("msgPanel").show(e);
            }

        }

        //Advance Search
        $("[controlid=txtAdvVendor]").keyup(function () {
            page.advanceItemSearch($$("txtAdvVendor").val(), $$("txtAdvManufacturer").val(), page.sales_tax_no);
        });
        $("[controlid=txtAdvManufacturer]").keyup(function () {
            page.advanceItemSearch($$("txtAdvVendor").val(), $$("txtAdvManufacturer").val(), page.sales_tax_no);
        });

        page.advanceItemSearch = function (ven_name, man_name, sales_tax_no) {
            page.itemService.getTouchItemAdvanceSearch(ven_name, man_name, sales_tax_no, function (data) {
                page.controls.grdAdvSearchItem.hide();
                //page.controls.grdTouchAdvSearchItem.width("100%");
                //page.controls.grdTouchAdvSearchItem.height("220px");
                page.controls.grdTouchAdvSearchItem.setTemplate({
                    selection: "Multiple",
                    columns: [
                            { 'name': "", 'width': "0px", 'dataField': "item_no" },
                            { 'name': "", 'width': "0px", 'dataField': "item_name" },
                            { 'name': "", 'width': "0px", 'dataField': "item_code" },
                            { 'name': "", 'width': "0px", 'dataField': "vendor_name" },
                            { 'name': "", 'width': "0px", 'dataField': "man_name" },
                            { 'name': "", 'width': "0px", 'dataField': "tax" },
                            { 'name': "", 'width': "0px", 'dataField': "price" },
                            { 'name': "", 'width': "0px", 'dataField': "mrp" },
                            { 'name': "Select Items", 'width': "100%", 'dataField': "item_no", itemTemplate: "<div id='detailGrid'></div>" }

                    ]
                })

                $$("grdTouchAdvSearchItem").rowBound = function (row, item) {
                    var htmlTemplate = [];
                    htmlTemplate.push("<div><img id='output' style='max-width:150px; max-height:150px; min-height:150px;' src='" + CONTEXT.ImageDownloadPath + item.item_no + '/' + item.image_name + "'/><BR><p style='background-color:orange;'><span > Vendor : " + item.vendor_name + "<BR> Manufacturer : " + item.man_name + "<BR> MRP : " + item.mrp + "</span></p></div>");

                    $(row).find("[id=detailGrid]").html(htmlTemplate.join(""));
                }

                //page.controls.grdTouchAdvSearchItem.createRow(item);
                page.controls.grdTouchAdvSearchItem.dataBind(data);

                //page.controls.grdTouchAdvSearchItem.dataBind(data);
            });
        }
        page.events.btnTouchAdvaSearchItem_click = function () {
            $("div.touch").show();
            $$("txtAdvVendor").val('');
            $$("txtAdvManufacturer").val('');
            $$("txtAdvVendor").focus();
            page.advanceItemSearch($$("txtAdvVendor").val(), $$("txtAdvManufacturer").val(), page.sales_tax_no);
            page.controls.grdAdvSearchItem.hide();
            //page.advanceItemSearch($$("txtAdvVendor").val(), $$("txtAdvManufacturer").val());
        }
        page.events.btnAdvSearchItem_click = function () {
            $("div.touch").hide();
            page.controls.pnlAdvSearchItemPopup.open();
            page.controls.pnlAdvSearchItemPopup.title("Item Advance Search");
            page.controls.pnlAdvSearchItemPopup.width(1300);
            page.controls.pnlAdvSearchItemPopup.height(600);
            $$("txtAdvItemSearch").val('');
            page.controls.grdAdvSearchItem.hide();
        }
        page.events.btnAdvaSearchItem_click = function () {
            $("div.touch").hide();
            page.controls.grdAdvSearchItem.show();
            page.itemService.getItemAdvanceSearch($$("txtAdvItemSearch").val(), page.sales_tax_no, function (data) {

                page.controls.grdAdvSearchItem.width("100%");
                //page.controls.grdAdvSearchItem.height("220px");
                page.controls.grdAdvSearchItem.setTemplate({
                    selection: "Multiple",
                    columns: [
                        { 'name': "Item No", 'width': "60px", 'dataField': "item_no" },
                        { 'name': "Item Name", 'width': "120px", 'dataField': "item_name" },
                        { 'name': "Item Code", 'width': "75px", 'dataField': "item_code" },
                        { 'name': "Default Vendor", 'width': "130px", 'dataField': "vendor_name" },
                        { 'name': "Manufacturer", 'width': "100px", 'dataField': "man_name" },
                        { 'name': "Tax", 'width': "60px", 'dataField': "tax" },
                        { 'name': "Price", 'width': "80px", 'dataField': "price" },
                        { 'name': "MRP", 'width': "80px", 'dataField': "mrp" },

                    ]
                });
                page.controls.grdAdvSearchItem.dataBind(data);

            });
        }
        page.events.btnAddAdvaSearchItem_click = function () {
            var data = {};
            if ($('div.touch').css('display') == 'none') {
                data = page.controls.grdAdvSearchItem.selectedData();
            }
            else {
                data = page.controls.grdTouchAdvSearchItem.selectedData();
            }
            page.advSearchItemSelect(data);
            page.controls.pnlAdvSearchItemPopup.close();
        }
        //#endregion
        page.advSearchItemSelect = function (item) {
            if (item != null) {
                $(item).each(function (i, item) {
                    if (typeof item.item_no != "undefined") {

                        if (item.price != null) {

                            page.itemService.getItemDiscountAutocomplete(item.item_no, function (data1) {

                                if (data1 != '' && data1 != undefined) {
                                    discountVal = data1[0].disc_value;
                                    page.discount.push({
                                        disc_no: data1[0].disc_no,
                                        disc_type: data1[0].disc_type,
                                        disc_name: data1[0].disc_name,
                                        disc_value: discountVal,
                                        item_no: item.item_no
                                    });
                                }

                                var newitem = {
                                    item_no: item.item_no,
                                    item_name: item.item_name,
                                    batch_no: item.batch_no,
                                    expiry_date: item.expiry_date,
                                    qty_stock: item.qty_stock,
                                    cost: item.price,
                                    qty_const: item.qty_stock,
                                    mrp: item.mrp,
                                    order_id: page.view.selectedSO().order_id,
                                    discount: item.discount,
                                    tax: item.tax,
                                    tax_class_no: item.tax_class_no,
                                    quantity: 1,
                                    free_qty: 0,
                                    fullfilled: 0,
                                    price: item.price,
                                    tray_id: item.tray_no,
                                    tray_count: 0,
                                    unit: item.unit,
                                    tofullfilled: 1,
                                    todelivered: 1,
                                    total_price: item.price * 1 + item.tax * item.price * 1,
                                    qty_type: item.qty_type
                                };
                                var rows = page.controls.grdSOItems.getRow({
                                    item_no: newitem.item_no
                                });


                                if (rows.length == 0) {
                                    page.controls.grdSOItems.createRow(newitem);
                                    page.controls.grdSOItems.edit(true);
                                    rows = page.controls.grdSOItems.getRow({
                                        item_no: newitem.item_no
                                    });
                                    rows[0].find("[datafield=quantity]").find("input").focus();
                                } else {
                                    var txtQty = rows[0].find("[datafield=quantity]").find("input");
                                    //txtQty.val(parseInt(txtQty.val()) + 1);
                                    txtQty.val(parseInt(txtQty.val()) + 1);
                                    txtQty.trigger('change');
                                    txtQty.focus();
                                }
                                //page.controls.txtItemSearch.customText("");
                                // page.controls.ddlSalesTax.selectedObject.val(CONTEXT.DEFAULT_SALES_TAX);
                                page.calculate();
                            });


                        } else {
                            alert("No price is defined for item:" + item.item_name);
                        }


                    }
                });
            }
        }

        //#region "Sales Order - Other Main Actions"

        //Update a sales order based on status


        //Add sales order items
        page.events.btnAddItemToSO_click = function () {

            page.controls.pnlItemSelectionPopup.open();
            page.controls.pnlItemSelectionPopup.title("Item Selection");
            page.controls.pnlItemSelectionPopup.width(800);
            page.controls.pnlItemSelectionPopup.height(400);



            page.controls.pnlItemSelectionPopup.dialogClose = function () {
                if (page.viewMode == "Mobile")
                    $('html, body').animate({
                        scrollTop: $("[controlid=grdSOItems]").offset().top
                    }, 2000);
            }

            page.controls.pnlItemSelection.load();



            page.controls.pnlItemSelection.select = function (data) {

                if (data.length > 0) {
                    $(data).each(function (i, item) {
                        if (item.mrp != null) {

                            page.itemService.getItemDiscountAutocomplete(item.item_no, function (data1) {

                                if (data1 != '' && data1 != undefined) {
                                    discountVal = data1[0].disc_value;
                                    page.discount.push({
                                        disc_no: data1[0].disc_no,
                                        disc_type: data1[0].disc_type,
                                        disc_name: data1[0].disc_name,
                                        disc_value: discountVal,
                                        item_no: item.item_no
                                    });
                                }

                                var newItem = {
                                    item_no: item.item_no,
                                    item_name: item.item_name,
                                    qty_stock: item.qty_stock,
                                    cost: item.price,
                                    order_id: page.view.selectedSO().order_id,
                                    discount: item.discount,
                                    tax: item.tax,
                                    tax_class_no: item.tax_class_no,
                                    quantity: 1,
                                    price: item.price,
                                    tray_id: item.tray_id,
                                    tray_count: 1,
                                    unit: item.unit,
                                    total_price: item.price * 1 + item.tax * item.price * 1
                                };
                                if (!exists(page.controls.grdSOItems.allData(), "item_no", item.item_no)) {
                                    page.controls.grdSOItems.createRow(newItem);
                                    page.controls.grdSOItems.edit(true);
                                    $$("msgPanel").show("Item added successfully!");
                                    page.calculate();
                                }
                            });


                        } else {
                            alert("No price is defined for item:" + item.item_name);
                        }
                    });

                    $$("pnlItemSelectionPopup").close();
                }

            };

            page.controls.pnlItemSelection.load();
        }


        //Print Sales Invoice
        page.events.btnPrintSO_click = function () {

            //pharma print
            //if (CONTEXT.ENABLE_MARKET_SHOPON == "true")
            //    PrintData(page.controls.grdSOItems.allData());
            //else {
            //    page.billService.getBillPrintSO(page.selectedSO.bill_no, function (data) {
            //        PrintingOD(data);
            //    });
            //}
            page.controls.pnlInvoiceSOPopup.close();

            page.controls.pnlPrintingInvoicePopup.open();
            page.controls.pnlPrintingInvoicePopup.title("Select Export Type");
            page.controls.pnlPrintingInvoicePopup.width("500");
            page.controls.pnlPrintingInvoicePopup.height("200");
        }
        page.events.btnPrintJasperBill_click = function () {
            var exp_type = $$("ddlExportType").selectedValue();
            if (exp_type == "" || exp_type == undefined || exp_type == null)
                $$("msgPanel").show("Please select export type");
            page.printJasper(page.PrintBillNo, exp_type);
        }
        page.events.btnInvoicePrintJasperBill_click = function () {
            var exp_type = $$("ddlInvoiceExportType").selectedValue();
            if (exp_type == "" || exp_type == undefined || exp_type == null)
                $$("msgPanel").show("Please select export type");
            page.printJasper(page.controls.lblSOIBillNo.html(), exp_type);
        }
        page.printJasper = function (bill_no, exp_type) {
            var billdata = {
                bill_no: bill_no
            }
            page.billService.getSalesPrint(billdata, function (data) {
                page.events.btnprintInvoiceJson_click(data, exp_type);
            });
        }
        page.events.btnprintInvoiceJson_click = function (billItem, exp_type) {
            var data = billItem[0];
            var bill_item = [];
            var s_no = 0;
            $(billItem).each(function (i, item) {
                s_no = s_no + 1;
                if (item.unit_identity == "1") {
                    item.qty = parseFloat(item.qty) / parseFloat(item.alter_unit_fact);
                    item.free_qty = parseFloat(item.qtyfree_qty) / parseFloat(item.alter_unit_fact);
                }
                bill_item.push({
                    "BillItemNo": s_no,
                    "ProductName": item.item_name,	// nonstandard unquoted field name
                    "Pack": item.packing,	// nonstandard single-quoted field name
                    "Batch": item.batch_no,	// standard double-quoted field name
                    "Exp": item.expiry_date,
                    "Qty": item.qty,
                    "FreeQty": item.free_qty,
                    "Rate": parseFloat(item.price).toFixed(2),
                    "PDis": parseFloat(item.discount).toFixed(2),
                    "MRP": parseFloat(item.mrp).toFixed(2),
                    "Hsn":item.hsn_code,
                    "CGST": parseInt(item.tax_per)+"%",//parseFloat(item.item_gst_tax).toFixed(5),
                    "SGST": parseInt(item.tax_per) + "%",//parseFloat(item.item_gst_tax).toFixed(5),
                    "GValue": parseFloat(item.total_price).toFixed(2)
                });
            });
            var accountInfo =
                        {
                            "BillType": "INVOICE",
                            "CustomerName": data.cust_name,	// standard double-quoted field name
                            "Phone": data.phone_no,
                            "CustAddress": data.address1,
                            "CustCityStreetZipCode": data.address2,
                            "isSalesExe": CONTEXT.ENABLE_SALES_EXECUTIVE,
                            "DLNo": data.license_no,
                            "GST": data.gst_no,
                            "TIN": data.tin_no,
                            "Area": data.sales_exe_area,
                            "SalesExecutiveName": data.sales_exe_name,
                            //"BillNo": data.bill_no,
                            "BillNo": data.bill_id,
                            "BillDate": data.bill_date,
                            "NoofItems": data.no_of_items,
                            "Quantity": data.no_of_qty,
                            "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                            "DiscountAmount": parseFloat(data.tot_discount).toFixed(2),
                            "BCGST": parseFloat(data.tot_gst_tax).toFixed(2),
                            "BSGST": parseFloat(data.tot_gst_tax).toFixed(2),
                            "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(2),
                            "BillAmount": parseFloat(data.total).toFixed(2),
                            "ApplicaName": CONTEXT.COMPANY_NAME,
                            "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1,
                            "CompanyCityStreetPincode": CONTEXT.COMPANY_ADDRESS_LINE2,
                            "CompanyPhoneNoEtc": CONTEXT.COMPANY_PHONE_NO,
                            "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                            "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                            "CompanyGST": CONTEXT.COMPANY_GST_NO,
                            "SSSS": "DUPLICATE",
                            "Original": "ORIGINAL",
                            "RoundAmount": parseFloat(data.round_off).toFixed(2),
                            "BillItem": bill_item
                        };

            //var accountInfo =
            //            {
            //                "CustomerName": "REYREG PHARMACEUTICALS",	// standard double-quoted field name
            //                "Phone": "+917598472250",
            //                "Address": "Sivanthakulam Road,No- 126A,Thoothukudi,TAMIL NADU-628003",
            //                "DLNo": "TNT/146/20B-TNT/135/21B",
            //                "GST": "33AEGPR4598L1ZT",
            //                "TIN": "33425842413",
            //                "Area": "Tuti",
            //                "SalesExecutiveName": "Ravi Thomas_19",
            //                "BillNo": "132",
            //                "BillDate": "19-07-2017",
            //                "NoofItems": "3",
            //                "Quantity": "7",
            //                "BSubTotal": "254.58",
            //                "DiscountAmount": "0.00",
            //                "BCGST": "15.28",
            //                "BSGST": "15.28",
            //                "TaxAmount": "30.55",
            //                "BillAmount": "285.13",
            //                "ApplicaName": "Shopon Dev Region",
            //                "ApplsName": "SHOPON DEV REGION",
            //                "CompanyAddress": "NO.102G/32/4 POLPETTAI TUTICORIN DIST TUTICORIN-628002",
            //                "PhoneNo": "+919345345434",
            //                "CompanyDLNo": "TNT/161/20B-TNT/149/21B",
            //                "CompanyTINNo": "33586450443",
            //                "CompanyGST": "33APOPR2352F1ZV",
            //                "SSSS": "DUPLICATE",
            //                "Original": "ORIGINAL",
            //                "RoundAmount": "0.40",
            //                "BillItem": [
            //                {
            //                    "BillItemNo": "1",
            //                    "ProductName": "IFFCAL",	// nonstandard unquoted field name
            //                    "Pack": "12209",	// nonstandard single-quoted field name
            //                    "Batch": "DVTC-2374",	// standard double-quoted field name
            //                    "Exp": "05/18",
            //                    "Qty": "2.00",
            //                    "FreeQty": "1.00",
            //                    "Rate": "34.65",
            //                    "PDis": "0.00",
            //                    "MRP": "0.00",
            //                    "CGST": "4.16 @ 6%",
            //                    "SGST": "4.16 @ 6%",
            //                    "GValue": "77.62"
            //                },
            //                {
            //                    "BillItemNo": "2",
            //                    "ProductName": "Lion Dates",	// nonstandard unquoted field name
            //                    "Pack": "12209",	// nonstandard single-quoted field name
            //                    "Batch": "PF-1311",	// standard double-quoted field name
            //                    "Exp": "07/18",
            //                    "Qty": "3.00",
            //                    "FreeQty": "1.00",
            //                    "Rate": "32.00",
            //                    "PDis": "0.00",
            //                    "MRP": "0.00",
            //                    "CGST": "5.76 @ 6%",
            //                    "SGST": "5.76 @ 6%",
            //                    "GValue": "107.52"
            //                },
            //                {
            //                    "BillItemNo": "3",
            //                    "ProductName": "Marker",	// nonstandard unquoted field name
            //                    "Pack": "12209",	// nonstandard single-quoted field name
            //                    "Batch": "450",	// standard double-quoted field name
            //                    "Exp": "07/17",
            //                    "Qty": "2.00",
            //                    "FreeQty": "1.00",
            //                    "Rate": "44.64",
            //                    "PDis": "0.00",
            //                    "MRP": "0.00",
            //                    "CGST": "5.36 @ 6%",
            //                    "SGST": "5.36 @ 6%",
            //                    "GValue": "99.99"
            //                }
            //                ]
            //            };
            //var accountInfoJson = JSON.stringify(accountInfo);
            if (page.PrintBillType == "SaleReturn") {
                accountInfo.BillName = "SALES RETURN BILL";
                GeneratePrint("ShopOnDev", "sales-bill-print/main-sales-bill.jrxml", accountInfo, exp_type);
            }
            else {
                accountInfo.BillName = "SALES BILL";
                GeneratePrint("ShopOnDev", "sales-bill-print/main-sales-bill.jrxml", accountInfo, exp_type);
            }
            
        }
        page.events.btnInvoiceSO_click = function () {
            page.controls.pnlInvoiceSOPopup.open();
            page.controls.pnlInvoiceSOPopup.title("Sales Invoice");
            page.controls.pnlInvoiceSOPopup.width(100);
            page.controls.pnlInvoiceSOPopup.height(200);
        }

        page.events.btnSendsms_click = function () {
            if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                try {
                    if ($$("txtContactNo").val() == undefined || $$("txtContactNo").val() == null || $$("txtContactNo").val() == "")
                        throw "Customer cannot have the mobile no";
                    var salesdetails = page.selectedSO;
                    var accountInfo =
                    {
                        "appName": CONTEXT.COMPANY_NAME,

                        "senderNumber": CONTEXT.SMS_SENDER_NO,
                        "companyId": CONTEXT.SMS_COMPANY_ID,
                        "message": //"Hai",
                            "Dear " + salesdetails.cust_name + "," + "\n" +
                            "Your Invoice No is " + [$$("lblSOIBillNo").html()] + " ,\n" +
                            "Your Sales Order No is " + [$$("lblSONo").html()] + " ,\n" +
                            "Your Total Amount is Rs. " + page.controls.lblTotal.value() + "\n" +
                            "Regards as" + CONTEXT.COMPANY_NAME + "",
                        "receiverNumber":
                           // "+919894692492",
                            "+91"+$$("txtContactNo").val(),
                        //"919003300929",
                        //$$("txtReceiverNumber").val(),
                        //"mobileNumber":
                        //"9486342575",
                        //"7338898011",
                    };

                    var accountInfoJson = JSON.stringify(accountInfo);

                    $.ajax({
                        type: "POST",
                        // url: "http://104.251.218.116:8080/woto-utility-rest/rest/sendSMS/text-message",
                        url: CONTEXT.SMSURL,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        crossDomain: false,
                        data: JSON.stringify(accountInfo),
                        dataType: 'json',
                        success: function (responseData, status, xhr) {
                            console.log(responseData);

                            alert("SMS sent successfully...");
                        },
                        error: function (request, status, error) {
                            console.log(request.responseText);

                            alert("SMS sent failed...");
                        }
                    });
                } catch (e) {
                    alert(e);
                }
            } else {
                alert("Sorry your settings block sending messages");
            }

        }
        //Print Return Invoice if any
        page.events.btnReturnPrintSO = function () {

            //page.billService.getBillReturn(page.selectedSO.bill_no, function (data) {
            //page.billService.getBillItem(page.selectedSO.bill_no, function (data) {
            PrintData(page.controls.grdSOItems.allData());
            // });

        }

        //Set the Tax to be used for current sales order.
        page.events.btnTaxOK_click = function () {
            if (page.controls.ddlSalesTax.selectedValue() == -1) {
                page.sales_tax = [];
                page.sales_tax_no = -1;
                page.calculate();
            } else {
                var data = page.controls.ddlSalesTax.selectedData();
                page.sales_tax_no = data.sales_tax_no;
                page.billService.getSalesTaxClass(data.sales_tax_no, function (data) {
                    page.sales_tax = data;
                    page.calculate();
                });
            }
            $$("msgPanel").show("Tax added in current session...");
            page.controls.pnlTaxPopup.close();

        }
        //Remove a ItemDiscount to be used for Current Sales order.
        //page.events.btnTaxRemove_click = function () {
        //    var data = $$("grdTax").selectedData();
        //    if (data.length > 0) {
        //        for (var i = page.tax.length - 1; i >= 0; i--) {
        //            if (page.tax[i].sales_tax_no == data[0].sales_tax_no) {
        //                page.tax.splice(i, 1);
        //            }
        //        }
        //    }
        //    var itemDisount = [];
        //    $(page.tax).each(function (i, data) {
        //        //Get discount for current item and discounts applied to all item
        //        if (typeof data.sales_tax_no != "undefined") {
        //            itemDisount.push(data);
        //        }
        //    });
        //    page.controls.grdTax.dataBind(itemDisount);
        //    page.calculate();
        //    // page.controls.pnlItemDiscountPopup.close();
        //}
        //Add a Discount to be used for Current Sales order.
        page.events.btnDiscountOK_click = function () {

            var data = page.controls.ddlDiscount.selectedData();
            if (typeof data != "undefined") {
                if (data.disc_name != null && (data.disc_name == "Manual Discount of x percent" || data.disc_name == "Manual Discount of x value" || data.disc_name == "Manual discount of x percent in item price" || data.disc_name == "Manual discount of x value in item price")) {
                    confirmManualDisc().then(function (answer) {
                        if (answer == "Ok") {
                            page.discount.push({
                                disc_no: data.disc_no,
                                disc_type: data.disc_type,
                                disc_name: data.disc_name,
                                disc_value: page.manualDiscountValue
                            });
                            page.calculate();
                        }
                    });

                }
                else {
                    page.discount.push({
                        disc_no: data.disc_no,
                        disc_type: data.disc_type,
                        disc_name: data.disc_name,
                        disc_value: data.disc_value
                    });

                    page.calculate();
                }
            }
        }

        //Remove a Discount to be used for Current Sales order.
        page.events.btnDiscountRemove_click = function () {
            //var data = $$("grdDiscount").selectedData();
            //if (data.length > 0) {
            //    for (var i = page.discount.length - 1; i >= 0; i--) {
            //        if (page.discount[i].disc_no == data[0].disc_no && page.discount[i].item_no == data[0].item_no) {
            //            page.discount.splice(i, 1);
            //        }
            //    }
            //    page.calculate();
            //}
            var data = $$("grdDiscount").selectedData();
            if (data.length > 0) {
                for (var i = page.discount.length - 1; i >= 0; i--) {
                    if (page.discount[i].disc_no == data[0].disc_no && page.discount[i].item_no == data[0].item_no) {
                        page.discount.splice(i, 1);
                    }
                }
                page.calculate();
            }
            var itemDisount = [];
            $(page.discount).each(function (i, data) {
                //Get discount for current item and discounts applied to all item
                if (typeof data.item_no == "undefined" || page.discount_item_no == data.item_no) {
                    itemDisount.push(data);
                }
            });
            page.controls.grdItemDiscount.dataBind(itemDisount);
        }

        //Add a discount at item level for the current items. TODO... what is 7?
        page.events.btnItemDiscountOK_click = function () {
            var data = page.controls.ddlItemDiscount.selectedData();

            if (typeof data != "undefined") {
                if (data.disc_name != null && (data.disc_name == "Manual discount of x percent in item price" || data.disc_name == "Manual discount of x value in item price")) {
                    confirmManualDisc().then(function (answer) {
                        if (answer == "Ok") {
                            page.discount.push({
                                disc_no: data.disc_no,
                                disc_type: data.disc_type,
                                disc_name: data.disc_name,
                                disc_value: page.manualDiscountValue,
                                item_no: page.discount_item_no
                            });
                            page.calculate();
                            alert("Discount successfully applied");
                        }
                    });

                }
                else {

                    page.discount.push({
                        disc_no: data.disc_no,
                        disc_type: data.disc_type,
                        disc_name: data.disc_name,
                        disc_value: data.disc_value,
                        item_no: page.discount_item_no
                    });
                    page.calculate();
                    alert("Discount successfully applied");

                }
                var itemDisount = [];
                $(page.discount).each(function (i, data) {
                    //Get discount for current item and discounts applied to all item
                    if (typeof data.item_no == "undefined" || page.discount_item_no == data.item_no) {
                        itemDisount.push(data);
                    }
                });
                page.controls.grdItemDiscount.dataBind(itemDisount);
            }
        }

        //Remove a ItemDiscount to be used for Current Sales order.
        page.events.btnItemDiscountRemove_click = function () {
            var data = $$("grdItemDiscount").selectedData();
            if (data.length > 0) {
                for (var i = page.discount.length - 1; i >= 0; i--) {
                    if (page.discount[i].disc_no == data[0].disc_no && page.discount[i].item_no == data[0].item_no) {
                        page.discount.splice(i, 1);
                    }
                }
                page.calculate();
            }
            var itemDisount = [];
            $(page.discount).each(function (i, data) {
                //Get discount for current item and discounts applied to all item
                if (typeof data.item_no == "undefined" || page.discount_item_no == data.item_no) {
                    itemDisount.push(data);
                }
            });
            page.controls.grdItemDiscount.dataBind(itemDisount);
            // page.controls.pnlItemDiscountPopup.close();
        }

        //#endregion


        //#region "Sales Order - Popups"

        //Show popup for new sales order
        page.events.btnNewSO_click = function () {
            $$("btnAddSOOK").disable(false);
            $$("btnAddSOOK").show();
            page.controls.pnlNewSOPopup.open();

            page.controls.pnlNewSOPopup.title("Create New Sales Order");
            page.controls.pnlNewSOPopup.width(340);
            page.controls.pnlNewSOPopup.height(250);

            // $$("ddlCustomerName").selectedValue("");
            $$("dsExpectedDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
        }

        //Show popup to pay invoice
        page.events.btnPayInvoiceAmount_click = function () {
            $$("btnBillPaySOOK").disable(false);
            $$("btnBillPaySOOK").show();
            page.controls.pnlBillPayPopup.open();
            page.controls.pnlBillPayPopup.title("Make Payment.");
            page.controls.pnlBillPayPopup.width(340);
            page.controls.pnlBillPayPopup.height(350);
            $$("dsBillPayDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));  // Load Current SO when click Pay
            $$("txtPayDesc").value("CurrentSO");
            $$("txtPayAmount").value(page.remainingAmount);
        }

        page.events.btnReturnDeliverySO_click = function () {
            var flag = false;
            var items = [];
            var inventItems = [];
            var newBill = {
                bill_type: "Sale"
            }
            try {
                $(page.controls.grdSOItems.allData()).each(function (index, item) {
                    if (item.fullfilled == undefined || item.fullfilled == null || item.fullfilled == "")
                        item.fullfilled = 0;
                    if (item.delivered == undefined || item.delivered == null || item.delivered == "")
                        item.delivered = 0;
                    if (item.tofullfilled == undefined || item.tofullfilled == null || item.tofullfilled == "")
                        item.tofullfilled = 0;
                    if (item.todelivered == undefined || item.todelivered == null || item.todelivered == "")
                        item.todelivered = 0;

                    if (parseFloat(item.delivered) < parseFloat(item.todelivered)) {
                        throw "Return qty cannot be greater than the delivered qty for item: " + item.item_name + "";
                    }
                    if (isNaN(item.tofullfilled)) {
                        item.tofullfilled = 0;
                    }
                    if (isNaN(item.todelivered) || parseFloat(item.todelivered) < 0) {
                        throw "Delivered qty should be a number and positive for item: " + item.item_name + "";
                    }

                    if (item.todelivered > 0) {
                        flag = true;
                        var ori_deliver_qty = item.delivered;
                        if (item.unit_identity == "1") {
                            item.todelivered = parseFloat(item.todelivered) * parseFloat(item.alter_unit_fact);
                            ori_deliver_qty = parseFloat(ori_deliver_qty) * parseFloat(item.alter_unit_fact);
                        }

                        inventItems.push({
                            var_no: item.var_no,
                            qty: item.todelivered,
                            //vendor_no: page.selectedSO.cust_no,
                            comments: "",
                            trans_type: "SaleReturn",
                            trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            key1: page.selectedSO.bill_no,
                            key2: item.item_no,
                            //FINFACTS ENTRY DATA
                            invent_type: "SaleReturnCredit",
                            finfacts_comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            amount: (parseFloat(item.cost) * parseFloat(item.todelivered)),
                            //batch_no: item.batch_no,
                            //expiry_date: item.expiry_date,
                            //mrp: item.mrp,
                            //variation_name: item.variation_name
                        });

                        items.push({
                            order_item_id: item.order_item_id,
                            var_no: item.var_no,
                            order_id: page.selectedSO.order_id,
                            delivered: parseFloat(ori_deliver_qty) - parseFloat(item.todelivered)
                        });
                    }

                });

                if (flag == false)
                    throw "No items cannot be returned";

                // page.salesService.updateSalesOrderItems(0, items, function () {
                page.salesService.confirmedSalesOrder(page.selectedSO.order_id, page.controls.lblSOConfirmedDate.getDate(), function () {
                    page.salesService.updateSalesOrderItems(0, items, function () {
                        //Make inventory entry
                        newBill.bill_items = inventItems;
                        page.stockAPI.insertStock(newBill, function (data) {
                        //page.inventoryService.insertInventoryItems(0, inventItems, function (data) {

                            page.salesService.getSOItems(page.selectedSO.order_id, function (data) {

                                //Keep the selected Items in page scope
                                page.selectedSOItems = $.util.clone(data);

                                //Bind the selected Items on view
                                page.view.selectedSOItems(data);

                                //Load the stage
                                page.loadSalesOrder(page.selectedSO.order_id, function () {
                                    $$("msgPanel").flash("Sales order is successfully returned");
                                    $$("pnlAddToDeliveryActions").hide();
                                    $$("pnlAddToFullfillActions").hide();
                                    $$("pnlReturnDeliveryActions").hide();
                                    $$("pnlAddToTrayActions").hide();
                                    $$("pnlReturnTrayActions").hide();
                                    $$("pnlItemActions").show();
                                    page.deliveryMode = false;
                                });
                            });
                        });
                    })
                });




            } catch (e) {
                $$("msgPanel").show(e);

            }
        }


        page.events.btnAddToTrayConfirm_click = function () {
            try {
                var trayItems = [];
                $(page.controls.grdSOItems.allData()).each(function (i, item) {
                    if (item.tray_received == undefined || item.tray_received == null || item.tray_received == "")
                        item.tray_received = 0;
                    if (parseFloat(item.tray_received) < 0 || isNaN(item.tray_received))
                        throw "Tray qty should be number and positive";
                    if (parseFloat(item.tray_received) > 0)
                        if (item.tray_id != null)
                            trayItems.push({
                                tray_id: item.tray_id,
                                tray_count: parseInt(item.tray_received),
                                trans_type: "Customer Sales",
                                trans_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                cust_id: page.controls.ddlSOCustomer.selectedValue(),
                                bill_id: page.controls.lblSOIBillNo.html(),
                                store_no: localStorage.getItem("user_store_no")
                            });
                });
                page.trayService.insertEggTrayTransactions(0, trayItems, function (data) {
                    page.loadSalesOrder(page.selectedSO.order_id, function () {
                        $$("msgPanel").show("Tray added successfully...");
                        $$("pnlItemActions").show();
                        $$("pnlAddToTrayActions").hide();
                        $$("pnlReturnDeliveryActions").hide();
                        $$("pnlAddToFullfillActions").hide();
                        $$("pnlAddToDeliveryActions").hide();
                        $$("pnlReturnTrayActions").hide();
                        $$("msgPanel").hide();
                    });
                });

            } catch (e) {
                $$("msgPanel").flash(e);
            }
        }

        page.events.btnReturnTrayConfirm_click = function () {
            try {
                var trayItems = [];
                $(page.controls.grdSOItems.allData()).each(function (i, item) {
                    if (item.tray_received == undefined || item.tray_received == null || item.tray_received == "")
                        item.tray_received = 0;
                    if (parseFloat(item.tray_received) < 0 || isNaN(item.tray_received))
                        throw "Tray qty should be number and positive";
                    if (parseFloat(item.tray_received) > 0)
                        if (item.tray_id != null)
                            trayItems.push({
                                tray_id: item.tray_id,
                                tray_count: parseInt(item.tray_received),
                                trans_type: "Customer Return",
                                trans_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                cust_id: page.controls.ddlSOCustomer.selectedValue(),
                                bill_id: page.controls.lblSOIBillNo.html()
                            });
                });
                page.trayService.insertEggTrayTransactions(0, trayItems, function (data) {
                    page.loadSalesOrder(page.selectedSO.order_id, function () {
                        $$("msgPanel").show("Tray added successfully...");
                        $$("pnlItemActions").show();
                        $$("pnlAddToTrayActions").hide();
                        $$("pnlReturnDeliveryActions").hide();
                        $$("pnlAddToFullfillActions").hide();
                        $$("pnlAddToDeliveryActions").hide();
                        $$("pnlReturnTrayActions").hide();
                        $$("msgPanel").hide();
                    });
                });

            } catch (e) {
                $$("msgPanel").flash(e);
            }
        }

        //Show popup to return pay invoice
        page.events.btnReturnPayInvoiceAmount_click = function () {
            try {
                if (parseFloat(page.controls.lblTotalAmtRemaining.value()) == parseFloat(page.controls.lblTotal.value()))
                    throw "Payment not yet payed";
                page.billService.getReturnedActiveBillByNo(page.selectedSO.order_id, function (data) {
                    $$("ddlReturnBillNo").dataBind(data, "bill_no", "bill_no", "select");
                });
                $$("ddlReturnBillNo").selectionChange(function () {
                    var data = {
                        so_no: page.selectedSO.order_id,
                        bill_no: $$("ddlReturnBillNo").selectedValue()
                    };
                    page.billService.getReturnedBillAmtByNo(data, function (data) {
                        $$("txtReturnBillAmount").value(data[0].total);
                        $$("txtReturnPayAmount").value(data[0].total);
                    });
                });
                page.controls.pnlReturnBillPayPopup.open();
                page.controls.pnlReturnBillPayPopup.title("Make Payment.");
                page.controls.pnlReturnBillPayPopup.width(340);
                page.controls.pnlReturnBillPayPopup.height(550);
                $$("dsReturnBillPayDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));  // Load Current SO when click Pay
                $$("txtReturnPayDesc").value("CurrentSO");
                $$("txtReturnBillAmount").value("0.00");
                $$("txtReturnPayAmount").value("0.00");
            } catch (e) {
                $$("msgPanel").show(e);
            }
        }

        page.events.btnReturnSO_click = function () {
            $$("btnReturnSOItemPopup").disable(false);
            $$("btnReturnSOItemPopup").show();
            page.controls.pnlReturnSOPopup.open();
            page.controls.pnlReturnSOPopup.title("Return Items");
            page.controls.pnlReturnSOPopup.width(1000);
            page.controls.pnlReturnSOPopup.height(450);
            $$("txtSOIReturnBillDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
            page.billService.getReturnedBillByNo(page.selectedSO.order_id, page.controls.lblSOIBillNo.html(), function (rdata) {
                $(rdata).each(function (i, item) {
                    item.qty_returned = item.qty_SaleReturned;
                    item.free_qty_return = item.free_qty_SaleReturn;
                    if (item.free_qty_return == undefined || item.free_qty_return == null || item.free_qty_return == "")
                        item.free_qty_return = 0;
                    if (item.free_qty == undefined || item.free_qty == null || item.free_qty == "")
                        item.free_qty = 0;
                    //item.alter_unit_fact = "1";
                    //if (item.unit_identity == "1") {
                    //    item.ordered_qty = parseFloat(item.ordered_qty) / parseFloat(item.alter_unit_fact);
                    //    item.qty_returned_without_free = parseFloat(item.qty_returned) - parseFloat(item.free_qty_return);
                    //    item.delivered = parseFloat(item.delivered) / parseFloat(item.alter_unit_fact); //- parseFloat(item.free_qty);
                    //    item.qty_returned_without_free = parseFloat(item.qty_returned_without_free) / parseFloat(item.alter_unit_fact);
                    //    item.free_qty_return = parseFloat(item.free_qty_return) / parseFloat(item.alter_unit_fact);
                    //} else {
                    //    item.qty_returned_without_free = parseFloat(item.qty_returned) - parseFloat(item.free_qty_return);
                    //    item.delivered = parseFloat(item.delivered)- parseFloat(item.free_qty);
                    //}
                    item.qty_returned_without_free = parseFloat(item.qty_returned) - parseFloat(item.free_qty_return);
                    item.delivered = parseFloat(item.delivered) - parseFloat(item.free_qty);
                    //dataitems.push({
                    //    batch_no: item.batch_no,
                    //    delivered: parseFloat(item.delivered)-parseFloat(item.free_qty),
                    //    expiry_date: item.expiry_date,
                    //    free_qty: item.free_qty,
                    //    free_qty_return: item.free_qty_return,
                    //    item_name: item.item_name,
                    //    item_no: item.item_no,
                    //    item_price: item.item_price,
                    //    mrp: item.mrp,
                    //    ordered_price: item.ordered_price,
                    //    ordered_qty: item.ordered_qty,
                    //    qty: item.qty,
                    //    qty_returned: parseFloat(item.qty_returned) - parseFloat(item.free_qty_return)
                    //});
                    if (parseInt(item.delivered) > 0)
                        page.view.selectedReturnSOItems(rdata);
                        //page.controls.grdReturnSOItems.createRow(item);
                })

            });
        }
        page.events.btnReturnSOItemPopup_click = function (overrideItems) {
            $$("btnReturnSOItemPopup").disable(true);
            $$("btnReturnSOItemPopup").hide();
            try {
                var itemlList = page.controls.grdReturnSOItems.allData();
                if (typeof overrideItems != "undefined")
                    itemlList = overrideItems;

                var returnItems = [];
                var newBill = {
                    so_no: page.selectedSO.order_id,
                    bill_no:"0",
                    bill_date: dbDateTime($$("txtSOIReturnBillDate").getDate()),
                    store_no: getCookie("user_store_id"),
                    user_no: getCookie("user_id"),
                    reg_no: localStorage.getItem("user_register_id"),

                    sub_total: 0,
                    round_off: 0,
                    total: 0,
                    discount: 0,
                    tax: 0,

                    bill_type: "SaleReturn",
                    state_no: 300, //300 is Return
                    sales_tax_no: "-1",
                    tax:0,
                    //store_no: CONTEXT.store_no,
                    //reg_no: CONTEXT.reg_no,
                    cust_no: page.selectedSO.cust_no,
                    cust_name: $$("ddlSOCustomer").selectedData().cust_name,
                    mobile_no: $$("txtContactNo").value(),
                    email_id: $$("txtEmail").value(),
                    cust_address: $$("txtDeliveryAddress").value().replace(/,/g, '-'),
                    gst_no: $$("txtGst").value(),
                    bill_no_par: $$("lblSOIBillNo").html(),
                    sales_executive: $$("ddlReturnedBy").selectedValue(),
                    //FINFACTS ENTRY DATA
                    invent_type: "SaleReturnCredit",
                    finfacts_comp_id: localStorage.getItem("user_finfacts_comp_id"),
                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                    
                   // store_no: CONTEXT.store_no,
                    //reg_no: CONTEXT.reg_no,
                    //user_no: CONTEXT.user_no,
                    //cust_no: page.selectedSO.cust_no,
                    //sales_tax_no: -1,
                    //delivered_by: $$("ddlReturnedBy").selectedValue(),
                };
                var stockItems = [];
                var lastItemNo = "";
                var lastItem = null;
                var buying_cost = 0;

                var flagNoData = false;
                $(itemlList).each(function (i, item) {
                    if (typeof overrideItems != "undefined")
                        item.ret_qty = parseFloat(item.qty) - parseFloat(item.qty_returned);

                    //Set default value if empty
                    if (item.ret_qty == null || item.ret_qty == "" || typeof item.ret_qty == "undefined") {
                        item.ret_qty = 0;
                    }
                    if (item.ret_free == null || item.ret_free == "" || typeof item.ret_free == "undefined") {
                        item.ret_free = 0;
                    }
                    if (item.free_qty_return == null || item.free_qty_return == "" || typeof item.free_qty_return == "undefined") {
                        item.free_qty_return = 0;
                    }
                    if (item.free_qty == null || item.free_qty == "" || typeof item.free_qty == "undefined") {
                        item.free_qty = 0;
                    }

                    //Validate number and non negative
                    if (isNaN(item.ret_qty) || parseFloat(item.ret_qty) < 0) //If not a number or negative set flag=1
                        throw "Quantity to return should be a number and non negative.";
                    if (isNaN(item.ret_free) || parseFloat(item.ret_free) < 0) //If not a number or negative set flag=1
                        throw "Free quantity to return should be a number and non negative.";

                    //Set if delivered to be 0 when the delivered not yet started
                    if (item.delivered == undefined || item.delivered == null || item.delivered == "" || isNaN(item.delivered))
                        item.delivered = 0;
                    if (parseFloat(item.free_qty) < (parseFloat(item.free_qty_return) + parseFloat(item.ret_free)))
                        throw "Free qty cannot be greater than the total free qty";

                    if (parseFloat(item.ret_qty) > 0 || parseFloat(item.ret_free) > 0) {

                        flagNoData = true;

                        if ((parseFloat(item.delivered)+parseFloat(item.free_qty)) < (parseFloat(item.free_qty_return) + parseFloat(item.ret_free) + parseFloat(item.ret_qty) + parseFloat(item.qty_returned_without_free))) //If not a number or negative set flag=1
                            throw "Total return quantity cannot be greater than stocked quantity.";

                        if (item.unit_identity == "1") {
                            item.ret_qty = parseFloat(item.ret_qty) * parseFloat(item.alter_unit_fact);
                            item.ret_free = parseFloat(item.ret_free) * parseFloat(item.alter_unit_fact);
                        }
                        //Add list for inventory transaction
                        stockItems.push(item);
                        var tax = (parseFloat(item.ret_qty) * parseFloat(item.item_price)) * (item.tax_per / 100);
                        newBill.tax = newBill.tax + tax;
                        buying_cost = buying_cost + parseFloat(item.cost) * (parseFloat(item.ret_qty) + parseFloat(item.ret_free));


                        //Add list for return bill with total item returned (when multiple mrp exists)
                        if (lastItemNo != item.item_no) {
                            lastItem = item;
                            lastItem.fin_ret_qty = parseFloat(item.ret_qty);
                            lastItem.fin_ret_free = parseFloat(item.ret_free);
                            lastItem.fin_total_price = parseFloat(item.ret_qty) * parseFloat(item.item_price);
                            lastItem.sum_qty_returned = parseFloat(item.qty_returned);
                            returnItems.push(item);
                            lastItemNo = item.item_no;
                            lastItem.fin_cost = parseFloat(item.cost);
                        }
                        else {
                            lastItem.fin_ret_qty = parseFloat(lastItem.fin_ret_qty) + parseFloat(item.ret_qty);
                            lastItem.fin_ret_free = parseFloat(lastItem.fin_ret_free) + parseFloat(item.ret_free);
                            lastItem.fin_total_price = parseFloat(lastItem.fin_ret_qty) * parseFloat(item.item_price);
                            lastItem.sum_qty_returned = lastItem.sum_qty_returned + parseFloat(item.qty_returned);
                            lastItem.fin_cost = parseFloat(item.cost);
                        }

                        if (typeof overrideItems != "undefined") {
                            //For bill overriding. Return all item bill but Destock only stocked item
                            lastItem.fin_ret_qty = parseFloat(item.ordered_qty) - parseFloat(lastItem.sum_qty_returned);
                            lastItem.fin_ret_free = parseFloat(item.free_qty) - parseFloat(lastItem.free_qty_return);
                            lastItem.fin_total_price = parseFloat(item.fin_ret_qty) * parseFloat(item.item_price);
                            //Calculate bill total value
                            newBill.sub_total = newBill.sub_total + parseFloat(lastItem.fin_ret_qty) * parseFloat(item.item_price);
                            newBill.total = newBill.sub_total + newBill.tax;
                            lastItem.fin_cost = parseFloat(item.cost);
                        } else {
                            //Calculate bill total value
                            newBill.sub_total = newBill.sub_total + parseFloat(item.ret_qty) * parseFloat(item.item_price);
                            newBill.total = Math.round(parseFloat(newBill.sub_total + newBill.tax));
                        }
                    }
                });

                if (flagNoData == false)
                    throw "No return quantity is specified";
                    var rbillItems = [];
                    $(returnItems).each(function (i, billItem) {
                        rbillItems.push({
                            qty: billItem.fin_ret_qty,
                            free_qty: billItem.fin_ret_free,
                            unit_identity: billItem.unit_identity,
                            price: billItem.item_price,
                            discount: 0,
                            taxable_value: (parseFloat(billItem.fin_total_price) * parseFloat(billItem.tax_per)) / 100,
                            tax_per: billItem.tax_per,
                            total_price: billItem.fin_total_price,
                            bill_type: "SaleReturn",
                            tax_class_no: (billItem.tax_class_no == null) ? "0" : billItem.tax_class_no,
                            price_no:billItem.price_no,
                            hsn_code: (billItem.hsn_code == null) ? "0" : billItem.hsn_code,
                            cgst: (billItem.cgst == null) ? "0" : billItem.cgst,
                            sgst: (billItem.sgst == null) ? "0" : billItem.sgst,
                            igst: (billItem.igst == null) ? "0" : billItem.igst,
                            var_no: billItem.var_no,
                            amount: parseFloat(billItem.item_price) * (parseFloat(billItem.fin_ret_qty) + parseFloat(billItem.fin_ret_free)),
                        });
                    });


                    newBill.bill_items = rbillItems;
                    page.stockAPI.insertBill(newBill, function (data) {
                        page.currentReturnBillNo = data;
                        var inventItems = [];
                        $(stockItems).each(function (i, billItem) {
                            inventItems.push({
                                var_no: billItem.var_no,
                                qty: parseFloat(billItem.ret_qty) + parseFloat(billItem.ret_free),
                                trans_type: "SaleReturn",
                                trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                key1: page.currentReturnBillNo,
                                key2: billItem.item_no,
                                //FINFACTS ENTRY DATA
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                invent_type: "SaleReturnCredit",
                                description: "SaleReturn" + page.currentReturnBillNo,
                                amount: parseFloat(billItem.cost) * parseFloat(billItem.ret_qty),
                                comp_id: localStorage.getItem("user_finfacts_comp_id")
                            });
                        });

                        //TODO Tray entry is missing on return
                        //Insert stock
                        page.stockAPI.insertAllStockVar(0, inventItems, function (data) {
                        //page.inventoryService.insertInventoryItems(0, inventItems, function (data1) {

                            page.loadSalesOrder(page.selectedSO.order_id, function () {

                                $$("msgPanel").show("Sales order is successfully returned. A new return bill is generated with bill no " + page.currentReturnBillNo);

                            });

                            //page.events.btnReturnSO_click();
                            var round_off = (parseFloat(newBill.sub_total) - parseFloat(newBill.discount) + parseFloat(newBill.tax))
                            var s_with_tax = (parseFloat(newBill.sub_total) - parseFloat(newBill.discount));//- parseFloat($$("lblRndOff").value());
                            var ori_round_off=parseFloat(Math.round(parseFloat(round_off)) - parseFloat(round_off)).toFixed(5);
                            var data1 = {
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                description: "Sales Order Return-" + page.selectedSO.order_id,
                                jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                sales_with_out_tax: parseFloat(s_with_tax).toFixed(5),
                                tax_amt: parseFloat(newBill.tax).toFixed(5),
                                buying_cost: buying_cost,
                                round_off: (parseFloat(ori_round_off) > 0) ? (parseFloat(ori_round_off)) : (parseFloat(ori_round_off)),
                                key_1: page.currentReturnBillNo,
                                key_2: $$("ddlSOCustomer").selectedValue(),
                                
                            };
                            if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                $$("msgPanel").show('Updating Finfacts!');

                                //page.finfactsService.insertCreditReturnSales(data1, function (response) {
                                page.finfactsEntry.creditReturnSales(data1, function (response) {
                                    page.events.btnReturnSO_click();
                                    // page.loadJournal();
                                    alert('Successfully returned!');
                                    $$("btnReturnSOItemPopup").disable(false);
                                    $$("btnReturnSOItemPopup").show();
                                });
                            }
                            if (CONTEXT.ENABLE_SALES_EXECUTIVE_REWARD == true) {
                                var newItem = {};
                                var sales_executive_no = page.controls.ddlDeliveryBy.selectedValue();
                                if (sales_executive_no != "-1")
                                    page.salesExecutiveRewardService.getSalesExecutiveById(sales_executive_no, function (data) {
                                        page.salesExecutiveRewardService.getRewardById(data[0].reward_plan_id, function (data2) {
                                            if (data2.length != 0) {
                                                page.billService.getBill(page.currentReturnBillNo, function (data1) {
                                                    newItem.sales_executive_no = sales_executive_no;
                                                    newItem.reward_plan_id = data[0].reward_plan_id;
                                                    newItem.bill_no = data1[0].bill_no;
                                                    newItem.trans_date = data1[0].bill_date;
                                                    newItem.points = data1[0].total / data2[0].reward_plan_point;
                                                    newItem.trans_type = "Debit";
                                                    newItem.description = "Debit";
                                                    newItem.setteled_amount = parseFloat(data1[0].total * data2[0].reward_plan_point) / 4;
                                                    page.salesExecutiveRewardService.insertSalesExecutiveRewardt(newItem, function (data) {
                                                        //page.msgPanel.show("Points added successfully.");
                                                    });
                                                });
                                            } else {
                                                //page.msgPanel.show("Sales Executive cannot have reward plans.");
                                            }
                                        });
                                    });
                            }
                            $$("msgPanel").hide();

                        });

                        //page.purchaseBillService.getBillByPO(page.currentPO.po_no, function (data) {
                        //    page.controls.grdBillTransactions.dataBind(data);
                        //});
                    });
               // });

            } catch (e) {
                alert(e);
                $$("btnReturnSOItemPopup").disable(false);
                $$("btnReturnSOItemPopup").show();
            }
        }

        /*
        try{
        var ret_data = [];
        var tot_amount = 0;
        var count1 = 0;

        $(page.controls.grdReturnSOItems.allData()).each(function (i, item) {


            if (parseFloat(item.ret_qty) == 0) {
                count1++;
            }


            if (parseFloat(item.ret_qty) > 0) {
                ret_data.push({
                    item_no: item.item_no,
                    item_name: item.item_name,
                    qty: item.qty,
                    batch_no: item.batch_no,
                    price: item.price,
                    discount: item.discount,
                    expiry_date: item.expiry_date,
                    mrp: item.mrp,
                    unit: item.unit,
                    tax_per: item.tax_per,
                    ret_qty: item.ret_qty,
                    total_price: item.total_price,
                    rtn_qty: item.rtn_qty,
                    amount: item.amount
                })
                tot_amount = parseFloat(tot_amount) + (parseFloat(item.amount) / parseFloat(item.qty)) * (parseFloat(item.ret_qty));
            }
        });
        var selItem = $$("grdReturnSOItems").allData();
     //   var count = 0;
        if (count1 == ($$("grdReturnSOItems").allData()).length) {
            throw "No items to be selected";
        }
        else {
            $(page.controls.grdReturnSOItems.allData()).each(function (index, item) {
                if (item.delivered == undefined || item.delivered == null || item.delivered == "")
                    item.delivered = 0;
                if (parseFloat(item.delivered) < parseFloat(item.rtn_qty) + parseFloat(item.ret_qty)) {
                    throw "QTy Returned Is Lesser Than The Qty Delivered For The Item: "+item.item_name+"";
                 //   count++;
                }
                if (isNaN(item.ret_qty)) {
                    throw "Qty is Number For Item: "+item.item_name+"";
                 //   count++;
                }
                if (parseFloat(item.ret_qty)<0) {
                    throw "Qty is Not Negative For Item"+item.item_name+"";
                    //   count++;
                }
            });
          //  if (count == 0) {
                //Prepare bill data
                var newBill = {
                    so_no: page.selectedSO.order_id,
                    store_no: CONTEXT.store_no,
                    reg_no: CONTEXT.reg_no,
                    user_no: CONTEXT.user_no,

                    sub_total: tot_amount,
                    total: tot_amount,
                    discount: 0,
                    tax: 0,

                    bill_type: "Return",
                    cust_no: page.selectedSO.cust_no,
                    state_no: 300, //300 is return               
                    return_bill_no: page.selectedSO.bill_no,
                    sales_tax_no: page.sales_tax_no,



                };

                $$("msgPanel").show("Returning Bills...");
                //Create a new Bill
                page.billService.insertBill(newBill, function (data) {
                    page.currentBillNo = data[0].key_value
                    //Prepare for invoice payment
                    var billSO = {
                        collector_id: CONTEXT.user_no,  //TODO  leave it null
                        pay_desc: "Return of bill " + page.selectedSO.bill_no,
                        amount: page.controls.lblTotal.value(),
                        bill_id: page.currentBillNo,
                        pay_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                        pay_type: "Return"
                    };

                    $$("msgPanel").show("Returning Payments...");
                    //Pay for the correstponding bill_no
                    //   page.salesService.payInvoiceBillSalesOrder(billSO, function (data) {

                    //If finfacts module is enabled then make entry in finfacts.
                    if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                        var data1 = {
                            per_id: CONTEXT.PeriodId,
                            target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                            amount: tot_amount,
                            description: "Sales Order Return -" + page.selectedSO.order_id,
                            jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                            key_1: $$("lblSOIBillNo").html(),
                            comp_id: CONTEXT.CompanyName
                        };
                        $$("msgPanel").show("Updating Finfacts...");
                        page.finfactsService.insertCreditReturnSales(data1, function (response) {

                        });
                    } else { }
                    //Get original bill and do return bill
                    var rbillItems = [];
                    $(ret_data).each(function (i, data) {
                        rbillItems.push({
                            bill_no: page.currentBillNo,
                            item_no: data.item_no,
                            qty: data.ret_qty,
                            price: data.price,
                            qty_returned: data.ret_qty,
                            //tax_class_no: billItem.tax_class_no,
                            tax_per: 0,
                            discount: 0,
                            total_price: (parseFloat(data.amount) / parseFloat(data.qty)) * (parseFloat(data.ret_qty))
                        });
                    });
                    //Insert bill items one by one
                    page.billService.insertAllBillItems(page.currentBillNo, 0, rbillItems, function () {

                        //Update bill no in sales order
                        page.salesService.updateReturnBillNo({ order_id: page.selectedSO.order_id, return_bill_no: page.currentBillNo }, function () {

                            //Prepare inventory data reversal
                            var inventItems = [];
                            $(rbillItems).each(function (i, data) {
                                inventItems.push({
                                    item_no: data.item_no,
                                    cost: data.price,   //TODO : Price why needed
                                    qty: data.qty,
                                    vendor_no: page.selectedSO.cust_no,
                                    comments: "",
                                    invent_type: "Sale Return",
                                    key1: page.currentBillNo
                                });
                            });



                            $$("msgPanel").show("Returning Stock...");
                            //Make inventory entry
                            page.inventoryService.insertInventoryItems(0, inventItems, function () {
                                if (CONTEXT.ENABLE_MODULE_TRAY == true) {

                                    //Prepare trayItems
                                    var trayItems = [];
                                    $(page.controls.grdSOItems.allData()).each(function (index, item) {
                                        if (item.tray_id != '' && item.tray_id != undefined) {
                                            var trayTrans = {
                                                tray_count: item.tray_count,
                                                trans_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                trans_type: 'Customer Return',
                                                tray_id: item.tray_id,
                                                cust_id: page.selectedSO.cust_no,
                                                bill_id: page.currentBillNo,   //TODO : billno or so no
                                            };
                                            trayItems.push(trayTrans);
                                        }
                                    });

                                    $$("msgPanel").show("Returning Tray...");
                                    //Make tray entry
                                    page.trayService.insertEggTrayTransactions(0, trayItems, function () {

                                        //If state is Paid then need to rever payment also in journal and payment_t then 

                                        $$("msgPanel").show("Reloading data...");
                                        //reload sales order
                                        page.loadSalesOrder(page.selectedSO.order_id, function () {
                                           
                                            $$("msgPanel").show("Sales order is successfully Returned. A new return bill is generated with bill no " + page.currentBillNo);

                                        });
                                    })
                                } else {
                                    //reload data
                                    //reload sales order
                                    $$("msgPanel").show("Reloading data...");
                                    page.loadSalesOrder(page.selectedSO.order_id, function () {
                                       
                                        $$("msgPanel").show("Sales order is successfully Returned. A new return bill is generated with bill no " + page.currentBillNo);

                                    });
                                }
                                page.controls.pnlReturnSOPopup.close();
                            })
                        });
                    });
                    //  });
                });
          //  }
        }
    }catch(e){
        alert(e);
       
    }
*/




        page.events.btnReturnDeliverySOPopup_click = function () {
            var ret_data = [];
            var tot_amount = 0;
            var count1 = 0;
            $(page.controls.grdReturnDeliverySOItems.allData()).each(function (i, item) {
                if (parseFloat(item.return_delivery) == 0) {
                    count1++;
                }
                else {
                    ret_data.push({
                        item_no: item.item_no,
                        item_name: item.item_name,
                        qty: item.quantity,
                        batch_no: item.batch_no,
                        price: item.price,
                        discount: item.discount,
                        expiry_date: item.expiry_date,
                        mrp: item.mrp,
                        unit: item.unit,
                        tax_per: item.tax_per,
                        ret_qty: item.return_delivery,
                        total_price: item.total_price,
                        //rtn_qty: item.rtn_qty,
                        amount: item.amount
                    })
                    tot_amount = parseFloat(tot_amount) + (parseFloat(item.amount) / parseFloat(item.qty)) * (parseFloat(item.ret_qty));
                }
            });
            var selItem = $$("grdReturnDeliverySOItems").allData();
            var count = 0;
            if (count1 == ($$("grdReturnDeliverySOItems").allData()).length) {
                alert("No items to be selected");
            }
            else {
                page.currentBillNo = page.controls.lblSOIBillNo.html();
                //Get original bill and do return bill
                var rbillItems = [];
                $(ret_data).each(function (i, data) {
                    rbillItems.push({
                        bill_no: page.currentBillNo,
                        item_no: data.item_no,
                        qty: data.ret_qty,
                        price: data.price,
                        qty_returned: data.ret_qty,
                        //tax_class_no: billItem.tax_class_no,
                        tax_per: 0,
                        discount: 0,
                        total_price: (parseFloat(data.amount) / parseFloat(data.qty)) * (parseFloat(data.ret_qty))
                    });
                    //Prepare inventory data reversal
                    var inventItems = [];
                    $(rbillItems).each(function (i, data) {
                        inventItems.push({
                            item_no: data.item_no,
                            cost: data.price,   //TODO : Price why needed
                            qty: data.qty,
                            vendor_no: page.selectedSO.cust_no,
                            comments: "",
                            invent_type: "SaleReturn",
                            key1: page.currentBillNo
                        });
                    });

                    $$("msgPanel").show("Returning Stock...");
                    //Make inventory entry
                    page.inventoryService.insertInventoryItems(0, inventItems, function () {
                        //if (CONTEXT.ENABLE_MODULE_TRAY == true) {

                        //    //Prepare trayItems
                        //    var trayItems = [];
                        //    $(page.controls.grdSOItems.allData()).each(function (index, item) {
                        //        if (item.tray_id != '' && item.tray_id != undefined) {
                        //            var trayTrans = {
                        //                tray_count: item.tray_count,
                        //                trans_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                        //                trans_type: 'Customer Return',
                        //                tray_id: item.tray_id,
                        //                cust_id: page.selectedSO.cust_no,
                        //                bill_id: page.currentBillNo,   //TODO : billno or so no
                        //            };
                        //            trayItems.push(trayTrans);
                        //        }
                        //    });

                        //    $$("msgPanel").show("Returning Tray...");
                        //    //Make tray entry
                        //    page.trayService.insertEggTrayTransactions(0, trayItems, function () {

                        //        //If state is Paid then need to rever payment also in journal and payment_t then 

                        //        $$("msgPanel").show("Reloading data...");
                        //        //reload sales order
                        //        page.loadSalesOrder(page.selectedSO.order_id, function () {

                        //            $$("msgPanel").show("Sales order is successfully Returned. A new return bill is generated with bill no " + page.currentBillNo);

                        //        });
                        //        $$("msgPanel").hide();
                        //    })
                        //} else {
                        //    //reload data
                        //    //reload sales order
                        //    $$("msgPanel").show("Reloading data...");
                        //    page.loadSalesOrder(page.selectedSO.order_id, function () {

                        //        $$("msgPanel").show("Sales order is successfully Returned. A new return bill is generated with bill no " + page.currentBillNo);

                        //    });
                        //    $$("msgPanel").hide();
                        //}
                        page.controls.pnlReturnDeliveryPopup.close();
                    })
                });
            }
        }


        //Show popup to add discount at item level
        page.events.itemDiscountClick = function () {

            page.controls.pnlItemDiscountPopup.open();
            page.controls.pnlItemDiscountPopup.title("Discount(s) applied for item");
            page.controls.pnlItemDiscountPopup.width(800);
            page.controls.pnlItemDiscountPopup.height(400);


            page.controls.grdItemDiscount.width("100%");
            page.controls.grdItemDiscount.height("220px");
            page.controls.grdItemDiscount.setTemplate({
                selection: "Single",

                columns: [
                    { 'name': "Disc No", 'width': "100px", 'dataField': "disc_no" },
                    { 'name': "Disc Name", 'width': "200px", 'dataField': "disc_name" },
                    { 'name': "Disc Type", 'width': "150px", 'dataField': "disc_type" },
                    { 'name': "Item No", 'width': "150px", 'dataField': "item_no" },

                ]
            });
            var itemDisount = [];
            $(page.discount).each(function (i, data) {
                //Get discount for current item and discounts applied to all item
                if (typeof data.item_no == "undefined" || page.discount_item_no == data.item_no) {
                    itemDisount.push(data);
                }
            });
            page.controls.grdItemDiscount.dataBind(itemDisount);

            if (page.selectedSO.state_text != "Created") {
                $$("btnItemDiscountOK").hide();
                $$("btnItemDiscountRemove").hide();
            }
            else {
                $$("btnItemDiscountOK").show();
                $$("btnItemDiscountRemove").show();
            }

        }

        page.events.btnSendMail_click = function () {
            if (CONTEXT.ENABLE_EMAIL == "true") {
                try {
                    var orderdetails = page.selectedSO;
                    var itemLists = [];
                    if (orderdetails.email == undefined || orderdetails.email == "" || orderdetails.email == null)
                        throw "Customer cannot have the email id";
                    page.customerService.getTotalPoints(orderdetails.cust_no, function (data, callback) {
                        $(page.controls.grdSOItems.allData()).each(function (i, item) {
                            itemLists.push({ "itemNo": item.item_no, "itemName": item.item_name, "qty": item.quantity, "unit": item.unit, "price": item.price, "discount": item.discount, "totalPrice": item.total_price });
                        });
                        // page.controls.grdSOItems.allData()
                        var accountInfo = {
                            "billNo": orderdetails.bill_no,
                            "appName": CONTEXT.COMPANY_NAME,
                            "companyId": localStorage.getItem("user_company_id"),
                            "orderedDate": page.controls.lblSOOrderedDate.getDate(),
                            "deliveredDate": page.controls.lblSODeliveredDate.getDate(),
                            "expectedDate": page.controls.dsSOExpectedDate.getDate(),
                            "salesOrderNo": orderdetails.order_id,
                            "salesOrderStatus": orderdetails.state_text,
                            "shippingAddress": orderdetails.shipping_address,
                            "deliveryAddress": orderdetails.delivery_address,
                            "clientAddress": CONTEXT.ClientAddress,
                            "customerNumber": orderdetails.cust_no,
                            "customerName": orderdetails.cust_name,
                            "tax": page.controls.lblTax.value(),
                            "subTotal": page.controls.lblTotal.value(),
                            "discount": page.controls.lblDiscount.value(),
                            "totalPaid": orderdetails.total_paid_amount,
                            "totalRewardPoint": data[0].points,
                            "emailAddressList": [orderdetails.email],
                            //["wototech@outlook.com"],
                            // [orderdetails.email],
                            //["sam.info85@gmail.com"],
                            //["immanuvel.kalaiarasan@gmail.com"],
                            //[//"sundaralingam48@gmail.com","wototech@outlook.com","balumanoj85@gmail.com"],
                            "billItemList": itemLists
                            /* [{"itemNo": "1",
                             "itemName": "Chocolate Cookies",
                             "qty": "10",
                             "unit": "Kilogram",
                             "price": "23.00",
                             "discount": "2",
                             "totalPrice": "230"}]*/

                        };
                        var accountInfoJson = JSON.stringify(accountInfo);

                        $.ajax({
                            type: "POST",
                            //  url: "http://104.251.218.116:8080/woto-utility-rest/rest/sendEmail/sales-order",
                            url: CONTEXT.ENABLE_SMS_URL,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            crossDomain: false,
                            data: JSON.stringify(accountInfo),
                            dataType: 'json',
                            success: function (responseData, status, xhr) {
                                console.log(responseData);

                                alert("Email Sent Successfully..." + orderdetails.cust_name + " " + orderdetails.email + " " + CONTEXT.COMPANY_NAME);
                            },
                            error: function (request, status, error) {
                                console.log(request.responseText);

                                alert("Email Sent Failed..." + orderdetails.cust_name + " " + orderdetails.email + " " + CONTEXT.COMPANY_NAME);
                            }
                        });
                    });
                    //});

                    //});
                } catch (e) {
                    alert(e);
                }
            } else {
                alert("Sorry!.. Your settings blocks email sending");
            }
        }


        //Show popup to set tax
        page.events.lblTaxLabel_click = function () {
            page.controls.pnlTaxPopup.open();
            page.controls.pnlTaxPopup.title("Tax Selection");
            page.controls.pnlTaxPopup.width(650);
            page.controls.pnlTaxPopup.height(150);

            $$("ddlSalesTax").selectedValue(page.sales_tax_no);
            if (page.selectedSO.state_text != "Created") {

                $$("btnTaxOK").hide();

            }
            else {
                $$("btnTaxOK").show();

            }


        }

        //Show popup to add discount
        page.events.lblDiscountLabel_click = function () {
            page.controls.pnlDiscountPopup.open();
            page.controls.pnlDiscountPopup.title("Discount(s) applied for bill");
            page.controls.pnlDiscountPopup.width(800);
            page.controls.pnlDiscountPopup.height(400);


            page.controls.grdDiscount.width("100%");
            page.controls.grdDiscount.height("220px");
            page.controls.grdDiscount.setTemplate({
                selection: "Single",

                columns: [
                    { 'name': "Disc No", 'width': "100px", 'dataField': "disc_no" },
                    { 'name': "Disc Name", 'width': "200px", 'dataField': "disc_name" },
                    { 'name': "Disc Type", 'width': "150px", 'dataField': "disc_type" },
                    { 'name': "Item No", 'width': "150px", 'dataField': "item_no" },
                ]
            });
            page.controls.grdDiscount.dataBind(page.discount);

            if (page.selectedSO.state_text != "Created") {
                $$("btnDiscountOK").hide();
                $$("btnDiscountRemove").hide();
            }
            else {
                $$("btnDiscountOK").show();
                $$("btnDiscountRemove").show();
            }
        }




        page.events.btnReturnDelivery_click = function () {
            $$("pnlReturnDeliveryActions").show();
            $$("pnlAddToFullfillActions").hide();
            $$("pnlAddToDeliveryActions").hide();
            $$("pnlAddToTrayActions").hide();
            $$("pnlReturnTrayActions").hide();
            $$("pnlItemActions").hide();

            page.deliveryMode = true;
            page.view.selectedSOItems(page.currentSOItems);
            page.deliveryMode = false;
        }


        page.events.btnReturnDeliveryCancel_click = function () {
            $$("pnlReturnTrayActions").hide();
            $$("pnlAddToDeliveryActions").hide();
            $$("pnlAddToFullfillActions").hide();
            $$("pnlReturnDeliveryActions").hide();
            $$("pnlAddToTrayActions").hide();
            $$("pnlItemActions").show();
            // page.deliveryMode = false;
            page.view.selectedSOItems(page.currentSOItems);
        }
        page.events.btnAddToTrayCancel_click = function () {
            $$("pnlReturnTrayActions").hide();
            $$("pnlAddToDeliveryActions").hide();
            $$("pnlAddToFullfillActions").hide();
            $$("pnlReturnDeliveryActions").hide();
            $$("pnlAddToTrayActions").hide();
            $$("pnlItemActions").show();
            // page.deliveryMode = false;
            page.view.selectedSOItems(page.currentSOItems);
        }
        page.events.btnReturnTrayCancel_click = function () {
            $$("pnlReturnTrayActions").hide();
            $$("pnlAddToDeliveryActions").hide();
            $$("pnlAddToFullfillActions").hide();
            $$("pnlReturnDeliveryActions").hide();
            $$("pnlAddToTrayActions").hide();
            $$("pnlItemActions").show();
            // page.deliveryMode = false;
            page.view.selectedSOItems(page.currentSOItems);
        }

        page.events.btnPendingPayment_click = function () {
            $$("lblTotalAmount").value("0");
            $$("txtReceivedAmount").value("0");
            $$("txtReceivedAmount").disable(false);
            $$("btnPayPending").disable(false);
            $$("btnPayPending").show();
            page.controls.pnlPayPending.open();
            page.controls.pnlPayPending.title("Pending Payment Screen");
            page.controls.pnlPayPending.width(1200);
            page.controls.pnlPayPending.height(500);
            page.view.selectedPendingPayment([]);
            $$("pnlCardType").hide();
            $$("pnlCouponNo").hide();
            $$("pnlCardNo").hide();
            $$("txtSearchBillNo").focus();
            $$("ddlBillView").selectedValue("Bill View");
            $$("ddlPayBillType").selectedValue("Select");
            
            page.customerService.getActiveCustomer("", function (data) {
                $$("ddlCustName").dataBind(data, "cust_no", "cust_name", "All");
            });

            $$("txtPendingPayDesc").value("CurrentBill");
            $$("dsPendingPayDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));

            $$("ddlCustName").selectionChange(function () {
                $$("ddlPayBillType").selectedValue("Select");
                $$("ddlBillView").selectedValue("Bill View");
            });
            $$("ddlBillView").selectionChange(function () {
                $$("lblTotalAmount").value("0");
                $$("txtReceivedAmount").value("0");
                var loan_data = {};
                loan_data.cust_no = $$("ddlCustName").selectedValue() == -1 ? "" : $$("ddlCustName").selectedValue();
                loan_data.bill_type = ($$("ddlPayBillType").selectedValue() == "Select") ? "" : $$("ddlPayBillType").selectedValue();

                if ($$("ddlBillView").selectedValue() == "Payment View") {
                    $$("pnlPendingReceivedAmount").hide();
                    $$("pnlPendingPayButton").hide();
                    $$("pnlPendingPaidAmount").hide();
                    page.billService.getPaymentWise(loan_data, function (data) {
                        page.view.selectedPendingPayment(data);
                        page.controls.grdPendingPayment.edit(false);
                    });

                }
                else {
                    $$("pnlPendingReceivedAmount").show();
                    $$("pnlPendingPayButton").show();
                    $$("pnlPendingPaidAmount").hide();
                    var filter = {};
                    filter.viewMode = "Standard";
                    filter.fromDate = "";
                    filter.toDate = "";
                    filter.cust_no = "";
                    filter.bill_type = ($$("ddlPayBillType").selectedValue() == "Select") ? "" : $$("ddlPayBillType").selectedValue();
                    filter.item_no = "";
                    filter.status = "";
                    filter.cust_no = $$("ddlCustName").selectedValue() == -1 ? "" : $$("ddlCustName").selectedValue();
                    //$$("msgPanel").show("Loading...");
                    var payment_data = [];
                    page.billService.getPendingReport(filter, function (data) {
                        //page.dynaReportService.getSalesReport(filter, function (data) {
                        $(data).each(function (i, item) {
                            if (parseFloat(item.total) != parseFloat(item.total_paid_amount)) {
                                payment_data.push({
                                    bill_no: item.bill_no,
                                    bill_date: item.bill_date,
                                    bill_type: item.bill_type,
                                    cust_no: item.cust_no,
                                    cust_name: item.cust_name,
                                    total: item.total,
                                    total_paid_amount: item.total_paid_amount,
                                    expense_amt: item.expense,
                                    balance: parseFloat(item.total) - parseFloat(item.total_paid_amount)
                                })
                            }
                        })
                        page.view.selectedPendingPayment(payment_data);
                    });
                }
            });
            $$("ddlPayBillType").selectionChange(function () {
                $$("ddlBillView").selectedValue("Bill View");
                $$("lblTotalAmount").value(parseFloat(0));
                $$("txtReceivedAmount").value(parseFloat(0));
                //Get the all bill details
                var filter = {};
                filter.viewMode = "Standard";
                filter.fromDate = "";
                filter.toDate = "";
                filter.bill_type = ($$("ddlPayBillType").selectedValue() == "Select") ? "" : $$("ddlPayBillType").selectedValue();
                filter.item_no = "";
                filter.status = "";
                filter.cust_no = $$("ddlCustName").selectedValue() == -1 ? "" : $$("ddlCustName").selectedValue();
                //$$("msgPanel").show("Loading...");
                var payment_data = [];
                page.billService.getPendingReport(filter, function (data) {
                    //page.dynaReportService.getSalesReport(filter, function (data) {
                    $(data).each(function (i, item) {
                        if (parseFloat(item.total) != parseFloat(item.total_paid_amount)) {
                            payment_data.push({
                                bill_no: item.bill_no,
                                bill_date: item.bill_date,
                                bill_type: item.bill_type,
                                cust_no: item.cust_no,
                                cust_name: item.cust_name,
                                total: item.total,
                                total_paid_amount: item.total_paid_amount,
                                expense_amt: item.expense,
                                balance: parseFloat(item.total) - parseFloat(item.total_paid_amount)
                            })
                        }
                    })
                    page.view.selectedPendingPayment(payment_data);
                });
            })

            $$("ddlPayMode").selectionChange(function () {
                if ($$("ddlPayMode").selectedValue() == "Cash") {
                    $$("pnlCardType").hide();
                    $$("pnlCardNo").hide();
                    $$("pnlCouponNo").hide();
                }
                if ($$("ddlPayMode").selectedValue() == "Card") {
                    $$("pnlCardType").show();
                    $$("pnlCouponNo").hide();
                    $$("pnlCardNo").show();
                }
                if ($$("ddlPayMode").selectedValue() == "Coupon") {
                    $$("pnlCardType").hide();
                    $$("pnlCouponNo").show();
                    $$("pnlCardNo").hide();
                }
            })

        }

        page.events.btnPayPending_click = function () {
            $$("btnPayPending").disable(true);
            var allBillSO = [];
            var data1 = [];
            var expenseData1 = [];
            try {

                var countNoAmount = 0;
                $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                    if (item.amount_pay != 0 && item.amount_pay != "" && item.amount_pay != undefined) {
                        countNoAmount = countNoAmount + 1;
                    }
                });
                if (countNoAmount < 1)
                    throw "Please check the amount...!";
                if (($$("ddlPayMode").selectedValue() == "Card") && ($$("txtCardNo").val() == ""))
                    throw "Card no should be mantatory";
                if (($$("ddlPayMode").selectedValue() == "Coupon") && ($$("txtCouponNo").val() == ""))
                    throw "Coupon no should be mantatory";
                if ($$("ddlPayMode").selectedValue() == "" || $$("ddlPayMode").selectedValue() == null)
                    throw "Select mode of pay...!";
                //Get all payment details in grid
                $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                    if (parseFloat(item.amount_pay) > 0) {
                        page.expense_amt = item.expense_amt;
                        allBillSO.push({
                            collector_id: localStorage.getItem("user_register_id"),
                            pay_desc: "POS Bill Payment",
                            amount: item.amount_pay,
                            bill_no: item.bill_no,
                            pay_date: $$("dsPendingPayDate").getDate(),//$.datepicker.formatDate("dd-mm-yy", new Date()),
                            pay_type: $$("ddlPayBillType").selectedValue(),
                            pay_mode: $$("ddlPayMode").selectedValue(),
                            card_type: ($$("ddlPayMode").selectedValue() == "Cash" || $$("ddlPayMode").selectedValue() == "Coupon") ? "" : $$("ddlCardType").selectedValue(),
                            card_no: ($$("ddlPayMode").selectedValue() == "Cash" || $$("ddlPayMode").selectedValue() == "Coupon") ? "" : $$("txtCardNo").val(),
                            coupon_no: ($$("ddlPayMode").selectedValue() == "Cash" || $$("ddlPayMode").selectedValue() == "Card") ? "" : $$("txtCouponNo").val()
                        });
                        if ($$("ddlPayBillType").selectedValue() == "Sale") {
                            data1.push({
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : ($$("ddlPayMode").selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTBank : ($$("ddlPayMode").selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : ($$("ddlPayMode").selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                //amount: item.amount_pay,
                                paid_amount: item.amount_pay,
                                description: "POS-" + item.bill_no,
                                jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                key_1: item.bill_no,
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            });

                        }
                        if ($$("ddlPayBillType").selectedValue() == "SaleReturn") {
                            data1.push({
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : ($$("ddlPayMode").selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTBank : ($$("ddlPayMode").selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : ($$("ddlPayMode").selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                //amount: item.amount_pay,
                                paid_amount: item.amount_pay,
                                description: "POS Return-" + item.bill_no,
                                jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                key_1: item.bill_no,
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            });
                        }
                    }
                });
                page.salesService.payAllInvoiceBillSalesOrder(0, allBillSO, function (data) {
                    //If finfacts module is enabled then make entry in finfacts.
                    if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                        if ($$("ddlPayBillType").selectedValue() == "Sale") {
                            $$("msgPanel").show("Updating Finfacts...");
                            page.finfactsEntry.allcreditSalesPayment(0, data1, function (response) {
                                $$("msgPanel").show("POS payment is recorded successfully.");
                                //alert("Successfully Paid...");
                                ShowDialogBox('Message', 'Successfully paid...!', 'Ok', '', null);
                                page.controls.pnlPayPending.close();
                                $$("btnPayPending").disable(false);
                                //page.salesService.getSOs(page.view.searchInput(), $$("ddlState").selectedValue(), function (data) {
                                //    page.view.searchResult(data);
                                //});
                                $$("grdSOResult").dataBind({
                                    getData: function (start, end, sortExpression, filterExpression, callback) {
                                        page.salesService.getSOs("", "", page.view.searchInput(), $$("ddlState").selectedValue(), function (data) {
                                            var totalRecord = data.length;
                                            page.salesService.getSOs(start, end, page.view.searchInput(), $$("ddlState").selectedValue(), function (data) {
                                                callback(data, totalRecord);
                                            });
                                        });
                                    },
                                    update: function (item, updatedItem) {
                                        for (var prop in updatedItem) {
                                            if (!updatedItem.hasOwnProperty(prop)) continue;
                                            item[prop] = updatedItem[prop];
                                        }
                                    }
                                });
                            });
                        }
                        else {
                            $$("msgPanel").show("Updating Finfacts...");
                            //page.finfactsService.insertAllReturnReceipt(0, data1, function (response) {
                            page.finfactsEntry.allcreditReturnSalesPayment(0, data1, function (response) {
                                $$("msgPanel").show("POS payment is returned successfully.");
                                //alert("Successfully Paid...");
                                ShowDialogBox('Message', 'Successfully paid...!', 'Ok', '', null);
                                page.controls.pnlPayPending.close();
                                //page.salesService.getSOs(page.view.searchInput(), $$("ddlState").selectedValue(), function (data) {
                                //    page.view.searchResult(data);
                                //});
                                $$("grdSOResult").dataBind({
                                    getData: function (start, end, sortExpression, filterExpression, callback) {
                                        page.salesService.getSOs("", "", page.view.searchInput(), $$("ddlState").selectedValue(), function (data) {
                                            var totalRecord = data.length;
                                            page.salesService.getSOs(start, end, page.view.searchInput(), $$("ddlState").selectedValue(), function (data) {
                                                callback(data, totalRecord);
                                            });
                                        });
                                    },
                                    update: function (item, updatedItem) {
                                        for (var prop in updatedItem) {
                                            if (!updatedItem.hasOwnProperty(prop)) continue;
                                            item[prop] = updatedItem[prop];
                                        }
                                    }
                                });
                            });
                        }
                    } else {
                        $$("msgPanel").show("POS payment is recorded successfully.");
                        ShowDialogBox('Message', 'Successfully paid...!', 'Ok', '', null);
                        page.controls.pnlPayPending.close();
                        $$("grdSOResult").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                page.salesService.getSOs("", "", page.view.searchInput(), $$("ddlState").selectedValue(), function (data) {
                                    var totalRecord = data.length;
                                    page.salesService.getSOs(start, end, page.view.searchInput(), $$("ddlState").selectedValue(), function (data) {
                                        callback(data, totalRecord);
                                    });
                                });
                            },
                            update: function (item, updatedItem) {
                                for (var prop in updatedItem) {
                                    if (!updatedItem.hasOwnProperty(prop)) continue;
                                    item[prop] = updatedItem[prop];
                                }
                            }
                        });
                        callback();
                    }
                });

            } catch (e) {
                ShowDialogBox('Warning', e, 'Ok', '', null);
                $$("btnPayPending").disable(false);
            }

        },

        page.calculate = function () {
            page.controls.grdDiscount.dataBind(page.discount);

            var itemDiscounts = arr = jQuery.grep(page.discount, function (dis, i) {
                if (dis.disc_level == "Item") {
                    if (typeof dis.item_no == "undefined" || dis.item_no == undefined || dis.item_no == "" || dis.item_no == null)
                        return true;
                    else if (dis.item_no == page.discount_item_no)
                        return true;
                    else
                        return false;
                }
                else
                    return false;
            });
            page.controls.grdItemDiscount.dataBind(itemDiscounts);

            var sub_total = 0;
            var tot_sales_tax = 0;
            var tot_discount = 0;
            var total = 0;
            var tot_discount_val = 0;


            $(page.controls.grdSOItems.getAllRows()).each(function (i, row) {
                var billItem = page.controls.grdSOItems.getRowData(row);
                var item_no = parseInt($(row).find("[datafield=item_no]").find("div").html());
                if (CONTEXT.SELLING_PRICE_EDITABLE) {
                    var price = parseFloat($(row).find("[datafield=price]").find("input").val());
                    if (isNaN(price)) {
                        price = parseFloat($(row).find("[datafield=price]").find("div").html());
                    }
                } else {
                    var price = parseFloat($(row).find("[datafield=price]").find("div").html());
                    if (isNaN(price)) {
                        price = parseFloat($(row).find("[datafield=price]").find("input").val());
                    }
                }
                var alldata = page.controls.grdSOItems.allData();
                var qty; // = parseFloat($(row).find("[datafield=quantity]").find("input").val());

                $(alldata).each(function (index, item) {
                    if (i == index) {
                        if (item.qty_type == "Integer")
                            qty = parseInt(item.quantity);
                        else
                            qty = parseFloat(item.quantity);
                    }
                });
                var discount_inclusive = parseInt($(row).find("[datafield=discount_inclusive]").find("div").html());
                var tax_class_no = parseInt($(row).find("[datafield=tax_class_no]").find("div").html());
                var txtTax = $(row).find("[datafield=tax_per]").find("div");
                var tax_inclusive = parseInt($(row).find("[datafield=tax_inclusive]").find("div").html());
                var txtDiscount = $(row).find("[datafield=discount]").find("div");
                var txtAmount = $(row).find("[datafield=total_price]").find("div");
                var txtAmountVal = parseFloat($(row).find("[datafield=total_price]").find("div").html());

                if (isNaN(qty)) {
                    qty = 1;
                }
                function getTaxPercent(tax_class_no) {
                    var rdata = 0;
                    $(page.sales_tax).each(function (i, item) {
                        if (tax_class_no == item.tax_class_no) {
                            rdata = item.tax_per;
                        }
                    });
                    return rdata;
                }
                function getTaxIgst(tax_class_no) {
                    var rdata = 0;
                    $(page.sales_tax).each(function (i, item) {
                        if (tax_class_no == item.tax_class_no) {
                            rdata = item.igst;
                        }
                    });
                    return rdata;
                }
                var tax = getTaxPercent(tax_class_no);
                var isgt = getTaxIgst(tax_class_no);
                
                var discount = 0;
                var billdiscountval = 0;
                var billdiscountper = 0;
                var discount_val = 0;
                var disc_price;
                
                if (CONTEXT.ENABLE_TAX_INCLUSIVE) {
                    if (tax_inclusive == "1")
                        disc_price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty)) / parseFloat((parseFloat(tax) / 100) + 1);
                    else
                        disc_price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                }
                else {
                    disc_price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                }
                $(page.discount).each(function (j, data) {

                    if (data.item_no == item_no) {
                        //Discount for all items
                        if (typeof data.item_no == "undefined" || data.item_no == undefined || data.item_no == "" || data.item_no == null) {
                            if (data.disc_type == "Fixed")
                                discount_val = discount_val + data.disc_value * qty;
                            else if (data.disc_type == "Percent") {
                                if (discount_inclusive == "1") {
                                    discount_val = discount_val + ((parseFloat(disc_price) - parseFloat(disc_price / ((data.disc_value / 100) + 1))) * parseFloat(qty));
                                }
                                else {
                                    discount_val = discount_val + ((disc_price * qty) * data.disc_value / 100);
                                }
                            }
                        } else if (data.item_no == item_no) {
                            if (data.disc_type == "Fixed")
                                discount_val = discount_val + data.disc_value * qty;
                            else if (data.disc_type == "Percent") {
                                //discount = discount + txtAmountVal * data.disc_value / 100;
                                if (discount_inclusive == "1") {
                                    discount_val = discount_val + ((parseFloat(disc_price) - parseFloat(disc_price / ((data.disc_value / 100) + 1))) * parseFloat(qty));
                                }
                                else {
                                    discount_val = discount_val + ((disc_price * qty) * data.disc_value / 100);
                                }
                            }
                        }
                    }
                    else if (typeof data.item_no == "undefined" || data.item_no == null || data.item_no == "") {
                        if (data.disc_type == "Fixed")
                            discount_val = discount_val + data.disc_value * qty;
                        else if (data.disc_type == "Percent") {
                            if (discount_inclusive == "1") {
                                discount_val = discount_val + ((parseFloat(disc_price) - parseFloat(disc_price / ((data.disc_value / 100) + 1))) * parseFloat(qty));
                            }
                            else {
                                discount_val = discount_val + ((disc_price * qty) * data.disc_value / 100);
                            }
                        }
                    }
                });
                tot_discount_val = tot_discount_val + discount_val;

                if (CONTEXT.ENABLE_TAX_INCLUSIVE) {
                    if (tax_inclusive == "1")
                        price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty)) / parseFloat((parseFloat(tax) / 100) + 1);
                    else
                        price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                }
                else {
                    price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                }
                $(page.discount).each(function (j, data) {

                    if (data.item_no == item_no) {
                        //Discount for all items
                        if (typeof data.item_no == "undefined" || data.item_no == undefined || data.item_no == "" || data.item_no == null) {
                            if (data.disc_type == "Fixed")
                                discount = discount + data.disc_value * qty;
                            else if (data.disc_type == "Percent") {
                                if (discount_inclusive == "1") {
                                    discount = discount + ((parseFloat(price) - parseFloat(price / ((data.disc_value / 100) + 1))) * parseFloat(qty));
                                }
                                else {
                                    discount = discount + ((price * qty) * data.disc_value / 100);
                                }
                            }
                        } else if (data.item_no == item_no) {
                            if (data.disc_type == "Fixed")
                                discount = discount + data.disc_value * qty;
                            else if (data.disc_type == "Percent") {
                                //discount = discount + txtAmountVal * data.disc_value / 100;
                                if (discount_inclusive == "1") {
                                    discount = discount + ((parseFloat(price) - parseFloat(price / ((data.disc_value / 100) + 1))) * parseFloat(qty));
                                }
                                else {
                                    discount = discount + ((price * qty) * data.disc_value / 100);
                                }
                            }
                        }
                    }
                    else if (typeof data.item_no == "undefined" || data.item_no == null || data.item_no == "") {
                        if (data.disc_type == "Fixed")
                            discount = discount + data.disc_value * qty;
                        else if (data.disc_type == "Percent") {
                            if (discount_inclusive == "1") {
                                discount = discount + ((parseFloat(price) - parseFloat(price / ((data.disc_value / 100) + 1))) * parseFloat(qty));
                            }
                            else {
                                discount = discount + ((price * qty) * data.disc_value / 100);
                            }
                        }
                    }
                });

                
                tot_discount = tot_discount + discount;
                price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                var qty_price = (price * qty);
                sub_total = sub_total + qty_price;
                var tax_amount = (qty_price * tax / 100);
                tot_sales_tax = tot_sales_tax + tax_amount;
                var amount = qty_price + tax_amount;
                billItem.item_sub_total = qty_price;

                txtTax.html(tax + "%");
                txtDiscount.html(parseFloat(discount));
                txtAmount.html(parseFloat(amount).toFixed(5));
                
                var currentData = page.controls.grdSOItems.getRowData(row); //set the grid value
                currentData.tax_per = tax;
                currentData.discount = discount;
                currentData.total_price = amount;
                currentData.disc_no = page.discount.disc_no;
            });

            page.controls.lblSubTotal.value(parseFloat(parseFloat(sub_total)+parseFloat(tot_discount)).toFixed(5));

            var exp_amount = page.controls.txtExpense.value();
            if (exp_amount == "" || exp_amount == null || typeof exp_amount == "undefined")
                exp_amount = 0;
            total = sub_total + tot_sales_tax + parseFloat(exp_amount);//- tot_discount 

            var data = page.controls.grdSOItems.allData();

            page.controls.lblDiscount.value(parseFloat(parseFloat(tot_discount_val).toFixed(5)));
            page.controls.lblTax.value(parseFloat(tot_sales_tax).toFixed(5));

            var total_after_Rnd_off = Math.round(parseFloat(total));
            var round_off = parseFloat(parseFloat(total_after_Rnd_off)-parseFloat(total)).toFixed(5);

            page.controls.lblRndOff.value(parseFloat(round_off).toFixed(5));
            page.controls.lblTotal.value(parseFloat(total_after_Rnd_off).toFixed(5));

            if (page.selectedSO.bill_no != null) {
                page.salesService.getTotalPaidSO(page.selectedSO.bill_no, function (data) {
                    page.controls.lblTotalAmtPaid.value(data[0].total);
                    page.remainingAmount = page.controls.lblTotal.value() - page.controls.lblTotalAmtPaid.value();
                    page.controls.lblTotalAmtRemaining.value(page.remainingAmount);

                });
            } else {
                page.controls.lblTotalAmtPaid.value(parseFloat(0));
                page.controls.lblTotalAmtRemaining.value(parseFloat(0));
                page.remainingAmount = 0;
            }
            page.controls.grdDiscount.dataBind(page.discount);
            page.controls.grdItemDiscount.dataBind(page.discount);

        }
        page.reCalculate = function (callback) {
            $(page.controls.grdSOItems.getAllRows()).each(function (i, row) {
                var billItem = page.controls.grdSOItems.getRowData(row);
                var price = ($$("ddlRate").selectedValue() == "1") ? billItem.temp_price : ($$("ddlRate").selectedValue() == "2") ? billItem.alter_price_1 : billItem.alter_price_2;
                billItem.price = price;
                $(row).find("[datafield=price]").find("div").html(price);
            });
            callback({});
        }
        var typingTimer;                //timer identifier
        var doneTypingInterval = 250;  //time in ms, 5 second for example
        var $input = $("[controlid=txtExpense]");

        //on keyup, start the countdown
        $input.on('keyup', function () {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(doneTyping, doneTypingInterval);
        });

        //on keydown, clear the countdown 
        $input.on('keydown', function () {
            clearTimeout(typingTimer);
        });
        //user is "finished typing," do something
        function doneTyping() {
            if ($$("txtExpenseName").value() == "" || $$("txtExpenseName").value() == null || typeof $$("txtExpenseName").value() == "undefined") {
                alert("Expense Name Is Not Empty!!!");
                $$("txtExpenseName").value("");
                $$("txtExpense").value("");
            }
            page.calculate();
        }
        //Load a single sales order details in screen.
        page.loadSalesOrder = function (order_id, callback) {
            //Get sub order detais
            page.salesService.getSOByNo(order_id, function (dataitem) {

                //Show the detail panel if it is hidden.Note: Hidden on page_load
                $(".detail-info").show();

                //Keep the selected sales order in page scope for future use
                page.selectedSO = dataitem[0];

                //Bind the selected order detail on view
                page.view.selectedSO(page.selectedSO);

                if (callback)
                    callback();

                //Get sub order item details
                page.salesService.getSOItems(dataitem[0].order_id, function (data) {

                    //Keep the selected Items in page scope
                    page.selectedSOItems = $.util.clone(data);

                    //Bind the selected Items on view
                    page.view.selectedSOItems(data);

                    if (page.selectedSO.bill_no != null) {
                        //Note After Fullfill status Item grid,discount and sales tax should be loaded from bill instead of SO.
                        //And all information should be readonly
                        //Get the discount detail for current bull
                        page.billService.getAllBillDiscount(page.selectedSO.bill_no, function (data) {
                            // page.discount = [];
                            //page.disount = data;
                            $(data).each(function (i, item) {
                                page.discount.push({
                                    disc_no: item.disc_no,
                                    disc_type: item.value_type,
                                    disc_name: item.disc_name,
                                    disc_value: item.value,
                                    item_no: item.item_no
                                });
                            });
                        });

                        //get the sales tax no for curren bill
                        page.billService.getBill(page.selectedSO.bill_no, function (data) {
                            page.SOBill = data[0];

                            page.controls.lblSubTotal.value(page.SOBill.sub_total);
                            page.controls.lblDiscount.value(page.SOBill.discount);
                            page.controls.lblTax.value(page.SOBill.tax);
                            page.controls.lblRndOff.value(page.SOBill.round_off);
                            page.controls.lblTotal.value(page.SOBill.total);

                            page.controls.txtExpenseName.value(page.SOBill.exp_name);
                            page.controls.txtExpense.value(page.SOBill.exp_amount);
                            //  $$("msgPanel").show("Calculating remaining balalnce after payment.");

                            page.salesService.getTotalPaidSO(page.selectedSO.bill_no, function (data) {
                                page.controls.lblTotalAmtPaid.value(data[0].total);
                                page.remainingAmount = parseFloat(page.controls.lblTotal.value()) - parseFloat(page.controls.lblTotalAmtPaid.value());
                                page.controls.lblTotalAmtRemaining.value(page.remainingAmount);
                                //  $$("msgPanel").show("Paid amount and remaining balance is updated..");


                            });
                            page.sales_tax_no = page.SOBill.sales_tax_no;
                            page.sales_tax = [];
                             page.billService.getSalesTaxClass(page.sales_tax_no, function (data) {
                            //Get sales tax-tax_class mapping data
                                 page.sales_tax = data;
                             });
                        });
                        //ReCalculate Bill Summary
                        //page.calculate();
                    }
                    else {
                        //In created and ordered state , Load discount and sales tax from sales order
                        page.billService.getAllSODiscount(order_id, function (data) {
                            page.discount = [];
                            $(data).each(function (i, item) {
                                page.discount.push({
                                    disc_no: item.disc_no,
                                    disc_type: item.value_type,
                                    disc_name: item.disc_name,
                                    disc_value: item.value,
                                    item_no: item.item_no
                                });
                            });



                            //Set sales_tax_no
                            //page.sales_tax_no = page.selectedSO.sales_tax_no;
                            // page.billService.getSalesTaxClass(page.sales_tax_no, function (data) {
                            //Get sales tax-tax_class mapping data
                            page.billService.getSalesTaxClass(CONTEXT.DEFAULT_SALES_TAX, function (data) {
                                page.sales_tax = data;
                            });
                            //ReCalculate Bill Summary
                            page.calculate();
                        });
                    }

                    //page.calculate();
                });

                //Get pending sales amount
                var data1 = {
                    viewMode: "Customer Wise",
                    fromDate: "",
                    toDate: "",
                    cust_no: page.controls.ddlSOCustomer.selectedValue(),
                    item_no: "",
                    bill_type: ""
                }
                page.dynaReportService.getSalesReport(data1, function (data1) {
                    if (data1.length != 0)
                        page.pendingAmount = data1[0].total_price - data1[0].total_paid_amount;
                    // page.controls.lblPendingAmount.value(parseFloat(page.pendingAmount).toFixed(5));


                });


                //Get Payment detail if bill is there.Means after fullfill
                if (order_id != null) {
                    //Get the Payment details for the current bill.Today one SO can have only one Bill.
                    page.salesService.getTransactionDetails(order_id, function (data) {
                        //Bind the payment details on view
                        page.controls.grdTransactions.dataBind(data);
                    });
                } else
                    page.controls.grdTransactions.dataBind([]);

                page.billService.getBillBySO(page.selectedSO.order_id, function (data) {
                    //Bind the bill details on view
                    $$("grdBillTransactions").height("80px");
                    $$("grdBillTransactions").setTemplate({
                        selection: "Single",
                        columns: [
                                    { 'name': "", 'width': "0px", 'dataField': "bill_no",visible:false },
                                    { 'name': "Bill No", 'width': "80px", 'dataField': "bill_id" },
                                    { 'name': "Bill Date", 'width': "120px", 'dataField': "bill_date" },
                                    { 'name': "Bill Type", 'width': "120px", 'dataField': "bill_type" },
                                    { 'name': "Amount", 'width': "120px", 'dataField': "total" },
                                    { 'name': "Action", 'width': "120px", 'dataField': "bill_no", editable: false, itemTemplate: "<input type='button' class='grid-button' value='' action='Open' style='    border: none;    background-color: transparent;    background-image: url(Open_file.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' /> <input type='button' title='Jasper Print'  class='grid-button' value='' action='PrintJasper' style='    border: none;    background-color: transparent;    background-image: url(print.png);    background-size: contain;    width: 25px;    height: 25px;;margin-right:10px' />  " }
                        ]
                    });
                    page.controls.grdBillTransactions.rowCommand = function (action, actionElement, rowId, row, rowData) {
                        if (action == "Open") {
                            var data = {
                                bill_no: $(row).find("[datafield=bill_no]").find("div").html(),
                                bill_type: "Sales"
                            }
                            page.events.btnOpenBill_click(data);
                        }
                        if (action == "PrintJasper") {
                            page.PrintBillType = rowData.bill_type;
                            page.PrintBillNo = rowData.bill_no;
                            page.controls.pnlPrintingPopup.open();
                            page.controls.pnlPrintingPopup.title("Select Export Type");
                            page.controls.pnlPrintingPopup.width("500");
                            page.controls.pnlPrintingPopup.height("200");
                        }
                    }
                    page.controls.grdBillTransactions.dataBind(data);
                });

                if (page.selectedSO.state_text == "Created")
                    $$("txtItemSearch").selectedObject.focus();
            });
        }



        //#endregion


        //#region "Sales Order- Search and load"
        //Search 
        page.events.btnSearch_click = function () {
            page.controls.pnlContainerPage.hide();
            $$("pnlSearch").show();
            $$("pnlDetail").hide();
            page.view.UIState("Load");
            //page.salesService.getSOs(page.view.searchInput(), $$("ddlState").selectedValue(), function (data) {
            //    page.view.searchResult(data);
            //});
            $$("grdSOResult").dataBind({
                getData: function (start, end, sortExpression, filterExpression, callback) {
                    page.salesService.getSOs("", "", page.view.searchInput(), $$("ddlState").selectedValue(), function (data) {
                        var totalRecord = data.length;
                        page.salesService.getSOs(start, end, page.view.searchInput(), $$("ddlState").selectedValue(), function (data) {
                            page.view.searchResult([]);
                            callback(data, totalRecord);
                        });
                    });
                },
                update: function (item, updatedItem) {
                    for (var prop in updatedItem) {
                        if (!updatedItem.hasOwnProperty(prop)) continue;
                        item[prop] = updatedItem[prop];
                    }
                }
            });
        }
        page.events.btnOpenBill_click = function (bill) {
            page.controls.pnlViewer.open();
            page.controls.pnlViewer.title("Bill Details");
            page.controls.pnlViewer.width(850);
            page.controls.pnlViewer.height(400);
            page.controls.ucbillViewer.load(bill);
        },

        //Page load
        page.events.page_load = function () {

            $("[controlid=txtItemSearch]").bind("keypress", function (e) {
                // access the clipboard using the api
                var self = this;
                setTimeout(function () {
                    var str = $(self).val();
                    if (str.startsWith("00")) {
                        $(self).val(parseInt(str.substring(0, str.length - 1)));
                        $(self).keydown();
                    }
                }, 300)
            });
            page.controls.txtItemSearch.itemTemplate = function (item) {
                if (CONTEXT.ENABLE_STOCK_MAINTANENCE) {
                    if (item.qty_stock > 0) {
                        if (parseInt(item.cost) == 0) {
                            return "<a>" + item.item_name + "_" + item.item_no + "<span style='margin:right:30px'><span>    <span style='margin:right:30px'><span> [Price:" + item.price + "]-Free</a>";
                        } else {
                            return "<a>" + item.item_name + "_" + item.item_no + "<span style='margin:right:30px'><span>    <span style='margin:right:30px'><span> [Price:" + item.price + "]</a>";
                        }
                    }
                }
                else {
                    if (parseInt(item.cost) == 0) {
                        return "<a>" + item.item_name + "_" + item.item_no + "<span style='margin:right:30px'><span>    <span style='margin:right:30px'><span> [Price:" + item.price + "]-Free</a>";
                    } else {
                        return "<a>" + item.item_name + "_" + item.item_no + "<span style='margin:right:30px'><span>    <span style='margin:right:30px'><span> [Price:" + item.price + "]</a>";
                    }
                }
            }
            page.controls.txtItemSearch.dataBind({
                getData: function (term, callback) {
                    //page.itemService.getItemAutoComplete(term, page.sales_tax_no, callback);
                    //callback(page.productList);
                    page.itemService.getItemAutoCompleteAllData(term, CONTEXT.DEFAULT_SALES_TAX, function (data) {
                        callback(data);
                    });
                }
            });
            page.controls.txtItemSearch.select(function (item) {
                if (item != null) {
                    if (typeof item.item_no != "undefined") {

                        if (item.price != null) {
                            page.itemService.getItemDiscountAutocomplete(item.item_no, function (data1) {
                                page.taxclassService.getTaxByItem(page.sales_tax_no, item.tax_class_no, function (taxData) {
                                    if (data1 != '' && data1 != undefined) {
                                        discountVal = data1[0].disc_value;
                                        page.discount.push({
                                            disc_no: data1[0].disc_no,
                                            disc_type: data1[0].disc_type,
                                            disc_name: data1[0].disc_name,
                                            disc_value: discountVal,
                                            item_no: item.item_no
                                        });
                                    }
                                    var newitem = {
                                        item_no: item.item_no,
                                        item_code: item.item_code,
                                        item_name: item.item_name,
                                        batch_no: item.batch_no,
					                    man_date: item.man_date,
                                        expiry_date: item.expiry_date,
                                        qty_stock: item.qty_stock,
                                        // cost: item.price,
                                        cost: (item.tax_inclusive == "0") ? item.price : parseFloat(parseFloat(item.price) / ((100 + parseFloat(item.tax)) / 100)).toFixed(4),
                                        qty_const: item.qty_stock,
                                        mrp: item.mrp,
                                        order_id: page.view.selectedSO().order_id,
                                        discount: item.discount,
                                        tax: taxData[0].tax,
                                        tax_class_no: item.tax_class_no,
                                        temp_qty: 1,
                                        quantity: 1,
                                        free_qty: 0,
                                        fullfilled: 0,
                                        price: ($$("ddlRate").selectedValue() == "1") ? item.price : ($$("ddlRate").selectedValue() == "2") ? item.alter_price_1 : item.alter_price_2,
                                        temp_price: item.price,
                                        alter_price_1: item.alter_price_1,
                                        alter_price_2: item.alter_price_2,
                                        tray_id: item.tray_no,
                                        tray_count: 0,
                                        unit: item.unit,
                                        tofullfilled: 1,
                                        todelivered: 1,
                                        total_price: item.price * 1 + item.tax * item.price * 1,
                                        qty_type: item.qty_type,
                                        cost: item.cost == null ? 0 : item.cost,
                                        tax_inclusive: item.tax_inclusive,
                                        variation_name: item.variation_name,
                                        hsn_code: item.hsn_code,
                                        cgst: (taxData[0].cgst == null) ? 0 : taxData[0].cgst,
                                        sgst: (taxData[0].sgst == null) ? 0 : taxData[0].sgst,
                                        igst: (taxData[0].igst == null) ? 0 : taxData[0].igst,
                                        tax_per: taxData[0].tax,
                                        alter_unit: item.alter_unit,
                                        alter_unit_fact: item.alter_unit_fact,
                                        unit_identity: 0,
                                        state_text: "Created",
                                        var_no: item.var_no,
                                        price_no: item.price_no == null ? "0" : item.price_no,
                                        expiry_alert_days: item.expiry_alert_days,
                                        rack_no: item.rack_no,
                                        discount_inclusive: item.discount_inclusive
                                    };
                                    var rows = page.controls.grdSOItems.getRow({
                                        //item_no: newitem.item_no
                                        variation_name: newitem.variation_name
                                    });


                                    if (rows.length == 0) {
                                        page.controls.grdSOItems.createRow(newitem);
                                        page.controls.grdSOItems.edit(true);
                                        rows = page.controls.grdSOItems.getRow({
                                            variation_name: newitem.variation_name
                                        });
                                        //rows[0].find("[datafield=quantity]").find("input").focus();
                                        rows[0].find("[datafield=temp_qty]").find("input").focus();
                                    } else {
                                        //var txtQty = rows[0].find("[datafield=quantity]").find("input");
                                        var txtQty = rows[0].find("[datafield=temp_qty]").find("input");
                                        //txtQty.val(parseInt(txtQty.val()) + 1);
                                        txtQty.val(parseInt(txtQty.val()) + 1);
                                        txtQty.trigger('change');
                                        txtQty.focus();
                                    }
                                    page.controls.txtItemSearch.customText("");
                                    page.controls.txtItemSearch.clearLastTerm();
                                    // page.controls.ddlSalesTax.selectedObject.val(CONTEXT.DEFAULT_SALES_TAX);
                                    page.calculate();
                                });
                            });
                        } else {
                            alert("No price is defined for item:" + item.item_name);
                        }


                    }
                }

            });

            page.view.UIState("Load");
            page.view.searchResult([]);

            page.customerService.getActiveCustomer("", function (data) {
                $$("ddlCustomerName").dataBind(data, "cust_no", "cust_name");
                $$("ddlSOCustomer").dataBind(data, "cust_no", "cust_name");
            });

            $$("ddlPayFor").selectionChange(function (data) {
                //   var remainingAmount1;
                if ($$("ddlPayFor").selectedValue() == "Current SalesOrder") {

                    $$("txtPayAmount").value(page.remainingAmount);
                }
                else if ($$("ddlPayFor").selectedValue() == "All Pending Payments") {
                    //$$("txtPayAmount").value(page.pendingAmount);
                    $$("txtPayAmount").value(page.controls.lblPendingPayment.html());

                }
            });

            page.salesService.getAllPaymentCollector(function (data) {
                $$("ddlCollectorName").dataBind(data, "collector_id", "collector_name");
                $$("ddlReturnCollectorName").dataBind(data, "collector_id", "collector_name");
            });

            page.purchaseService.getStateForSales(function (data) {
                $$("ddlState").dataBind(data, "state_no", "state_name", "All");
            });

            $$("ddlSOCustomer").selectionChange(function () {
                page.customerService.getCustomerById($$("ddlSOCustomer").selectedValue(), function (data) {

                    $$("txtSOCompany").value(data[0].company);
                    $$("txtContactNo").value(data[0].phone_no);
                    $$("txtEmail").value(data[0].email);
                    $$("txtGst").value(data[0].gst_no);

                    $$("txtShippingAddress").value(data[0].address1 + "-" + data[0].address2 + "-" + data[0].city + "-" + data[0].zip_code);
                    $$("txtDeliveryAddress").value(data[0].address1 + "-" + data[0].address2 + "-" + data[0].city + "-" + data[0].zip_code);


                });

            });

            page.billService.getAllDiscount(function (data) {
                page.controls.ddlDiscount.dataBind(data, "disc_no", "disc_name", "None");
            });
            page.billService.getAllItemDiscount(function (data) {
                page.controls.ddlItemDiscount.dataBind(data, "disc_no", "disc_name", "None");
            });
            page.billService.getAllSalestax(function (data) {
                page.controls.ddlSalesTax.dataBind(data, "sales_tax_no", "sales_tax_name", "None");
            });

            page.controls.lblDiscountLabel.selectedObject.css("cursor", "pointer");
            page.controls.lblDiscountLabel.selectedObject.hover(function () {
                $(this).css("text-decoration", "underline");
            }, function () {
                $(this).css("text-decoration", "");
            });

            page.controls.lblTaxLabel.selectedObject.css("cursor", "pointer");
            page.controls.lblTaxLabel.selectedObject.hover(function () {
                $(this).css("text-decoration", "underline");
            }, function () {
                $(this).css("text-decoration", "");
            });



            $$("lblTaxLabel").selectedObject.click(page.events.lblTaxLabel_click);

            $$("lblDiscountLabel").selectedObject.click(page.events.lblDiscountLabel_click);

            $$("grdTransactions").height("80px");
            $$("grdTransactions").setTemplate({
                selection: "Single",
                columns: [
                    { 'name': "Pay Id", 'width': "80px", 'dataField': "pay_id" },
                    { 'name': "Pay Date", 'width': "120px", 'dataField': "pay_date" },
                    { 'name': "Amount", 'width': "120px", 'dataField': "amount" },
                    { 'name': "Pay Type", 'width': "120px", 'dataField': "pay_type" },
                    { 'name': "Collector", 'width': "120px", 'dataField': "collector_name" },
                ]
            });

            $$("grdSOResult").dataBind({
                getData: function (start, end, sortExpression, filterExpression, callback) {
                    page.salesService.getSOs("", "", page.view.searchInput(), -1, function (data) {
                        var totalRecord = data.length;
                        page.salesService.getSOs(start, end, page.view.searchInput(), -1, function (data) {
                            callback(data, totalRecord);
                        });
                    });
                },
                update: function (item, updatedItem) {
                    for (var prop in updatedItem) {
                        if (!updatedItem.hasOwnProperty(prop)) continue;
                        item[prop] = updatedItem[prop];
                    }
                }
            });

            $$("ddlState").selectionChange(function () {
                var info = [];
                $$("grdSOResult").dataBind({
                    getData: function (start, end, sortExpression, filterExpression, callback) {
                        page.salesService.getSOs("", "", page.view.searchInput(), $$("ddlState").selectedValue(), function (data) {
                            var totalRecord = data.length;
                            page.salesService.getSOs(start, end, page.view.searchInput(), $$("ddlState").selectedValue(), function (data) {
                                callback(data, totalRecord);
                            });
                        });
                    },
                    update: function (item, updatedItem) {
                        for (var prop in updatedItem) {
                            if (!updatedItem.hasOwnProperty(prop)) continue;
                            item[prop] = updatedItem[prop];
                        }
                    }
                });
            });

            $$("txtReturnBillAmount").disable(true);
            
            page.billService.getAllDeliveyBoy(function (data) {
                page.controls.ddlDeliveryBy.dataBind(data, "sale_executive_no", "sale_executive_name", "Select");
                page.controls.ddlReturnedBy.dataBind(data, "sale_executive_no", "sale_executive_name", "Select");
            })
            page.controls.ddlRate.selectionChange(function () {
                page.reCalculate(function (data) {
                    page.calculate();
                });
            });
        },

        //Load the selected sales order on view
            page.events.grdSOResult_select = function (item) {
                $$("pnlDetail").show();
                $$("pnlSearch").hide();
                page.loadSalesOrder(item.order_id);

                $$("pnlAddToDeliveryActions").hide();
                $$("pnlAddToFullfillActions").hide();
                $$("pnlReturnDeliveryActions").hide();
                $$("pnlAddToTrayActions").hide();
                $$("pnlReturnTrayActions").hide();
                $$("pnlReturnTrayActions").hide();
                page.sales_tax_no = CONTEXT.DEFAULT_SALES_TAX;
                //page.itemService.getItemAutoCompleteAllData("%", page.sales_tax_no, function (data) {
                //    var dataList = [];
                //    $(data).each(function (i, item) {
                //        // item.label = item.label + " <span style='margin:right:30px'><span> [MRP:" + item.price + "] <span style='margin:right:30px'><span> " + item.mrp
                //        if (parseFloat(item.qty_stock) != 0)
                //            dataList.push(item);
                //    });
                //    page.productList = dataList;
                //    //page.productList = data;
                //});
                if (CONTEXT.ENABLE_QR_CODE) {
                    $$("btnQrScan").show();
                }
                else {
                    $$("btnQrScan").hide();
                }
            }
        //#endregion


        function receiptCalculation(save, bill_type) {
            var data1 = {
                per_id: 1,
                target_acc_id: 1,
                amount: page.controls.lblSubTotal.value(),
                description: "Sales Order-" + page.selectedSO.order_id,
                jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date())
            };

            if (save) {
                //  page.accService.insertReceipt(data1, function (response) {
                //page.loadJournal();
                var jrn_id = -1;
                page.controls.lblJournalId.html(jrn_id);


                var newSO = {
                    order_id: page.selectedSO.order_id,
                    cust_no: page.controls.ddlSOCustomer.selectedValue(),
                    expected_date: page.controls.dsSOExpectedDate.getDate(),
                    ordered_date: page.controls.lblSOOrderedDate.getDate(),
                    fulfilled_date: page.controls.lblSOFulfilledDate.getDate(),
                    invoice_paid_date: page.controls.lblSOInvoiceDate.getDate(),
                    delivered_date: page.controls.lblSODeliveredDate.getDate(),
                    contact_no: page.controls.txtContactNo.value(),
                    shipping_address: page.controls.txtShippingAddress.value(),
                    delivery_address: page.controls.txtDeliveryAddress.value(),
                    email: page.controls.txtEmail.value(),
                    gst_no: page.controls.txtGst.value(),
                    bill_no: page.bill_no,
                    company: $$("txtSOCompany").value(),
                    jrn_id: jrn_id
                };

                page.salesService.updateSalesOrder(newSO, function () {
                    alert("Order Fulfilled Successfully!!");
                    page.salesService.getSOByNo(page.selectedSO.order_id, function (data) {
                        var row = page.controls.grdSOResult.selectedRows()[0];
                        page.selectedSO.state_no = 901;
                        page.selectedSO.state_text = "Fulfilled";
                        page.controls.grdSOResult.updateRow(row.attr("row_id"), data[0])
                        row.click();

                        page.controls.lblJournalId.html(data.jrn_id);

                        page.controls.lblSOIBillNo.html(page.bill_no);



                    });

                    //    });

                }, 3000);
            } else {
                // page.accService.insertReceipt(data1, function (response) {
                //page.loadJournal();
                var jrn_id = -1;
                // page.controls.lblJournalId.html(jrn_id);


                var newSO = {
                    order_id: page.selectedSO.order_id,
                    cust_no: page.controls.ddlSOCustomer.selectedValue(),
                    expected_date: page.controls.dsSOExpectedDate.getDate(),
                    ordered_date: page.controls.lblSOOrderedDate.getDate(),
                    fulfilled_date: page.controls.lblSOFulfilledDate.getDate(),
                    invoice_paid_date: page.controls.lblSOInvoiceDate.getDate(),
                    delivered_date: page.controls.lblSODeliveredDate.getDate(),
                    contact_no: page.controls.txtContactNo.value(),
                    shipping_address: page.controls.txtShippingAddress.value(),
                    delivery_address: page.controls.txtDeliveryAddress.value(),
                    email: page.controls.txtEmail.value(),
                    gst_no: page.controls.txtGst.value(),
                    bill_no: page.bill_no,
                    company: $$("txtSOCompany").value(),
                    jrn_id: jrn_id
                };

                page.salesService.updateSalesOrder(newSO, function () {
                    //alert("Sales Order Receipt Entry is saved successfully in Journal->Receipt!!");
                    page.salesService.getSOByNo(page.selectedSO.order_id, function (data) {
                        var row = page.controls.grdSOResult.selectedRows()[0];
                        page.selectedSO.state_no = 902;
                        page.selectedSO.state_text = "Invoice Paid";
                        page.controls.grdSOResult.updateRow(row.attr("row_id"), data[0])
                        row.click();

                        // page.controls.lblJournalId.html(data.jrn_id);


                    });

                });

                //  });
            }


        }

        function PrintingOD(data) {
            var r = window.open(null, "_blank");
            var doc = r.document;
            var head = false;

            doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; } #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td  {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;} </style><div class='col-lg-12'>");
            doc.write("<span style='float:right;font-size:17px;'>ORIGINAL</span><br>");
            doc.write("<div><h1><center>" + CONTEXT.COMPANY_NAME.toUpperCase() + "</center></h1></div>");
            doc.write("<center><div style='width:600px;'>" + '' + CONTEXT.COMPANY_ADDRESS_LINE2 + '' + "</center>");
            doc.write("<center>PH :" + CONTEXT.COMPANY_PHONE_NO + "</center></div>");
            doc.write("<div><span style='float:left'>DL.No : " + '' + CONTEXT.COMPANY_DL_NO + '' + "</span></div>");
            doc.write("<div><span class='col-lg-12' style='float:right'>TIN : " + '' + CONTEXT.COMPANY_TIN_NO + '' + "</span></div><br>");
            doc.write("<div><span class='col-lg-12' style='float:right'>GST : " + CONTEXT.COMPANY_GST_NO + " </span></div>");

            doc.write("<br><br><table style='width:100%;' cellpadding='0' cellspacing='0' border='1'>");

            doc.write("<tr ><td  style='width:350px;'>");
            doc.write("<br><div style='font-weight:bold'>" + $$("txtSOCompany").value().toUpperCase() + "</div><br>");
            doc.write("<div>" + $$("txtDeliveryAddress").value() + "<br>");
            doc.write("PH:" + $$("txtContactNo").val() + "");

            var txt_dl_no = (data[0].license_no == null || data[0].license_no == "null" || data[0].license_no == undefined) ? "" : data[0].license_no;
            var txt_tin_no = (data[0].tin_no == null || data[0].tin_no == "null" || data[0].tin_no == undefined) ? "" : data[0].tin_no;
            var txt_gst_no = (data[0].gst_no == null || data[0].gst_no == "null" || data[0].gst_no == undefined) ? "" : data[0].gst_no;

            doc.write("<br>DL.No : " + txt_dl_no + "");
            doc.write("<br>GST : " + txt_gst_no + "");
            doc.write("<br>TIN : " + txt_tin_no + "</div></td>");
            doc.write("<td><div>INVOICE CREDIT BILL</div><br>");
            doc.write("BILL NO : " + page.controls.lblSOIBillNo.html() + "<br>");
            doc.write("BILL DATE : " + page.selectedSO.ordered_date + "</div><br>");
            //doc.write("<div>DUE ON : " +  + "</div><br>");
            doc.write("</td><td><div>Sales Executive : " + data[0].sales_exe_name + "<br>");
            doc.write("Area : " + data[0].sales_exe_area + "</div><br>");
            doc.write("</td></tr>");


            doc.write("</table><br>");


            doc.write("<table  id='orgTblItem' style='width:100%;' cellpadding='0'; cellspacing='0'; border='0'; >");
            doc.write("<tr style='font-weight:bold;'>");
            doc.write("<th class='col' style=' width: 5px; height: 30px;'>S.No</th>");
            doc.write("<th class='col' style=' width: 110px; height: 30px;'>Product Name</th>");
            doc.write("<th class='col' style=' width: 80px; height: auto;'>Pack</th>");
            //doc.write("<th class='col' style=' width: 50px; height: auto;'>Bill No</th>");
            doc.write("<th class='col' style=' width: 60px; height: 30px;'>Batch</th>");
            doc.write("<th class='col' style=' width: 10px; height: 30px;'>Exp</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>Qty</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>Free</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>PTR</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>PDis</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>MRP</th>");
            //doc.write("<th class='col' style=' width: 50px; height: auto;'>Tax</th>");
            doc.write("<th class='col' style=' width: 90px; height: 30px;'>CGST</th>");
            doc.write("<th class='col' style=' width: 90px; height: 30px;'>SGST</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>G Value</th>");
            doc.write("</tr>");
            var no_of_prd = 0;
            var tot_Qty = 0;
            var tot_tax_cgst = 0;
            var tot_tax_sgst = 0;
            //var tot_tax_cgst_perct = 0;
            //var tot_tax_sgst_perct = 0;
            var s_no = 1;
            $(data).each(function (i, item) {
                var tax_cgst = 0;
                var tax_sgst = 0;
                var tax_cgst_percent = 0;
                var tax_sgst_percent = 0;

                tax_cgst = parseFloat(item.tax_amt) / parseFloat(2);
                tax_sgst = parseFloat(item.tax_amt) / parseFloat(2);
                tax_cgst_percent = parseInt(item.tax_per) / parseInt(2);
                tax_sgst_percent = parseInt(item.tax_per) / parseInt(2);


                var txt_Batch = (item.batch_no == null || item.batch_no == "null" || item.batch_no == undefined) ? "" : item.batch_no;
                var txt_exp_date = (item.expiry_date == null || item.expiry_date == "null" || item.expiry_date == undefined) ? "" : item.expiry_date;
                var txt_Qnty = (item.qty == null || item.qty == "null" || item.qty == undefined) ? "0" : item.qty;
                var txt_FQnty = (item.free_qty == null || item.free_qty == "null" || item.free_qty == undefined) ? "0" : item.free_qty;
                var txt_Price = (item.price == null || item.price == "null" || item.price == undefined) ? "0" : item.price;
                var txt_Disc = (item.discount == null || item.discount == "null" || item.discount == undefined) ? "0" : item.discount;
                var txt_Mrp = (item.mrp == null || item.mrp == "null" || item.mrp == undefined) ? "0" : item.mrp;
                var txt_Tot_Price = (item.total_price == null || item.total_price == "null" || item.total_price == undefined) ? "0" : item.total_price;
                doc.write("<tr  style='text-align: center;border:1px'>");
                doc.write("<td  class='col' style=' width: 5px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + s_no + "</td>");
                doc.write("<td  class='col' style=' width: 110px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + item.item_name + "</td>");
                doc.write("<td  class='col' style=' width: 80px; height: auto;'>" + item.packing + "</td>");
                doc.write("<td  class='col' style=' width: 60px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_Batch + "</td>");
                doc.write("<td  class='col' style=' width: 10px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_exp_date + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_Qnty + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_FQnty + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Price).toFixed(5) + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Disc).toFixed(5) + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Mrp).toFixed(5) + "</td>");
                //doc.write("<td  class='col' style=' width: 90px; height: auto;'>" + parseFloat(item.tax_per) + "%</td>");
                doc.write("<td  class='col' style=' width: 90px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(tax_cgst).toFixed(5) + " @ " + tax_cgst_percent + "%</td>");
                doc.write("<td  class='col' style=' width: 90px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(tax_sgst).toFixed(5) + " @ " + tax_sgst_percent + "%</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Tot_Price).toFixed(5) + "</td>");
                doc.write("</tr>");

                no_of_prd = no_of_prd + 1;
                s_no = s_no + 1;
                tot_Qty = parseInt(tot_Qty) + parseInt(item.qty);
                tot_tax_cgst = parseFloat(tot_tax_cgst) + parseFloat(tax_cgst);
                tot_tax_sgst = parseFloat(tot_tax_sgst) + parseFloat(tax_sgst);
                //tot_tax_sgst_perct = parseFloat(tot_tax_sgst_perct) + parseFloat(tax_sgst_percent);
                //tot_tax_cgst_perct = parseFloat(tot_tax_cgst_perct) + parseFloat(tax_cgst_percent);
            });
            doc.write("<tr><td colspan='9' style=''><div> No.of.Items :  " + no_of_prd + "</div></td><td colspan='4'> <div ><b>Sub Total: </b><span style='float:right'>" + parseFloat(page.controls.lblSubTotal.value()).toFixed(5) + "</span> </div></td> </tr>");
            doc.write("<tr><td colspan='9' style=''><div> Quantity : " + tot_Qty + "</div></td><td colspan='4'> <div ><b>Discount Amount: </b><span style='float:right'>" + parseFloat(page.controls.lblDiscount.value()).toFixed(5) + "</span> </div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>CGST: </b><span style='float:right'>" + parseFloat(tot_tax_cgst).toFixed(5) + " </span></div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>SGST: </b><span style='float:right'>" + parseFloat(tot_tax_sgst).toFixed(5) + "</span> </div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>Tax Amount: </b><span style='float:right'>" + parseFloat(page.controls.lblTax.value()).toFixed(5) + " </span></div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>Round off: </b><span style='float:right'>" + parseFloat(page.controls.lblRndOff.value()).toFixed(5) + " </span></div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>BILL AMOUNT: </b><span style='float:right'>" + parseFloat(page.controls.lblTotal.value()).toFixed(5) + "</span> </div> </td></tr>");
            doc.write("</tr>");
            doc.write("</table>");


            //doc.write("<div> No.of.Item " + no_of_prd + "</div>");
            //doc.write("<br><div> Qty " + tot_Qty + "</div>");

            //doc.write(" <div align='right'><b>Gross Value: </b>" + page.controls.lblSubTotal.value() + " </div>");
            //doc.write(" <div align='right'><b>Discount Amount: </b>" + page.controls.lblDiscount.value() + " </div>");
            //doc.write(" <div align='right'><b>CGST: </b>" + tot_tax_cgst + " </div>");
            //doc.write(" <div align='right'><b>SGST: </b>" + tot_tax_sgst + " </div>");
            //doc.write(" <div align='right'><b>Tax Amount: </b>" + page.controls.lblTax.value() + " </div>");
            //doc.write(" <div align='right'><b>Bill Amount: </b>" + page.controls.lblTotal.value() + " </div>");

            doc.write("<div align='right'><h5>For " + CONTEXT.COMPANY_NAME + "</h5>");



            discount: page.controls.lblDiscount.value(),

            //doc.write("<footer> <h2 align='center'></h2></footer><div align='center'><p>&copy; 2017 <a href='http://www.wototech.com'>www.wototech.com</a><p></div></body></html>");
            doc.write("</div></div></body></html>");
            doc.write("</div>");

            //DUPLICATE

            doc.write("<p style='page-break-after:always;'></p><div class='col-lg-12'>");
            doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; }  #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;}</style><div class='col-lg-12'>");
            doc.write("<span style='float:right;font-size:17px;'>DUPLICATE</span><br>");
            doc.write("<div><h1><center>" + '' + CONTEXT.COMPANY_NAME.toUpperCase() + '' + "</center></h1></div>");
            doc.write("<center><div style='width:600px;'>" + '' + CONTEXT.COMPANY_ADDRESS_LINE2 + '' + "</center>");
            doc.write("<center>PH :" + CONTEXT.COMPANY_PHONE_NO + "</center></div>");
            doc.write("<div><span style='float:left'>DL.No : " + '' + CONTEXT.COMPANY_DL_NO + '' + "</span></div>");
            doc.write("<div><span class='col-lg-12' style='float:right'>TIN : " + '' + CONTEXT.COMPANY_TIN_NO + '' + "</span></div><br>");
            doc.write("<div><span class='col-lg-12' style='float:right'>GST : " + CONTEXT.COMPANY_GST_NO + " </span></div>");

            doc.write("<br><br><table style='width:100%;' cellpadding='0' cellspacing='0' border='1'>");

            doc.write("<tr ><td  style='width:350px;'>");
            doc.write("<br><div style='font-weight:bold'>" + $$("txtSOCompany").value().toUpperCase() + "</div><br>");
            doc.write("<div>" + $$("txtDeliveryAddress").value() + "<br>");
            doc.write("PH:" + $$("txtContactNo").val() + "");

            doc.write("<br>DL.No : " + data[0].license_no + "");
            doc.write("<br>TIN : " + data[0].tin_no + "</div></td>");
            doc.write("<td><div>INVOICE CREDIT BILL</div><br>");
            doc.write("BILL NO : " + page.controls.lblSOIBillNo.html() + "<br>");
            doc.write("BILL DATE : " + page.selectedSO.ordered_date + "</div><br>");
            //doc.write("<div>DUE ON : " +  + "</div><br>");
            doc.write("</td><td><div>Sales Executive : " + data[0].sales_exe_name + "<br>");
            doc.write("Area : " + data[0].sales_exe_area + "</div><br>");
            doc.write("</td></tr>");


            doc.write("</table><br>");


            doc.write("<table id='dupTblItem'  style='width:100%;' cellpadding='0'; cellspacing='0'; border='0'; >");
            doc.write("<tr style='font-weight:bold;'>");
            doc.write("<th class='col' style=' width: 5px; height: 30px;'>S.No</th>");
            doc.write("<th class='col' style=' width: 110px; height: 30px;'>Product Name</th>");
            doc.write("<th class='col' style=' width: 80px; height: auto;'>Pack</th>");
            //doc.write("<th class='col' style=' width: 50px; height: auto;'>Bill No</th>");
            doc.write("<th class='col' style=' width: 60px; height: 30px;'>Batch</th>");
            doc.write("<th class='col' style=' width: 10px; height: 30px;'>Exp</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>Qty</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>Free</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>PTR</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>PDis</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>MRP</th>");
            //doc.write("<th class='col' style=' width: 50px; height: auto;'>Tax</th>");
            doc.write("<th class='col' style=' width: 90px; height: 30px;'>CGST</th>");
            doc.write("<th class='col' style=' width: 90px; height: 30px;'>SGST</th>");
            doc.write("<th class='col' style=' width: 50px; height: 30px;'>G Value</th>");
            doc.write("</tr>");
            var no_of_prd = 0;
            var tot_Qty = 0;
            var tot_tax_cgst = 0;
            var tot_tax_sgst = 0;
            //var tot_tax_cgst_perct = 0;
            //var tot_tax_sgst_perct = 0;
            var s_no = 1;
            $(data).each(function (i, item) {
                var tax_cgst = 0;
                var tax_sgst = 0;
                var tax_cgst_percent = 0;
                var tax_sgst_percent = 0;

                tax_cgst = parseFloat(item.tax_amt) / parseFloat(2);
                tax_sgst = parseFloat(item.tax_amt) / parseFloat(2);
                tax_cgst_percent = parseInt(item.tax_per) / parseInt(2);
                tax_sgst_percent = parseInt(item.tax_per) / parseInt(2);


                var txt_Batch = (item.batch_no == null || item.batch_no == "null" || item.batch_no == undefined) ? "" : item.batch_no;
                var txt_exp_date = (item.expiry_date == null || item.expiry_date == "null" || item.expiry_date == undefined) ? "" : item.expiry_date;
                var txt_Qnty = (item.qty == null || item.qty == "null" || item.qty == undefined) ? "0" : item.qty;
                var txt_FQnty = (item.free_qty == null || item.free_qty == "null" || item.free_qty == undefined) ? "0" : item.free_qty;
                var txt_Price = (item.price == null || item.price == "null" || item.price == undefined) ? "0" : item.price;
                var txt_Disc = (item.discount == null || item.discount == "null" || item.discount == undefined) ? "0" : item.discount;
                var txt_Mrp = (item.mrp == null || item.mrp == "null" || item.mrp == undefined) ? "0" : item.mrp;
                var txt_Tot_Price = (item.total_price == null || item.total_price == "null" || item.total_price == undefined) ? "0" : item.total_price;
                doc.write("<tr  style='text-align: center;border:1px'>");
                doc.write("<td  class='col' style=' width: 5px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + s_no + "</td>");
                doc.write("<td  class='col' style=' width: 110px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + item.item_name + "</td>");
                doc.write("<td  class='col' style=' width: 80px; height: auto;'>" + item.packing + "</td>");
                doc.write("<td  class='col' style=' width: 60px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_Batch + "</td>");
                doc.write("<td  class='col' style=' width: 10px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_exp_date + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_Qnty + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_FQnty + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Price).toFixed(5) + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Disc).toFixed(5) + "</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Mrp).toFixed(5) + "</td>");
                //doc.write("<td  class='col' style=' width: 90px; height: auto;'>" + parseFloat(item.tax_per) + "%</td>");
                doc.write("<td  class='col' style=' width: 90px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(tax_cgst).toFixed(5) + " @ " + tax_cgst_percent + "%</td>");
                doc.write("<td  class='col' style=' width: 90px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(tax_sgst).toFixed(5) + " @ " + tax_sgst_percent + "%</td>");
                doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Tot_Price).toFixed(5) + "</td>");
                doc.write("</tr>");

                no_of_prd = no_of_prd + 1;
                s_no = s_no + 1;
                tot_Qty = parseInt(tot_Qty) + parseInt(item.qty);
                tot_tax_cgst = parseFloat(tot_tax_cgst) + parseFloat(tax_cgst);
                tot_tax_sgst = parseFloat(tot_tax_sgst) + parseFloat(tax_sgst);
                //tot_tax_sgst_perct = parseFloat(tot_tax_sgst_perct) + parseFloat(tax_sgst_percent);
                //tot_tax_cgst_perct = parseFloat(tot_tax_cgst_perct) + parseFloat(tax_cgst_percent);
            });
            doc.write("<tr><td colspan='9' style=''><div> No.of.Items :  " + no_of_prd + "</div></td><td colspan='4'> <div ><b>Sub Total: </b><span style='float:right'>" + parseFloat(page.controls.lblSubTotal.value()).toFixed(5) + "</span> </div></td> </tr>");
            doc.write("<tr><td colspan='9' style=''><div> Quantity : " + tot_Qty + "</div></td><td colspan='4'> <div ><b>Discount Amount: </b><span style='float:right'>" + parseFloat(page.controls.lblDiscount.value()).toFixed(5) + "</span> </div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>CGST: </b><span style='float:right'>" + parseFloat(tot_tax_cgst).toFixed(5) + " </span></div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>SGST: </b><span style='float:right'>" + parseFloat(tot_tax_sgst).toFixed(5) + "</span> </div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>Tax Amount: </b><span style='float:right'>" + parseFloat(page.controls.lblTax.value()).toFixed(5) + " </span></div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>Round off: </b><span style='float:right'>" + parseFloat(page.controls.lblRndOff.value()).toFixed(5) + " </span></div></td> </tr>");
            doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>BILL AMOUNT: </b><span style='float:right'>" + parseFloat(page.controls.lblTotal.value()).toFixed(5) + "</span> </div> </td></tr>");
            doc.write("</tr>");
            doc.write("</table>");
            //doc.write("<div> No.of.Item " + no_of_prd + "</div>");
            //doc.write("<br><div> Qty " + tot_Qty + "</div>");

            //doc.write(" <div align='right'><b>Gross Value: </b>" + page.controls.lblSubTotal.value() + " </div>");
            //doc.write(" <div align='right'><b>Discount Amount: </b>" + page.controls.lblDiscount.value() + " </div>");
            //doc.write(" <div align='right'><b>CGST: </b>" + tot_tax_cgst + " </div>");
            //doc.write(" <div align='right'><b>SGST: </b>" + tot_tax_sgst + " </div>");
            //doc.write(" <div align='right'><b>Tax Amount: </b>" + page.controls.lblTax.value() + " </div>");
            //doc.write(" <div align='right'><b>Bill Amount: </b>" + page.controls.lblTotal.value() + " </div>");

            doc.write("<div align='right'><h5>For " + CONTEXT.COMPANY_NAME + "</h5>");



            discount: page.controls.lblDiscount.value(),



            doc.write("</div></body></html>");

            //doc.write("<center>&copy; 2017 <a href='http://www.wototech.com'>www.wototech.com</a></center></div></body></html>");

            doc.close();
            r.focus();
            r.print();
        }
        function PrintData(dataList) {

            var r = window.open(null, "_blank");
            var doc = r.document;
            var head = false;
            //   doc.write("<html><title>AVM Whole Sale Dealer Sales Order</title><style>.col{padding:5px}.hcol{padding:5px}</style><body>");
            //   doc.write("<header align='center'> <h1>AVM Wholesale Dealer</h1></header>");
            doc.write("<h2><center>" + '' + CONTEXT.COMPANY_NAME + '' + "</center></h2>");

            doc.write("<br><header align='center'> <h3>Sales Order Receipt</h3></header>");

            doc.write("<div><h3>Shipping Details:</h3></div>");



            doc.write("<table style='width: 60%; ' cellpadding='0' cellspacing='0' border='1'>");
            doc.write("<tr><td style='font-weight:bold;'>Company Name</td><td>" + $$("txtSOCompany").value() + "</td></tr>");
            doc.write("<tr><td style='font-weight:bold;'>Customer Name</td><td>" + page.controls.ddlSOCustomer.selectedData().cust_name + "</td></tr>");


            doc.write("<tr><td style='font-weight:bold'>Shipping Address</td><td>" + page.controls.txtShippingAddress.value() + "</td></tr>");
            doc.write("<tr><td style='font-weight:bold'>Delivery Address</td><td>" + page.controls.txtDeliveryAddress.value() + "</td></tr>");
            doc.write("<tr><td style='font-weight:bold'>Email</td><td>" + page.controls.txtEmail.value() + "</td></tr>");
            doc.write("<tr><td style='font-weight:bold'>Contact No</td><td>" + page.controls.txtContactNo.value() + "</td></tr>");

            doc.write("</table><br><br>");

            doc.write("<div><h3>Order Details:</h3></div>");


            doc.write("<table style='width: 50%;' cellpadding='0' cellspacing='0' border='1'>");
            doc.write("<tr><td style='font-weight:bold; float:left; width: 100%'>Order NO</td><td>" + page.selectedSO.order_id + "</td></tr>");
            doc.write("<tr><td style='font-weight:bold; float:left; width: 100%'>Bill NO</td><td>" + page.controls.lblSOIBillNo.html() + "</td></tr>");
            doc.write("<tr><td style='font-weight:bold; float:left; width: 100%'>State</td><td>" + page.selectedSO.state_text + "</td></tr>");
            doc.write("<tr><td style='font-weight:bold; float:left; width: 100%'>Ordered Date</td><td>" + page.selectedSO.ordered_date + "</td></tr>");
            doc.write("<tr><td style='font-weight:bold; float:left; width: 100%'>Confirmed Date</td><td>" + page.controls.lblSOConfirmedDate.getDate() + "</td></tr>");
            doc.write("<tr><td style='font-weight:bold; float:left; width: 100%'>Expected Date</td><td>" + page.selectedSO.expected_date + "</td></tr>");
            doc.write("<tr><td style='font-weight:bold; float:left; width: 100%'>Delivered Date</td><td>" + page.selectedSO.delivered_date + "</td></tr>");
            doc.write("</table><br>");

            doc.write("<div><h3>Item Details:</h3></div>");


            if (dataList[0].state_text) {
                doc.write("<table  style='width:100%;' cellpadding='0'; cellspacing='0'; border='1'; >");
                doc.write("<tr style='font-weight:bold;color: white; background-color:gray;'>");
                doc.write("<th class='col' style=' width: 70px; height: auto;'>Cust No</th>");
                doc.write("<th class='col' style=' width: 70px; height: auto;'>Cust Name</th>");
                doc.write("<th class='col' style=' width: 70px; height: auto;'>Bill No</th>");
                doc.write("<th class='col' style=' width: 70px; height: auto;'>Bill Date</th>");
                doc.write("<th class='col' style=' width: 70px; height: auto;'>Tax</th>");
                doc.write("<th class='col' style=' width: 70px; height: auto;'>Discount</th>");
                doc.write("<th class='col' style=' width: 70px; height: auto;'>StateName</th>");
                doc.write("<th class='col' style=' width: 70px; height: auto;'>Sub Total</th>");
                doc.write("<th class='col' style=' width: 70px; height: auto;'>Total</th>");
                doc.write("</tr>");
                $(dataList).each(function (i, item) {
                    doc.write("<tr>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.cust_no + "</td>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.cust_name + "</td>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.bill_no + "</td>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.bill_date + "</td>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.tax + "</td>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.discount + "</td>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.state_text + "</td>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.sub_total + "</td>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.total + "</td>");
                    doc.write("</tr>");
                });
                doc.write("</table>");

            }
            if (!dataList[0].state_text) {
                doc.write("<table  style='width:100%;' cellpadding='0'; cellspacing='0'; border='1'; >");
                doc.write("<tr style='font-weight:bold;color: white; background-color:gray;'>");
                doc.write("<th class='col' style=' width: 45px; height: auto;'>Item No</th>");
                doc.write("<th class='col' style=' width: 130px; height: auto;'>Item Name</th>");
                doc.write("<th class='col' style=' width: 130px; height: auto;'>Unit</th>");
                //doc.write("<th class='col' style=' width: 50px; height: auto;'>Bill No</th>");
                doc.write("<th class='col' style=' width: 90px; height: auto;'>Tax Amount</th>");
                doc.write("<th class='col' style=' width: 70px; height: auto;'>Discount</th>");
                doc.write("<th class='col' style=' width: 50px; height: auto;'>Qty</th>");
                doc.write("<th class='col' style=' width: 70px; height: auto;'>Qty Returned</th>");
                doc.write("<th class='col' style=' width: 50px; height: auto;'>Price</th>");
                doc.write("<th class='col' style=' width: 70px; height: auto;'>Total Price</th>");
                doc.write("</tr>");
                $(dataList).each(function (i, item) {
                    doc.write("<tr style='text-align: center;'>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.item_no + "</td>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.item_name + "</td>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.unit + "</td>");
                    //doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.bill_no + "</td>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.tax_per + "</td>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.discount + "</td>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.quantity + "</td>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.qty_returned + "</td>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.price + "</td>");
                    doc.write("<td  class='col' style=' width: 70px; height: auto;'>" + item.total_price + "</td>");
                    doc.write("</tr>");
                });
                doc.write("</table>");

            }

            doc.write("<br>");

            //doc.write("</table><footer> <h1>Woto Technologies,Tiruchendur, Tuticorin district - 628215</h1></footer></body></html>");
            doc.write(" <div align='right'><b>Sub Total: </b>" + page.controls.lblSubTotal.value() + " </div>");
            doc.write(" <div align='right'><b>Discount: </b>" + page.controls.lblDiscount.value() + " </div>");
            doc.write(" <div align='right'><b>Tax: </b>" + page.controls.lblTax.value() + " </div>");
            doc.write(" <div align='right'><b>Total Returned Amount: </b>" + page.controls.lblReturns.html() + " </div>");

            page.tot_amt_inc_return = parseFloat(page.controls.lblTotal.value()) - parseFloat(page.controls.lblReturns.html());

            //doc.write(" <div align='right'><b>Total Amount: </b>" + page.controls.lblTotal.value() + " </div>");
            doc.write(" <div align='right'><b>Total Amount: </b>" + page.tot_amt_inc_return + " </div>");
            doc.write(" <div align='right'><b>Total Paid: </b>" + page.controls.lblTotalAmtPaid.value() + " </div>");
            doc.write(" <div align='right'><b>Remaining Amount: </b>" + page.controls.lblTotalAmtRemaining.value() + " </div> <br><br><br><div align='right'><h3>Authorized Signature</h3></div>");



            discount: page.controls.lblDiscount.value(),

                doc.write("<footer> <h2 align='center'>" + CONTEXT.ClientAddress + "</h2></footer><div align='center'><p>&copy; 2017 <a href='http://www.wototech.com'>www.wototech.com</a><p></div></body></html>");

            doc.close();
            r.focus();
            r.print();


        }

        page.view = {
            searchInput: function () {
                return page.controls.txtSOSearch.val();
            },
            searchResult: function (data) {
                page.controls.grdSOResult.width("100%");
                //if (page.viewMode == "Desktop")
                page.controls.grdSOResult.height("440px");
                page.controls.grdSOResult.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "", 'width': "0px", 'dataField': "order_id",visible:false },
                        { 'name': "ID", 'width': "60px", 'dataField': "order_no" },
                        { 'name': "Customer", 'width': "200px", 'dataField': "cust_name" },
                        { 'name': "State", 'width': "150px", 'dataField': "state_text" },
                        { 'name': "Expected Date", 'width': "150px", 'dataField': "expected_date" },
                        { 'name': "Delivered Date", 'width': "150px", 'dataField': "delivered_date" },
                        { 'name': "Total Amount", 'width': "150px", 'dataField': "total_amount" },
                        { 'name': "Paid", 'width': "150px", 'dataField': "total_paid_amount" },
                        { 'name': "Balance", 'width': "150px", 'dataField': "balance" },
                       /// { 'name': "Ordered", 'width': "70px", 'dataField': "ordered_date" },
                        { 'name': "", 'width': "1px", 'dataField': "expected_date" },
                        { 'name': "", 'width': "1px", 'dataField': "delivered_date" }
                    ]
                });
                page.controls.grdSOResult.selectionChanged = function (rowList, dataList) {
                    page.events.grdSOResult_select(dataList);
                }

                page.controls.grdSOResult.dataBind(data);
            },
            salesHistory: function () {
                var repInput = {
                    viewMode: "Standard",
                    fromDate: "",
                    toDate: "",
                    cust_no: page.controls.ddlSOCustomer.selectedValue(),
                    item_no: "",
                    bill_type: "",
                    bill_advance:""
                }
                page.dynaReportService.getSalesReport(repInput, function (data) {
                    var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                    var poSummary = { tot_ret: 0, tot_ret_pay: 0, tot_ret_bal: 0 };
                    var lastItem = null;
                    $(data).each(function (i, item) {
                        if (lastItem == null || lastItem.bill_no != item.bill_no) {
                            if (item.bill_type == "Sale") {
                                salSummary.tot_sale = salSummary.tot_sale + parseFloat(item.total);
                                salSummary.tot_pay = salSummary.tot_pay + parseFloat(item.total_paid_amount);
                            }
                            else {
                                salSummary.tot_ret = salSummary.tot_ret + parseFloat(item.total);
                                salSummary.tot_ret_pay = salSummary.tot_ret_pay + parseFloat(item.total_paid_amount);
                            }
                            if (item.so_no == page.selectedSO.order_id) {
                                if (item.bill_type == "Sale") {
                                    poSummary.tot_sale = item.total;
                                    poSummary.tot_pay = item.total_paid_amount;
                                    poSummary.tot_bal = parseFloat(poSummary.tot_sale) - parseFloat(poSummary.tot_pay);
                                }
                                else {
                                    poSummary.tot_ret = poSummary.tot_ret + parseFloat(item.total);
                                    poSummary.tot_ret_pay = poSummary.tot_ret_pay + parseFloat(item.total_paid_amount);
                                    poSummary.tot_ret_bal = parseFloat(poSummary.tot_ret) - parseFloat(poSummary.tot_ret_pay);
                                }
                            }
                            lastItem = item;
                        }
                    });
                    page.controls.lblTotalSales.html(parseFloat(salSummary.tot_sale).toFixed(5));
                    page.controls.lblTotalPayment.html(parseFloat(salSummary.tot_pay).toFixed(5));
                    page.controls.lblTotalReturns.html(parseFloat(salSummary.tot_ret).toFixed(5));
                    page.controls.lblTotalReturnsPayment.html(parseFloat(salSummary.tot_ret_pay).toFixed(5));
                    page.controls.lblPendingPayment.html(parseFloat(parseFloat(page.controls.lblTotalSales.html()) - parseFloat(page.controls.lblTotalPayment.html())).toFixed(5));

                    if (poSummary.tot_sale != undefined)
                        page.controls.lblTotal.value(parseFloat(poSummary.tot_sale).toFixed(5));
                    if (poSummary.tot_pay != undefined)
                        page.controls.lblTotalAmtPaid.value(parseFloat(poSummary.tot_pay).toFixed(5));
                    if (poSummary.tot_bal != undefined)
                        page.controls.lblTotalAmtRemaining.value(parseFloat(poSummary.tot_bal).toFixed(5));

                    page.controls.lblReturns.html(parseFloat(poSummary.tot_ret).toFixed(5));
                    page.controls.lblReturnsPaid.value(parseFloat(poSummary.tot_ret_pay).toFixed(5));
                    page.controls.lblReturnsBalance.value(parseFloat(poSummary.tot_ret_bal).toFixed(5));

                });
            },
            selectedSO: function (soDetail) {
                if (soDetail) {
                    //Load Sales order detail
                    $$("lblSONo").html(soDetail.order_id);
                    $$("lblTempSONo").html(soDetail.order_no);
                    $$("lblSOState").html(soDetail.state_text);
                    $$("txtSOIBillDate").setDate(soDetail.bill_date);
                    $$("ddlSOCustomer").selectedValue(soDetail.cust_no);
                    $$("lblSOIBillNo").html(soDetail.bill_no);   //TODO : Comma seperated if multiple bill in future
                    $$("lblTempSOIBillNo").html(soDetail.bill_id);
                    if (soDetail.delivered_by == null) {
                        $$("ddlDeliveryBy").selectedValue(-1);
                    } else {
                        $$("ddlDeliveryBy").selectedValue(soDetail.delivered_by);
                    }

                    //Load Shipping details
                    $$("txtSOCompany").value(soDetail.company);
                    $$("txtShippingAddress").value(soDetail.shipping_address);
                    $$("txtDeliveryAddress").value(soDetail.delivery_address);
                    $$("txtContactNo").value(soDetail.contact_no);
                    $$("txtEmail").value(soDetail.email);
                    $$("txtGst").value(soDetail.gst_no);
                    //Load Order Dates                  
                    $$("lblSOOrderedDate").setDate(soDetail.ordered_date);
                    $$("dsSOExpectedDate").setDate(soDetail.expected_date);
                    $$("lblSOConfirmedDate").setDate(soDetail.confirm_date);
                    $$("lblSODeliveredDate").setDate(soDetail.delivered_date);
                    $$("lblSOFulfilledDate").setDate(soDetail.fulfilled_date);
                    $$("lblSOInvoiceDate").setDate(soDetail.invoice_paid_date);
                    $$("lblSOCompletedDate").html(soDetail.completed_date);
                    $$("lblSOReturnedDate").html(soDetail.returned_date);

                    //Load default date based on status
                    if (soDetail.state_text == "Created") {
                        if (soDetail.ordered_date == "" || soDetail.ordered_date == null)
                            $$("lblSOOrderedDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
                    }
                    if (soDetail.state_text == "Ordered") {
                        if (soDetail.completed_date == "" || soDetail.completed_date == null)
                            $$("lblSOConfirmedDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
                    }
                    if (soDetail.state_text == "Confirmed") {
                        if (soDetail.confirm_date == "" || soDetail.confirm_date == null)
                            $$("lblSOFulfilledDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
                    }
                    if (soDetail.state_text == "Fillfilled") {
                        if (soDetail.invoice_paid_date == "" || soDetail.invoice_paid_date == null)
                            $$("lblSOInvoiceDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
                    }

                    //Update search result
                    var row = page.controls.grdSOResult.selectedRows()[0];
                    page.controls.grdSOResult.updateRow(row.attr("row_id"), soDetail)

                    page.view.UIState(soDetail.state_text);
                }
                page.view.salesHistory();
                return page.selectedSO;
            },
            selectedSOItems: function (data) {
                page.currentSOItems = data;
                //Set the template for SO Items list
                page.controls.grdSOItems.width("2550px");
                //if (page.viewMode == "Desktop") {
                if (true) {
                    page.controls.grdSOItems.height("auto");
                    if (page.fullfillMode == true) {
                        page.controls.grdSOItems.setTemplate({
                            selection: "Single",
                            columns: [
                                { 'name': "", 'width': "50px", 'dataField': "order_item_id", editable: false, visible: page.selectedSO.state_text == "Created", itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='    border: none;    background-color: transparent;    background-image: url(cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" },
                                { 'name': "Sl No", 'width': "70px", 'dataField': "sl_no" },
                                { 'name': "", 'width': "1px", 'dataField': "order_item_id", editable: false },
                                { 'name': "Item Name", 'width': "120px", 'dataField': "item_name", editable: false },
                                //{ 'name': "Item No", 'width': "100px", 'dataField': "item_no", editable: false },
                                { 'name': "Item No", 'width': "100px", 'dataField': "item_code", editable: false },
                                { 'name': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                                { 'name': "Unit", 'width': "75px", 'dataField': "unit",itemTemplate: "<div  id='prdDetail' style=''></div>"},// editable: false },
                                { 'name': "Qty", 'width': "50px", 'dataField': "temp_qty", editable: page.selectedSO.state_text == "Created" },
                                { 'name': "", 'width': "0px", 'dataField': "quantity", editable: page.selectedSO.state_text == "Created" },
                                { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: page.selectedSO.state_text == "Created", visible: CONTEXT.SHOW_FREE },
                                { 'name': "Free Qty", 'width': "80px", 'dataField': "temp_free_qty", editable: page.selectedSO.state_text == "Created", visible: CONTEXT.SHOW_FREE },
                                { 'name': "In Stock", 'width': "70px", 'dataField': "qty_stock" },

                                { 'name': "Returned", 'width': "80px", 'dataField': "qty_returned", editable: false, visible: page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },

                                { 'name': "Fulfilled", 'width': "80px", 'dataField': "fullfilled", editable: false, visible: page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },
                                { 'name': "To Fulfill", 'width': "80px", 'dataField': "tofullfilled", editable: page.selectedSO.state_text == "Confirmed", visible: page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },

                                { 'name': "Delivered", 'width': "80px", 'dataField': "delivered", visible: true },
                                { 'name': "To Delivered", 'width': "100px", 'dataField': "todelivered", visible: false },

                                { 'name': "Tray", 'width': "40px", 'dataField': "tray_count", editable: page.selectedSO.state_text == "Created", visible: CONTEXT.ENABLE_MODULE_TRAY && page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },

                                { 'name': "Price", 'width': "45px", 'dataField': "price", editable: false },
                                { 'name': "Disc", 'width': "50px", 'dataField': "discount" },
                                { 'name': "GST", 'width': "25px", 'dataField': "tax_per" },
                                { 'name': "Amount", 'width': "80px", 'dataField': "total_price" },

                                { 'name': "Variation", 'width': "120px", 'dataField': "variation_name", editable: false, visible: CONTEXT.ENABLE_VARIATION },
                                { 'name': "MRP", 'width': "45px", 'dataField': "mrp", editable: false, visible: CONTEXT.ENABLE_MRP },
                                { 'name': "Batch No", 'width': "120px", 'dataField': "batch_no", editable: false, visible: CONTEXT.ENABLE_BAT_NO },
                                { 'name': "Manufacture Date", 'width': "150px", 'dataField': "man_date", editable: false, visible: CONTEXT.ENABLE_EXP_DATE },
                                { 'name': "Expiry Date", 'width': "120px", 'dataField': "expiry_date", editable: false, visible: CONTEXT.ENABLE_EXP_DATE },
                                { 'name': "HSN Code", 'width': "100px", 'dataField': "hsn_code", editable: false, visible: CONTEXT.ENABLE_HSN_CODE },
                                { 'name': "CGST", 'width': "80px", 'dataField': "cgst" },
                                { 'name': "SGST", 'width': "80px", 'dataField': "sgst" },
                                { 'name': "IGST", 'width': "80px", 'dataField': "igst" },


                                { 'name': "", 'width': "0px", 'dataField': "cost" },
                                { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                                { 'name': "", 'width': "0px", 'dataField': "qty_const" },

                                { 'name': "", 'width': "1px", 'dataField': "tax_class_no" },
                                { 'name': "", 'width': "1px", 'dataField': "discount_no" },
                                { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },

                                { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                                { 'name': "", 'width': "0px", 'dataField': "alter_unit" },
                                { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                                { 'name': "", 'width': "0px", 'dataField': "var_no" },
                                { 'name': "", 'width': "0px", 'dataField': "price_no" },
                                { 'name': "", 'width': "0px", 'dataField': "tax_class_no" },
                                { 'name': "", 'width': "0px", 'dataField': "discount_inclusive" },
                                { 'name': "", 'width': "0px", 'dataField': "tax_inclusive" },
                                { 'name': "", 'width': "0px", 'dataField': "item_sub_total" },

                                { 'name': "", 'width': "0px", 'dataField': "alter_price_1" },
                                { 'name': "", 'width': "0px", 'dataField': "alter_price_2" },
                                { 'name': "", 'width': "0px", 'dataField': "temp_price" },
                            ]
                        });
                    }
                    else if (page.deliveryMode == true) {
                        page.controls.grdSOItems.setTemplate({
                            selection: "Single",
                            columns: [
                                { 'name': "", 'width': "50px", 'dataField': "order_item_id", editable: false, visible: page.selectedSO.state_text == "Created", itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='    border: none;    background-color: transparent;    background-image: url(cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" },
                                { 'name': "Sl No", 'width': "70px", 'dataField': "sl_no" },
                                { 'name': "", 'width': "1px", 'dataField': "order_item_id", editable: false },
                                { 'name': "Item Name", 'width': "120px", 'dataField': "item_name", editable: false },
                                { 'name': "Item No", 'width': "100px", 'dataField': "item_no", editable: false },
                                { 'name': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                                { 'name': "Unit", 'width': "75px", 'dataField': "unit",itemTemplate: "<div  id='prdDetail' style=''></div>"},// editable: false },
                                { 'name': "Qty", 'width': "50px", 'dataField': "temp_qty", editable: page.selectedSO.state_text == "Created" },
                                { 'name': "", 'width': "0px", 'dataField': "quantity", editable: page.selectedSO.state_text == "Created" },
                                { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: page.selectedSO.state_text == "Created", visible: CONTEXT.SHOW_FREE },
                                { 'name': "Free Qty", 'width': "80px", 'dataField': "temp_free_qty", editable: page.selectedSO.state_text == "Created", visible: CONTEXT.SHOW_FREE },
                                { 'name': "In Stock", 'width': "70px", 'dataField': "qty_stock", visible: CONTEXT.SHOW_STOCK_COLUMN },

                                { 'name': "Returned", 'width': "80px", 'dataField': "qty_returned", editable: false, visible: page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },

                                { 'name': "Fulfilled", 'width': "80px", 'dataField': "fullfilled", editable: false, visible: true },
                                { 'name': "To Fulfill", 'width': "80px", 'dataField': "tofullfilled", editable: page.selectedSO.state_text == "Confirmed", visible: false },

                                { 'name': "Delivered", 'width': "80px", 'dataField': "delivered", editable: false, visible: page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },
                                { 'name': "To Delivered", 'width': "100px", 'dataField': "todelivered", editable: page.selectedSO.state_text == "Fulfilled" || page.selectedSO.state_text == "Confirmed", visible: page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },

                                { 'name': "Tray", 'width': "40px", 'dataField': "tray_count", editable: page.selectedSO.state_text == "Created", visible: CONTEXT.ENABLE_MODULE_TRAY && page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },

                                { 'name': "Price", 'width': "45px", 'dataField': "price", editable: false },
                                { 'name': "Disc", 'width': "50px", 'dataField': "discount" },
                                { 'name': "GST", 'width': "25px", 'dataField': "tax_per" },
                                { 'name': "Amount", 'width': "80px", 'dataField': "total_price" },

                                { 'name': "Variation", 'width': "120px", 'dataField': "variation_name", editable: false, visible: CONTEXT.ENABLE_VARIATION },
                                { 'name': "MRP", 'width': "45px", 'dataField': "mrp", editable: false, visible: CONTEXT.ENABLE_MRP },
                                { 'name': "Batch No", 'width': "120px", 'dataField': "batch_no", editable: false, visible: CONTEXT.ENABLE_BAT_NO },
                                { 'name': "Manufacture Date", 'width': "150px", 'dataField': "man_date", editable: false, visible: CONTEXT.ENABLE_EXP_DATE },
                                { 'name': "Expiry Date", 'width': "120px", 'dataField': "expiry_date", editable: false, visible: CONTEXT.ENABLE_EXP_DATE },
                                { 'name': "HSN Code", 'width': "100px", 'dataField': "hsn_code", editable: false, visible: CONTEXT.ENABLE_HSN_CODE },
                                { 'name': "CGST", 'width': "80px", 'dataField': "cgst" },
                                { 'name': "SGST", 'width': "80px", 'dataField': "sgst" },
                                { 'name': "IGST", 'width': "80px", 'dataField': "igst" },

                                { 'name': "", 'width': "0px", 'dataField': "cost" },
                                { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                                { 'name': "", 'width': "0px", 'dataField': "qty_const" },

                                { 'name': "", 'width': "1px", 'dataField': "tax_class_no" },
                                { 'name': "", 'width': "1px", 'dataField': "discount_no" },
                                { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                               // { 'name': "", 'width': "50px", 'dataField': "item_no", editable: false, visible: page.selectedSO.state_text == "Created", itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='    border: none;    background-color: transparent;    background-image: url(cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" }
                               { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                                { 'name': "", 'width': "0px", 'dataField': "alter_unit" },
                                { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                                { 'name': "", 'width': "0px", 'dataField': "var_no" },
                                { 'name': "", 'width': "0px", 'dataField': "price_no" },
                                { 'name': "", 'width': "0px", 'dataField': "tax_class_no" },
                                { 'name': "", 'width': "0px", 'dataField': "discount_inclusive" },
                                { 'name': "", 'width': "0px", 'dataField': "tax_inclusive" },
                                { 'name': "", 'width': "0px", 'dataField': "item_sub_total" },

                                { 'name': "", 'width': "0px", 'dataField': "alter_price_1" },
                                { 'name': "", 'width': "0px", 'dataField': "alter_price_2" },
                                { 'name': "", 'width': "0px", 'dataField': "temp_price" },
                            ]
                        });
                    }
                    else if (page.trayMode == true) {
                        page.controls.grdSOItems.setTemplate({
                            selection: "Single",
                            columns: [
                                { 'name': "", 'width': "50px", 'dataField': "order_item_id", editable: false, visible: page.selectedSO.state_text == "Created", itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='    border: none;    background-color: transparent;    background-image: url(cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" },
                                { 'name': "Sl No", 'width': "70px", 'dataField': "sl_no" },
                                { 'name': "", 'width': "1px", 'dataField': "order_item_id", editable: false },
                                { 'name': "Item Name", 'width': "120px", 'dataField': "item_name", editable: false },
                                { 'name': "Item No", 'width': "100px", 'dataField': "item_no", editable: false },
                                { 'name': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                                { 'name': "Unit", 'width': "75px", 'dataField': "unit",itemTemplate: "<div  id='prdDetail' style=''></div>"},// editable: false },
                                { 'name': "Qty", 'width': "50px", 'dataField': "temp_qty", editable: page.selectedSO.state_text == "Created" },
                                { 'name': "", 'width': "0px", 'dataField': "quantity", editable: page.selectedSO.state_text == "Created" },
                                { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: page.selectedSO.state_text == "Created", visible: CONTEXT.SHOW_FREE },
                                { 'name': "Free Qty", 'width': "80px", 'dataField': "temp_free_qty", editable: page.selectedSO.state_text == "Created", visible: CONTEXT.SHOW_FREE },
                                { 'name': "In Stock", 'width': "70px", 'dataField': "qty_stock", visible: CONTEXT.SHOW_STOCK_COLUMN },

                                { 'name': "Returned", 'width': "80px", 'dataField': "qty_returned", editable: false, visible: page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },

                                { 'name': "Fulfilled", 'width': "80px", 'dataField': "fullfilled", editable: false, visible: true },
                                { 'name': "To Fulfill", 'width': "80px", 'dataField': "tofullfilled", editable: page.selectedSO.state_text == "Confirmed", visible: false },

                                { 'name': "Delivered", 'width': "80px", 'dataField': "delivered", editable: false, visible: page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },
                                //{ 'name': "To Delivered", 'width': "100px", 'dataField': "todelivered", editable: page.selectedSO.state_text == "Fulfilled" || page.selectedSO.state_text == "Confirmed", visible: page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },

                                { 'name': "Tray", 'width': "40px", 'dataField': "tray_count", editable: false, visible: CONTEXT.ENABLE_MODULE_TRAY && page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },
                                { 'name': "To Tray", 'width': "100px", 'dataField': "tray_received", editable: true, visible: CONTEXT.ENABLE_MODULE_TRAY && page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },

                                { 'name': "Price", 'width': "45px", 'dataField': "price", editable: false },
                                { 'name': "Disc", 'width': "50px", 'dataField': "discount" },
                                { 'name': "GST", 'width': "25px", 'dataField': "tax_per" },
                                { 'name': "Amount", 'width': "80px", 'dataField': "total_price" },

                                { 'name': "Variation", 'width': "120px", 'dataField': "variation_name", editable: false, visible: CONTEXT.ENABLE_VARIATION },
                                { 'name': "MRP", 'width': "45px", 'dataField': "mrp", editable: false, visible: CONTEXT.ENABLE_MRP },
                                { 'name': "Batch No", 'width': "120px", 'dataField': "batch_no", editable: false, visible: CONTEXT.ENABLE_BAT_NO },
                                { 'name': "Manufacture Date", 'width': "150px", 'dataField': "man_date", editable: false, visible: CONTEXT.ENABLE_EXP_DATE },
                                { 'name': "Expiry Date", 'width': "120px", 'dataField': "expiry_date", editable: false, visible: CONTEXT.ENABLE_EXP_DATE },
                                { 'name': "HSN Code", 'width': "100px", 'dataField': "hsn_code", editable: false, visible: CONTEXT.ENABLE_HSN_CODE },
                                { 'name': "CGST", 'width': "80px", 'dataField': "cgst" },
                                { 'name': "SGST", 'width': "80px", 'dataField': "sgst" },
                                { 'name': "IGST", 'width': "80px", 'dataField': "igst" },

                                { 'name': "", 'width': "0px", 'dataField': "cost" },
                                { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                                { 'name': "", 'width': "0px", 'dataField': "qty_const" },

                                { 'name': "", 'width': "1px", 'dataField': "tax_class_no" },
                                { 'name': "", 'width': "1px", 'dataField': "discount_no" },
                                { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                               // { 'name': "", 'width': "50px", 'dataField': "item_no", editable: false, visible: page.selectedSO.state_text == "Created", itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='    border: none;    background-color: transparent;    background-image: url(cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" }
                               { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                                { 'name': "", 'width': "0px", 'dataField': "alter_unit" },
                                { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                                { 'name': "", 'width': "0px", 'dataField': "var_no" },
                                { 'name': "", 'width': "0px", 'dataField': "price_no" },
                                { 'name': "", 'width': "0px", 'dataField': "tax_class_no" },
                                { 'name': "", 'width': "0px", 'dataField': "discount_inclusive" },
                                { 'name': "", 'width': "0px", 'dataField': "tax_inclusive" },
                                { 'name': "", 'width': "0px", 'dataField': "item_sub_total" },

                                { 'name': "", 'width': "0px", 'dataField': "alter_price_1" },
                                { 'name': "", 'width': "0px", 'dataField': "alter_price_2" },
                                { 'name': "", 'width': "0px", 'dataField': "temp_price" },
                            ]
                        });
                    }
                    else {
                        page.controls.grdSOItems.setTemplate({
                            selection: "Single",
                            columns: [
                                { 'name': "", 'width': "50px", 'dataField': "order_item_id", editable: false, visible: page.selectedSO.state_text == "Created", itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='    border: none;    background-color: transparent;    background-image: url(cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" },
                                { 'name': "Sl No", 'width': "70px", 'dataField': "sl_no" },
                                { 'name': "", 'width': "1px", 'dataField': "order_item_id", editable: false },
                                { 'name': "Item Name", 'width': "120px", 'dataField': "item_name", editable: false },
                                { 'name': "Item No", 'width': "100px", 'dataField': "item_no", editable: false },
                                { 'name': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                                { 'name': "Unit", 'width': "75px", 'dataField': "unit",itemTemplate: "<div  id='prdDetail' style=''></div>"},// editable: false },
                                { 'name': "Qty", 'width': "50px", 'dataField': "temp_qty", editable: page.selectedSO.state_text == "Created" },
                                { 'name': "", 'width': "0px", 'dataField': "quantity", editable: page.selectedSO.state_text == "Created" },
                                { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: page.selectedSO.state_text == "Created", visible: CONTEXT.SHOW_FREE },
                                { 'name': "Free Qty", 'width': "80px", 'dataField': "temp_free_qty", editable: page.selectedSO.state_text == "Created", visible: CONTEXT.SHOW_FREE },
                                { 'name': "In Stock", 'width': "80px", 'dataField': "qty_stock", visible: CONTEXT.SHOW_STOCK_COLUMN },

                                { 'name': "Returned", 'width': "80px", 'dataField': "qty_returned", editable: false, visible: page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },

                                { 'name': "Fulfilled", 'width': "100px", 'dataField': "fullfilled", editable: false, visible: page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },
                                { 'name': "To Fulfill", 'width': "100px", 'dataField': "tofullfilled", editable: page.selectedSO.state_text == "Confirmed", visible: false },

                                { 'name': "Delivered", 'width': "100px", 'dataField': "delivered", editable: false, visible: page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },
                                { 'name': "To Delivered", 'width': "100px", 'dataField': "todelivered", editable: page.selectedSO.state_text == "Fulfilled" || page.selectedSO.state_text == "Confirmed", visible: false },

                                { 'name': "Tray", 'width': "40px", 'dataField': "tray_count", visible: CONTEXT.ENABLE_MODULE_TRAY && page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },

                                { 'name': "Price", 'width': "60px", 'dataField': "price", editable: CONTEXT.SELLING_PRICE_EDITABLE && page.selectedSO.state_text == "Created" },
                                { 'name': "Disc", 'width': "60px", 'dataField': "discount" },
                                { 'name': "GST", 'width': "60px", 'dataField': "tax_per" },
                                { 'name': "Amount", 'width': "100px", 'dataField': "total_price" },

                                { 'name': "Variation", 'width': "120px", 'dataField': "variation_name", editable: false, visible: CONTEXT.ENABLE_VARIATION },
                                { 'name': "MRP", 'width': "60px", 'dataField': "mrp", editable: false, visible: CONTEXT.ENABLE_MRP },
                                { 'name': "Batch No", 'width': "120px", 'dataField': "batch_no", editable: false, visible: CONTEXT.ENABLE_BAT_NO },
                                { 'name': "Manufacture Date", 'width': "150px", 'dataField': "man_date", editable: false, visible: CONTEXT.ENABLE_EXP_DATE },
                                {'name': "Expiry Date", 'width': "120px", 'dataField': "expiry_date", editable: false, visible: CONTEXT.ENABLE_EXP_DATE },
                                { 'name': "HSN Code", 'width': "100px", 'dataField': "hsn_code", editable: false, visible: CONTEXT.ENABLE_HSN_CODE },
                                { 'name': "CGST", 'width': "80px", 'dataField': "cgst" },
                                { 'name': "SGST", 'width': "80px", 'dataField': "sgst" },
                                { 'name': "IGST", 'width': "80px", 'dataField': "igst" },

                                { 'name': "", 'width': "0px", 'dataField': "cost" },
                                { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                                { 'name': "", 'width': "0px", 'dataField': "qty_const" },

                                { 'name': "", 'width': "1px", 'dataField': "tax_class_no" },
                                { 'name': "", 'width': "1px", 'dataField': "discount_no" },
                                { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                               // { 'name': "", 'width': "50px", 'dataField': "item_no", editable: false, visible: page.selectedSO.state_text == "Created", itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='    border: none;    background-color: transparent;    background-image: url(cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" }
                               { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                                { 'name': "", 'width': "0px", 'dataField': "alter_unit" },
                                { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                                { 'name': "", 'width': "0px", 'dataField': "var_no" },
                                { 'name': "", 'width': "0px", 'dataField': "price_no" },
                                { 'name': "", 'width': "0px", 'dataField': "tax_class_no" },
                                { 'name': "", 'width': "0px", 'dataField': "discount_inclusive" },
                                { 'name': "", 'width': "0px", 'dataField': "tax_inclusive" },
                                { 'name': "", 'width': "0px", 'dataField': "item_sub_total" },

                                { 'name': "", 'width': "0px", 'dataField': "alter_price_1" },
                                { 'name': "", 'width': "0px", 'dataField': "alter_price_2" },
                                { 'name': "", 'width': "0px", 'dataField': "temp_price" },
                            ]
                        });
                    }
                }
                else {

                    page.controls.grdSOItems.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "", 'width': "50px", 'dataField': "order_item_id", editable: false, visible: page.selectedSO.state_text == "Created", itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='    border: none;    background-color: transparent;    background-image: url(cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" },
                            { 'name': "", 'width': "1px", 'dataField': "order_item_id", editable: false, visible: false },
                            { 'name': "Sl No", 'width': "70px", 'dataField': "sl_no" },
                            { 'name': "Item Name", 'width': "80px", 'dataField': "item_name", editable: false },
                            { 'name': "Item No", 'width': "0px", 'dataField': "item_no", editable: false, visible: false },
                            { 'name': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                            { 'name': "Qty", 'width': "50px", 'dataField': "temp_qty", editable: page.selectedSO.state_text == "Created" },
                            { 'name': "", 'width': "0px", 'dataField': "quantity", editable: page.selectedSO.state_text == "Created" },
                            { 'name': "Qty In Hand", 'width': "80px", 'dataField': "qty_stock", editable: false, visible: false },
                            { 'name': "Returned", 'width': "80px", 'dataField': "qty_returned", editable: false, visible: page.selectedSO.state_text != "Created" && page.selectedSO.state_text != "Ordered" },
                            { 'name': "Cost", 'width': "45px", 'dataField': "price", editable: CONTEXT.SELLING_PRICE_EDITABLE && page.selectedSO.state_text != "Ordered" },
                            { 'name': "Tray Qty", 'width': "40px", 'dataField': "tray_count", editable: page.selectedSO.state_text == "Created", visible: CONTEXT.ENABLE_MODULE_TRAY },
                            { 'name': "Disc", 'width': "40px", 'dataField': "discount", visible: false },
                            { 'name': "Tax", 'width': "40px", 'dataField': "tax_per", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "cost" },
                            { 'name': "", 'width': "1px", 'dataField': "tray_id" },
                            { 'name': "", 'width': "0px", 'dataField': "qty_const" },
                            { 'name': "", 'width': "1px", 'dataField': "tax_class_no", visible: false },
                            { 'name': "", 'width': "1px", 'dataField': "discount_no", visible: false },
                            { 'name': "", 'width': "1px", 'dataField': "qty_type", visible: false },
                            { 'name': "Amount", 'width': "45px", 'dataField': "total_price" },
                            { 'name': "", 'width': "0px", 'dataField': "var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "price_no" },
                            { 'name': "", 'width': "0px", 'dataField': "tax_class_no" },
                            { 'name': "CGST", 'width': "0px", 'dataField': "cgst" },
                            { 'name': "SGST", 'width': "0px", 'dataField': "sgst" },
                            { 'name': "IGST", 'width': "0px", 'dataField': "igst" },
                            { 'name': "", 'width': "0px", 'dataField': "discount_inclusive" },
                            { 'name': "", 'width': "0px", 'dataField': "tax_inclusive" },
                            { 'name': "", 'width': "0px", 'dataField': "item_sub_total" },
                           // { 'name': "", 'width': "45px", 'dataField': "item_no", editable: false, visible: page.selectedSO.state_text == "Created", itemTemplate: "<input type='button' value='Delete' action='Delete' />" }
                           { 'name': "", 'width': "0px", 'dataField': "alter_price_1" },
                            { 'name': "", 'width': "0px", 'dataField': "alter_price_2" },
                            { 'name': "", 'width': "0px", 'dataField': "temp_price" },
                        ]
                    });
                }

                //Handle Row Command
                page.controls.grdSOItems.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    //To Handle removing an item from list.
                    if (action == "Delete") {
                        page.controls.grdSOItems.deleteRow(rowId);

                        //Recalculate after deleting a item
                        page.calculate();

                    }
                }

                //Handle Row Bound to handle discount and quantity change.
                page.controls.grdSOItems.rowBound = function (row, item) {
                    $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdSOItems.allData().length);
                    //Check Expiry Alert
                    //if (CONTEXT.ENABLE_EXP_ALERT) {
                    //    //var today = new Date();
                    //    //today.setDate(today.getDate() - parseInt(CONTEXT.ENABLE_EXP_ALERTDays));
                    //    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                    //        if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                    //            var EnteredDate = item.expiry_date;
                    //            var date = "28";
                    //            var month = EnteredDate.substring(0, 2);
                    //            var year = EnteredDate.substring(3, 7);

                    //            var myDate = new Date(year, month - 1, date);
                    //            myDate.setDate(myDate.getDate() - parseInt(CONTEXT.ENABLE_EXP_ALERTDays));
                    //            today = new Date();
                    //            today.setHours(0, 0, 0, 0);
                    //            if (myDate <= today) {
                    //                alert("This Product Will Be Expire On " + item.expiry_date);
                    //                row[0].style.color = "orange";
                    //            }
                    //        }
                    //    } else {
                    //        if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                    //            var EnteredDate = item.expiry_date;
                    //            var date = EnteredDate.substring(0, 2);
                    //            var month = EnteredDate.substring(3, 5);
                    //            var year = EnteredDate.substring(6, 10);

                    //            var myDate = new Date(year, month - 1, date);
                    //            myDate.setDate(myDate.getDate() - parseInt(CONTEXT.ENABLE_EXP_ALERTDays));
                    //            var today = new Date();
                    //            today.setHours(0, 0, 0, 0);
                    //            if (myDate <= today) {
                    //                alert("This Product Will Be Expire On " + item.expiry_date);
                    //                row[0].style.color = "orange";
                    //            }
                    //        }
                    //    }
                    //}

                    //Check the expiry items or not
                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                        if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                            var EnteredDate = item.expiry_date;
                            var date = "28";
                            var month = EnteredDate.substring(0, 2);
                            var year = EnteredDate.substring(3, 7);

                            var myDate = new Date(year, month - 1, date);
                            var today = new Date();
                            today.setHours(0, 0, 0, 0);

                            if (CONTEXT.ENABLE_EXP_ALERT) {
                                if (myDate <= today) {
                                    if (!CONTEXT.POS_ALLOW_EXPIRED_ITEMS) {
                                        row.find("div[datafield=qty]").css("visibility", "hidden");
                                        row.find("div[datafield=temp_qty]").css("visibility", "hidden");
                                        row.find("div[datafield=free_qty]").css("visibility", "hidden");
                                        row[0].style.color = "red";
                                    }
                                }
                                else {
                                    myDate.setDate(myDate.getDate() - parseInt(item.expiry_alert_days));
                                    if (myDate <= today) {
                                        alert("This Product Will Be Expire On " + item.expiry_date);
                                        row[0].style.color = "orange";
                                    }
                                }
                            } else {
                                if (myDate <= today) {
                                    if (!CONTEXT.POS_ALLOW_EXPIRED_ITEMS) {
                                        row.find("div[datafield=qty]").css("visibility", "hidden");
                                        row.find("div[datafield=temp_qty]").css("visibility", "hidden");
                                        row.find("div[datafield=free_qty]").css("visibility", "hidden");
                                        row[0].style.color = "red";
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                            var EnteredDate = item.expiry_date;
                            var date = EnteredDate.substring(0, 2);
                            var month = EnteredDate.substring(3, 5);
                            var year = EnteredDate.substring(6, 10);

                            var myDate = new Date(year, month - 1, date);
                            var today = new Date();
                            today.setHours(0, 0, 0, 0);

                            if (CONTEXT.ENABLE_EXP_ALERT) {
                                if (myDate <= today) {
                                    if (!CONTEXT.POS_ALLOW_EXPIRED_ITEMS) {
                                        row.find("div[datafield=qty]").css("visibility", "hidden");
                                        row.find("div[datafield=temp_qty]").css("visibility", "hidden");
                                        row.find("div[datafield=free_qty]").css("visibility", "hidden");
                                    }
                                    row[0].style.color = "red";
                                }
                                else {
                                    myDate.setDate(myDate.getDate() - parseInt(item.expiry_alert_days));
                                    if (myDate <= today) {
                                        alert("This Product Will Be Expire On " + item.expiry_date);
                                        row[0].style.color = "orange";
                                    }
                                }
                            } else {
                                if (myDate <= today) {
                                    if (!CONTEXT.POS_ALLOW_EXPIRED_ITEMS) {
                                        row.find("div[datafield=qty]").css("visibility", "hidden");
                                        row.find("div[datafield=temp_qty]").css("visibility", "hidden");
                                        row.find("div[datafield=free_qty]").css("visibility", "hidden");
                                    }
                                    row[0].style.color = "red";
                                }
                            }
                        }
                    }
                    if (CONTEXT.POS_SHOW_STOCK_EMPTY_COLOR) {
                        if (parseInt(item.qty_stock) <= 0) {
                            row.find("div[datafield=variation_name]").css("color", "blue");
                        }
                    }
                    if (CONTEXT.ENABLE_STOCK_ALERT) {
                        if (parseInt(item.qty_stock) <= parseInt(item.reorder_level)) {
                            alert("Item Stock Is Less Than Reorder Level")
                            row[0].style.color = "#f90bf2";
                        }
                    }
                    if (item.tray_id == "-1" || item.tray_id == null) {
                        row.find("div[datafield=tray_received]").css("visibility", "hidden");
                    }

                    var htmlTemplate = [];
                    if (CONTEXT.ENABLE_ALTER_UNIT && item.state_text == "Created") {
                        if (item.alter_unit == undefined || item.alter_unit == null || item.alter_unit == "") {
                            htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</select></div>");
                        } else {
                            htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</option><option value='1'>" + item.alter_unit + "</option></select></div>");
                        }
                    }
                    else {
                        if(item.unit_identity == "0")
                            htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</option></select></div>");
                        else
                            htmlTemplate.push("<div><select id='itemUnit'><option value='1'>" + item.alter_unit + "</option></select></div>");
                    }
                    $(row).find("[id=prdDetail]").html(htmlTemplate.join(""));
                    $(row).find("[id=itemUnit]").change(function () {
                        if ($(this).val() == "0") {
                            item.quantity = parseFloat(item.temp_qty);
                            $(row).find("[datafield=quantity]").find("div").html(parseFloat(item.temp_qty));
                            item.free_qty = parseFloat(item.temp_free_qty);
                            $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.temp_free_qty));
                            item.unit_identity = 0;
                            $(row).find("[datafield=unit_identity]").find("div").html(0);
                        } else {
                            item.quantity = parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=quantity]").find("div").html(parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact));
                            item.free_qty = parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact));
                            item.unit_identity = 1;
                            $(row).find("[datafield=unit_identity]").find("div").html(1);
                        }
                        page.calculate();
                    });

                    if (item.unit_identity == "1") {
                        item.temp_qty = parseFloat(item.quantity) / parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=temp_qty]").find("div").html(parseFloat(item.temp_qty));

                        item.temp_free_qty = parseFloat(item.free_qty) / parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=temp_free_qty]").find("div").html(parseFloat(item.temp_free_qty));

                        item.fullfilled = parseFloat(item.fullfilled) / parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=fullfilled]").find("div").html(parseFloat(item.fullfilled));

                        item.delivered = parseFloat(item.delivered) / parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=delivered]").find("div").html(parseFloat(item.delivered));

                        item.qty_returned = parseFloat(item.qty_returned) / parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=qty_returned]").find("div").html(parseFloat(item.qty_returned));
                        $(row).find("[id=itemUnit]").val(1);
                    }
                    else {
                        item.temp_qty = parseFloat(item.quantity);
                        $(row).find("[datafield=temp_qty]").find("div").html(parseFloat(item.temp_qty));
                        item.temp_free_qty = parseFloat(item.free_qty);
                        $(row).find("[datafield=temp_free_qty]").find("div").html(parseFloat(item.temp_free_qty));
                        $(row).find("[id=itemUnit]").val(0);
                    }

                    //To open Item Dicount screen and load the current discounts that is set
                    row.on("click", "[datafield=discount]", function () {
                        page.discount_item_no = item.item_no;
                        page.events.itemDiscountClick();

                    });
                    //row.on("focus", "input[datafield=quantity]", function () {

                    //    $(this).select();
                    //});

                    //Handle quantity change and recalculate
                    //row.on("change", "input[datafield=quantity]", function () {
                    //    if (item.qty_type == "Integer")
                    //        $(this).val(parseInt($(this).val()));
                    //    page.calculate();
                    //});

                    row.on("focus", "input[datafield=temp_qty]", function () {
                        $(this).select();
                    });
                    row.on("change", "input[datafield=temp_qty]", function () {
                        if (item.qty_type == "Integer")
                            $(this).val(parseInt($(this).val()));
                        if ($(row).find("[id=itemUnit]").val() == "0") {
                            item.quantity = parseFloat(item.temp_qty);
                            $(row).find("[datafield=quantity]").find("div").html(parseFloat(item.temp_qty))
                        } else {
                            item.quantity = parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=quantity]").find("div").html(parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact))
                        }
                        page.calculate();
                    });

                    row.on("change", "input[datafield=temp_free_qty]", function () {
                        if (item.qty_type == "Integer")
                            $(this).val(parseInt($(this).val()));
                        if ($(row).find("[id=itemUnit]").val() == "0") {
                            item.free_qty = parseFloat(item.temp_free_qty);
                            $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.temp_free_qty));
                        } else {
                            item.free_qty = parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact))
                        }
                        page.calculate();
                    });

                    //Handle free quantity change and recalculate
                    //row.on("change", "input[datafield=free_qty]", function () {
                    //    if (item.qty_type == "Integer")
                    //        $(this).val(parseInt($(this).val()));
                    //    page.calculate();
                    //});
                    //Handle quantity change and recalculate
                    row.on("change", "input[datafield=price]", function () {
                        page.calculate();
                    });
                    //row.on("keydown", "input[datafield=quantity]", function (e) {
                    //    if (e.which == 9) {
                    //        e.preventDefault();
                    //        var nextRow = $(this).closest("grid_row").next();
                    //        if (nextRow.length == 0) {
                    //            page.controls.txtItemSearch.selectedObject.focus();
                    //        } else {
                    //            nextRow.find("input[datafield=qty]").focus();
                    //        }

                    //    }
                    //});
                    row.on("keydown", "input[datafield=temp_qty]", function (e) {
                        if (e.which == 9) {
                            e.preventDefault();
                            var nextRow = $(this).closest("grid_row").next();
                            if (nextRow.length == 0) {
                                page.controls.txtItemSearch.selectedObject.focus();
                            } else {
                                nextRow.find("input[datafield=temp_qty]").focus();
                            }

                        }
                    });

                };

                //Bind the data
                page.controls.grdSOItems.dataBind(data);
                page.controls.grdSOItems.edit(true);

                /*  $("input[datafield=quantity]").keypress(function(){
                      $("span").text(i += 1);
                  });*/

            },
            selectedReturnSOItems: function (data) {
                $$("grdReturnSOItems").width("2200px");
                $$("grdReturnSOItems").height("220px");
                $$("grdReturnSOItems").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "", 'width': "1px", 'dataField': "order_item_id", editable: false },
                        { 'name': "Sl No", 'width': "70px", 'dataField': "sl_no" },
                            { 'name': "Item Name", 'width': "150px", 'dataField': "item_name", editable: false },
                            { 'name': "Item No", 'width': "100px", 'dataField': "item_no", editable: false },
                            { 'name': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                           // { 'name': "Batch No", 'width': "120px", 'dataField': "batch_no", editable: false, visible: CONTEXT.ENABLE_BAT_NO },
                           // { 'name': "Expiry Date", 'width': "120px", 'dataField': "expiry_date", editable: false, visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Qty", 'width': "60px", 'dataField': "ordered_qty" },
                            { 'name': "Delivered", 'width': "90px", 'dataField': "delivered" },
                           // { 'name': "Delivered Qty", 'width': "150px", 'dataField': "delivered", editable: page.selectedSO.state_text == "Created" },
                            { 'name': "Returned", 'width': "90px", 'dataField': "qty_returned_without_free", editable: false },
                            { 'name': "Unit", 'width': "80px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                            { 'name': "Return Qty", 'width': "100px", 'dataField': "ret_qty", editable: true },
                            { 'name': "Free Qty", 'width': "80px", 'dataField': "free_qty", },
                            { 'name': "Returned Free", 'width': "110px", 'dataField': "free_qty_return", editable: false },
                            { 'name': "Return Free", 'width': "100px", 'dataField': "ret_free", editable: true },
                            { 'name': "Variation", 'width': "120px", 'dataField': "variation_name", },
                            { 'name': "MRP", 'width': "70px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP },
                            { 'name': "Expiry Date", 'width': "100px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Batch No", 'width': "80px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO },
                            { 'name': "HSN Code", 'width': "100px", 'dataField': "hsn_code", visible: false },
                            { 'name': "CGST", 'width': "60px", 'dataField': "cgst",visible:false },
                            { 'name': "SGST", 'width': "60px", 'dataField': "sgst", visible: false },
                            { 'name': "IGST", 'width': "60px", 'dataField': "igst", visible: false },
                            { 'name': "Price to return", 'width': "160px", 'dataField': "item_price" },//, editable: false },
                            { 'name': "Amount", 'width': "100px", 'dataField': "tot_amount" },
                            { 'name': "", 'width': "0px", 'dataField': "price", editable: false },
                          //  { 'name': "MRP", 'width': "45px", 'dataField': "mrp", editable: false, visible: CONTEXT.ENABLE_MRP },
                           //  { 'name': "Unit", 'width': "75px", 'dataField': "unit", editable: false },
                          //  { 'name': "Disc", 'width': "50px", 'dataField': "discount" },
                            { 'name': "", 'width': "0px", 'dataField': "qty_const" },
                          //  { 'name': "Tax", 'width': "25px", 'dataField': "tax_per" },
                          { 'name': "", 'width': "0px", 'dataField': "amount" },
                          { 'name': "", 'width': "0px", 'dataField': "cost" },
                          { 'name': "", 'width': "0px", 'dataField': "price_no" },
                          { 'name': "", 'width': "0px", 'dataField': "tax_class_no" },
                          { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                           // { 'name': "Amount", 'width': "50px", 'dataField': "total_price" },

                    ]
                });

                page.controls.grdReturnSOItems.rowBound = function (row, item) {
                    $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdReturnSOItems.allData().length);
                    var htmlTemplate = [];
                    if (CONTEXT.ENABLE_ALTER_UNIT) {
                        if (item.alter_unit == undefined || item.alter_unit == null || item.alter_unit == "") {
                            htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</select></div>");
                        } else {
                            htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</option><option value='1'>" + item.alter_unit + "</option></select></div>");
                        }
                    } else {
                        htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</select></div>");
                    }
                    $(row).find("[id=prdDetail]").html(htmlTemplate.join(""));

                    $(row).find("[id=itemUnit]").change(function () {
                        if ($(this).val() == "0") {
                            item.ordered_qty = parseFloat(item.ordered_qty) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=ordered_qty]").find("div").html(parseFloat(item.ordered_qty));
                            item.qty_returned_without_free = parseFloat(item.qty_returned) - parseFloat(item.free_qty_return);
                            $(row).find("[datafield=qty_returned_without_free]").find("div").html(parseFloat(item.qty_returned_without_free));
                            item.delivered = parseFloat(item.delivered) * parseFloat(item.alter_unit_fact); //- parseFloat(item.free_qty);
                            $(row).find("[datafield=delivered]").find("div").html(parseFloat(item.delivered));
                            item.qty_returned_without_free = parseFloat(item.qty_returned_without_free) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=qty_returned_without_free]").find("div").html(parseFloat(item.qty_returned_without_free));
                            item.free_qty_return = parseFloat(item.free_qty_return) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=free_qty_return]").find("div").html(parseFloat(item.free_qty_return));
                            item.free_qty = parseFloat(item.free_qty) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.free_qty));
                            item.unit_identity = 0;
                            $(row).find("[datafield=unit_identity]").find("div").html(0);
                        }
                        else {
                            item.ordered_qty = parseFloat(item.ordered_qty) / parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=ordered_qty]").find("div").html(parseFloat(item.ordered_qty));
                            item.qty_returned_without_free = parseFloat(item.qty_returned) - parseFloat(item.free_qty_return);
                            $(row).find("[datafield=qty_returned_without_free]").find("div").html(parseFloat(item.qty_returned_without_free));
                            item.delivered = parseFloat(item.delivered) / parseFloat(item.alter_unit_fact); //- parseFloat(item.free_qty);
                            $(row).find("[datafield=delivered]").find("div").html(parseFloat(item.delivered));
                            item.qty_returned_without_free = parseFloat(item.qty_returned_without_free) / parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=qty_returned_without_free]").find("div").html(parseFloat(item.qty_returned_without_free));
                            item.free_qty_return = parseFloat(item.free_qty_return) / parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=free_qty_return]").find("div").html(parseFloat(item.free_qty_return));
                            item.free_qty = parseFloat(item.free_qty) / parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.free_qty));
                            item.unit_identity = 1;
                            $(row).find("[datafield=unit_identity]").find("div").html(1);
                        }
                        item.tot_amount = parseFloat(item.ret_qty) * parseFloat(item.item_price);
                        if (isNaN(item.tot_amount))
                            item.tot_amount = 0;
                        $(row).find("[datafield=tot_amount]").find("div").html(item.tot_amount.toFixed(5));
                    });

                    row.on("change", "input[datafield=ret_qty]", function () {
                        item.tot_amount = parseFloat(item.ret_qty) * parseFloat(item.item_price);
                        if (isNaN(item.tot_amount))
                            item.tot_amount = 0;
                        $(row).find("[datafield=tot_amount]").find("div").html(item.tot_amount.toFixed(5));
                    });
                }
                page.controls.grdReturnSOItems.dataBind(data);
                $$("grdReturnSOItems").edit(true);
            },
            selectedReturnedSOItems: function (data) {
                $$("grdReturnedSOItems").width("100%");
                $$("grdReturnedSOItems").height("220px");
                $$("grdReturnedSOItems").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "", 'width': "1px", 'dataField': "order_item_id", editable: false },
                        { 'name': "Bill No", 'width': "60px", 'dataField': "bill_no", editable: false },
                            { 'name': "Item No", 'width': "60px", 'dataField': "item_no", editable: false },
                            { 'name': "Item Name", 'width': "120px", 'dataField': "item_name", editable: false },
                          //  { 'name': "Batch No", 'width': "120px", 'dataField': "batch_no", editable: false, visible: CONTEXT.ENABLE_BAT_NO },
                           // { 'name': "Expiry Date", 'width': "120px", 'dataField': "expiry_date", editable: false, visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Qty", 'width': "50px", 'dataField': "qty" },

                            { 'name': "Return Qty", 'width': "100px", 'dataField': "qty_returned", editable: false },
                           // { 'name': "Cost", 'width': "45px", 'dataField': "price", editable: false },
                          //  { 'name': "MRP", 'width': "45px", 'dataField': "mrp", editable: false, visible: CONTEXT.ENABLE_MRP },
                            { 'name': "Unit", 'width': "75px", 'dataField': "unit", editable: false },
                           // { 'name': "Disc", 'width': "50px", 'dataField': "discount" },
                            { 'name': "", 'width': "0px", 'dataField': "qty_const" },
                           // { 'name': "Tax", 'width': "25px", 'dataField': "tax_per" },
                            { 'name': "Amount", 'width': "50px", 'dataField': "total_price" },

                    ]
                });
                page.controls.grdReturnedSOItems.dataBind(data);
            },
            selectedReturnDeliverySOItems: function (data) {
                $$("grdReturnDeliverySOItems").width("100%");
                $$("grdReturnDeliverySOItems").height("220px");
                $$("grdReturnDeliverySOItems").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "", 'width': "1px", 'dataField': "order_item_id", editable: false },
                            { 'name': "Item No", 'width': "60px", 'dataField': "item_no", editable: false },
                            { 'name': "Item Name", 'width': "120px", 'dataField': "item_name", editable: false },
                          //  { 'name': "Batch No", 'width': "120px", 'dataField': "batch_no", editable: false, visible: CONTEXT.ENABLE_BAT_NO },
                           // { 'name': "Expiry Date", 'width': "120px", 'dataField': "expiry_date", editable: false, visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Qty", 'width': "50px", 'dataField': "quantity" },

                            { 'name': "Already Delivered", 'width': "150px", 'dataField': "fullfilled" },
                            { 'name': "Return Delivery", 'width': "150px", 'dataField': "return_delivery", editable: true },
                            { 'name': "", 'width': "0px", 'dataField': "price", editable: false },
                           { 'name': "", 'width': "0px", 'dataField': "mrp", editable: false, visible: CONTEXT.ENABLE_MRP },
                            { 'name': "Unit", 'width': "75px", 'dataField': "unit", editable: false },
                           // { 'name': "Disc", 'width': "50px", 'dataField': "discount" },
                            { 'name': "", 'width': "0px", 'dataField': "qty_const" },
                           // { 'name': "Tax", 'width': "25px", 'dataField': "tax_per" },
                            { 'name': "", 'width': "0px", 'dataField': "total_price" },

                    ]
                });
                page.controls.grdReturnDeliverySOItems.dataBind(data);
                $$("grdReturnDeliverySOItems").edit(true);
            },
            selectedPendingPayment: function (data) {
                $$("lblTotalAmount").value("0");
                $$("txtReceivedAmount").value("0");

                $$("grdPendingPayment").width("100%");
                $$("grdPendingPayment").height("220px");
                $$("grdPendingPayment").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Bill No", 'width': "100px", 'dataField': "bill_no" },
                        { 'name': "Bill Date", 'width': "130px", 'dataField': "bill_date" },
                        { 'name': "Bill Type", 'width': "130px", 'dataField': "bill_type" },
                        { 'name': "Total Amount", 'width': "130px", 'dataField': "total" },
                        { 'name': "Payment Date", 'width': "130px", 'dataField': "pay_date", visible: ($$("ddlBillView").selectedValue() == "Payment View") },
                        { 'name': "Paid", 'width': "100px", 'dataField': "total_paid_amount" },
                        { 'name': "Balance", 'width': "130px", 'dataField': "balance", visible: ($$("ddlBillView").selectedValue() != "Payment View") },
                        { 'name': "", 'width': "0px", 'dataField': "expense_amt" },
                        { 'name': "Amount Pay", 'width': "130px", 'dataField': "amount_pay", editable: true },
                        { 'name': "", 'width': "50px", 'dataField': "pay_type", itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='    border: none;    background-color: transparent;    background-image: url(cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />", visible: ($$("ddlBillView").selectedValue() == "Bill View") }
                    ]
                });
                //Handle Row Command
                page.controls.grdPendingPayment.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    var amount = 0;
                    //To Handle removing an item from list.
                    if (action == "Delete") {
                        page.controls.grdPendingPayment.deleteRow(rowId);
                        var amount = 0;
                        var payAmount = 0;
                        $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                            if (item.bill_type == "Sale") {
                                amount = parseFloat(amount) + parseFloat(item.balance);
                                payAmount = parseFloat(payAmount) + parseFloat(item.amount_pay);
                            }
                            else if (item.bill_type == "SaleReturn") {
                                amount = parseFloat(amount) - parseFloat(item.balance);
                                payAmount = parseFloat(payAmount) - parseFloat(item.amount_pay);
                            }
                        });
                        $$("lblTotalAmount").value(parseFloat(amount));
                        $$("txtReceivedAmount").value(parseFloat(payAmount));
                    }
                }
                $$("grdPendingPayment").rowBound = function (row, item) {
                    item.amount_pay = parseFloat(item.balance);
                    if (item.bill_type == "Sale") {
                        $$("lblTotalAmount").value(parseFloat($$("lblTotalAmount").value()) + parseFloat(item.balance));
                        $$("txtReceivedAmount").value(parseFloat($$("txtReceivedAmount").value()) + parseFloat(item.amount_pay));
                    }
                    else if (item.bill_type == "SaleReturn") {
                        $$("lblTotalAmount").value(parseFloat($$("lblTotalAmount").value()) - parseFloat(item.balance));
                        $$("txtReceivedAmount").value(parseFloat($$("txtReceivedAmount").value()) - parseFloat(item.amount_pay));
                    }

                    row.on("change", "input[datafield=amount_pay]", function () {
                        var amount = 0;
                        $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                            if (item.bill_type == "Sale")
                                amount = parseFloat(amount) + parseFloat(item.amount_pay);
                            else if (item.bill_type == "SaleReturn")
                                amount = parseFloat(amount) - parseFloat(item.amount_pay);
                        });
                        $$("txtReceivedAmount").value(parseFloat(amount));
                    });
                }

                page.controls.grdPendingPayment.dataBind(data);
                page.controls.grdPendingPayment.edit(true);
            },

            UIState: function (state) {
                //State Buttons
                $$("btnOrderSO").hide();
                $$("btnFulfillSO").hide();
                $$("btnInvoicePaySO").hide();
                $$("btnCancelSO").hide();
                $$("btnDeliveredSO").hide();
                $$("btnCompletedSO").hide();
                $$("btnSendMail").hide();
                //Action buttons
                $$("btnAddItemToSO").hide();
                $$("btnSaveSO").hide();
                $$("btnRemoveSO").hide();
                $$("btnPayInvoiceAmount").hide();
                $$("btnReCreateSO").hide();
                $$("btnConfirmedSO").hide();
                $$("btnPartialFulfillSO").hide();
                $$("btnReturnSO").hide();
                $$("btnReturnPayInvoiceAmount").hide();
                $$("btnReturnDeliverySO").hide();


                //Print buttons              
                $$("btnInvoiceSO").hide();
                $$("btnReturnPrintSO").hide();
                $$("btnDeliverySO").hide();


                //Sales Order Details


                $$("ddlSOCustomer").disable(true);
                $$("ddlSOCustomer").css("color", "black");
                $$("ddlSOCustomer").css("background-color", "whitesmoke");


                // Shipping details
                $$("txtSOCompany").css("background-color", "white");
                $$("txtShippingAddress").css("background-color", "white");
                $$("txtDeliveryAddress").css("background-color", "white");
                $$("txtContactNo").css("background-color", "white");
                $$("txtEmail").css("background-color", "white");
                $$("txtGst").css("background-color", "whitesmoke");

                $$("txtSOCompany").readOnly(false);
                $$("txtShippingAddress").readOnly(false);
                $$("txtDeliveryAddress").readOnly(false);
                $$("txtContactNo").readOnly(false);
                $$("txtEmail").readOnly(false);
                $$("txtGst").readOnly(true);

                //Order Dates                 
                $$("lblSOOrderedDate").disable(true);
                $$("lblSOOrderedDate").css("background-color", "whitesmoke");
                $$("dsSOExpectedDate").disable(true);
                $$("dsSOExpectedDate").css("background-color", "whitesmoke");
                $$("lblSOConfirmedDate").disable(true);
                $$("lblSOConfirmedDate").css("background-color", "whitesmoke");
                $$("lblSODeliveredDate").disable(true);
                $$("lblSODeliveredDate").css("background-color", "whitesmoke");
                $$("lblSOFulfilledDate").disable(true);
                $$("lblSOFulfilledDate").css("background-color", "whitesmoke");
                $$("lblSOInvoiceDate").disable(true);
                $$("lblSOInvoiceDate").css("background-color", "whitesmoke");

                $$("lblSOCompletedDate").css("background-color", "whitesmoke");
                $$("lblSOReturnedDate").css("background-color", "whitesmoke");

                //Bill Summary
                $$("lblSubTotal").css("background-color", "whitesmoke");
                $$("lblDiscount").css("background-color", "whitesmoke");
                $$("lblTax").css("background-color", "whitesmoke");
                $$("lblTotal").css("background-color", "whitesmoke");
                $$("lblTotalAmtPaid").css("background-color", "whitesmoke");
                $$("lblTotalAmtRemaining").css("background-color", "whitesmoke");
                // $$("lblPendingAmount").css("background-color", "whitesmoke");


                //TODO : remove this

                $("#lblOrderedDisplay").css('color', "Black");
                $("#lblCreatedDisplay").css('color', "Black");
                $("#lblConfirmedDisplay").css('color', "Black");
                $("#lblDeliveredDisplay").css('color', "Black");
                $("#lblFulfilledDisplay").css('color', "Black");
                $("#lblReturnDisplay").css('color', "Black");
                $("#lblReturnDisplay").hide();
                $("#lblPaidDisplay").css('color', "Black");
                $("#lblPaidDisplay").show();

                $("#lblCreatedDisplay").hide();
                $("#lblOrderedDisplay").hide();
                $("#lblConfirmedDisplay").hide();
                $("#lblFulfilledDisplay").hide();
                $("#lblDeliveredDisplay").hide();
                $("#lblPaidDisplay").hide();
                $$("btnBack").hide();



                $$("pnlItemSearch").hide();
                $$("pnlItemActions").hide();
                page.controls.btnCancelSO.selectedObject.next().hide();
                page.controls.btnPayInvoiceAmount.selectedObject.next().hide();
                page.controls.btnReturnPayInvoiceAmount.selectedObject.next().hide();
                page.controls.btnInvoicePaySO.selectedObject.next().hide();
                page.controls.btnRemoveSO.selectedObject.next().hide();
                page.controls.btnInvoiceSO.selectedObject.next().hide();

                $$("pnlBillSummary").hide();

                if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                    $$("pnlExpenses").show();
                    $$("pnlExpenseName").show();
                }
                else {
                    $$("pnlExpenses").hide();
                    $$("pnlExpenseName").hide();
                }
                if (CONTEXT.ENABLE_ITEM_RATE) {
                    page.controls.ddlRate.show();
                }
                else {
                    page.controls.ddlRate.hide();
                }
                if (state == "Created") {
                    //Labels
                    $("#lblCreatedDisplay").show();
                    $("#lblOrderedDisplay").show();
                    $("#lblConfirmedDisplay").show();
                    $("#lblFulfilledDisplay").show();
                    $("#lblDeliveredDisplay").show();
                    $("#lblPaidDisplay").show();
                    $$("btnBack").show();
                    //Action Buttons
                    $$("btnOrderSO").show();
                    $$("btnAddItemToSO").hide();
                    $$("btnSaveSO").show();
                    $$("btnRemoveSO").show();
                    $$("btnSendMail").hide();
                    $$("btnFulfillSO").hide();
                    $$("btnReCreateSO").hide();
                    $$("btnConfirmedSO").hide();
                    $$("btnCancelSO").hide();
                    $$("btnPartialFulfillSO").hide();
                    $$("btnDeliverySO").hide();
                    $$("btnReturnSO").hide();
                    $$("btnInvoiceSO").hide();
                    $$("btnReturnPayInvoiceAmount").hide();
                    $$("btnReturnDeliverySO").hide();

                    //Flow chart
                    $("#lblCreatedDisplay").css('color', "lightgreen");
                    $("#lblOrderedDisplay").css('color', "Black");
                    $("#lblConfirmedDisplay").css('color', "Black");
                    $("#lblFulfilledDisplay").css('color', "Black");
                    $("#lblDeliveredDisplay").css('color', "Black");
                    $("#lblReturnDisplay").css('color', "Black");
                    $("#lblReturnDisplay").hide();
                    $("#lblPaidDisplay").css('color', "Black");

                    //Enabled controls on created state
                    $$("ddlSOCustomer").disable(false);
                    $$("ddlSOCustomer").css("background-color", "white");
                    $$("dsSOExpectedDate").disable(false);
                    $$("dsSOExpectedDate").css("background-color", "white");
                    $$("lblSOOrderedDate").disable(false);
                    $$("lblSOOrderedDate").css("background-color", "white");
                    $$("pnlItemSearch").show();
                    $$("pnlItemActions").hide();

                    page.controls.btnCancelSO.selectedObject.next().hide();
                    page.controls.btnPayInvoiceAmount.selectedObject.next().hide();
                    page.controls.btnReturnPayInvoiceAmount.selectedObject.next().hide();
                    page.controls.btnInvoicePaySO.selectedObject.next().hide();
                    page.controls.btnRemoveSO.selectedObject.next().show();

                    $$("pnlBillSummary").show();

                    //Sales Executive
                    page.controls.ddlDeliveryBy.disable(false);
                    $$("txtSOIBillDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));

                    //Expense Details
                    $$("txtExpenseName").disable(false);
                    $$("txtExpense").disable(false);
                }

                if (state == "Ordered") {
                    //Labels
                    $("#lblCreatedDisplay").show();
                    $("#lblOrderedDisplay").show();
                    $("#lblConfirmedDisplay").show();
                    $("#lblFulfilledDisplay").show();
                    $("#lblDeliveredDisplay").show();
                    $("#lblPaidDisplay").show();
                    $$("btnBack").show();
                    //Action Buttons
                    $$("btnFulfillSO").hide();
                    $$("btnSaveSO").hide();
                    $$("btnRemoveSO").show();
                    $$("btnSendMail").hide();
                    $$("btnReCreateSO").show();
                    $$("btnConfirmedSO").show();
                    $$("btnCancelSO").hide();
                    $$("btnPartialFulfillSO").hide();
                    $$("btnDeliverySO").hide();
                    $$("btnReturnSO").hide();
                    $$("btnInvoiceSO").show();
                    $$("btnReturnPayInvoiceAmount").hide();
                    $$("btnReturnDeliverySO").hide();


                    //Flow chart
                    $("#lblCreatedDisplay").css('color', "lightgreen");
                    $("#lblOrderedDisplay").css('color', "lightgreen");
                    $("#lblConfirmedDisplay").css('color', "Black");
                    $("#lblFulfilledDisplay").css('color', "Black");
                    $("#lblDeliveredDisplay").css('color', "Black");
                    $("#lblReturnDisplay").css('color', "Black");
                    $("#lblReturnDisplay").hide();
                    $("#lblPaidDisplay").css('color', "Black");

                    //Enabled controls on ordered state
                    $$("lblSOFulfilledDate").disable(false);
                    $$("lblSOFulfilledDate").css("background-color", "white");
                    $$("pnlItemActions").hide();

                    page.controls.btnCancelSO.selectedObject.next().hide();
                    page.controls.btnPayInvoiceAmount.selectedObject.next().hide();
                    page.controls.btnReturnPayInvoiceAmount.selectedObject.next().hide();
                    page.controls.btnInvoicePaySO.selectedObject.next().hide();
                    page.controls.btnRemoveSO.selectedObject.next().show();
                    page.controls.btnInvoiceSO.selectedObject.next().show();

                    $$("lblSOConfirmedDate").disable(false);
                    $$("lblSOConfirmedDate").css("background-color", "white");
                    $$("lblSOFulfilledDate").disable(true);
                    $$("lblSOFulfilledDate").css("background-color", "whitesmoke");


                    $$("pnlBillSummary").show();

                    //Sales Executive
                    page.controls.ddlDeliveryBy.disable(true);
                    $$("txtSOIBillDate").disable(true);

                    //Expense Name
                    page.controls.txtExpense.disable(true);
                    page.controls.txtExpenseName.disable(true);

                    //Expense Details
                    $$("txtExpenseName").disable(true);
                    $$("txtExpense").disable(true);
                }
                if (state == "Confirmed") {
                    //Labels
                    $("#lblCreatedDisplay").show();
                    $("#lblOrderedDisplay").show();
                    $("#lblConfirmedDisplay").show();
                    $("#lblFulfilledDisplay").show();
                    $("#lblDeliveredDisplay").show();
                    $("#lblPaidDisplay").show();
                    $$("btnBack").show();
                    //Action Buttons
                    $$("btnPayInvoiceAmount").show();
                    $$("btnFulfillSO").show();
                    $$("btnInvoiceSO").show();
                    $$("btnDeliveredSO").hide();
                    $$("btnSaveSO").hide();
                    $$("btnSendMail").hide();
                    $$("btnReCreateSO").hide();
                    $$("btnConfirmedSO").hide();
                    $$("btnCancelSO").show();
                    $$("btnPartialFulfillSO").hide();
                    $$("btnDeliverySO").hide();
                    $$("btnReturnSO").hide();
                    //$$("btnInvoiceSO").hide();
                    $$("btnReturnPayInvoiceAmount").show();
                    $$("btnReturnDeliverySO").hide();

                    //Flow chart
                    $("#lblCreatedDisplay").css('color', "lightgreen");
                    $("#lblOrderedDisplay").css('color', "lightgreen");
                    $("#lblConfirmedDisplay").css('color', "lightgreen");
                    $("#lblFulfilledDisplay").css('color', "Black");
                    $("#lblDeliveredDisplay").css('color', "Black");
                    $("#lblReturnDisplay").css('color', "Black");
                    $("#lblReturnDisplay").hide();
                    $("#lblPaidDisplay").css('color', "Black");

                    //Enabled controls on Fullfilled state
                    $$("lblSOFulfilledDate").disable(false);
                    $$("lblSOFulfilledDate").css("background-color", "white");
                    $$("lblSODeliveredDate").disable(true);
                    $$("lblSODeliveredDate").css("background-color", "whitesmoke");
                    $$("pnlItemActions").show();

                    //View all the controls
                    $$("btnAddToFullfill").show();
                    page.controls.btnAddToFullfill.selectedObject.next().show();
                    $$("btnAddToDelivery").show();
                    page.controls.btnAddToDelivery.selectedObject.next().show();
                    $$("btnReturnDelivery").show();
                    page.controls.btnReturnDelivery.selectedObject.next().show();

                    page.controls.btnCancelSO.selectedObject.next().show();
                    page.controls.btnPayInvoiceAmount.selectedObject.next().show();
                    page.controls.btnReturnPayInvoiceAmount.selectedObject.next().show();
                    page.controls.btnInvoicePaySO.selectedObject.next().hide();
                    page.controls.btnRemoveSO.selectedObject.next().hide();
                    page.controls.btnInvoiceSO.selectedObject.next().show();

                    $$("pnlBillSummary").show();

                    if (CONTEXT.ENABLE_MODULE_TRAY == false) {
                        $$("btnAddToTray").hide();
                        page.controls.btnAddToTray.selectedObject.next().hide();
                        $$("btnReturnTray").hide();
                        page.controls.btnReturnTray.selectedObject.next().hide();
                    }

                    //Sales Executive
                    page.controls.ddlDeliveryBy.disable(true);
                    $$("txtSOIBillDate").disable(true);

                    //Expense Details
                    $$("txtExpenseName").disable(true);
                    $$("txtExpense").disable(true);
                }
                if (state == "Fulfilled") {
                    //Labels
                    $("#lblCreatedDisplay").show();
                    $("#lblOrderedDisplay").show();
                    $("#lblConfirmedDisplay").show();
                    $("#lblFulfilledDisplay").show();
                    $("#lblDeliveredDisplay").show();
                    $("#lblPaidDisplay").show();
                    $$("btnBack").show();
                    //Action Buttons
                    $$("btnPayInvoiceAmount").show();
                    $$("btnInvoiceSO").show();
                    $$("btnDeliveredSO").show();
                    $$("btnSaveSO").hide();
                    $$("btnSendMail").hide();
                    $$("btnReCreateSO").hide();
                    $$("btnConfirmedSO").hide();
                    $$("btnCancelSO").show();
                    $$("btnPartialFulfillSO").hide();
                    $$("btnDeliverySO").hide();
                    $$("btnReturnSO").hide();
                    //$$("btnInvoiceSO").hide();
                    $$("btnReturnPayInvoiceAmount").show();
                    $$("btnReturnDeliverySO").hide();

                    //Flow chart
                    $("#lblCreatedDisplay").css('color', "lightgreen");
                    $("#lblOrderedDisplay").css('color', "lightgreen");
                    $("#lblConfirmedDisplay").css('color', "lightgreen");
                    $("#lblFulfilledDisplay").css('color', "lightgreen");
                    $("#lblDeliveredDisplay").css('color', "Black");
                    $("#lblReturnDisplay").css('color', "Black");
                    $("#lblReturnDisplay").hide();
                    $("#lblPaidDisplay").css('color', "Black");

                    //Enabled controls on Fullfilled state
                    $$("lblSODeliveredDate").disable(false);
                    $$("lblSODeliveredDate").css("background-color", "white");
                    $$("pnlItemActions").show();

                    //View the controls
                    $$("btnAddToFullfill").hide();
                    page.controls.btnAddToFullfill.selectedObject.next().hide();
                    $$("btnAddToDelivery").show();
                    page.controls.btnAddToDelivery.selectedObject.next().show();
                    $$("btnReturnDelivery").show();
                    page.controls.btnReturnDelivery.selectedObject.next().show();

                    page.controls.btnCancelSO.selectedObject.next().show();
                    page.controls.btnPayInvoiceAmount.selectedObject.next().show();
                    page.controls.btnReturnPayInvoiceAmount.selectedObject.next().show();
                    page.controls.btnInvoicePaySO.selectedObject.next().hide();
                    page.controls.btnRemoveSO.selectedObject.next().hide();
                    page.controls.btnInvoiceSO.selectedObject.next().show();

                    $$("pnlBillSummary").show();

                    if (CONTEXT.ENABLE_MODULE_TRAY == false) {
                        $$("btnAddToTray").hide();
                        page.controls.btnAddToTray.selectedObject.next().hide();
                        $$("btnReturnTray").hide();
                        page.controls.btnReturnTray.selectedObject.next().hide();
                    }

                    //Sales Executive
                    page.controls.ddlDeliveryBy.disable(true);
                    $$("txtSOIBillDate").disable(true);

                    //Expense Details
                    $$("txtExpenseName").disable(true);
                    $$("txtExpense").disable(true);
                }
                if (state == "Delivered") {
                    //Labels
                    $("#lblCreatedDisplay").show();
                    $("#lblOrderedDisplay").show();
                    $("#lblConfirmedDisplay").show();
                    $("#lblFulfilledDisplay").show();
                    $("#lblDeliveredDisplay").show();
                    $("#lblPaidDisplay").show();
                    $$("btnBack").show();
                    //Action Buttons
                    $$("btnPayInvoiceAmount").show();
                    $$("btnInvoiceSO").show();
                    $$("btnInvoicePaySO").show();
                    $$("btnSendMail").hide();
                    $$("btnReCreateSO").hide();
                    $$("btnConfirmedSO").hide();
                    $$("btnSaveSO").hide();
                    $$("btnPartialFulfillSO").hide();
                    $$("btnDeliverySO").hide();
                    $$("btnReturnSO").hide();
                    //$$("btnInvoiceSO").hide();
                    $$("btnReturnPayInvoiceAmount").show();
                    $$("btnReturnDeliverySO").hide();

                    //Enabled controls on Delivered state
                    $$("lblSOInvoiceDate").disable(false);
                    $$("lblSOInvoiceDate").css("background-color", "white");

                    //Flow chart
                    $("#lblCreatedDisplay").css('color', "lightgreen");
                    $("#lblOrderedDisplay").css('color', "lightgreen");
                    $("#lblConfirmedDisplay").css('color', "lightgreen");
                    $("#lblFulfilledDisplay").css('color', "lightgreen");
                    $("#lblDeliveredDisplay").css('color', "lightgreen");
                    $("#lblReturnDisplay").css('color', "Black");
                    $("#lblReturnDisplay").hide();
                    $("#lblPaidDisplay").css('color', "Black");

                    $$("txtSOCompany").css("background-color", "whitesmoke");
                    $$("txtShippingAddress").css("background-color", "whitesmoke");
                    $$("txtDeliveryAddress").css("background-color", "whitesmoke");
                    $$("txtContactNo").css("background-color", "whitesmoke");
                    $$("txtEmail").css("background-color", "whitesmoke");
                    $$("txtGst").css("background-color", "whitesmoke");

                    $$("txtSOCompany").readOnly(true);
                    $$("txtShippingAddress").readOnly(true);
                    $$("txtDeliveryAddress").readOnly(true);
                    $$("txtContactNo").readOnly(true);
                    $$("txtEmail").readOnly(true);
                    $$("txtGst").readOnly(true);

                    $$("pnlItemActions").show();
                    $$("btnAddToFullfill").hide();
                    page.controls.btnAddToFullfill.selectedObject.next().hide();
                    $$("btnAddToDelivery").hide();
                    page.controls.btnAddToDelivery.selectedObject.next().hide();
                    $$("btnReturnDelivery").hide();
                    page.controls.btnReturnDelivery.selectedObject.next().hide();
                    page.controls.btnReturnPayInvoiceAmount.selectedObject.next().show();
                    page.controls.btnInvoicePaySO.selectedObject.next().hide();

                    page.controls.btnCancelSO.selectedObject.next().hide();
                    page.controls.btnPayInvoiceAmount.selectedObject.next().show();
                    page.controls.btnReturnPayInvoiceAmount.selectedObject.next().show();
                    page.controls.btnInvoicePaySO.selectedObject.next().show();
                    page.controls.btnRemoveSO.selectedObject.next().hide();
                    page.controls.btnInvoiceSO.selectedObject.next().show();

                    $$("pnlBillSummary").show();

                    if (CONTEXT.ENABLE_MODULE_TRAY == false) {
                        $$("btnAddToTray").hide();
                        page.controls.btnAddToTray.selectedObject.next().hide();
                        $$("btnReturnTray").hide();
                        page.controls.btnReturnTray.selectedObject.next().hide();
                    }

                    //Sales Executive
                    page.controls.ddlDeliveryBy.disable(true);
                    $$("txtSOIBillDate").disable(true);

                    //Expense Details
                    $$("txtExpenseName").disable(true);
                    $$("txtExpense").disable(true);
                }
                if (state == "Invoice Paid") {
                    //Labels
                    $("#lblCreatedDisplay").show();
                    $("#lblOrderedDisplay").show();
                    $("#lblConfirmedDisplay").show();
                    $("#lblFulfilledDisplay").show();
                    $("#lblDeliveredDisplay").show();
                    $("#lblPaidDisplay").show();
                    $$("btnBack").show();
                    //Action Buttons
                    $$("btnInvoiceSO").show();
                    $$("btnCancelSO").show();
                    $$("btnSendMail").hide();
                    $$("btnReCreateSO").hide();
                    $$("btnConfirmedSO").hide();
                    $$("btnPartialFulfillSO").hide();
                    $$("btnDeliverySO").hide();
                    $$("btnReturnSO").hide();
                    //$$("btnInvoiceSO").hide();
                    $$("btnReturnPayInvoiceAmount").show();
                    $$("btnReturnDeliverySO").hide();

                    //Flow chart
                    $("#lblCreatedDisplay").css('color', "lightgreen");
                    $("#lblOrderedDisplay").css('color', "lightgreen");
                    $("#lblConfirmedDisplay").css('color', "lightgreen");
                    $("#lblFulfilledDisplay").css('color', "lightgreen");
                    $("#lblDeliveredDisplay").css('color', "lightgreen");
                    $("#lblReturnDisplay").css('color', "Black");
                    $("#lblReturnDisplay").hide();
                    $("#lblPaidDisplay").css('color', "lightgreen");

                    $$("txtSOCompany").css("background-color", "whitesmoke");
                    $$("txtShippingAddress").css("background-color", "whitesmoke");
                    $$("txtDeliveryAddress").css("background-color", "whitesmoke");
                    $$("txtContactNo").css("background-color", "whitesmoke");
                    $$("txtEmail").css("background-color", "whitesmoke");
                    $$("txtGst").css("background-color", "whitesmoke");

                    $$("txtSOCompany").readOnly(true);
                    $$("txtShippingAddress").readOnly(true);
                    $$("txtDeliveryAddress").readOnly(true);
                    $$("txtContactNo").readOnly(true);
                    $$("txtEmail").readOnly(true);
                    $$("txtGst").readOnly(true);
                    $$("pnlItemActions").show();
                    $$("btnAddToFullfill").hide();
                    page.controls.btnAddToFullfill.selectedObject.next().hide();
                    $$("btnAddToDelivery").hide();
                    page.controls.btnAddToDelivery.selectedObject.next().hide();
                    $$("btnReturnDelivery").hide();
                    page.controls.btnReturnDelivery.selectedObject.next().hide();

                    page.controls.btnCancelSO.selectedObject.next().show();
                    page.controls.btnPayInvoiceAmount.selectedObject.next().hide();
                    page.controls.btnReturnPayInvoiceAmount.selectedObject.next().hide();
                    page.controls.btnInvoicePaySO.selectedObject.next().hide();
                    page.controls.btnRemoveSO.selectedObject.next().show();
                    page.controls.btnInvoiceSO.selectedObject.next().show();

                    $$("pnlBillSummary").show();

                    if (CONTEXT.ENABLE_MODULE_TRAY == false) {
                        $$("btnAddToTray").hide();
                        page.controls.btnAddToTray.selectedObject.next().hide();
                        $$("btnReturnTray").hide();
                        page.controls.btnReturnTray.selectedObject.next().hide();
                    }

                    //Sales Executive
                    page.controls.ddlDeliveryBy.disable(true);
                    $$("txtSOIBillDate").disable(true);

                    //Expense Details
                    $$("txtExpenseName").disable(true);
                    $$("txtExpense").disable(true);
                }

                //if (state == "Removed") {
                if (state == "Cancel") {
                    //Labels
                    $("#lblCreatedDisplay").show();
                    $("#lblOrderedDisplay").show();
                    $("#lblConfirmedDisplay").show();
                    $$("btnBack").show();
                    //Action Buttons
                    //$$("btnInvoiceSO").show();
                    $$("btnReturnPrintSO").show();
                    $$("btnSendMail").hide();
                    $$("btnReCreateSO").hide();
                    $$("btnConfirmedSO").hide();
                    $$("btnPartialFulfillSO").hide();
                    $$("btnDeliverySO").hide();
                    $$("btnReturnSO").hide();
                    $$("btnInvoiceSO").hide();
                    $$("btnReturnPayInvoiceAmount").hide();
                    $$("btnReturnDeliverySO").hide();


                    //Flow chart
                    $("#lblCreatedDisplay").css('color', "lightgreen");
                    $("#lblOrderedDisplay").css('color', "lightgreen");
                    $("#lblConfirmedDisplay").css('color', "lightgreen");
                    $("#lblFulfilledDisplay").css('color', "Black");
                    $("#lblDeliveredDisplay").css('color', "Black");
                    $("#lblReturnDisplay").css('color', "lightgreen");
                    $("#lblReturnDisplay").show();
                    $("#lblPaidDisplay").css('color', "Black");
                    $("#lblPaidDisplay").hide();
                    $("#lblFulfilledDisplay").hide();
                    $("#lblDeliveredDisplay").hide();
                    $$("pnlItemActions").hide();

                    $$("pnlBillSummary").show();

                    if (CONTEXT.ENABLE_MODULE_TRAY == false) {
                        $$("btnAddToTray").hide();
                        page.controls.btnAddToTray.selectedObject.next().hide();
                        $$("btnReturnTray").hide();
                        page.controls.btnReturnTray.selectedObject.next().hide();
                    }
                    //Sales Executive
                    page.controls.ddlDeliveryBy.disable(true);
                    $$("txtSOIBillDate").disable(true);

                    //Expense Details
                    $$("txtExpenseName").disable(true);
                    $$("txtExpense").disable(true);
                }
            }

        }
        //QR Code Scan
        page.events.btnQrScan_click = function () {
            page.controls.pnlQrScan.open();
            page.controls.pnlQrScan.title("QR Scanning Screen");
            page.controls.pnlQrScan.width(750);
            page.controls.pnlQrScan.height(550);
            let scanner = new Instascan.Scanner({ video: $(page.controls.preview.selectedObject)[0] });
            scanner.addListener('scan', function (content) {
                page.controls.pnlQrScan.close();
                page.controls.txtItemSearch.selectedText(content);
                scanner.stop();
            });
            Instascan.Camera.getCameras().then(function (cameras) {
                if (cameras.length > 0) {
                    scanner.start(cameras[0]);
                } else {
                    console.error('No cameras found.');
                }
            }).catch(function (e) {
                console.error(e);
            });
        }


        page.interface.load = function () {
            $(page.selectedObject).load("/view/pages/item-list/item-list.html");
        }

        /*     function pendingAmount() {
                 page.salesService.getPendingAmount($$("ddlSOCustomer").selectedValue(), function(data) {
                     $(data).each(function(i, item) {
                         page.controls.lblPendingAmount.value(item.result);
                     });
                 });
             }*/

    });
}

$.fn.itemSelection = function () {
    page.finfactsEntry = new FinfactsEntry();
    var control = $.pageController.getControlContext(this).getControl();

    if (typeof control.controlName === "undefined") { //Do the intitialisation only one time.
        control.controlName = "itemSelection";

        control.view = {
            uiState: function (currentUIState) {
                if (currentUIState == "New") {
                    control.controls.grdItemFilter.width("300px");
                    control.controls.grdItemFilter.height("260px");
                    control.controls.grdItemFilter.setTemplate({
                        selection: true,
                        columns: [
                            { 'name': "Item No", 'width': "70px", 'dataField': "item_no" },
                            { 'name': "Item Name", 'width': "140px", 'dataField': "item_name" },
                            { 'name': "", 'width': "1px", 'dataField': "tax_per" },
                            { 'name': "", 'width': "1px", 'dataField': "tax_class_no" },
                            { 'name': "", 'width': "1px", 'dataField': "tray_id" },

                            { 'name': "", 'width': "1px", 'dataField': "price" }


                        ]
                    });
                    control.controls.grdItemFilter.rowBound = function (row, item) {
                        row.css("cursor", "pointer");
                        row.click(function () {
                            row.parent().children("div").css("background-color", "");
                            var chk = row.find("input[type=checkbox]");
                            if (chk.prop("checked")) {
                                row.css("background-color", "");
                                row.find("input[type=checkbox]").prop("checked", false);
                                control.events.grdItemFilter_select(item, false);
                            } else {
                                row.css("background-color", "lime");
                                row.find("input[type=checkbox]").prop("checked", true);
                                control.events.grdItemFilter_select(item, true);
                            }

                            //row.parent().find("input[type=checkbox]").prop("checked", false);
                        });
                    };
                    control.controls.grdItemFilter.dataBind([]);

                    control.controls.grdItemSelected.width("300px");
                    control.controls.grdItemSelected.height("260px");
                    control.controls.grdItemSelected.setTemplate({
                        selection: false,
                        columns: [
                            { 'name': "Item No", 'width': "70px", 'dataField': "item_no" },
                            { 'name': "", 'width': "1px", 'dataField': "tray_id" },
                            { 'name': "Item Name", 'width': "140px", 'dataField': "item_name" }
                        ]
                    });
                    control.controls.grdItemSelected.rowBound = function (row, item) {
                        row.css("cursor", "pointer");
                        row.click(function () {
                            row.parent().children("div").css("background-color", "");
                            row.css("background-color", "lime");

                            row.parent().find("input[type=checkbox]").prop("checked", false);
                            row.find("input[type=checkbox]").prop("checked", true);
                            //control.events.grdSOResult_select(item);
                        });
                    };
                    control.controls.grdItemSelected.dataBind([]);

                    //pcontrolage.controls.txtItemSearch.dataBind({
                    //    getData: function (term, callback) {
                    //        //page.itemService.getItemAutoComplete(term, page.sales_tax_no, callback);
                    //        callback(page.productList);
                    //    }
                    //});
                }
            }
        }
        control.events = {
            page_init: function () {
                //control.view.uiState("New");

            },
            page_load: function () {
                control.view.uiState("New");

                control.controls.txtItemSearch.val("");
                control.controls.txtItemSearch.focus();
                control.controls.grdItemFilter.dataBind([]);
                control.controls.grdItemSelected.dataBind([]);

            },
            grdItemFilter_select: function (item) {
                if (!exists(control.controls.grdItemSelected.allData(), "item_no", item.item_no))
                    control.controls.grdItemSelected.createRow(item);
            },
            txtItemSelAdd_click: function () {
                if (control.interface.select) {
                    control.interface.select(control.controls.grdItemSelected.allData());
                    //control.controls.pnlItemSelectionPopup.close();
                }
                control.controls.grdItemSelected.dataBind([]);
            },
            txtItemSelCancel_click: function () {
                if (control.interface.select) {

                }
            }
        };

        control.interface.select = null;
        control.interface.load = function () {

            control.controls.grdItemSelected.dataBind([]);

            control.controls.txtItemSearch.selectedObject.bind('change keyup paste', function () {

                control.itemService.getItemsAutoComplete(control.controls.txtItemSearch.value(), function (data) {
                    control.controls.grdItemFilter.dataBind(data);
                });
            });
        }
        control.itemService = new ItemService();
        $.pageController.initControlAndEvents(control);
    }

    return control.interface;
}


function exists(data, column, columnValue) {
    var exists = false;
    for (var d in data) {
        if (data[d][column] == columnValue) {
            exists = true;
            break;
        }
    }
    return exists;
}


function compareContents(origData, currData, keys, updColumns) {
    var deleteData = [];
    var addedData = [];
    var updatedData = [];
    $(origData).each(function (i2, origItem) {
        var found = false;
        $(currData).each(function (i3, currItem) {
            var keyMatch = true;
            $(keys.split(',')).each(function (i1, key1) {
                if (origItem[key1] != currItem[key1])
                    keyMatch = false;
            });
            if (keyMatch)
                found = true;
        });
        if (found == false)
            deleteData.push(origItem);
    });
    $(currData).each(function (i2, origItem) {
        var found = false;
        $(origData).each(function (i3, currItem) {
            var keyMatch = true;
            $(keys.split(',')).each(function (i1, key1) {
                if (origItem[key1] != currItem[key1])
                    keyMatch = false;
            });
            if (keyMatch)
                found = true;
        });
        if (found == false)
            addedData.push(origItem);
    });


    $(currData).each(function (i2, origItem) {
        var found = false;
        $(origData).each(function (i3, currItem) {
            var keyMatch = true;
            $(keys.split(',')).each(function (i1, key1) {
                if (origItem[key1] != currItem[key1])
                    keyMatch = false;
            });
            if (keyMatch) {

                $(updColumns.split(',')).each(function (i5, column) {
                    if (origItem[column] != currItem[column])
                        found = true;
                });


            }
        });
        if (found == true)
            updatedData.push(origItem);
    });
    return {
        deletedDate: deleteData,
        addedData: addedData,
        updatedData: updatedData
    };
}
