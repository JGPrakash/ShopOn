WEBUI = {};
WEBUI.CONTEXT = {};
WEBUI.CONTEXT.RootPath = "";


window.mobile = false;
if (matchMedia) {
    var mq = window.matchMedia("(min-width: 500px)");
    mq.addListener(WidthChange);
    WidthChange(mq);
}

// media query change
function WidthChange(mq) {
    if (mq.matches) {
        window.mobile = false;
        // window width is at least 500px
    } else {
        window.mobile = true;
        // window width is less than textBo
    }

}

$(document).ready(function () {

    //Set Language For Controls
    setTimeout(function () {
        $(".label[rlabel]").each(function (i, label) {
            $(label).html(WEBUI.LANG[CONTEXT.CurrentLanguage][$(label).attr("rlabel")]);
        });
        $(".header-label[rlabel]").each(function (i, label) {
            $(label).html(WEBUI.LANG[CONTEXT.CurrentLanguage][$(label).attr("rlabel")]);
        });
    }, 2000)
    
    //$(".primaryReadButton[rlabel]").each(function (i, primaryReadButton) {
    //    $(primaryReadButton).html(WEBUI.LANG[CONTEXT.CurrentLanguage][$(primaryReadButton).attr("rlabel")]);
    //}); 
    //$(".primaryWriteButton[rlabel]").each(function (i, primaryWriteButton) {
    //    $(primaryWriteButton).val(WEBUI.LANG[CONTEXT.CurrentLanguage][$(primaryWriteButton).attr("rlabel")]);
    //});
    //$(".secondaryButton[rlabel]").each(function (i, secondaryButton) {
    //    $(secondaryButton).html(WEBUI.LANG[CONTEXT.CurrentLanguage][$(secondaryButton).attr("rlabel")]);
    //});
    

    $.fn.actionButton = function () {
        return $.pageController.getControl(this, function (page) {
            //Set the default properties for button
            $(page.selectedObject).attr("type", "button");
            $(page.selectedObject).addClass("button");
            
            //Expose the click event
            page.events.page_load = function () {
                //Click Event
                $(page.selectedObject).click(function () {
                    if (page.clickHandler != null) {
                        if (typeof $(page.selectedObject).attr("requiredUnSavedCheck") != "undefined") {
                            unSavedChangesCheck($(page.selectedObject).attr("requiredUnSavedCheck"), function () {
                                page.clickHandler();
                            }); //Pass function with empty argumnets.Inside that pass the necessary arguments in scope.
                        } else
                            page.clickHandler();
                    }
                });
                if (typeof $(page.selectedObject).attr("rlabel") != "undefined")
                    $(page.selectedObject).attr("value", WEBUI.LANG[CONTEXT.CurrentLanguage][$(page.selectedObject).attr("rlabel")]);
            };

            //Available public interface.
            page.clickHandler = null;
            page.interface.click = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).click();
                } else {
                    page.clickHandler = handler;
                }
            };




        });

    }



    //Default button action implementation
    //Note the default button should be inside the panel that has attribute as default-button
    //$("body").keydown(function (e) {
    //    if (e.keyCode == 13) {

    //        var defButton = $(e.target).closest("[default-button]").attr("default-button");
    //        setTimeout(function () {
    //            $(e.target).closest("[default-button]").find("[controlid=" + defButton + "]").click();
    //        }, 50);

    //        e.stopPropagation();
    //        e.preventDefault();
    //    }
    //});

    //Generic html Control.Returns a plain jquery object 
    $.fn.htmlControl = function () {
        return $.pageController.getControl(this, function (page) {
            page.interface = $(page.selectedObject);
            page.attachCommonroperties();
        });
        $(page.selectedObject).attr("value", WEBUI.LANG[CONTEXT.CurrentLanguage][$(page.selectedObject).attr("rlabel")]);
    }


    $.fn.multiButton = function () {
        return $.pageController.getControl(this, function (page) {
            //Set the default properties for button
            //  $(page.selectedObject).attr("type", "button");
            var htmlTemplate = '<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">New Invoice  ';
            htmlTemplate = htmlTemplate + '<span class="caret"></span></button>';
            htmlTemplate = htmlTemplate + '<ul class="dropdown-menu">';
            $($(page.selectedObject).attr("multi-buttons").split(",")).each(function (i, item) {
                htmlTemplate = htmlTemplate + '<li><a href="#">' + item + '</a></li>';
            });

            //htmlTemplate= htmlTemplate + '<li><a href="#">CSS</a></li>';
            //htmlTemplate= htmlTemplate + '<li><a href="#">JavaScript</a></li>';
            htmlTemplate = htmlTemplate + '</ul>';
            $(page.selectedObject).attr("class", "dropdown");
            $(page.selectedObject).html(htmlTemplate);

            //Page Load
            page.events.page_load = function () {
                //Click Event
                $(page.selectedObject).find("li").click(function () {
                    if (page.clickHandler != null) {
                        //Unsaved changes check
                        if (typeof $(page.selectedObject).attr("requiredUnSavedCheck") != "undefined") {
                            $.unSavedChangesCheck($(page.selectedObject).attr("requiredUnSavedCheck"), function () {
                                page.clickHandler($(this).text());
                            });
                        }
                        else
                            page.clickHandler($(this).text());
                    }
                });
            };

            //Available public interface.
            page.clickHandler = null;
            page.interface.click = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).click();
                } else {
                    page.clickHandler = handler;
                }
            };
            page.attachCommonroperties();

        });

    }


    //Action Buttons
    //Primary Save or write operation
    $.fn.primaryWriteButton = function () {
        return $.pageController.getControl(this, function (page) {
            //Set the default properties for button
            $(page.selectedObject).attr("type", "button");
            $(page.selectedObject).addClass("primaryWriteButton");
            

            //Page Load
            page.events.page_load = function () {
                //Click Event
                $(page.selectedObject).click(function () {
                    if (page.clickHandler != null) {
                        //Unsaved changes check
                        if (typeof $(page.selectedObject).attr("requiredUnSavedCheck") != "undefined") {
                            $.unSavedChangesCheck($(page.selectedObject).attr("requiredUnSavedCheck"), function () {
                                page.clickHandler();
                            });
                        }
                        else
                            page.clickHandler();
                    }
                });
                if (typeof $(page.selectedObject).attr("rlabel") != "undefined")
                    $(page.selectedObject).attr("value", WEBUI.LANG[CONTEXT.CurrentLanguage][$(page.selectedObject).attr("rlabel")]);
            };

            //Available public interface.
            page.clickHandler = null;
            page.interface.click = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).click();
                } else {
                    page.clickHandler = handler;
                }
            };
            page.attachCommonroperties();

        });

    }
    //Primary Read,Search or preview information
    $.fn.primaryReadButton = function () {
        return $.pageController.getControl(this, function (page) {
            //Set the default properties for button
            $(page.selectedObject).attr("type", "button");
            $(page.selectedObject).addClass("primaryReadButton");
            
            //Page Load
            page.events.page_load = function () {
                //Click Event
                $(page.selectedObject).click(function () {
                    if (page.clickHandler != null) {
                        //Unsaved changes check
                        if (typeof $(page.selectedObject).attr("requiredUnSavedCheck") != "undefined") {
                            $.unSavedChangesCheck($(page.selectedObject).attr("requiredUnSavedCheck"), function () {
                                page.clickHandler();
                            });
                        }
                        else
                            page.clickHandler();
                    }
                });
                if (typeof $(page.selectedObject).attr("rlabel") != "undefined")
                    $(page.selectedObject).attr("value", WEBUI.LANG[CONTEXT.CurrentLanguage][$(page.selectedObject).attr("rlabel")]);
            };

            //Available public interface.
            page.clickHandler = null;
            page.interface.click = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).click();
                } else {
                    page.clickHandler = handler;
                }
            };
            page.attachCommonroperties();
        });
    }
    //All actions other than primary
    $.fn.secondaryButton = function () {
        return $.pageController.getControl(this, function (page) {
            //Set the default properties for button
            $(page.selectedObject).attr("type", "button");
            $(page.selectedObject).addClass("secondaryButton");
            //$(page.selectedObject).attr("value", WEBUI.LANG[CONTEXT.CurrentLanguage][$(page.selectedObject).attr("rlabel")]);
            if (typeof $(page.selectedObject).attr("rlabel") != "undefined")
                $(page.selectedObject).val(WEBUI.LANG[CONTEXT.CurrentLanguage][$(page.selectedObject).attr("rlabel")]);
            //Page Load
            page.events.page_load = function () {
                //Click Event
                $(page.selectedObject).click(function () {
                    if (page.clickHandler != null) {
                        //Unsaved changes check
                        if (typeof $(page.selectedObject).attr("requiredUnSavedCheck") != "undefined") {
                            $.unSavedChangesCheck($(page.selectedObject).attr("requiredUnSavedCheck"), function () {
                                page.clickHandler();
                            });
                        }
                        else
                            page.clickHandler();
                    }
                });
            };

            //Available public interface.
            page.clickHandler = null;
            page.interface.click = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).click();
                } else {
                    page.clickHandler = handler;
                }
            };
            page.attachCommonroperties();
        });
    }

    //Image Button
    $.fn.imageButton = function () {
        return $.pageController.getControl(this, function (page) {
            //Set the default properties for button
            $(page.selectedObject).attr("type", "image");
            $(page.selectedObject).addClass("");

            //Expose the click event
            page.events.page_load = function () {
                //Click Event
                $(page.selectedObject).click(function () {
                    if (page.clickHandler != null) {
                        if (typeof $(page.selectedObject).attr("requiredUnSavedCheck") != "undefined") {
                            $.unSavedChangesCheck($(page.selectedObject).attr("requiredUnSavedCheck"), function () {
                                page.clickHandler();
                            });    //Pass function with empty argumnets.Inside that pass the necessary arguments in scope.
                        }
                        else
                            page.clickHandler();
                    }
                });
            };

            //Available public interface for the Button
            page.clickHandler = null;
            page.interface.click = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).click();
                } else {
                    page.clickHandler = handler;
                }
            };
            page.attachCommonroperties();
        });
    }

    //Buttons used to Switching view
    $.fn.tabButton = function () {
        return $.pageController.getControl(this, function (page) {
            //Set the default properties for button
            $(page.selectedObject).attr("type", "button");
            $(page.selectedObject).addClass("tabButton");

            //Page Load
            page.events.page_load = function () {
                //Click Event
                $(page.selectedObject).click(function () {
                    if (page.clickHandler != null) {
                        //Unsaved changes check
                        if (typeof $(page.selectedObject).attr("requiredUnSavedCheck") != "undefined") {
                            $.unSavedChangesCheck($(page.selectedObject).attr("requiredUnSavedCheck"), function () {
                                page.clickHandler();
                            });
                        }
                        else
                            page.clickHandler();
                    }
                });
            };

            //Available public interface.
            page.clickHandler = null;
            page.interface.click = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).click();
                } else {
                    page.clickHandler = handler;
                }
            };
            page.attachCommonroperties();
        });
    }

    //Label 
    $.fn.label = function () {
        return $.pageController.getControl(this, function (page) {
            $(page.selectedObject).addClass("class", "label");
            page.interface = $(page.selectedObject);
            page.attachCommonroperties();
            page.interface.value = function (val) {
                if (typeof val != "undefined")
                    $(page.selectedObject).html(val);
                return $(page.selectedObject).html();
            };
            $(page.selectedObject).html(WEBUI.LANG[CONTEXT.CurrentLanguage][$(page.selectedObject).attr("rlabel")]);
        });
    }
    //Label Value 
    $.fn.labelValue = function () {
        return $.pageController.getControl(this, function (page) {
            $(page.selectedObject).addClass("label-value");
            page.interface = $(page.selectedObject);
            page.attachCommonroperties();

            page.interface.value = function (val) {
                if (typeof val != "undefined")
                    $(page.selectedObject).html(val);
                return $(page.selectedObject).html();
            };
        });
    }

    //Form Controls
    //TextBox
    $.fn.textBox = function () {
        return $.pageController.getControl(this, function (page) {

            //Event handlers
            page.changeHandler = null;
            page.focusHandler = null;
            page.blurHandler = null;
            page.keyUpHandler = null;
            
            //Capture and Bind Events
            page.events.page_load = function () {
                //Change Event
                $(page.selectedObject).change(function () {
                    if (page.changeHandler != null) {
                        page.changeHandler();
                    }
                });

                //Focus Event
                $(page.selectedObject).focus(function () {
                    if (page.focusHandler != null) {
                        page.focusHandler();
                    }
                });

                //Blur Event
                $(page.selectedObject).blur(function () {
                    if (page.blurHandler != null) {
                        page.blurHandler();
                    }
                });


                //keyup Event
                $(page.selectedObject).keyup(function () {
                    if (page.keyUpHandler != null) {
                        page.keyUpHandler();
                    }
                });
                $(page.selectedObject).keypress(function () {
                    if (CONTEXT.CurrentLanguage == "ta") {
                        convertThis(event);
                    }
                });
                if (typeof $(page.selectedObject).attr("rlabel") != "undefined")
                    $(page.selectedObject).attr("placeholder", WEBUI.LANG[CONTEXT.CurrentLanguage][$(page.selectedObject).attr("rlabel")]);
                
            }

            //Available public Events.            
            page.interface.change = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).change();
                } else {
                    page.changeHandler = handler;
                }
            };
            page.interface.focus = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).focus();
                } else {
                    page.focusHandler = handler;
                }
            };
            page.interface.blur = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).blur();
                } else {
                    page.blurHandler = handler;
                }
            };

            page.interface.keyup = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).keyup();
                } else {
                    page.keyUpHandler = handler;
                }
            };
            //Available Properties
            //Commmon properties like show,hide,css,addClass,removeClass
            page.attachCommonroperties();

            //Get and Set textbox value.
            page.interface.value = function (data) {
                if (typeof data == "undefined")
                    return $(page.selectedObject).val();
                else
                    return $(page.selectedObject).val(data);
            }

            page.interface.val = function (data) {
                if (typeof data == "undefined")
                    return $(page.selectedObject).val();
                else
                    return $(page.selectedObject).val(data);
            }

            //Width of the textbox
            page.interface.width = function (value) {
                $(page.selectedObject).css("width", value);
            }

            //Make textbox readonly
            // ReSharper disable once UnusedParameter
            page.interface.readOnly = function (value) {
                //TODO
            }

            //Get and set the value. This method is depreciated.Use value instead
            //page.interface.val = function (data) {
            //    if (typeof data == "undefined")
            //        return $(page.selectedObject).val();
            //    else
            //        return $(page.selectedObject).val(data);
            //}

        });
    }
    $.fn.uniqueTextBox = function () {
        return $.pageController.getControl(this, function (page) {

            //Event handlers
            page.changeHandler = null;
            page.focusHandler = null;
            page.blurHandler = null;
            page.keyUpHandler = null;

            //Capture and Bind Events
            page.events.page_load = function () {
                //Change Event
                $(page.selectedObject).change(function () {
                    if (page.changeHandler != null) {
                        page.changeHandler();
                    }
                });
                
                //Focus Event
                $(page.selectedObject).focus(function () {
                    if (page.focusHandler != null) {
                        page.focusHandler();
                    }
                });

                //Blur Event
                $(page.selectedObject).blur(function () {
                    if (page.blurHandler != null) {
                        page.blurHandler();
                    }
                });


                //keyup Event
                $(page.selectedObject).keyup(function () {
                    if (page.keyUpHandler != null) {
                        page.keyUpHandler();
                    }
                });
                $(page.selectedObject).keypress(function () {

                });
                if (typeof $(page.selectedObject).attr("rlabel") != "undefined")
                    $(page.selectedObject).attr("placeholder", WEBUI.LANG[CONTEXT.CurrentLanguage][$(page.selectedObject).attr("rlabel")]);

            }

            //Available public Events.            
            page.interface.change = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).change();
                } else {
                    page.changeHandler = handler;
                }
            };
            page.interface.focus = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).focus();
                } else {
                    page.focusHandler = handler;
                }
            };
            page.interface.blur = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).blur();
                } else {
                    page.blurHandler = handler;
                }
            };

            page.interface.keyup = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).keyup();
                } else {
                    page.keyUpHandler = handler;
                }
            };
            //Available Properties
            //Commmon properties like show,hide,css,addClass,removeClass
            page.attachCommonroperties();

            //Get and Set textbox value.
            page.interface.value = function (data) {
                if (typeof data == "undefined")
                    return $(page.selectedObject).val();
                else
                    return $(page.selectedObject).val(data);
            }

            page.interface.val = function (data) {
                if (typeof data == "undefined")
                    return $(page.selectedObject).val();
                else
                    return $(page.selectedObject).val(data);
            }

            //Width of the textbox
            page.interface.width = function (value) {
                $(page.selectedObject).css("width", value);
            }

            //Make textbox readonly
            // ReSharper disable once UnusedParameter
            page.interface.readOnly = function (value) {
                //TODO
            }


        });
    }
    //Hidden Control
    $.fn.hidden = function () {
        return $.pageController.getControl(this, function (page) {
            page.interface.value = function (data) {
                if (typeof data == "undefined")
                    return $(page.selectedObject).val();
                else
                    return $(page.selectedObject).val(data);
            }
        });
    }

    //DropDown List
    //Implement List Interface : selectedValue,selectedData,getValue,dataBind,selectionChange
    $.fn.dropDownList = function () {
        return $.pageController.getControl(this, function (page) {

            //Event Handler
            page.selectionChangeHandler = null;
            page.clickHandler = null;

            //Capture and Bind Events
            page.events.page_load = function () {
                //Change Event
                $(page.selectedObject).change(function () {
                    if (page.selectionChangeHandler != null) {
                        page.selectionChangeHandler();
                    }
                });

                //To support default button trigger when selection is triggered in drop.
                $(page.selectedObject).keydown(function (event) {
                    if (event.keyCode === $.ui.keyCode.ENTER) {
                        event.preventDefault();
                        event.stopPropagation();
                    }

                });

                //Click Event
                $(page.selectedObject).click(function () {
                    if (page.clickHandler != null) {
                        page.clickHandler();
                    }
                });

            }

            //Available public events
            //Fires dropdown selection change event or assign a event handler for selection change event.
            page.interface.selectionChange = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).change();     //Trigger Event
                } else {
                    page.selectionChangeHandler = handler;     //Assign Event handler
                }
            };

            //Fires dropdown click event or assign a event handler for click
            page.interface.triggerClick = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).click();     //Trigger Event
                } else {
                    page.clickHandler = handler;     //Assign Event handler
                }
            };



            //Available public Methods & Properties
            //Commmon properties like show,hide,css,addClass,removeClass
            page.attachCommonroperties();
            //Bind an object array to dropdown
            page.interface.dataBind = function (data, valueField, textField, addText) {
                page.valueField = valueField;
                page.textField = textField;
                //Clear dropdown
                $(page.selectedObject).get(0).options.length = 0;

                //Add Empty row If any
                if (typeof addText != "undefined")
                    $(page.selectedObject).get(0).options[0] = new Option(addText, "-1");

                //Bind data to dropdown.TODO Bind with array for better perfoemance
                $.each(data, function (i, dataitem) {
                    var opt = $("<option></option>");
                    opt.val(dataitem[valueField]);
                    opt.html(dataitem[textField]);
                    opt.attr("data", JSON.stringify(dataitem));
                    $(page.selectedObject).append(opt);
                });

            };
            //Get selected data
            page.interface.selectedData = function (value) {
                //Set the selection if value is passed.
                if (typeof (value) != "undefined") {
                    page.interface.selectedValue(value[page.valueField]);
                }
                //Get the selected data from the attribute data.
                if (typeof $(page.selectedObject).find(":selected").attr("data") != "undefined")
                    return JSON.parse($(page.selectedObject).find(":selected").attr("data"));
                else
                    return null;
            };
            //Get or set selected value.
            page.interface.selectedValue = function (value) {
                if (typeof (value) == "undefined")
                    return $(page.selectedObject).val();
                else
                    return $(page.selectedObject).val(value).trigger('change');
            };
            //Set the selected value. Append the value and text if it is not present in grid. Useful when displaying deleted informations.
            page.interface.selectedValueAppend = function (value, text) {
                //Append maximum one option.So remove previouly appended items.
                $(page.selectedObject).find("option[added]").remove();
                //Append the value and text if not available in select
                if ($(page.selectedObject).find("option[value='" + value + "']").length <= 0) {
                    var o = new Option(text, value);
                    $(o).attr("added", "true");
                    $(page.selectedObject).append(o);
                }
                //set the selected value                
                return $(page.selectedObject).val(value);
            };
            //Get value based on option Text
            page.interface.getValue = function (text) {
                if (text != undefined) {
                    return $(page.selectedObject).find("option").filter(function () {
                        return $(this).html() == text;
                    }).val();
                }
                else {

                    return page.selectedObject.find(":selected").text();
                }

            };



        });

    }

    //Radio List  : Select one value  from list of radio options.TODO : Yet to implement and test
    $.fn.radioList = function () {
        return $.pageController.getControl(this, function (page) {
            //Future : RepeateLayout,CSS,SelectedIndex...

            //Event Handler
            page.selectionChangeHandler = null;

            //Capture and Bind Events
            page.events.page_load = function () {
                //Change Event
                $(page.selectedObject).change(function () {
                    if (page.selectionChangeHandler != null) {
                        page.selectionChangeHandler();
                    }
                });
            }

            //Available public events
            page.interface.selectionChange = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).change();
                } else {
                    page.selectionChangeHandler = handler;
                }
            };

            //Available public Methods & Properties
            //Commmon properties like show,hide,css,addClass,removeClass
            page.attachCommonroperties();
            //Bind an object array to dropdown
            page.interface.dataBind = function (data, valueField, textField) {
                page.valueField = valueField;
                page.textField = textField;
                //TODO

            };
            //Get selected data
            // ReSharper disable once UnusedParameter
            page.interface.selectedData = function (value) {
                //TODO
            };
            //Get or set selected value.
            // ReSharper disable once UnusedParameter
            page.interface.selectedValue = function (value) {
                //TODO
            };
            //Get value based on option Text
            // ReSharper disable once UnusedParameter
            page.interface.getValue = function (text) {
                //TODO
            };

        });

    }

    //CheckBox List : Select multiple value from list of check options.  TODO : Yet to implement and test
    $.fn.checkBoxList = function () {
        return $.pageController.getControl(this, function (page) {
            //Future : RepeateLayout,CSS,SelectedIndex...
            //Event Handler
            page.selectionChangeHandler = null;

            //Capture and Bind Events
            page.events.page_load = function () {
                //Change Event
                $(page.selectedObject).change(function () {
                    if (page.selectionChangeHandler != null) {
                        page.selectionChangeHandler();
                    }
                });
            }

            //Available public events
            page.interface.selectionChange = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).change();
                } else {
                    page.selectionChangeHandler = handler;
                }
            };


            //Available public Methods & Properties
            //Commmon properties like show,hide,css,addClass,removeClass
            page.attachCommonroperties();
            //Bind an object array to dropdown
            page.interface.dataBind = function (data, valueField, textField) {
                page.valueField = valueField;
                page.textField = textField;
                //TODO

            };
            //Get selected data as an array
            // ReSharper disable once UnusedParameter
            page.interface.selectedData = function (value) {
                //TODO
            };
            //Get or set selected value.
            // ReSharper disable once UnusedParameter
            page.interface.selectedValue = function (value) {
                //TODO
            };
            //Get value based on option Text
            // ReSharper disable once UnusedParameter
            page.interface.getValue = function (text) {
                //TODO
            };

        });
    }
    //Auto Complete List : 
    $.fn.autoCompleteList = function () {
        return $.pageController.getControl(this, function (page) {
            //page scope objects
            page.dataSource = null; // Datasource the client has provided while binding.
            page.data = null;
            page.lastTerm = null;

            page.selectedItem = null;
            page.valueField = "value";
            page.textField = "label";
            page.allowCustomText = false;

            $(page.selectedObject).attr("placeholder", WEBUI.LANG[CONTEXT.CurrentLanguage][$(page.selectedObject).attr("rlabel")]);

            page.textChangeHandler = null;
            page.selectHandler = null;
            page.noRecordFoundHandler = null;

            //Available public events
            //Event raised when text is changed in textbox.
            page.interface.textChange = function (handler) {
                if (typeof handler == "undefined") {
                    $(page.selectedObject).change();
                } else {
                    page.changeHandler = handler;
                }
            };
            //Event raised when any item is selected from autocomplete list.
            page.interface.select = function (handler) {
                if (typeof handler == "undefined") {
                    if (page.selectHandler)     //Trigger Event 
                        page.selectHandler(page.selectedItem);

                } else {
                    page.selectHandler = handler;     //Assign Event handler
                }
            };
            //Event raised when autocomplete could not find a matching record.
            page.interface.noRecordFound = function (handler) {
                if (typeof handler == "undefined") {
                    if (page.noRecordFoundHandler)     //Trigger Event 
                        page.noRecordFoundHandler(page.selectedObject);

                } else {
                    page.noRecordFoundHandler = handler;     //Assign Event handler
                }
            };

            //Available properties and method
            //Set the datasource to be used for autocomplete
            page.interface.dataBind = function (dataSource, valueField, textField) {

                if (typeof valueField != "undefined") {
                    page.valueField = valueField;
                    page.textField = textField;
                }

                page.dataSource = dataSource;
            };
            //Get the selected value.
            page.interface.selectedValue = function () {
                if (typeof page.selectedItem != "undefined") {
                    if (page.selectedItem != null)
                        return page.selectedItem.value;
                }
                return null;
            };

            page.interface.selectedText = function (text) {
                if (text != null) {
                    if (page.dataSource.getData != null) {

                        page.dataSource.getData(text, function (data) {

                            if (data.length > 0) {
                                $(page.selectedObject).val(text).change();
                                page.selectedItem = { value: data[0][page.valueField], text: data[0][page.textField] };
                                $(page.selectedObject).focus();
                                $(page.selectedObject).autocomplete("search");
                                //if (page.selectHandler)     //Trigger Event 
                                //    page.selectHandler(page.selectedItem);
                                return $(page.selectedObject).val();
                            }


                        });
                    } else {
                        page.dataSource.getDataCustom(text, function (data) {
                            if (data.length > 0) {
                                $(page.selectedObject).val(text).change();
                                page.selectedItem = { value: data[0][page.valueField], text: data[0][page.textField] };
                                $(page.selectedObject).focus();
                                $(page.selectedObject).autocomplete("search");
                                //if (page.selectHandler)     //Trigger Event 
                                //    page.selectHandler(page.selectedItem);
                                return $(page.selectedObject).val();
                            }


                        });
                    }

                }
                else {
                    return $(page.selectedObject).val();
                }

            }

            //Set text on textbox. TODO : Check this func
            page.interface.customText = function (val) {
                page.selectedObject.val(val);
                page.selectedObject.change();

            };

            page.interface.allowCustomText = function (val) {
                page.allowCustomText = val;

            };

            //Clear autocomplete selection
            page.interface.clear = function () {
                page.selectedObject.val("");
                page.selectedItem = null;

            }

            page.interface.itemTemplate = function (item) {
                return "<a>" + item.label + "</a>";
            }
            //ToDo : remove
            page.interface.clearLastTerm = function () { page.lastTerm = null; }


            //Bind autocomplete and evetns.
            page.events.page_load = function () {
                
                //Track text change event
                $(page.selectedObject).change(function () {
                    if (page.textChangeHandler != null) {
                        page.textChangeHandler(page.selectedObject.val());
                    }
                });


                // Fix : don't navigate away from the field on tab when selecting an item
                $(page.selectedObject).bind("keydown", function (event) {
                    if ($(page.selectedObject).val() === "") page.selectedItem = null;
                    if (event.keyCode === $.ui.keyCode.ENTER && $(page.selectedObject).autocomplete("instance").menu.active) {
                        event.preventDefault();
                        event.stopPropagation();
                    } else if (event.keyCode === $.ui.keyCode.ENTER) {
                        //   $(page.selectedObject).blur();
                        //     $(page.selectedObject).focus();
                    }
                    if (event.keyCode === $.ui.keyCode.TAB && $(page.selectedObject).autocomplete("instance").menu.active) {
                        event.preventDefault();
                    }
                }).autocomplete({
                    autoFocus: true,
                    minLength: 1,    //Configure Min length to start search..
                    //Fired when user enters text.
                    source: function (request, response) {
                        var term = this.element.val().split(/,\s*/).pop();
                        //Try to get from cache page.data.
                        //Go to server if cache is empty,If search term is not part of last search term, If search has wild card or last last result has more than 500 records (only first 500 is always rea.). 
                        if (!page.data || !$.util.contains(term, page.lastTerm) || (term !== page.lastTerm && page.data.length > 499)) {
                            //Query from server. Noe :  page.dataSource will be defined by user.

                            if ($(page.selectedObject).next("[spinner]").length == 0)
                                $(page.selectedObject).after('<div spinner="true" style="position: absolute; display: inline-block; float: left;"><i style="top: 0px; position: relative; display: inline-block; font-size: small;" class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>');

                            if (page.dataSource.getData != null) {

                                page.dataSource.getData(term, function (data) {

                                    page.data = data;
                                    page.lastTerm = term;
                                    $(page.selectedObject).next("[spinner]").remove();
                                    $(page.selectedObject).autocomplete("search");
                                });
                            } else {

                                page.dataSource.getDataCustom(term, function (data) {
                                    var customTextObject = { label: term, value: 'xxxx' };
                                    data.unshift(customTextObject);
                                    page.data = data;
                                    page.lastTerm = term;
                                    $(page.selectedObject).next("[spinner]").remove();
                                    $(page.selectedObject).autocomplete("search");


                                });
                            }

                        }
                        //If last term has the current term as part. for ex : last term = cat  and term = cate.Then filter from last search result.
                        if ($.util.contains(term, page.lastTerm)) {
                            var ldata = $.ui.autocomplete.filter(page.data, term);
                            if (page.dataSource.getData != null) {
                                if (ldata.length == 0) {

                                    //Raise event if no record is filtered.
                                    if (page.selectHandler)
                                        page.selectHandler(page.selectedItem);
                                    if (page.noRecordFoundHandler)
                                        page.noRecordFoundHandler(page.selectedObject);
                                }
                                response(ldata);
                            }
                            else {
                                if (term != page.lastTerm) {
                                    var customText = { label: term, value: 'xxxx' };
                                    ldata.unshift(customText);
                                }

                                if (ldata.length == 0) {

                                    //Raise event if no record is filtered.
                                    if (page.selectHandler)
                                        page.selectHandler(page.selectedItem);
                                    if (page.noRecordFoundHandler)
                                        page.noRecordFoundHandler(page.selectedObject);
                                }
                                response(ldata);
                            }
                        }
                        else {
                            //rerurn the queried data
                            response(page.data);
                        }

                    },
                    //Focus on textbox
                    focus: function () {
                        return false;
                    },
                    //Selecting a list value should display text field in textbox
                    select: function (event, ui) {
                        this.value = ui.item[page.textField];
                        page.selectedItem = ui.item; //Set the current selected Item in page scope

                        setTimeout(function () {
                            //Raise Event : Select
                            if (page.selectHandler)
                                page.selectHandler(page.selectedItem);
                        }, 100);

                        return false;
                    },
                    //Track change events
                    change: function (event, ui) {
                        if (page.allowCustomText == false && ui.item == null) //Disallow entering custom text.Text entered in texbox should match with value in list
                        {
                            this.value = "";
                            page.selectedItem = null;
                        }
                        //Raise Event : Select
                        //if (page.selectHandler)
                        //    page.selectHandler(page.selectedItem);
                        $(page.selectedObject).next("[spinner]").remove();

                    },

                    open: function () { //Fix to move the list on top of dialog box                    
                        var dialog = $(this).closest(".ui-dialog");


                        if (dialog.length > 0) {
                            $(".ui-autocomplete.ui-front").zIndex(dialog.zIndex() + 1);
                        }
                        $(this).autocomplete("widget").css({
                            "padding": ".1em", "min-height": "0", "max-Height": "150px"
                        });
                    },
                    appendTo: "body", //Fix to move the list on top of dialog box
                    close: function () {
                        //Fix to move the list on top of dialog box

                        $(this).autocomplete("option", "appendTo", "body");


                    }

                }).autocomplete("instance")._renderItem = function (ul, item) {
                    //Custom list layout
                    return $("<li>")
                    //Check It Jebas Change This
                    .append(page.interface.itemTemplate(item))
                        .appendTo(ul);
                    //.append("<a>" + item.label + "</a>")
                    //.appendTo(ul);
                }
            };

            page.attachCommonroperties();
        });


    }

    //Date Selector
    $.fn.dateSelector = function () {

        return $.pageController.getControl(this, function (page) {

            if (page.selectedObject[0].controlId == "dtSelector") {
                page.mode = "YearMonth";
                page.dateFormat = "M yy";
            } else {
                page.mode = null;
                page.dateFormat = "dd-mm-yy";
            }


            page.events.page_load = function () {

                $(page.selectedObject).attr("placeholder", page.dateFormat);
                //DatePicker control.Default properties
                $.datepicker.setDefaults({
                    dateFormat: page.mode == "YearMonth" ? "M yy" : 'dd-mm-yy',
                    //defaultDate: new Date(),
                    changeMonth: true,
                    changeYear: true,
                    showButtonPanel: page.mode ? false : true,
                    showWeek: page.mode ? false : true,
                    firstDay: 1,
                    constrainInput: true,


                    beforeShow: function () {
                        if (page.mode == "YearMonth") {
                            if ((datestr = $(this).val()).length > 0) {
                                year = datestr.substring(datestr.length - 4, datestr.length);
                                month = jQuery.inArray(datestr.substring(0, 3),
                                         $(this).datepicker('option', 'monthNamesShort'));
                                $(this).datepicker('option', 'defaultDate', new Date(year, month, 1));
                                $(this).datepicker('setDate', new Date(year, month, 1));
                            }
                        }
                        else {


                            if ($(this).attr("IEFocusFix") === "true") {
                                return false;
                            }
                            else {
                                $(this).attr("placeholder", "dd-mm-yy"); //TODO : Need to fix in future.Will work only if datepicker is opned.
                                $(this).blur(function () {
                                    try {
                                        if (!page.mode) {

                                            $.datepicker.parseDate(WEBUI.CONSTANTS.DateFormat, $(this).val());
                                        }

                                    } catch (e) {
                                        if ($(this).val() == "")
                                            $(this).val("");
                                        else
                                            $(this).val($.datepicker.formatDate("dd-mm-yy", new Date()));
                                        //$(this).val("");
                                        // alert(WEBUI.MESSAGES.InvalidDateFormat);
                                    };
                                });
                            }
                        }
                    },
                    onClose: function (dateText, inst) {

                        if (page.mode) {


                            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();

                            $(this).datepicker('setDate', new Date(year, month, 1));
                            $(this).datepicker({
                                dateFormat: "M yy"
                            });

                            var self = $(this);
                        }
                    },
                    onSelect: function () {

                        var self = $(this);
                        $(this).attr("IEFocusFix", "true");
                        setTimeout(function () {
                            $(self).parent().attr("tabindex", -1).focus();
                            self.attr("IEFocusFix", "false");
                        }, 500);


                    }
                }
                );

                if (page.mode == "YearMonth") {
                    $(page.selectedObject).datepicker({
                        dateFormat: "M yy"
                    });

                }
                else {
                    $(page.selectedObject).datepicker({
                        dateFormat: 'dd-mm-yy'
                    });
                }
            }



            page.interface.setDate = function (date) {
                return page.selectedObject.datepicker('setDate', new Date(date))
            }
            page.interface.getDate = function () {

                return $(page.selectedObject).datepicker().val();   //{ dateFormat: 'yy-mm-dd' }
            }

            page.interface.disable = function (val) {
                if (!val)
                    $(self).removeAttr('disabled');
                else
                    $(self).prop('disabled', 'disabled');
            }

            page.attachCommonroperties();
        });


    }

    $.fn.dateTimePicker = function () {
        return $.pageController.getControl(this, function (page) {
            page.dateFormat = "dd-mm-yyyy hh:mm";
            page.events.page_load = function () {
                $(page.selectedObject).attr("placeholder", page.dateFormat);
                //DatePicker control.Default properties
                //  $('#datetimepicker1').datetimepicker();
                $(page.selectedObject).datetimepicker({
                    format: 'DD/MM/YYYY HH:mm'
                });
            }
            page.interface.getDate = function () {
                return $(page.selectedObject).datetimepicker().val(); //{ dateFormat: 'yy-mm-dd' }
            }
            page.interface.setDate = function (date) {
                $(page.selectedObject).datetimepicker(date);
            }
        });
    }

    //Panel and Popups
    $.fn.simplePanel = function () {
        $(this).prepend("<HR>");
        $(this).append("<HR>");
        return $(this);
    }

    //Tab control
    $.fn.tab = function () {
        return $.pageController.getControl(this, function (tab) {
            //Click Event for the Tab
            $(tab.selectedObject).on("click", "li a", function () {

                tab.selectedTabObject = $(this);
                if ($(tab.selectedTabObject).parent().parent().children("li").children("a").filter('.tabSelected').attr("target") !==
                    $(tab.selectedTabObject).attr("target")) {


                    //Function to HAndle to TAb Selection
                    function SelectAction() {
                        if (tab.interface.beforeSelectionChanged) {

                            tab.interface.beforeSelectionChanged($(this).attr("target"));
                        }

                        $(tab.selectedTabObject).parent().parent().children("li").children("a").each(function (i, a) {
                            if ($(a).attr("target").substring(0, 1) == "#") {
                                $($(a).attr("target")).hide();
                            }
                            else {
                                var parentControlName = $(tab.selectedObject).attr("control").split(".")[0];
                                var parentControl = null;
                                if (parentControlName == "page")
                                    parentControl = $("body");
                                else
                                    parentControl = $(tab.selectedObject).closest("[control$='." + parentControlName + "']");

                                parentControl.find("[controlid=" + $(a).attr("target") + "]").hide();
                            }


                            $(a).removeClass("tabSelected");
                            $(a).parent("li").removeClass("tabSelected");
                        });

                        $(tab.selectedTabObject).addClass("tab tabSelected");
                        $(tab.selectedTabObject).parent("li").addClass("tab tabSelected");
                        // $($(tab.selectedTabObject).attr("target")).show();

                        if ($(tab.selectedTabObject).attr("target").substring(0, 1) == "#") {
                            $($(tab.selectedTabObject).attr("target")).show();
                        }
                        else {
                            var parentControlName = $(tab.selectedObject).attr("control").split(".")[0];
                            var parentControl = null;
                            if (parentControlName == "page")
                                parentControl = $("body");
                            else
                                parentControl = $(tab.selectedObject).closest("[control$='." + parentControlName + "']");

                            parentControl.find("[controlid=" + $(tab.selectedTabObject).attr("target") + "]").show();
                        }




                        if (tab.interface.selectionChanged) {
                            tab.interface.selectionChanged($(tab.selectedTabObject).attr("target"));
                        }

                    }

                    //Checking If there are any Unsaved Changes in one Tab before Moving to the Other Tab
                    if (typeof $(tab.selectedObject).attr("requiredUnSavedCheck") != "undefined") {

                        $.unSavedChangesCheck($(tab.selectedObject).attr("requiredUnSavedCheck"),
                            function () {
                                SelectAction();
                            }); //Pass function with empty argumnets.Inside that pass the necessary arguments in scope.
                    } else
                        SelectAction();
                }

            });

            //Page Load event for Tab
            tab.events.page_load = function () {
                if (tab.selectedObject.children("li").children("a").length > 0)
                    tab.selectedObject.children("li").children("a")[0].click();

                //tab.selectedObject.children("li").children("a")[0].click();         //On the Page Load, Bydefault Making the First Tab to be Selected
            }

            tab.interface.selectionChanged = null;
            tab.interface.beforeSelectionChanged = null;
            //An Global Method to change the Target Tab based on the ID of the Tab
            tab.interface.selectedTabTarget = function (target) {
                if (typeof target == "undefined")
                    return tab.selectedObject.find(".tabSelected a").attr("target");
                else {
                    tab.selectedObject.find("[target=" + target + "]").click();
                }
            };
            tab.interface.selectedObject = tab.selectedObject;
            tab.interface.show = function () {
                $(tab.selectedObject).show();
            };
            tab.interface.hide = function () {
                $(tab.selectedObject).hide();
            };
        });

    }

    //Poppup control
    $.fn.popup = function () {
        return $.pageController.getControl(this, function (page) {


            page.events.page_load = function () {

            }
            page.interface = {
                dialogClose: null,                          //Initializing dialogClose(to close thepopup)
                dialogBeforeClose: null,                     //Initilizaing a handler for Event dialogBeforeClose
                title: function (title) {                    //Title of the POPUP
                    $(page.selectedObject).parent().find('.ui-dialog-title').html(title);
                },
                rlabel: function(label){
                    if(typeof label != "undefined")
                        $(page.selectedObject).parent().find('.ui-dialog-title').html(WEBUI.LANG[CONTEXT.CurrentLanguage][label]);
                },
                width: function (width) {                    //Width of the Popup
                    $(page.selectedObject).dialog("option", "width", width);
                },
                height: function (height) {                   //Height of the Popup
                    $(page.selectedObject).dialog("option", "maxHeight", height);
                    $(page.selectedObject).dialog("option", "height", height);
                },
                open: function () {                           //An event to OPen the Popup
                    $(page.selectedObject).dialog({
                        autoOpen: false,                      //autoOpen is False
                        modal: true,                          //modal:true means By default this will be on the Top
                        position: {                           //positioning the Popup in the Page
                            my: "center",
                            at: "center",
                            of: window,
                            within: $("body")
                        },

                        draggable: true,                                        //Draggable Event of Popup
                        resizable: false, close: function () {                  //Resizable and Close Events
                            if (page.interface.dialogClose != null)
                                page.interface.dialogClose();
                        },
                        beforeClose: function () {
                            if (page.interface.dialogBeforeClose != null)
                                return page.interface.dialogBeforeClose();
                            return true;
                        },


                        title: "Title"                                           //Default Title of the Popup, if the title is not defined in the code

                    });
                    $(page.selectedObject).dialog("open");

                }, close: function () {                                        //To close the Popup
                    $(page.selectedObject).dialog("close");

                }, beforeClose: function () {
                    $(page.selectedObject).dialog("beforeClose");

                }

            }
            page.attachCommonroperties();                                      //Attaching Common Properties to popup Like SHOW, HIDE etc..
        });

    }

    //popup window controls
    $.fn.windowPopup = function (defaults) {
        //windowsPopup is used to load an entire page or url in a popup.
        //Properties supported: height,width,url;
        var self = this;   //local reference

        var width = 1000, height = 600;
        if (defaults.width)
            width = defaults.width;  //override default width
        if (defaults.height)
            height = defaults.height; //override default height

        var left = Number((screen.width / 2) - (width / 2)), top = Number((screen.height / 2) - (height / 2)); //calculate left and top

        self.popUpObj = window.open(defaults.url, "ModalPopUp", "toolbar=no,scrollbars=yes,location=no,statusbar=no,menubar=no,resizable=1,left=" + left + ",top=" + top + ",width=" + width + ",height=" + height + ",modal=yes");

        //Hide background of main page
        if (!$("#pnlBackground").length)
            $(body).append("<div id='divBackground' style='position: fixed; z-index: 999; height: 100%; width: 100%; top: 0; left: 0; background-color: Black; filter: alpha(opacity=60); opacity: 0.6; -moz-opacity: 0.8; display: none'>Resume</div>");
        $("#pnlBackground").show();

        function monitor(closeMethod) {
            if (self.popUpObj.closed === false) {
                setTimeout(function () {
                    monitor(closeMethod);
                }, 2000);
            } else {
                if (closeMethod)
                    closeMethod();
                $("#pnlBackground").hide();
            }
        }

        monitor(defaults.close);
        self.popUpObj.focus();

    };

    $.fn.messagePanel = function () {
        var self = $(this);
        return {
            flash: function (msg, title, icon) {
                if (typeof WEBUI.LANG[CONTEXT.CurrentLanguage][msg] != "undefined")
                    msg = WEBUI.LANG[CONTEXT.CurrentLanguage][msg];
                $(self).html(msg);
                $(self).show().delay(5000).fadeOut();
            },
            show: function (msg, title, icon) {
                if (typeof WEBUI.LANG[CONTEXT.CurrentLanguage][msg] != "undefined")
                    msg = WEBUI.LANG[CONTEXT.CurrentLanguage][msg];
                $(self).html("<button style='border: none;cursor: pointer;background-color: transparent;float:right'  onclick='$(this).parent().hide();' >X</button>" + msg);
                $(self).show();
            },
            hide: function () {
                $(self).hide();
            },

        };


    };
    //$.fn.dialogBox = function () {
    //    var self = $(this);
    //    return {
    //        show: function (title, content, btntext) {
    //            $(self).html("<div title='" + title + "'><p>" + content + "</p></div>");
    //            $(self).dialog({
    //                resizable: false,
    //                title: title,
    //                modal: true,
    //                width: '400px',
    //                height: 'auto',
    //                bgiframe: false,
    //                hide: { effect: 'scale', duration: 400 },
    //                buttons: [
    //                    {
    //                        text: btntext,
    //                        "class": "showcss",
    //                        "controlid": "btnOk",
    //                        click: function () {
    //                            $(self).dialog('close');
    //                        }
    //                    }
    //                ]
    //            });
    //            //$(self).dialog({
    //            //    resizable: false,
    //            //    title: title,
    //            //    modal: true,
    //            //    width: '400px',
    //            //    height: 'auto',
    //            //    bgiframe: false,
    //            //    hide: { effect: 'scale', duration: 400 },
    //            //    buttons: [
    //            //        {
    //            //            text: btn1text,
    //            //            "class": btn1css,
    //            //            "controlid": "btnOk",
    //            //            click: function () {
    //            //                $(self).dialog('close');
    //            //                return true;
    //            //            }
    //            //        },
    //            //        {
    //            //            text: btn2text,
    //            //            "class": btn2css,
    //            //            "controlid": "btnCancel",
    //            //            click: function () {
    //            //                $(self).dialog('close');
    //            //                return false;
    //            //            }
    //            //        }
    //            //    ]
    //            //});
    //        },
    //        hide: function () {
    //            $(self).hide();
    //        },

    //    };


    //};
    //Progress bar and Main Menu   
    $.fn.progressBar = function (status, msg) {
        //Progress bar that can appended before any panel   
        if (!$("#pnlProgress").length)
            $("body").append('<div id="pnlProgress"><span>Loading...</span>       <a title="Cancel the request." style="display:none">X</a>            <img src="/' + appConfig.root + '/ui/ui/images/ajaxloader.gif">    </div>');

        var prog;
        if (status === "show") {
            $("[control$=primaryWriteButton]").attr("disabled", "disabled");

            prog = $("#pnlProgress");

            prog.find("span").hide();
            prog.find("a").hide();
            //prog.find("span").text("Loading...");
            //if (msg)
            //    prog.find("span").text(msg);
            prog.remove();
            if ($(this).is("body"))
                $(prog).insertBefore($(this));
            else
                $(prog).insertBefore($(this));
            prog.show();
            var width = prog[0].clientWidth;
            prog.find("span").css("left", (width / 2) - 50);
            prog.find("a").css("left", (width / 2) + 20);
            prog.find("img").css("left", (width / 2) - 250);

        } else if (status === "hide") {
            $("[control$=primaryWriteButton]").removeAttr("disabled");
            prog = $("#pnlProgress");
            prog.remove();
            $(prog).insertBefore($("body"));
            prog.hide();
        }
    };

    $.fn.progressBarnew = function (status, msg, obj) {
        var prog;
        if (status === "show") {             //To Show the Progress Bar



            if (obj == null) {
                $.blockUI({ message: ' <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i> Just a moment... ' });         //The Whole Style of the Progress Bar can be defined in the blockUI Funstion
            } else {
                $('body').css('cursor', 'wait');
                if (msg != null)
                    $(obj).block({ message: ' <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>' + msg });
                else
                    $(obj).block({ message: ' <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>' });
            }

        } else if (status === "hide") {                       //To hide the ProgressBar

            if (obj == null) {
                $.unblockUI();
            } else {
                $(obj).unblock();
                $('body').css('cursor', 'auto');
            }

        }

        return {
            show: function () { $.blockUI({ message: ' <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i> Just a moment... ' }); },            //To Show the ProgressBar
            hide: function () { $.unblockUI(); }                                                               //To Hide The Progress Bar

        };
    };

    //Mainmenu
    $.fn.mainMenu = function (menuData) {

        var htmlContent = [];

        function loadMenu(menu, root) {
            htmlContent.push("<ul>");
            $(menu.ChildItems).each(function (i, menuChild) {
                if (menuChild.NavigateUrl !== "")
                    htmlContent.push("<li><a href='" + menuChild.NavigateUrl + "'>" + menuChild.Text);
                else
                    htmlContent.push("<li><a href='#'>" + menuChild.Text);

                if (menuChild.ChildItems.length > 0 && !root)
                    htmlContent.push("<img src='../images/rightArrow.gif' style='width:10px;height:10px' />");
                htmlContent.push("</a>");
                loadMenu(menuChild);
                htmlContent.push("</li>");
            });
            htmlContent.push("</ul>");
        }

        loadMenu(menuData, "root");
        $(this).append(htmlContent.join(" "));
        $(this).attr("class", "menu");

    };

    //Html Advanced controls  
    $.fn.grid = function () {
        /*
        Data Source : Array , ObjectDataSource and Remote DataSource.Refer grid.objectDataSource for interface methods to be implemented
        Paging : LoadMore, Standard
        Selection : None,Single,Multiple
        Layout Customisation : height,width,cssGrid,cssGridHeader,cssGridData,cssGridRow ,cssGridColumn
        Sorting : Yes. No custom sorting

        */
        return $.pageController.getControl(this, function (grid) {

            //#region "Reload,Filter,Sort,Paging"

            //Reload grid with updated sortExpression, filterExpression, pageNo and pageSize
            grid.interface.reloadGrid = function () {

                grid.clearPreviousDataSource();   //When doing rebind. I need to apply the modified feature in between like page size etc
                grid.getData(function (data) {
                    //Clear header
                    grid.selectedObject.find(".grid_header").find(".grid_header_select input[type=checkbox]").prop("checked", false);

                    grid.bindData(data);
                    grid.totalRecords();
                });

            }


            //Filter method to filter data  based on filterExpression. 
            grid.interface.filter = function (filterExpression) {
                if (typeof filterExpression != "undefined")
                    grid.filterExpression = filterExpression;
                grid.currentPage = 1;      //reset page no during filter
                grid.interface.reloadGrid();

            }


            //Sort method to sort data  based on sortExpression
            grid.interface.sort = function (sortExpression) {
                if (typeof sortExpression != "undefined")
                    grid.sortExpression = sortExpression;

                grid.interface.reloadGrid();
            }


            //Method to get and set current Page
            grid.interface.currentPage = function (pageNo) {

                if (typeof pageNo != "undefined") {
                    grid.currentPage = parseInt(pageNo);
                    grid.interface.reloadGrid();
                }

                return grid.currentPage;
            };

            //Method to get total Page count.
            grid.interface.totalPages = function () {
                return grid.totalPage();
            };

            grid.recordCount = 0;

            grid.getData = function (callback) {
                if (grid.paging) {
                    grid.dataSource.getData(grid.currentPage * grid.pageSize - grid.pageSize, grid.currentPage * grid.pageSize, grid.sortExpression, grid.filterExpression, function (data, recordCount) {
                        grid.recordCount = recordCount;
                        callback(data);
                    });
                } else
                    grid.dataSource.getData(-1, -1, grid.sortExpression, grid.filterExpression, function (data, recordCount) {
                        callback(data);
                        grid.recordCount = recordCount;
                    });
            }

            grid.totalPage = function () {
                return Math.floor(grid.recordCount % grid.pageSize == 0 ? grid.recordCount / grid.pageSize : grid.recordCount / grid.pageSize + 1);
            };

            grid.totalRecords = function () {

                if (grid.paging) {

                    $(grid.selectedObject).find(".total_record").html("Records : " + grid.pager.start() + " - " + grid.pager.end() + " of " + grid.recordCount);
                    var rowTemplate = "";
                    for (var i = 1; i <= grid.totalPage() ; i++)
                        rowTemplate = rowTemplate + "<option>" + i + "</option>";
                    $(grid.selectedObject).find(".grid_page_standard > select[page-action=goto]").html(rowTemplate);
                    $(grid.selectedObject).find(".grid_page_standard > select[page-action]").val(grid.currentPage);
                } else
                    $(grid.selectedObject).find(".total_record").html("Total Records : " + grid.recordCount);

            }

            grid.like = function (object, dataField, value) {
                if (typeof object[dataField] == "undefined")
                    return false;
                else if (object[dataField] == null)
                    return false;
                else
                    return $.util.like(object[dataField].toString().toUpperCase(), value.toString().toUpperCase());

            }

            grid.equal = function (object, dataField, value) {
                if (typeof object[dataField] == "undefined")
                    return false;
                else if (object[dataField] == null)
                    return false;
                else
                    return object[dataField].toString().toUpperCase() == value.toString().toUpperCase();

            }

            //#endregion


            //#region "Inbuilt filter Implementation"

            /*Inbuilt filter : will add a filter row below header. It can be controlled with the below 3 api methods             
              In Memory : Support LIKE (TextBox) and EQUALS (DropDown)
              External Data : Support only  LIKE(TextBox)
            */

            //show the inbuilt filter bar.            
            grid.interface.showFilter = function () {
                $(grid.selectedObject).find(".grid_filter").show();

                //InMemory: If Dropdown is used, then load data to dropdown when show is clicked.
                if (grid.dataLocation == "InMemory") {
                    var data = grid.interface.allData();
                    $($(grid.selectedObject).find(".grid_filter").find("select")).each(function (i, ctrl) {
                        var select = $(this);
                        select.html("");

                        var blankFound = false;
                        $($.util.uniqueBy($.util.sortBy(data, $(ctrl).attr("sortDataField")), function (x) { return x[$(ctrl).attr("dataField")]; })).each(function (j, dataItem) {
                            if (dataItem != null)
                                select.append("<option value='" + dataItem + "'>" + dataItem + "</option>");
                            else
                                blankFound = true;
                        });

                        if (blankFound)
                            select.prepend("<option value='[blank]'>[blank]</option>");
                        select.prepend("<option value='' selected='selected'></option>");
                    });
                }
            }

            //Hide the inbuilt filter bar,reset the filterbar data and clear filter expression.
            grid.interface.clearFilter = function () {
                //Clear all textbox and dropdown value
                $(grid.selectedObject).find(".grid_filter  [filterDataField]").val("");

                //Hide Filter
                $(grid.selectedObject).find(".grid_filter").hide();

                //Apply Filter
                if (grid.dataSource != null && grid.recordCount > 0) {
                    grid.interface.applyFilter();
                }
            }

            //Apply the filter based on filter bar or manually apply the filter expression that is passed.
            grid.interface.applyFilter = function () {

                //Build the filter expression
                var filterExpression = '';
                $($(grid.selectedObject).find(".grid_filter  [filterDataField]")).each(function (i, ctrl) {
                    if ($(ctrl).val() != '' && $(ctrl).val() != null) {
                        if ($(ctrl).prop("tagName") == "Select")
                            filterExpression = filterExpression + (filterExpression == '' ? "" : " && ") + " grid.equal(object,'" + $(ctrl).attr("filterDataField") + "','" + ($(ctrl).val() == "[blank]" ? "" : $(ctrl).val()) + "')";
                        else
                            filterExpression = filterExpression + (filterExpression == '' ? "" : " && ") + " grid.like(object,'" + $(ctrl).attr("filterDataField") + "','" + ($(ctrl).val() == "[blank]" ? "" : $(ctrl).val()) + "')";
                    }
                });


                grid.interface.filter(filterExpression);
            }

            //#endregion


            //#region "Inbuilt Sort Implementation"            
            grid.sortImplementation = {

                sortColumnClicked: null,
                sortDataFieldList: {},

                getDefaultSortTemplate: function (column) {
                    var columnTemplate = "<div sortDataField='" + (typeof (column.sortDataField) != "undefined" ? column.sortDataField : column.dataField) + "' style='cursor:pointer;width:100%'>";
                    columnTemplate = columnTemplate + "<img  currentSortState='None' src='" + WEBUI.CONTEXT.RootPath + "/ShopOn/ui/ui/images/topArrow.gif'  style=';display:none;vertical-align: bottom;'/>"; //arrow indicator reflecting currentSortState.Intitally currentSortState is NONE                                                    
                    if (column.headerTemplate)
                        columnTemplate = columnTemplate + column.headerTemplate;
                    else {
                        //Set Font For Header
                        if (typeof column.rlabel == "undefined")
                            columnTemplate = columnTemplate + "<span>" + column.name + "</span>";
                        else
                            columnTemplate = columnTemplate + "<span>" + WEBUI.LANG[CONTEXT.CurrentLanguage][column.rlabel] + "</span>";
                    }
                    columnTemplate = columnTemplate + "</div>";
                    return columnTemplate;
                },

                sortColumnClickHandler: function () {
                    //Hide all other icons.   
                    var img = $(this.sortColumnClicked).find("img[currentSortState]");

                    if (grid.rowSort) {
                        if (this.selectionMode == "Single") {
                            $(grid.selectedObject).find("." + grid.cssGridHeader + " img[currentSortState]").hide();
                            var currentState = img.attr("currentSortState");
                            $(grid.selectedObject).find("." + grid.cssGridHeader + " img[currentSortState]").attr("currentSortState", "None");
                            img.attr("currentSortState", currentState);
                        }

                        //Find the next sort state
                        img.attr("currentSortState", img.attr("currentSortState") == "None" ? "Asc" : img.attr("currentSortState") == "Asc" ? "Desc" : "None");

                        if (this.selectionMode == "Single")
                            this.sortDataFieldList = {};


                        if (img.attr("currentSortState") == "None") {
                            img.hide();
                            if (this.sortDataFieldList[$(this.sortColumnClicked).attr("sortDataField")])
                                delete this.sortDataFieldList[$(this.sortColumnClicked).attr("sortDataField")];
                        } else if (img.attr("currentSortState") == "Asc") {
                            img.attr("src", "" + WEBUI.CONTEXT.RootPath + "/ShopOn/ui/ui/images/topArrow.gif");
                            img.show();
                            this.sortDataFieldList[$(this.sortColumnClicked).attr("sortDataField")] = "";

                        }
                        else if (img.attr("currentSortState") == "Desc") {
                            img.attr("src", "" + WEBUI.CONTEXT.RootPath + "/ShopOn/ui/ui/images/downArrow.gif");
                            img.show();
                            this.sortDataFieldList[$(this.sortColumnClicked).attr("sortDataField")] = "-";
                        }

                        grid.sortExpression = [];
                        for (var prop in this.sortDataFieldList) {
                            grid.sortExpression.push(this.sortDataFieldList[prop] + prop);
                        }
                        grid.interface.reloadGrid();
                    }
                    else {
                       
                    }
                },

                selectionMode: "Single",

                bindEvents: function () {
                    var self = this;
                    //Monitor to trigger sortColumnClickHandler.
                    $(grid.selectedObject).find("." + grid.cssGridHeader + " [sortDataField]").click(function (e) {
                        self.selectionMode = e.ctrlKey ? "Multiple" : "Single";
                        self.sortColumnClicked = $(this);
                        if (typeof $(grid.selectedObject).attr("requiredUnSavedCheck") != "undefined") {
                            $.unSavedChangesCheck($(grid.selectedObject).attr("requiredUnSavedCheck"), function () {
                                self.sortColumnClickHandler();
                            });
                        }
                        else
                            self.sortColumnClickHandler();
                    });
                }
            }


            grid.sortColumnClickHandler = function () {
                grid.selectedObject.progressBar('show');
                setTimeout(function () {
                    $(grid.selectedObject).find("." + grid.cssGridHeader + " div[dataField]").children("span[sort]").hide();

                    var img = $(grid.sortColumnClicked).children("span[sort]");
                    img.attr("sort", img.attr("sort") == "" ? "-" : "");
                    img.attr("sort") == "" ? img.html("&#8593;") : img.html("&#8595;");
                    img.show();

                    grid.sortDataField = img.attr("sort") + "" + $(grid.sortColumnClicked).attr("sortDataField");
                    grid.clearPreviousDataSource();
                    grid.getData(function (data) {
                        grid.bindData(data);
                        grid.selectedObject.progressBar('hide');
                    });

                }, 200);
            }

            //#endregion


            //#region "Inbuilt Paging Implementation : LoadMore and Standard"

            //Return the pager object associated with grid
            grid.interface.pager = function () {
                return grid.pager;
            }

            //Load More Class : Load more keeps appending next page one by one.
            grid.LoadMorePager = function () {
                //LoadMore method to load next page
                this.loadMore = function () {
                    if (grid.paging == true) {
                        if (grid.currentPage < grid.totalPage()) {
                            grid.interface.currentPage(grid.currentPage + 1);
                        }
                    }
                }

                //return start row
                this.start = function () {
                    return 1;
                }

                //return end row
                this.end = function () {
                    var end = grid.currentPage * grid.pageSize;
                    if (end > grid.recordCount)
                        end = grid.recordCount;
                    return end;
                }
            }

            //Standard Pager Class : Pagingg with Next,Previous and GotoPage functionality
            grid.StandardPager = function () {

                //Go to Next Page
                this.nextPage = function () {
                    if (grid.currentPage < grid.totalPage())
                        this.goToPage(grid.currentPage + 1);
                }

                //Go to Previous Page
                this.previousPage = function () {
                    if (grid.currentPage > 1)
                        this.goToPage(grid.currentPage - 1);
                }

                //Go to specified page.
                this.goToPage = function (pageNo) {
                    grid.interface.currentPage(pageNo);
                }

                //Return start row in current view
                this.start = function () {
                    return ((grid.currentPage - 1) * grid.pageSize) + 1;
                }

                //Return end row in current view
                this.end = function () {
                    var end = grid.currentPage * grid.pageSize;
                    if (end > grid.recordCount)
                        end = grid.recordCount;
                    return end;
                }
            }

            //#endregion


            //#region  "Data Source Implementation"

            //Set the data source.Also support user defined datasource
            grid.interface.dataSource = function (dataSource) {
                if (dataSource) {
                    if (Object.prototype.toString.call(dataSource) === '[object Array]') {
                        grid.dataSource = new grid.ObjectDataSource(dataSource); //In Memory Array Data Source
                        grid.dataLocation = "InMemory";
                    } else {
                        grid.dataLocation = "External";
                        grid.dataSource = dataSource; // Remote Data Source
                    }

                    //Clear old data and update the new settings./
                    grid.clearPreviousDataSource();
                    grid.updateSettings();
                }

                return grid.dataSource;
            }




            /*
                DataSource : Data is the underlying core of grid.DataSource is implemented as an interface so that user can customise it when needed.OOTB implementation provided with grid is grid.ObjectDataSource.
                Using OOTB grid.ObjectDataSource :  The entire data should reside in memory as array of objects.ObjectDataSource implementation is added OOTB with paging,filtering and sorting.If array is passed to grid.interface.datasource, automatically ObjectDataSource will be used.
                CustomDataSource :  The data can be external or inmemory. 
                             Use CustomDataSource.
                                 1. for huge volume of records where keeping entire data in memory is not efficient.
                                 2. Customising filtering,paging or sorting impementation. 
                            Steps
                             1. Implement the below DataSource Interface
                                  IDataSource{
                                        this.getCount = function () {}
                                        this.getData = function (start, end, sortExpression, filterExpression){}
                                        this.create = function (item)
                                        this.update = function (item, updatedItem)
                                        this.delete = function (item) 
                                  } 
                             2. set the dataSource before calling databind using
                                          $$("gridId").dataDource(functiotion(){
                                              .... IMPLEMENTed datasource interface
                                          });
                                          $$("gridId").dataBind();
                             Note : user should handle filtering,paging and sorting by themselves.
            */
            grid.ObjectDataSource = function (objectArray) {
                var originalData = objectArray;   //This will preserve the original data.Useful when filtering is applied which changes the data variable.
                var data = objectArray;
                //return the total count.
                this.getCount1 = function (filterExpression, callback) {
                    callback(data.length);
                }
                /*  
                    Get the data to be bind to grid.
                    Paging : start and end decides the current page to be displayed. 
                    Sorting : user can specify multi sort using sort expression. ex -pcaName,projName,-status. - denotes descending.
                    Filtering : filterExpression is a javascript statement which should evaluate to true or false. Only records matching filterExpression will be returned. For ex pcaName == "Chairs" .
                                Two methods grid.like and grid.equals can be used in expression which evaluates the most common search.Ex.grid.like(object,pcaName,'cha')
                */
                this.getData = function (start, end, sortExpression, filterExpression, callback) {
                    var tempData = originalData;
                    if (filterExpression) {
                        //Eval will read the object.So needed
                        // ReSharper disable once UnusedParameter
                        tempData = $.grep(data, function (object) {
                            return eval(filterExpression);
                        });
                    }
                    data = tempData;
                    sortExpression = false;
                    //Create a new object. Ignore null value.
                    if (sortExpression)         //TODO : If filtered already.. no need to slice again to avoid inplace sorting.
                        callback($.util.sortBy(data.slice(0), sortExpression).slice(start != -1 ? start : 0, end != -1 ? end : tempData.length), tempData.length);
                    else
                        callback(data.slice(start != -1 ? start : 0, end != -1 ? end : tempData.length), tempData.length);
                }

                //Create a new object
                this.create = function (item) {
                    data.push(item);
                }

                //Update existing object
                this.update = function (item, updatedItem) {
                    for (var prop in updatedItem) {
                        if (!updatedItem.hasOwnProperty(prop)) continue;
                        item[prop] = updatedItem[prop];
                    }
                }

                //Delete an object
                this.delete = function (item) {
                    data.pop(item);
                }
            }

            //#endregion


            //#region "Read Data and Row"

            //Get selected Row Id
            grid.interface.selectedRowIds = function () {
                var dataList = new Array();
                $(grid.selectedObject).find(".grid_data").find(".grid_select input[type=checkbox]:checked").each(function () {
                    dataList.push($(this).closest(".grid_row").attr("row_id"));
                });
                return dataList;
            }

            //Get selected data rows
            grid.interface.selectedRows = function () {
                var dataList = new Array();
                $(grid.selectedObject).find(".grid_data").find(".grid_select input[type=checkbox]:checked").each(function () {
                    dataList.push($(this).closest(".grid_row"));
                });
                return dataList;
            }

            //Get Rows matching data filter
            grid.interface.getRow = function (filter) {
                var dataList = new Array();
                $(grid.selectedObject).find(".grid_data").find(".grid_row").each(function (i1, row) {
                    row = $(row);
                    var rowId = row.attr("row_id");
                    var data = grid.currentData[rowId];
                    var found = true;
                    for (var prop in filter) {
                        if (typeof data[prop] === "undefined")
                            found = false;
                        if (filter[prop] != data[prop])
                            found = false;

                    }
                    if (found)
                        dataList.push(row);
                });
                return dataList;
                // return dataList;
            }

            //Get all rows
            grid.interface.getAllRows = function () {
                return $(grid.selectedObject).find(".grid_data").find(".grid_row");
            }



            //Get the selected rows data
            grid.interface.selectedData = function () {
                var dataList = new Array();
                $(grid.selectedObject).find(".grid_data").find(".grid_select input[type=checkbox]:checked").each(function () {
                    dataList.push(grid.currentData[$(this).closest(".grid_row").attr("row_id")]);
                });
                return dataList;
            }

            //Get data for the given row
            grid.interface.getRowData = function (row) {
                return grid.currentData[$(row).attr("row_id")];
            }

            //Get data for the given row id
            grid.interface.getRowDataByID = function (rowId) {
                return grid.currentData[rowId];
            }

            //Get all data.
            grid.interface.allData = function () {
                var dataList = new Array();
                for (var prop in grid.currentData) {
                    dataList.push(grid.currentData[prop]);
                }
                return dataList;
            }

            //#endregion


            //#region "Select,Create,Update and Delete Row"

            //Select a Row  
            grid.interface.selectRow = function (rowId) {
                //Change the html content
                if (grid.rowClickSelection == true)
                    grid.getRowContainer().children(".grid_row[row_id='" + rowId + "']").click();
                else {
                    var chk = grid.getRowContainer().children(".grid_row[row_id='" + rowId + "']").find(".grid_select_chk");
                    if (chk.is(":checked") == false)
                        chk.trigger("click");
                }

            }

            //Add a single row
            grid.interface.createRow = function (item, first) {
                grid.dataSource.create(item);
                var rowIds = grid.bindData([item], first);
                grid.totalRecords(++grid.dataCount);
                return rowIds;
            }

            //Update Row
            grid.interface.updateRow = function (rowId, item) {
                //Change the html content
                var row = grid.getRowContainer().children(".grid_row[row_id='" + rowId + "']");
                var selected = row.find(".grid_select input[type=checkbox]").prop("checked");
                var rowTemplate = grid.getRowTemplate();
                row.html(rowTemplate.html());

                //Change the originalData and underlying DataSource.data                    
                grid.dataSource.update(grid.originalData[rowId], item);


                //Rebind from dataSource and reset current and original data
                grid.bindRow(row, grid.originalData[rowId]);
                row.find(".grid_select input[type=checkbox]").prop("checked", selected);
            }

            //Delete a single row
            grid.interface.deleteRow = function (rowId) {
                //Delete from datasource
                grid.dataSource.delete(grid.originalData[rowId]);
                //Delete from Orinal
                delete grid.originalData[rowId];
                //DElete from current
                delete grid.currentData[rowId];
                //Delete from grid
                var row = grid.getRowContainer().children(".grid_row[row_id='" + rowId + "']");
                row.remove();
                grid.totalRecords(--grid.dataCount);
            }
            //#endregion


            //#region "Grid Setting and Binding"

            //#region "Properties to change Style."
            grid.interface.height = function (height) {
                if (height != null) {
                    grid.selectedObject.children(".grid_data").css("height", height);
                    grid.height = height;
                }
                return grid.selectedObject.children(".grid_data").css("height");
            }
            grid.interface.width = function (width) {
                if (width != null) {
                    grid.selectedObject.css("width", width);
                    grid.width = width;
                }
                return grid.selectedObject.css("width");
            }
            grid.interface.display = function (display) {
                if (display != null) {

                    grid.selectedObject.css("display", display);
                }
                return grid.selectedObject.css("display");
            }
            grid.interface.cssGrid = function (cssGrid) {
                if (cssGrid != null) {
                    grid.selectedObject.find("." + grid.cssGrid).attr("class", cssGrid);
                    grid.cssGrid = cssGrid;
                }
                return grid.css_grid;
            }
            grid.interface.rowHide = function (rowId) {

                var row = grid.getRowContainer().children(".grid_row[row_id='" + rowId + "']");
                row.hide();
                grid.totalRecords(--grid.dataCount);
            }
            grid.updateSettings = function () {
                grid.columns = grid.updatedColumns;
                grid.selection = grid.updatedSelection;
                grid.selectionType = grid.updatedSelectionType;
                grid.sorting = grid.updatedSorting;
                grid.paging = grid.updatedPaging;
                grid.pagingType = grid.updatedPagingType;
                grid.pageSize = grid.updatedPageSize;
                grid.rowClickSelection = grid.updatedRowClickSelection;

                //Update new Values
                if (grid.paging) {

                    if (grid.pagingType == "LoadMore")
                        grid.pager = new grid.LoadMorePager();
                    else if (grid.pagingType == "Standard")
                        grid.pager = new grid.StandardPager();
                }
            }

            //#endregion


            //#region "Properties to change feature"

            //Enable or Disable sorting.
            grid.interface.sorting = function (sorting) {
                if (sorting != null) {
                    grid.updatedSorting = sorting;
                }
                return grid.updatedSorting;
            };

            //Enable or Disable Paging and set the paging Type
            grid.interface.paging = function (paging) {
                if (paging != null) {
                    grid.tempPaging = paging;
                    if (paging == true) {
                        grid.updatedPaging = true;
                        grid.updatedPagingType = "Standard";
                    }
                    else if (paging == false) {
                        grid.updatedPaging = false;
                        grid.updatedPagingType = "None";
                    }
                    else if (paging == "None") {
                        grid.updatedPaging = false;
                        grid.updatedPagingType = "None";
                    }
                    else if (paging == "Standard") {
                        grid.updatedPaging = true;
                        grid.updatedPagingType = "Standard";
                    }
                    else if (paging == "LoadMore") {
                        grid.updatedPaging = true;
                        grid.updatedPagingType = "LoadMore";
                    }

                }
                return grid.tempPaging;
            };

            //Method to get or Set current page size.
            grid.interface.pageSize = function (pageSize) {
                if (pageSize != null) {
                    grid.updatedPageSize = pageSize;
                }
                return grid.updatedPageSize;
            };


            grid.interface.rowSort = function (rowSort) {
                if (rowSort != null) {
                    grid.rowSort = rowSort;
                }
                return grid.rowSort;
            };

            grid.interface.rowClickSelection = function (rowClickSelection) {
                if (rowClickSelection != null) {
                    grid.updatedRowClickSelection = rowClickSelection;
                }
                return grid.updatedRowClickSelection;
            };


            //Enable or Disable Selection and set the selection Type
            grid.interface.selection = function (selection) {
                if (selection != null) {
                    grid.tempSelection = selection;
                    if (selection == true) {
                        grid.updatedSelection = true;
                        grid.updatedSelectionType = "Single";
                    }
                    else if (selection == false) {
                        grid.updatedSelection = false;
                        grid.updatedSelectionType = "None";
                    }
                    else if (selection == "None") {
                        grid.updatedSelection = false;
                        grid.updatedSelectionType = "None";
                    }
                    else if (selection == "Single") {
                        grid.updatedSelection = true;
                        grid.updatedSelectionType = "Single";
                    }
                    else if (selection == "Multiple") {
                        grid.updatedSelection = true;
                        grid.updatedSelectionType = "Multiple";
                    }

                }
                return grid.tempSelection;
            };

            //Update or read columns
            grid.interface.columns = function (columns) {
                if (columns != null) {
                    grid.updatedColumns = columns;
                }
                return grid.updatedColumns;
            };


            //#endregion


            //#region "Template and Binding"

            //bind tehe datasource to grid
            grid.interface.dataBind = function (dataSource) {
                //Argument data is depreceated and should be used only for backward compatability.Use dataSource method to set data.                    
                if (dataSource)
                    grid.interface.dataSource(dataSource);

                //Create Header,rowTemplate and placeholder for data
                grid.bindHeader();

                //Bind the data
                grid.currentPage = 1;
                grid.getData(function (data) {
                    grid.bindData(data);
                    grid.totalRecords(data.length);
                });



            }

            //Clear previous data
            grid.clearPreviousDataSource = function () {
                //Remove all the old rows bind
                grid.getRowTemplate().next().children("div").remove();

                grid.rowCounter = 0;
                //grid.currentPage = 1; //Reset the page no if data source is changed
                grid.originalData = new Object();
                grid.currentData = new Object();

            }

            //Set the template for the grid
            grid.interface.setTemplate = function (template) {
                if (typeof template !== "undefined" && template != null) {
                    //Layout Changes.
                    if (typeof template.width !== "undefined")
                        grid.interface.width(template.width);

                    if (typeof template.height !== "undefined")
                        grid.interface.height(template.height);

                    //Feature Changes.
                    if (typeof template.selection !== "undefined")
                        grid.interface.selection(template.selection);

                    if (typeof template.sorting !== "undefined")
                        grid.interface.sorting(template.sorting);

                    if (typeof template.paging !== "undefined")
                        grid.interface.paging(template.paging);

                    if (typeof template.pageSize !== "undefined")
                        grid.interface.pageSize(template.pageSize);

                    if (typeof template.columns !== "undefined")
                        grid.interface.columns(template.columns);

                    if (typeof template.rowClickSelection !== "undefined")
                        grid.interface.rowClickSelection(template.rowClickSelection);

                    if (typeof template.sort !== "undefined")
                        grid.interface.rowSort(template.sort);

                }
            };

            //#endregion



            //#endregion


            //#region "Class variable to hold data"

            //DataSource
            grid.dataSource = null;


            //Sorting
            grid.sorting = true;
            grid.updatedSorting = true;     //temporary holding before databind
            grid.sortExpression = [];


            //Paging
            grid.paging = false;      //Decided whether paging should be enabled or not
            grid.updatedPaging = false;

            grid.pagingType = "Standard";  //LoadMore,Standard. 
            grid.updatedPagingType = "Standard"; //LoadMore,Standard,Custom

            grid.pageSize = 20;
            grid.updatedPageSize = 20;

            grid.currentPage = 1;
            grid.pager = null;       //Holds the paging Implemention depending on pagingType.


            //Selection
            grid.selection = true;
            grid.updatedSelection = true;
            grid.selectionType = "None";
            grid.updatedSelectionType = "None";
            grid.rowClickSelection = false;
            grid.updatedRowClickSelection = false;

            grid.rowSort = true;

            //Filtering
            grid.filterExpression = null;

            //Template Columns
            grid.columns = null;
            grid.updatedColumns = null;



            //Layout             
            grid.height = null;
            grid.width = null;
            grid.cssGrid = "grid";
            grid.cssGridHeader = "grid_header";
            grid.cssGridData = "grid_data";
            grid.cssGridRow = "grid_row";
            grid.cssGridColumn = "grid_column"; // Add first row and first column in future if needed.


            //Data
            grid.rowCounter = 0;
            grid.originalData = new Object();
            grid.currentData = new Object();

            //#endregion


            //#region "Grid Interface - Events"

            grid.interface.rowBound = null;
            grid.interface.rowCommand = null;
            grid.interface.selectionChanged = null;

            //#endregion


            //#region "local event handling"
            grid.selectedObject.on("focus", ".grid_row", function () {
                if (grid.selection && grid.selectionType == "Single" || grid.selection && grid.selectionType == "Multiple")
                    $(this).addClass("grid_focus");
            });

            grid.selectedObject.on("blur", ".grid_row", function () {
                $(this).removeClass("grid_focus");
            });


            grid.selectedObject.on("keydown", ".grid_row", function (event) {
                if (event.target.tagName != "SELECT" && event.target.tagName != "INPUT" && event.target.tagName != "TEXTAREA") {
                    if (event.keyCode === $.ui.keyCode.ENTER) {
                        $(this).click();
                    } else if (event.keyCode === $.ui.keyCode.UP) {
                        if ($(this).prev().hasClass("grid_row")) {
                            $(this).prev().click();
                            $(this).prev().focus();
                            event.preventDefault();
                            event.stopPropagation();
                        }


                    } else if (event.keyCode === $.ui.keyCode.DOWN) {
                        if ($(this).next().hasClass("grid_row")) {
                            $(this).next().click();
                            $(this).next().focus();
                            event.preventDefault();
                            event.stopPropagation();
                        }

                    }
                }

            });

            grid.selectedObject.on("click", ".grid_row", function (e) {


                var row;
                if (grid.selection && grid.selectionType == "Single") {
                    if (e.target.tagName != "INPUT" && e.target.tagName != "SELECT" && e.target.tagName != "TEXTAREA")
                        $(this).focus();

                    row = $(e.target).closest(".grid_row");


                    row.parent().children("div").css("background-color", "");
                    row.css("background-color", "#DEECC3");  //rgb(219, 238, 196)

                    row.parent().find(".grid_select input[type=checkbox]").prop("checked", false);
                    row.find(".grid_select input[type=checkbox]").prop("checked", true);

                    if (grid.interface.selectionChanged)
                        grid.interface.selectionChanged(row, grid.currentData[row.attr("row_id")]);
                }
                else if (grid.selection && grid.selectionType == "Multiple") {
                    if (grid.rowClickSelection == true && !(e.target.type == "checkbox" && $(e.target).attr("class") == "grid_select_chk")) {
                        row = $(e.target).closest(".grid_row");
                        row.css("cursor", "pointer");
                        if (e.shiftKey) {
                            if (grid.interface.selectedRows().length > 0) {

                                var selRow = grid.interface.selectedRows()[0];
                                row.parent().children("div").css("background-color", "");
                                row.parent().find(".grid_select input[type=checkbox]").prop("checked", false);
                                $(selRow).css("background-color", "#DEECC3");
                                $(selRow).find(".grid_select input[type=checkbox]").prop("checked", true);

                                var startRow = row.parent().children("div").index(selRow);
                                var endRow = row.parent().children("div").index(row);
                                while (startRow != endRow) {

                                    row.css("background-color", "#DEECC3");
                                    row.find(".grid_select input[type=checkbox]").prop("checked", true);

                                    if (endRow > startRow) {
                                        startRow++;
                                        selRow = $(selRow).next();
                                        $(selRow).css("background-color", "#DEECC3");
                                        $(selRow).find(".grid_select input[type=checkbox]").prop("checked", true);
                                    } else {
                                        startRow--;
                                        selRow = $(selRow).prev();
                                        $(selRow).css("background-color", "#DEECC3");
                                        $(selRow).find(".grid_select input[type=checkbox]").prop("checked", true);
                                    }
                                }
                            }

                            row.css("background-color", "#DEECC3");
                            row.find(".grid_select input[type=checkbox]").prop("checked", true);


                            if (window.getSelection) {
                                if (window.getSelection().empty) {  // Chrome
                                    window.getSelection().empty();
                                } else if (window.getSelection().removeAllRanges) {  // Firefox
                                    window.getSelection().removeAllRanges();
                                }
                            } else if (document.selection) {  // IE?
                                document.selection.empty();
                            }


                        }
                        else if (e.ctrlKey) {
                            if (row.find(".grid_select input[type=checkbox]").prop("checked") == true) {
                                row.css("background-color", "");
                                row.find(".grid_select input[type=checkbox]").prop("checked", false);
                            } else {
                                row.css("background-color", "#DEECC3");
                                row.find(".grid_select input[type=checkbox]").prop("checked", true);
                            }
                        }
                        else {
                            if (e.target.tagName != "INPUT" && e.target.tagName != "SELECT" && e.target.tagName != "TEXTAREA")
                                $(this).focus();

                            row.parent().children("div").css("background-color", "");
                            row.css("background-color", "#DEECC3");  //rgb(219, 238, 196)

                            row.parent().find(".grid_select input[type=checkbox]").prop("checked", false);
                            row.find(".grid_select input[type=checkbox]").prop("checked", true);
                        }

                    }
                    else if (e.target.type == "checkbox" && $(e.target).attr("class") == "grid_select_chk") {
                        row = $(e.target).closest(".grid_row");

                        if (e.shiftKey) {
                            if (grid.interface.selectedRows().length > 0) {
                                var selRow;
                                if (row.parent().children("div").index(row) < row.parent().children("div").index(grid.interface.selectedRows()[grid.interface.selectedRows().length - 1]))
                                    selRow = grid.interface.selectedRows()[grid.interface.selectedRows().length - 1];
                                else
                                    selRow = grid.interface.selectedRows()[0];
                                row.parent().children("div").css("background-color", "");
                                row.parent().find(".grid_select input[type=checkbox]").prop("checked", false);
                                $(selRow).css("background-color", "#DEECC3");
                                $(selRow).find(".grid_select input[type=checkbox]").prop("checked", true).change();

                                var startRow = row.parent().children("div").index(selRow);
                                var endRow = row.parent().children("div").index(row);
                                while (startRow != endRow) {

                                    row.css("background-color", "#DEECC3");
                                    row.find(".grid_select input[type=checkbox]").prop("checked", true).change();

                                    if (endRow > startRow) {
                                        startRow++;
                                        selRow = $(selRow).next();
                                        $(selRow).css("background-color", "#DEECC3");
                                        $(selRow).find(".grid_select input[type=checkbox]").prop("checked", true).change();
                                    } else {
                                        startRow--;
                                        selRow = $(selRow).prev();
                                        $(selRow).css("background-color", "#DEECC3");
                                        $(selRow).find(".grid_select input[type=checkbox]").prop("checked", true).change();
                                    }
                                }
                            }
                            //added for grid header checkbox issue
                            if ($(grid.selectedObject).find(".grid_row:visible").length == grid.interface.selectedRows().length)
                                row.parent().parent().find(".grid_header").find(".grid_header_select input[type=checkbox]").prop("checked", true);
                            else
                                row.parent().parent().find(".grid_header").first().find(".grid_header_select input[type=checkbox]").prop("checked", false);
                            row.css("background-color", "#DEECC3");
                            row.find(".grid_select input[type=checkbox]").prop("checked", true);


                            if (window.getSelection) {
                                if (window.getSelection().empty) {  // Chrome
                                    window.getSelection().empty();
                                } else if (window.getSelection().removeAllRanges) {  // Firefox
                                    window.getSelection().removeAllRanges();
                                }
                            } else if (document.selection) {  // IE?
                                document.selection.empty();
                            }
                        }
                        else {
                            if ($(this).find(".grid_select input[type=checkbox]").prop("checked")) {
                                row.css("background-color", "#DEECC3");
                            }
                            else {
                                row.css("background-color", "white");
                            }
                            if ($(grid.selectedObject).find(".grid_row:visible").length == grid.interface.selectedRows().length)
                                row.parent().parent().find(".grid_header").first().find(".grid_header_select input[type=checkbox]").prop("checked", true);
                            else
                                row.parent().parent().find(".grid_header").first().find(".grid_header_select input[type=checkbox]").prop("checked", false);
                        }
                    }

                    if (grid.interface.selectionChanged) {
                        var dataList = new Array();
                        var rowList = new Array();
                        $(grid.selectedObject).find(".grid_data").find(".grid_select input[type=checkbox]:checked").each(function () {
                            rowList.push($(this).closest(".grid_row"));
                            dataList.push(grid.currentData[$(this).closest(".grid_row").attr("row_id")]);
                        });
                        grid.interface.selectionChanged(rowList, dataList);
                    }

                }

                var actionElement = $(e.target);
                if (actionElement.attr("action")) {
                    if (grid.interface.rowCommand)
                        grid.interface.rowCommand(actionElement.attr("action"), actionElement, $(actionElement).closest(".grid_row").attr("row_id"), $(actionElement).closest(".grid_row"), grid.currentData[$(actionElement).closest(".grid_row").attr("row_id")]);
                }
            });

            $(grid.selectedObject).on("keydown", "input[filterDataField]", function (event) {
                if (event.which == 13) {
                    grid.interface.applyFilter();
                }

            });

            $(grid.selectedObject).on("change", "select[filterDataField]", function () {
                grid.interface.applyFilter();
            });


            //#endregion 


            //#region "Building UI"

            grid.bindHeader = function () {



                //Clear the entire grid
                $(grid.selectedObject).html("");
                $(grid.selectedObject).attr("class", grid.cssGrid);

                //Building header
                var header = [];
                header.push("<div class='" + grid.cssGridHeader + "'>");

                //When Selection mode is miltiple. Add checkbox to perform selectAll and deSelectAll.
                if (grid.selection && grid.selectionType == "Multiple") {
                    header.push("<div style='width:20px' class='grid_header_select' >");//;display:none
                    header.push("<input type='checkbox'  >");
                    header.push("</div>");
                }

                //Add Column Headers
                $(grid.columns).each(function (iIndex, item) {
                    /* Sorting Implementation
                        1. Default Sort
                                1.By default, sorting is true for all columns. if user dont need sorting for that column, user can set to false.
                                2.When header column is clicked (note header column should have attribute sortDataField),
                                        Based on currentSortState attribute, calculate the next sort state .. State transition  allowed -  NONE->ASC->DESC->NONE. Intitally set to none.
                                        Sort expression is calculated based on new currentSortState and passed to getData method and the resulting data is rebind to grid.                                                       
                                3. Multi Column Sort possibility
                                        Press ctrl and click the span[sortDataField]. New sort expression for current column is appended to previous sort expression and then passed to getData.
                        
                        2. Default sort with header template 
                                same as above.
                        
                        3. Custom Sort 
                                    1. set sorting=false first
                                    2. Define your own header template and bind click event.
                                    3. When your header is clicked, call grid.interface.sort(sortExpression)
                     */

                    //Decide whether to use span or use user defined template.
                    var columnTemplate;
                    if (typeof item.sorting == "undefined" || item.sorting == true) {
                        columnTemplate = grid.sortImplementation.getDefaultSortTemplate(item);
                    } else {
                        if (item.headerTemplate)
                            columnTemplate = item.headerTemplate;
                        else
                            columnTemplate = "<span>" + item.name + "</span>";
                    }


                    //add the column to the header row.                     
                    header.push("<div dataField='" + item.dataField + "' style='" + (item.visible === false ? "display:none;" : "") + "width: " + item.width + "'>" + columnTemplate + "</div>");
                });
                header.push("</div>");

                $(grid.selectedObject).append(header.join(""));





                if (grid.sorting == true) {
                    grid.sortImplementation.bindEvents();
                }




                //Filter Code starts herer
                header = [];
                header.push("<div class='grid_filter' style='display:none'>");
                //When Selection mode is miltiple. placeholder to occupy some space
                if (grid.selection && grid.selectionType == "Multiple") {
                    header.push("<div style='width:20px'></div>");
                }

                //Add Column Headers
                $(grid.columns).each(function (iIndex, item) {
                    //Prepare the column level style to be set.
                    var columnStyle = "";
                    if (item.visible === false)
                        columnStyle = "display:none;";
                    columnStyle = columnStyle + "width: " + item.width;

                    var filterTemplate;
                    if (item.filterTemplate)       //Enables customisation by providing custom template for filtering
                        filterTemplate = item.filterTemplate;
                    else {
                        //Select Type filter is allowed only for InMemory data. For remote data use filter template and custom code,.
                        if (item.filterType == "Select" && grid.dataLocation == "InMemory")   //Binding data to select will be delayed until show filter is called.
                            filterTemplate = "<select filterDataField='" + (typeof (item.filterDataField) != "undefined" ? item.filterDataField : item.dataField) + "' sortDataField='" + (typeof (item.sortDataField) != "undefined" ? item.sortDataField : item.dataField) + "' dataField='" + item.dataField + "' filter='true' style='width:calc( 100% - 10px );font-size:10px;font-family:verdana;margin-top:2px;margin-bottom:0px'></select>";
                        else
                            filterTemplate = "<input filterDataField='" + (typeof (item.filterDataField) != "undefined" ? item.filterDataField : item.dataField) + "' dataField='" + item.dataField + "' filter='true' type=text style='font-size:10px;font-family:verdana;width:calc( 100% - 10px );margin-top:2px;margin-bottom:4px' />";
                    }

                    //add the column to the header row.                    
                    header.push("<div  style='" + columnStyle + "'>" + filterTemplate + "</div>");
                });
                header.push("</div>");



                $(grid.selectedObject).append(header.join(""));

                $(grid.selectedObject).find(".grid_header_select > input[type=checkbox]").change(function () {
                    $(grid.selectedObject).find(".grid_data .grid_select input[type=checkbox]").prop("checked", $(this).prop("checked")).change();
                    if ($(grid.selectedObject).find(".grid_data .grid_select input[type=checkbox]").prop("checked")) {
                        $(grid.selectedObject).find(".grid_data .grid_row").css("background-color", "rgba( rgb(222, 236, 195)");
                    }
                    else {
                        $(grid.selectedObject).find(".grid_data .grid_row").css("background-color", "rgba(255, 255, 255, 1");
                    }
                });



                //Build the row template. Row template is used to build individual row when binding
                var rowTemplate = "<div style='display:none'>";
                rowTemplate = rowTemplate + "<div class='grid_select'  style='" + ((grid.selection && grid.selectionType == "Multiple") ? "width:20px" : "display:none") + "'><input class='grid_select_chk' type='checkbox' ></div>";
                $(grid.columns).each(function (iIndex, item) {
                    var columnStyle = "width: " + item.width;

                    if (item.minimumWidth === false)
                        columnStyle = columnStyle + ";min-width:" + item.minimumWidth;
                    if (item.visible === false && (typeof item.visible !== "undefined"))
                        columnStyle = columnStyle + ";display:none";

                    //Check whether default template or user defined template
                    var itemTemplate = "<div>{" + item.dataField + "}</div>";
                    if (item.itemTemplate)
                        itemTemplate = "<div>" + item.itemTemplate + "</div>";

                    //Check whether editable and to add a placeholder for edit
                    var editTemplate = "";
                    if (item.editable) {
                        editTemplate = "<div class='grid_edit' style='display:none' column_index='" + iIndex + "'>";
                        editTemplate = editTemplate + "</div>";
                    }

                    //add the column to the row.
                    rowTemplate = rowTemplate + "<div style='" + columnStyle + "' dataField='" + item.dataField + "' >" + itemTemplate + editTemplate + "</div>";

                });
                rowTemplate = rowTemplate + "</div><div style='height:" + grid.height + "' class='" + grid.cssGridData + "'></div>";
                rowTemplate = rowTemplate + "<div class='grid_header'>";
                if (grid.paging == true && grid.pagingType == "LoadMore")
                    rowTemplate = rowTemplate + "<span style='float: left; margin-right: 20px; margin-top: 5px;' class='grid_page_load_more'>Load More</span>";
                else if (grid.paging == true && grid.pagingType == "Standard") {
                    rowTemplate = rowTemplate + "<div  class='grid_page_standard'><span page-action='prev' style='margin-right: 10px;cursor:pointer'>Prev</span><select page-action='goto' style='margin-right: 10px; padding: 0px;'>";
                    rowTemplate = rowTemplate + "</select><span style='cursor:pointer' page-action='next'>Next</span></div>";

                }
                rowTemplate = rowTemplate + " <span style='float: right; margin-right: 20px; margin-top: 5px;' class='total_record'></span></div>";

                $(grid.selectedObject).append(rowTemplate);
                if (grid.sorting) {
                    $(grid.selectedObject).find("." + grid.cssGridHeader + " div[dataField]").click(function (e) {
                        //Hide all other icons.
                        if ($(this).attr("sorting") == "true") {

                            if (!(e.target.tagName == "OPTION" || e.target.tagName == "SELECT" || e.target.tagName == "INPUT")) {

                                grid.selectionMode = e.ctrlKey ? "Multiple" : "Single";
                                grid.sortColumnClicked = $(this);
                                if (typeof $(grid.selectedObject).attr("requiredUnSavedCheck") != "undefined") {
                                    unSavedChangesCheck($(grid.selectedObject).attr("requiredUnSavedCheck"), function () {
                                        grid.sortColumnClickHandler();
                                    });
                                }
                                else {

                                    grid.sortColumnClickHandler();

                                }
                            }
                        }
                    });
                }


                if (grid.paging == true && grid.pagingType == "LoadMore")
                    $(grid.selectedObject).find(".grid_page_load_more").click(function () {
                        grid.pager.loadMore();
                    });
                else if (grid.paging == true && grid.pagingType == "Standard") {
                    $(grid.selectedObject).find(".grid_page_standard > [page-action]").click(function () {
                        if ($(this).attr("page-action") == "prev") {
                            grid.pager.previousPage();
                            //$(grid.selectedObject).find(".grid_page_standard > select[page-action]").val(grid.currentPage);
                        } else if ($(this).attr("page-action") == "next") {
                            grid.pager.nextPage();
                            // $(grid.selectedObject).find(".grid_page_standard > select[page-action]").val(grid.currentPage);
                        }

                    });
                    $(grid.selectedObject).find(".grid_page_standard > [page-action]").change(function () {
                        if ($(this).attr("page-action") == "goto") {
                            grid.pager.goToPage($(this).val());

                        }
                    });
                }


            }
            grid.addRow = function (first) {
                //Create a dummy row
                var row = grid.getRowTemplate().clone();
                //Add the dummy row to grid.
                if (typeof first == "undefined")
                    grid.getRowContainer().append(row);
                else if (String(first) == "false")
                    grid.getRowContainer().prepend(row);
                else if ($(first).length > 0) {
                    $(first).after(row);
                    //grid.getRowContainer().prepend(row);
                }

                //Set the row_id                     
                row.attr("row_id", ++grid.rowCounter);

                //Set the css
                row.css("display", "");
                row.attr("class", grid.cssGridRow);
                row.attr("tabindex", "1");
                row.addClass(grid.rowCounter % 2 == 1 ? "odd-row" : "even-row");
                return row;

            }
            grid.bindRow = function (row, item) {
                //Store the data                         
                grid.originalData[row.attr("row_id")] = item;
                grid.currentData[row.attr("row_id")] = $.util.clone(item); //Clone it.

                //Raise row bound event. So that user can override data and style before binding.
                if (grid.rowClickSelection) {
                    row.css("cursor", "pointer");
                }


                if (grid.interface.beforeRowBound)
                    grid.interface.beforeRowBound(row, grid.currentData[row.attr("row_id")]);

                //Bind value in each column.
                row.children("div").each(function () {
                    var dataFields = $(this).attr("dataField");
                    if (dataFields) {
                        //Bind the data and reload in div
                        $(this).html(grid.bindTemplate($(this).html(), dataFields, grid.currentData[row.attr("row_id")]));
                        // if ($(this).find("div[mode=view]").length > 0)
                        //     $(this).attr("title", $(this).find("div[mode=view]").text().trim());
                        // else
                        //    $(this).attr("title", $(this).text().trim());

                    }
                });

                if (row.attr("row-click") != "true") {
                    row.attr("row-click", "true");
                    row.click(function (evt) {
                        var actionElement = $(evt.target);
                        if (actionElement.attr("action")) {
                            var e = {
                                action: actionElement.attr("action"),
                                actionElement: actionElement,
                                currentRowId: $(actionElement).closest(".grid_row").attr("row_id"),
                                currentRow: $(actionElement).closest(".grid_row"),
                                currentData: grid.currentData[$(actionElement).closest(".grid_row").attr("row_id")],
                                originalData: grid.currentData[$(actionElement).closest(".grid_row").attr("row_id")],
                                save: function () {
                                    grid.interface.updateRow(this.currentRowId, this.currentData);
                                },
                                cancel: function () {
                                    grid.interface.updateRow(this.currentRowId, this.originalData);
                                }
                            };
                            if (grid.interface.rowCommand)
                                grid.interface.rowCommand(e);
                        }
                    });
                }




                if (grid.interface.rowBound)
                    grid.interface.rowBound(row, grid.currentData[row.attr("row_id")]);
            }
            grid.bindData = function (data, first) {
                var rowIds = [];
                $(data).each(function (iIndex, item) {
                    //Add a new row to grid.
                    var row = grid.addRow(first);
                    rowIds.push($(row).attr("row_id"));
                    //Bind data to row.
                    grid.bindRow(row, item);

                });
                return rowIds;
            }
            grid.getRowTemplate = function () {
                //Find the row template in grid.It is placed next to header section and hidden.                    
                return $(grid.selectedObject).find(".grid_data").prev();
            }
            grid.bindTemplate = function (tempContent, dataFields, item) {

                $(dataFields.split(",")).each(function (i, dataField) {
                    tempContent = $.util.replaceAll(tempContent, "{" + dataField + "}", item[dataField] == null ? "" : item[dataField]);
                });
                return tempContent;
            }
            grid.getRowContainer = function () {
                return $(grid.selectedObject).find(".grid_data");
            }

            //#endregion


            //#region Edit the grid data
            grid.interface.edit = function (val, rowId) {
                var editableColumns;
                if (!rowId)
                    editableColumns = $(grid.selectedObject).find(".grid_data").find(".grid_edit"); //Edit All row
                else
                    editableColumns = $(grid.selectedObject).find(".grid_data").find(".grid_row[row_id='" + rowId + "']").find(".grid_edit"); //Edit SPecific row.In future pass multiple rowId and select multiple row to editable column

                editableColumns.each(function (iIndex, item) {
                    if (val) {
                        var row = $(item).closest(".grid_row");
                        var column = grid.columns[$(this).attr("column_index")]; //Find the column to be updated                                
                        var data = grid.currentData[row.attr("row_id")];
                        $(item).html(grid.bindTemplate(column.editTemplate ? column.editTemplate : "<input type='text' dataField='" + column.dataField + "' value='{" + column.dataField + "}' />", column.dataField, data));
                    } else {
                        $(item).html("");
                    }
                    if (!val) {
                        $(item).show();
                        $(item).prev().hide();

                    } else {
                        $(item).hide();
                        $(item).prev().show();

                    }
                    $(item).toggle();
                    $(item).prev().toggle();

                });
                editableColumns.find("input[dataField]").bind('keyup keydown keypress onDOMAttrModified propertychange change', function () {
                    var rowId = $(this).closest(".grid_row").attr("row_id");
                    grid.currentData[rowId][$(this).attr("dataField")] = $(this).val();

                });
            }
            //#endregion


            //#region "For automation"
            grid.interface.AutoSetValue = function (filter, selector, value) {

                var row = $(grid.interface.getRow(filter)[0]);
                row.find(selector).val(value).trigger('change');

            }

            //Get value of the cell based on filter values
            grid.interface.AutoGetValue = function (filter, dataField) {
                var row = $(grid.interface.getRow(filter)[0]);
                return $(row.find("[datafield=" + dataField + "]")).first().text().trim()
            }

            //RowAction({ pcaName: "dfvds" }, "edit");
            //SetValue({ pcaName: "" }, "input[dataField=pcaName]", "Hellow")
            //SelectRow({ pcaName: "dfvds" });
            grid.interface.AutoSelectRow = function (filter) {

                var rowId = $(grid.interface.getRow(filter)[0]).attr("row_id");
                grid.interface.selectRow(rowId);
            }

            grid.interface.AutoRowAction = function (filter, actionName) {

                var row = $(grid.interface.getRow(filter)[0]);
                row.find("[action=" + actionName + "]").click();

            }
            //#endregion

            grid.attachCommonroperties();


        });


    };

    //File List
    $.fn.fileList = function () {
        return $.pageController.getControl(this, function (page, $$) {
            page.previewDialog = null;
            page.maxFiles = null;
            page.maxSize = null; // this will be in bytes

            page.interface.maxFiles = function (maxFiles) {
                if (maxFiles != null) {
                    page.maxFiles = maxFiles;
                }
            }
            page.interface.maxSize = function (maxSize) {
                if (maxSize != null) {
                    page.maxSize = maxSize;
                }
            }


            page.events.page_load = function () {
                $(page.selectedObject).addClass("file-list");
                var html = [];
                html.push("<div class='preview' style='display: none;' ><img src='' /></div>");
                html.push("<div class='file-list-data' style='display: none'></div>");
                html.push("<div class='file-list-action'>");
                //html.push('<input type="button" value="Click here to Upload" style="cursor:pointer;font-family: verdana; font-size: 10px; margin-top: 3px;"> <span> Or Drag and Drop here</span>');
                html.push('<input type="button" value="Click here to Upload" style="display: none">');
                //html.push('<input type="file"  accept="image/x-png, image/gif, image/jpeg"  class="inputfile" multiple style="display: none;">');
                html.push('<input type="file"  class="inputfile" multiple style="display: none;">');
                html.push("</div>");
                $(page.selectedObject).append(html.join(" "));
                //Trigger to open file dialog 
                $(page.selectedObject).on("click", ".file-list-action input[type=button]", function (e) {
                    $(page.selectedObject).find(".file-list-action input[type=file]").click();
                });




                $(page.selectedObject).find(".file-list-action input[type=file]").on("change", function () {
                    //var self = this;
                    //var approvedFiles = ValidateFileExtension(this.files);
                    //FileUpload(approvedFiles,
                    //           function (data) {
                    //               $(data)
                    //                   .each(function (i, imageItem) {

                    //                       page.allData[page.counter] = imageItem;
                    //                       bindRow(page.counter, imageItem);
                    //                       page.counter = page.counter + 1;
                    //                   });
                    //               if (page.interface.dataChange)
                    //                   page.interface.dataChange(page.interface.allData());

                    //               $(self).val("");
                    //           });



                });



                $(page.selectedObject).on('dragover', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                });

                function ValidateFileExtension(files) {
                    var approvedFiles = [];
                    //var _validFileExtensions = ["jpg", "jpeg", "gif", "png", "bmp"];

                    //$.each(files, function (i, n) {
                    //    if ($.inArray(this.type.split('/').pop().toLowerCase(), _validFileExtensions) == -1) {
                    //        alert("Only file formats jpg, jpeg, gif and png are allowed.");
                    //    } else {
                    //        approvedFiles.push(this);

                    //    }

                    //});
                    approvedFiles = files;
                    return approvedFiles;
                }

                $(page.selectedObject).on("drop", function (e) {

                    var droppedFiles = e.originalEvent.dataTransfer.files;

                    var approvedFiles = ValidateFileExtension(droppedFiles);


                    //FileUpload(approvedFiles, function (data) {
                    //    $(data).each(function (i, imageItem) {
                    //        page.allData[page.counter] = imageItem;
                    //        bindRow(page.counter, imageItem);
                    //        page.counter = page.counter + 1;
                    //    });
                    //    if (page.interface.dataChange)
                    //        page.interface.dataChange(page.interface.allData());

                    //});
                    e.preventDefault();
                    e.stopPropagation();
                });


            }



            function FileUpload(files, callback) {
                //var formData = new winFormData($(this)[0]);
                var allowUpload = true;
                var showSizeWarning = false;
                if (page.maxFiles != null) {
                    if (files.length + page.interface.allData().length > page.maxFiles) {
                        allowUpload = false;
                    }
                }

                if (allowUpload) {
                    if (files.length > 0) {
                        var datas = new window.FormData();
                        if (page.maxSize != null) {
                            for (var i = 0; i < files.length; i++) {
                                if (files[i].size < page.maxSize)
                                    datas.append(files[i].name, files[i]);
                                else
                                    showSizeWarning = true;
                            }
                        } else {
                            showSizeWarning = false;
                            for (var i = 0; i < files.length; i++) {
                                datas.append(files[i].name, files[i]);
                            }
                        }


                        page.container.progressBar('show');
                        $.ajax({
                            url: '../WebServices/FileUploadHandler.ashx/ProcessRequest',
                            type: 'POST',
                            data: datas,
                            cache: false,
                            crossDomain: true,
                            processData: false, // Don't process the files
                            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                            success: function (data, textStatus, jqXHR) {
                                var mapData = [];
                                $(data)
                                    .each(function (i, item) {
                                        mapData.push({
                                            fileNo: item.FileNo,
                                            fileName: item.FileName,
                                            filePath: item.FilePath.substring(2)
                                        });
                                    });
                                $(page.selectedObject).find(".file-list-data").css("height", "125px");
                                callback(mapData);

                                page.container.progressBar('hide');
                                if (showSizeWarning) {
                                    var tenL = 1000000;
                                    alert("Files greater than " + page.maxSize / tenL + " MB are not uploaded.");
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                page.container.progressBar('hide');
                            }
                        });
                    }
                } else {
                    alert('Max. ' + page.maxFiles + ' files can be stored here.');
                }
            }
            function bindRow(rowId, imageItem) {
                var html = [];
                html.push("<div style='position:relative' row-id='" + rowId + "' fileNo='" + imageItem.fileNo + "'>");
                html.push("<img title='Click to Preview'  style=' cursor: pointer;' src='" + imageItem.filePath + "' />");
                // html.push("<span>" + imageItem.fileName + "</span> ");
                html.push('<input type="button" title="Delete the file." style="position: absolute; cursor: pointer; color: black; background-color: white; font-family: courier new; width: 15px; margin-left: 0px; left: 85px; border: 1px solid black; padding-left: 2px; top: 0px;" action="delete" value="x" />');
                html.push("</div>");

                $(page.selectedObject).find(".file-list-data").append(html.join(" "));
                $(page.selectedObject).find(".file-list-data img").on("dragstart", function (event) {
                    event.preventDefault();

                    return false;
                });
            }

            $(page.selectedObject).on("click", ".file-list-data input[action]", function (e) {
                delete page.allData[$(e.currentTarget).closest("div").attr("row-id")];
                $(e.currentTarget).closest("div").remove();
                if (page.interface.dataChange)
                    page.interface.dataChange(page.interface.allData());
            });

            $(page.selectedObject).on("click", ".file-list-data img", function (e) {
                if (page.previewDialog == null) {

                    var div = $(page.selectedObject).find(".preview");
                    div.dialog();
                    div.dialog("open");
                    div.parent().find('.ui-dialog-title').html("Image Viewer");
                    div.dialog("option", "width", "900");
                    div.dialog("option", "maxHeight", "400");
                    div.dialog("option", "height", "400");
                    page.previewDialog = div;
                }
                page.previewDialog.find("img").attr("src", $(e.target).attr("src"));
                page.previewDialog.find("img").attr("width", '600');
                page.previewDialog.find("img").attr("height", '300');
                page.previewDialog.dialog("open");


            });

            page.interface.dataChange = null;
            page.counter = 1;
            page.interface.dataBind = function (imageList) {
                page.allData = {};
                $(page.selectedObject).find(".file-list-data").html("");
                $(imageList).each(function (i, imageItem) {

                    page.allData[page.counter] = imageItem;
                    bindRow(page.counter, imageItem);
                    page.counter = page.counter + 1;

                });

            }
            page.interface.allData = function () {
                var dataList = [];
                for (var prop in page.allData) {
                    dataList.push(page.allData[prop]);
                }
                return dataList;
            }


        });

    }
    //File Uploader
    $.fn.fileUploader = function (defaults) {
        return $.pageController.getControl(this, function (page, $$) {

            $(page.selectedObject).html('<input type="file" id="fileElem" multiple accept="image/*" style="display:none"  onchange="">            <a class="col-lg-3 col-lg-offset-5 col-xs-12 post_ad" href="#" id="fileSelect">Upload Image</a>             <div class="col-lg-3 col-lg-offset-5 col-xs-12" id="fileList"> <img/>                     </div>');//<p>No Files selected!</p>   

            page.interface.fileAdded = null;

            function handleFiles(files) {
                var invalidFileName = Array.from(files).filter(function (item) {
                    return item.name.length > 100;
                })
                if (invalidFileName.length> 0) {
                    alert("File name length exceeds 100. please rename and try again ");
                } else {
                    for (let i = 0; i < files.length; i++) {

                        const file = files[i];


                        new FileUpload(files[i], files[i].file);

                        // if (!file.type.startsWith('image/')) { continue }

                        // var preview= $(page.selectedObject).find("#fileList");

                        // const img = document.createElement("img");
                        // img.classList.add("obj");
                        // img.file = file;
                        // preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.

                        // const reader = new FileReader();
                        // reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(img);
                        // reader.readAsDataURL(file);
                    }
                }
                
            }

            // function sendFiles() {
            //     const imgs = document.querySelectorAll(".obj");

            //     for (let i = 0; i < imgs.length; i++) {
            //         new FileUpload(imgs[i], imgs[i].file);
            //     }
            // }

            //File image upload into server physical location
            function FileDirectUpload(file) {
                var data = new FormData();

                // Add the uploaded image content to the form data collection
                if (file != undefined) {
                        
                        var str = file.name.split(".");
                        var type = str[str.length - 1];
                        Window.no_of_images_server = ++Window.no_of_images_server;
                        //file.name = "image_" + Window.no_of_images + "." + type;
                        data.append("file", file, "image_" + Window.no_of_images_server + "." + type);
                        // Make Ajax request with the contentType = false, and procesDate = false
                        var ajaxRequest = $.ajax({
                            type: "POST",
                            //url: "http://104.251.218.116:8080/FileUploaderRESTService/rest/image/upload",
                            url: CONTEXT.ENABLE_IMAGE_UPLOAD_URL,
                            headers: {
                                //'file-path': '/usr/shopon/upload/images/' + $$("lblItemNo").value() + '/'
                                'file-path': CONTEXT.ENABLE_IMAGE_FILE_PATH + Window.selected_item_no + '/'
                            },
                            contentType: false,
                            processData: false,
                            data: data
                        });

                        ajaxRequest.done(function (xhr, textStatus) {
                            //alert("Picture uploaded successfully.");
                            console.log("Picture uploaded successfully...!");
                        });
                } else {
                    $$("msgPanel").show("Please any images before uploading it");
                }
            }
            function FileUpload(file) {
                const reader = new FileReader();
                reader.onload = function (evt) {
                    //xhr.send(evt.target.result);
                    var str = file.name.split(".");
                    var type = str[str.length - 1];
                    Window.no_of_images = ++Window.no_of_images;
                    $.server.webMethodPOST("propon/files/", [{
                        file_no: "##GUID##",
                        file_name: "image_" + Window.no_of_images+"."+type,
                        file_type: CONTEXT.IMAGE_UPLOAD_TYPE,
                        file_path: CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + Window.selected_item_no + '/' + "image_" + Window.no_of_images + "." + type,
                        //item_no:file.item_no,
                        file_data:(CONTEXT.IMAGE_UPLOAD_TYPE=="DB")? evt.target.result:undefined, 
                        "org_id": "##org_id##",
                        comp_id: getCookie("user_company_id")
                    }], function (data) {
                        if (CONTEXT.IMAGE_UPLOAD_TYPE == "FILE") {
                            FileDirectUpload(file);
                        }
                        //$(page.selectedObject).find("img").attr("src",data[0].file_data);
                        if (page.interface.fileAdded) {
                            page.interface.fileAdded(data);

                        }

                    });

                };
                reader.readAsDataURL(file);

                // this.ctrl = createThrobber(img);
                // const xhr = new XMLHttpRequest();
                // this.xhr = xhr;

                // const self = this;
                // this.xhr.upload.addEventListener("progress", function (e) {
                //     if (e.lengthComputable) {
                //         const percentage = Math.round((e.loaded * 100) / e.total);
                //         self.ctrl.update(percentage);
                //     }
                // }, false);

                // xhr.upload.addEventListener("load", function (e) {
                //     self.ctrl.update(100);
                //     const canvas = self.ctrl.ctx.canvas;
                //     canvas.parentNode.removeChild(canvas);
                // }, false);
                // xhr.open("POST", "http://demos.hacks.mozilla.org/paul/demos/resources/webservices/devnull.php");
                // xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
                // reader.onload = function (evt) {
                //     xhr.send(evt.target.result);
                // };
                // reader.readAsBinaryString(file);
            }

            page.events.page_load = function () {
                $(page.selectedObject).find("#fileSelect").click(function (e) {
                    $(page.selectedObject).find("#fileElem").val("");
                    $(page.selectedObject).find("#fileElem").click();
                    
                    e.preventDefault();

                });
                $(page.selectedObject).find("#fileElem").change(function (e) {

                    handleFiles(this.files);

                });
            }

        });
    }
    //Repeater control
    $.fn.repeater = function () {
        var selectedObject = $(this);

        var bindTemplate = function (tempContent, dataFields, item) {

            $(dataFields.split(",")).each(function (i, dataField) {
                tempContent = tempContent.replaceAll("{" + dataField + "}", item[dataField]);
            });
            return tempContent;
        }
        var self = this;
        return {
            selectedObject: selectedObject,
            setTemplate: function (template) {
                selectedObject.template = template;
            },

            dataBind: function (data) {
                $(self).find(".grid_repeater_data").html("");
                $(data).each(function (i, item) {
                    var row = bindTemplate($(self).find(".grid_repeater_template").html(), "item_no,item_name,qty,price", item);
                    $(self).find(".grid_repeater_data").append("<div class='grid_repeater_row'>" + row + "</div>");

                });



            }




        };

    }

    //Tree controls
    $.fn.tree = function (defaults) {
        return $.pageController.getControl(this, function (page, $$) {

            page.events.page_load = function () {
                $(page.selectedObject).addClass("tree");
                page.currentSize = 0;
                page.pageSize = 200;
                page.interface.action = null;
                page.data = null;
                page.template = null;

                //Events to handle template level actions.For example edit,save etc which are placed in headers will be handled here.
                //User should set the action attribute of link tag to TemplateEdit,TemplateCancel,TemplateSave inorder to automatically handle ui change.
                $(page.selectedObject).on("click", " .tree_header a", function (e) {
                    var actionElement = $(e.target);
                    if (actionElement.attr("action")) {

                    }
                });

                $(page.selectedObject).keydown(function (e) {
                    if (e.keyCode == 38) {
                        //  $(page.selectedObject).
                    } else {

                    }
                });

                //Event to handle row level actions and expand sub tree
                $(page.selectedObject).on("click", " .tree_data", function (e) {
                    //Row level actions will be triggered for link tag with action attribute set. User can handle this event
                    var action = $(e.target).attr("action");
                    if (action) {

                        //Handle inbuilt actions like expand and collapse.
                        if ($(e.target).attr("action") == "expand") {

                            //Show the sub content and change the icon.
                            $(this).parent().children("ul").css("display", "block");
                            $(this).closest("li").children("a:first").children("span:first").children("img").attr("src", BasePath + "ui/ui/images/minus.gif");
                            $(this).closest("li").children("a:first").children("span:first").children("img").attr("action", "collapse");

                            if (page.interface.expand)
                                page.interface.expand({
                                    objectName: $(this).attr("object-name"),
                                    objectKey: $(this).attr("object-key"),
                                    objectValue: $(this).attr("object-value"),
                                    objectContext: $(this).attr("object-context"),
                                    objectData: JSON.parse($(this).attr("object-data")),
                                    currentNode: $(this).parent()
                                });

                        } else if ($(e.target).attr("action") == "collapse") {
                            $(this).parent().children("ul").css("display", "none");
                            $(this).closest("li").children("a:first").children("span:first").children("img").attr("src", BasePath + "ui/ui/images/plus.gif");
                            $(this).closest("li").children("a:first").children("span:first").children("img").attr("action", "expand");


                        } else {
                            //Method Syntax : action(actionName,selectedData,selectedObjectType,selectedCheckbox,parentData,target)
                            if (page.interface.action != null)
                                page.interface.action({
                                    action: $(e.target).attr("action"),
                                    actionElement: e.target,
                                    objectName: $(this).attr("object-name"),
                                    objectKey: $(this).attr("object-key"),
                                    objectValue: $(this).attr("object-value"),
                                    objectContext: $(this).attr("object-context"),
                                    objectData: JSON.parse($(this).attr("object-data")),
                                    currentNode: $(this).parent(),
                                    parentObject: $(this).parent().parent().parent().parent().parent().children("a").attr("object"),
                                });
                        }
                    } else {
                        $(page.selectedObject).find(".tree_data_chk:checked").closest("a").css("background-color", "white");
                        $(page.selectedObject).find(".tree_data_chk:checked").prop("checked", false);

                        if ($(this).find('.tree_data_chk').prop("checked") == true)
                            $(this).find('.tree_data_chk').closest("a").css("background-color", "white");
                        else
                            $(this).find('.tree_data_chk').closest("a").css("background-color", "rgb(213, 254, 168);");
                        $(this).find('.tree_data_chk').prop("checked", !$(this).find('.tree_data_chk').prop("checked"));

                        if (page.interface.selectionChange != null) {
                            page.interface.selectionChange({
                                action: "Select",
                                actionElement: e.target,
                                objectName: $(this).attr("object-name"),
                                objectKey: $(this).attr("object-key"),
                                objectValue: $(this).attr("object-value"),
                                objectContext: $(this).attr("object-context"),
                                objectData: JSON.parse($(this).attr("object-data")),
                                currentNode: $(this).parent(),

                                parentObject: $(this).parent().parent().parent().children("a").attr("object"),
                                parentNode: $(this).parent().parent().parent()
                            });
                        }
                    }

                });

                //Implement sorting for only root level headers,
                $(page.selectedObject).on("click", ".tree_root > li > .tree_header span[dataField]", function () {
                    //Comparison logic
                    function dynamicSort(property, order) {
                        var sortOrder = -1;
                        if (order === "ASC") {
                            sortOrder = 1;
                        }
                        return function (a, b) {
                            var result = (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
                            return result * sortOrder;
                        };
                    }

                    //toggle sort direction on each click
                    var sort;
                    if ($(this).children("img").length === 0 || $(this).children("img").attr("sort") === "DESC")
                        sort = "ASC";
                    else
                        sort = "DESC";

                    //Sort the records
                    page.data.sort(dynamicSort($(this).attr("dataField"), sort));


                    //Load the sorted data
                    $(page.selectedObject).tree().addNodes(page.template, page.data, page.currentSize);

                    //Toggle the plus\minus icon
                    var header = $(page.selectedObject).find(".tree_header span[dataField='" + $(this).attr("dataField") + "']");
                    if (sort === "ASC")
                        header.append("<img sort='ASC'  src='" + WEBUI.CONTEXT.RootPath + "/ShopOn/ui/ui/images/topArrow.gif'  style='vertical-align: bottom;'/>");
                    else
                        header.append("<img sort='DESC' src='" + WEBUI.CONTEXT.RootPath + "/ShopOn/ui/ui/images/downArrow.gif' style='vertical-align: bottom;'/>");
                });

                //Logic to uncheck the last checkbox selection that is not made on current grid
                //$(page.selectedObject).on("change", ".tree_data_chk", function () {
                //    var par = $(this).parent().parent().parent().parent();
                //    $(page.selectedObject).find(".tree_data_chk:checked").each(function () {
                //        if (!($(this).parent().parent().parent().parent()[0] === par[0]))
                //            $(this).prop("checked", false);
                //    });
                //    $(page.selectedObject).find(".tree_header_chk:checked").prop("checked", false);
                //});

                //Implement Select All and DeSelect All methods.
                $(page.selectedObject).on("change", ".tree_header_chk", function () {
                    $(this).parent().parent().parent().nextAll().children("a").find(".tree_data_chk").prop("checked", $(this).prop("checked"));
                    var par = $(this).parent().parent().parent().parent();
                    $(page.selectedObject + "  .tree_data_chk:checked").each(function () {
                        if (!($(this).parent().parent().parent().parent()[0] === par[0]))
                            $(this).prop("checked", false);
                    });
                });



                //TODO : Simple implementation.Extend in future
                page.executeCondition = function (condition, item) {
                    var data = condition.replace("IF({", "").replace("}", "").replace(")", "").split(",");
                    //Dont change to === automatic conversion is needed here.
                    if (item[data[0]] == true)
                        return data[1].replace("'", "").replace("'", "");
                    else
                        return data[2].replace("'", "").replace("'", "");
                }


                //TODO : Move to common.js.
                page.entityMap = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;",
                    "/": "&#x2F;"
                };

                //Escape html and js specidal characters.
                page.escapeHtml = function (string) {
                    return String(string).replace(/[&<>"'\/]/g, function (s) {
                        return page.entityMap[s];
                    });
                }


            }


            page.interface = {
                //Private utility method to build the header part.Set the datafield so that it will be used in sorting. 
                //If Edit mode is set to true then add the edit template actions like edit,save and cancel.
                getHeader: function (template) {
                    var htmlContent = [];

                    htmlContent.push("<li STYLE='DISPLAY:NONE;'><div class='tree_header' object='" + template.object + "'>");
                    //Default show minus and checkbox should selectAll and DeselectAll
                    htmlContent.push("<span><img class='tree_header_img' src='../images/minus.gif'><input type='checkbox' action='selectAll' class='tree_header_chk' /></span>");
                    $(template.columns).each(function (i, item) {
                        if (!item.visible || item.visible === true)
                            htmlContent.push("<span action='sort' dataField='" + item.dataField + "' style='width:" + item.width + "' title='" + item.title + "' >" + item.title + "</span>");
                    });
                    htmlContent.push(" </div> </li>");
                    return htmlContent;
                },
                //Build each row along with data,searchInput and keys
                //It is mandatory to have a key to identify unique records.Will be used during update and delete.
                getData: function (data, template, leaf) {

                    var htmlContent = [];
                    var odd = true;
                    $(data).each(function (i1, item1) {
                        //Alternate colors
                        var style;
                        // if (odd === true)
                        style = "background-color:white;";
                        // else
                        //  style = "background-color:whitesmoke;";

                        if (template.styleCondition)
                            style = style + page.executeCondition(template.styleCondition, item1);



                        htmlContent.push("<li style='cursor:pointer;" + style + "'>");
                        odd = !odd;

                        var leafDataField = false;
                        if (typeof template.leafDataField != "undefined")
                            leafDataField = item1[template.leafDataField];
                        //Store all important data in attributes
                        htmlContent.push("<a class='tree_data' object-title='" + item1[template.objectTitle] + "' object-data='" + page.escapeHtml(JSON.stringify(item1)) + "'  object-name='" + template.object + "' object-value='" + item1[template.objectKey] + "' object-key='" + template.objectKey + "'  object-context-index='" + page.contextIndex + "' >");
                        if (leaf === true)
                            htmlContent.push("<span ><img action='expand' style='display: none'   class='tree_data_img' src='" + BasePath + "ui/ui/images/plus.gif'><input type='checkbox' class='tree_data_chk' style='display:none' /> </span>");
                        else if (leafDataField == true)
                            htmlContent.push("<span ><img action='expand' style='visibility: hidden'   class='tree_data_img' src='" + BasePath + "ui/ui/images/plus.gif'><input type='checkbox' class='tree_data_chk' style='display:none' /> </span>");
                        else
                            htmlContent.push("<span ><img action='expand' class='tree_data_img' src='" + BasePath + "ui/ui/images/plus.gif'><input type='checkbox' class='tree_data_chk' style='display:none' /> </span>");

                        //Bind all columns
                        $(template.columns).each(function (i2, item2) {
                            if (!item2.visible || item2.visible === true) {
                                //If template is specified for a column,then bind the data in template and generate html
                                if (item2.template) {
                                    var tempContent = item2.template;
                                    $(item2.dataField.split(",")).each(function (i3, item3) {
                                        tempContent = tempContent.replace("{" + item3 + "}", item1[item3]);
                                    });
                                    htmlContent.push(tempContent);
                                } else { //If no template is specified then add span tag
                                    var data = item1[item2.dataField];
                                    //Logic to trim out for specified max size-
                                    try {
                                        if (item2.maxSize)
                                            data = data.substring(0, item2.maxSize);
                                    } catch (e) {
                                    }
                                    //For edit mode , bind the input tag that should be used to get data value..
                                    if (item2.editable && item2.editable === true)
                                        htmlContent.push("<span title='" + data + "' style='width:" + item2.width + "' ><data>" + data + "</data><input type='text' style='display:none' value='" + data + "'  dataField='" + item2.dataField + "'/></span>");
                                    else
                                        htmlContent.push("<span title='" + data + "' style='width:" + item2.width + "' >" + data + "</span>");

                                }


                            }
                        });
                        htmlContent.push("</a></li>");

                    });
                    return htmlContent;

                },
                //Bind the data at root level.
                addNodes: function (template, data, context, oldCount) {
                    //WEBUI.UICONTROLS  all important information.
                    page.data = data;
                    page.template = template;
                    page.currentSize = 0;
                    page.context = new Array();
                    page.contextIndex = 0;
                    page.context[page.contextIndex] = context;


                    var currentSize = page.currentSize;
                    var pageSize = page.pageSize;

                    var htmlContent = [];
                    htmlContent.push("<ul class='tree_root'>");
                    htmlContent = htmlContent.concat(this.getHeader(template));      //Load Header

                    //To override the default no of records that should be shown.Used with sorting.
                    if (oldCount && (oldCount - pageSize) > 0)
                        currentSize = oldCount - pageSize;

                    //No record found
                    if (data.length === 0) {
                        // htmlContent.push("<li><span style='width:90%;text-align:center;'>No Records Found</span></li>");
                    } else
                        htmlContent = htmlContent.concat(page.interface
                            .getData(page.data.slice(0, currentSize + pageSize), template, false));

                    //Update the current no of records visible.
                    if (currentSize + pageSize < data.length)
                        currentSize = currentSize + pageSize;
                    else
                        currentSize = data.length;
                    page.currentSize = currentSize;

                    htmlContent.push("</ul>");


                    //Load more button implementation
                    page.selectedObject.html(htmlContent.join(" "));
                    page.selectedObject.next().remove();
                    page.selectedObject.after("<div style='display: inline-block; margin-top: 10px; width: 100%;'><span style='float: left; margin-top: 0px;'></span><a id='loadMorebtn' style='float: right; display: inline-block;cursor:pointer;'>Load More...</a></div>");
                    page.selectedObject.next().children("a").click(function () {
                        page.interface.loadMoreNodes();
                    });

                    //Footer information.
                    page.pageNo = page.selectedObject.next().children("span");
                    //if (page.data.length >= 500)
                    //    page.pageNo.text(currentSize + " of " + page.data.length + "     (only the first 500 record will display, please refine your search criteria to get more specific record)");
                    //else
                    //    page.pageNo.text(currentSize + " of " + page.data.length);
                    //End of page. Hide Load More.
                    if (currentSize === data.length) {
                        page.selectedObject.next().children("a").hide();
                    }

                    //Bind dragging support.
                    //  this.bindDragging();
                },
                //Bind additional data with diferent search criterial to current result.Note the data object should have both the old and new data together.
                addMoreNodes: function (template, data) {
                    if (WEBUI.UICONTROLS[uniqueId]["data"] && WEBUI.UICONTROLS[uniqueId]["data"].length > 0) {
                        WEBUI.UICONTROLS[uniqueId]["data"] = data;
                        WEBUI.UICONTROLS[uniqueId]["template"] = template;

                        WEBUI.UICONTROLS[uniqueId]["searchHistoryIndex"] = WEBUI.UICONTROLS[uniqueId]["searchHistoryIndex"] + 1;
                        WEBUI.UICONTROLS[uniqueId]["searchHistory"][WEBUI.UICONTROLS[uniqueId]["searchHistoryIndex"]] = template.criteria;

                        this.loadMoreNodes();
                        //   this.bindDragging();
                    } else
                        this.addNodes(template, data);
                },
                //Load Next page of records
                loadMoreNodes: function () {
                    var currentSize = page.currentSize;
                    var pageSize = page.pageSize;
                    var template = page.template;

                    if (currentSize === page.data.length) {
                        $("#loadMorebtn").hide();
                    }

                    var data = page.data.slice(currentSize, currentSize + pageSize);
                    $(page.selectedObject).find(".tree_root").append(page.interface.getData(data, template, false).join(" "));


                    if (currentSize + pageSize < page.data.length)
                        page.currentSize = currentSize + pageSize;
                    else
                        page.currentSize = page.data.length;

                    if (page.data.length >= 500)
                        page.pageNo.text(page.currentSize + " of " + page.data.length + "     (only the first 500 record will display, please refine your search criteria to get more specific record)");
                    else
                        page.pageNo.text(page.currentSize + " of " + page.data.length);
                    //    this.bindDragging();

                },
                //Load sub tree.
                addChildNodes: function (parentNode, template, data, leaf) {

                    var htmlContent = [];
                    htmlContent.push("<ul class='tree_child'>");

                    htmlContent = htmlContent.concat(page.interface.getHeader(template));

                    if (data.length === 0) {
                        //       htmlContent.push("<li><span style='width:90%;text-align:center;'>No Records Found</span></li>");
                    } else {

                        htmlContent = htmlContent.concat(page.interface.getData(data, template, leaf));
                    }
                    htmlContent.push("</ul>");
                    $(parentNode).append(htmlContent.join(" "));
                    //  this.bindDragging();

                },
                //Implementatio of drag and drop feature.
                bindDragging: function () {

                    $(page.selectedObject).find(".tree_data").draggable({
                        revert: true,
                        appendTo: "body",
                        drag: function () {
                            if (!$(this).find("input[type=checkbox]").prop("checked"))
                                return false;
                            return true;
                        },
                        helper: function () {
                            if (!$(this).find("input[type=checkbox]").prop("checked"))
                                return "";
                            var key = "";
                            var object = "";
                            $($(page.selectedObject).tree().getSelectedData()).each(function (iIndex, item) {
                                key = key + item.keyValue + ",";
                                object = item.object;

                            });
                            return "<span style='position:absolute;margin:10px;border:solid 1px black;font-weight:bold;background-color:whitesmoke'>" + object + ":" + key + "</span>";
                        }
                    });

                    $(page.selectedObject).find(".tree_data").droppable({
                        hoverClass: "ui-dropping",
                        accept: $(page.selectedObject).find(".tree_data"),
                        drop: function () {
                            var chk = $(this).find("input[type=checkbox]");

                            if (WEBUI.UICONTROLS[uniqueId].drop)
                                WEBUI.UICONTROLS[uniqueId].drop($(page.selectedObject).tree().getNodeData(chk), $(page.selectedObject).tree().getSelectedData(), chk);


                        }
                    });
                },
                //Get selected data from tree.
                getSelectedData: function () {
                    var dataList = new Array();
                    $(selectedObject).find(".tree_data_chk:checked").each(function (iIndex) {

                        dataList[iIndex] = JSON.parse($(this).parent().parent().attr("data"));
                        dataList[iIndex]["key"] = $(this).parent().parent().attr("object-key");
                        dataList[iIndex]["keyValue"] = $(this).parent().parent().attr("object-value");
                        dataList[iIndex]["object"] = $(this).parent().parent().attr("object");
                        dataList[iIndex]["source"] = $(this).parent().parent().attr("object");
                        dataList[iIndex]["destination"] = $(this).parent().parent().parent().parent().parent().children("a").attr("object");

                    });
                    return dataList;
                },
                selectNode: function (keyValue) {
                    $(page.selectedObject).find("[object-value=" + keyValue + "]").click();
                },
                selectNodeByText: function (textValue) {
                    $(page.selectedObject).find("[object-title='" + textValue + "']").click();
                },
                expandNodeByText: function (textValue) {
                    $(page.selectedObject).find("[object-title='" + textValue + "']").find(".tree_data_img").click();
                },
                deSelectNode: function (chk) {
                    $(chk).closest("[object-value]").css("background-color", "white");
                    $(chk).prop("checked", false);

                },




                //get Selected Checkboxes
                getSelectedNodes: function () {
                    return $(page.selectedObject).find(".tree_data_chk:checked");
                },
                //Get parent checkbox
                getParentNode: function () {
                    return $(selectedObject).find(".tree_data_chk:checked").parent().parent().parent().parent().parent().children("a").find(".tree_data_chk");
                },
                //Get the data for the the input checkbox.
                getNodeData: function (chk) {
                    var dataList = new Array();
                    var iIndex = 0;
                    dataList[iIndex] = JSON.parse($(chk).parent().parent().attr("object-data"));
                    dataList[iIndex]["key"] = $(chk).parent().parent().attr("object-key");
                    dataList[iIndex]["keyValue"] = $(this).parent().parent().attr("object-value");
                    dataList[iIndex]["object"] = $(chk).parent().parent().attr("object-name");
                    dataList[iIndex]["source"] = $(chk).parent().parent().attr("object-name");
                    dataList[iIndex]["destination"] = $(chk).parent().parent().parent().parent().parent().children("a").attr("object-name");
                    return dataList;
                },
                //To reload the row with updated data.The checkbox input parameter decides the record to be updated.
                reLoadNode: function (chk, template, data) {
                    var liContent = this.getData(data, template, false);

                    var selectedNode = $(chk).parent().parent().parent();
                    $(liContent.join(" ")).insertBefore(selectedNode);
                    selectedNode.remove();

                },
                //Re-expand the tree.
                reLoadChildNodes: function (chk) {
                    var expColIcon = $(chk).parent().parent().find(".tree_data_img");

                    $(chk).parent().parent().nextAll().remove();

                    expColIcon.attr("action", "expand");
                    expColIcon.click();
                    //$(chk).parent().parent().each(function () {
                    //    if (".tree_data_img")
                    //    if ($(this).next().is(":visible")) {
                    //        $(this).nextAll().remove();
                    //        $(this).click();
                    //    } else
                    //        $(this).nextAll().remove();
                    //});
                },
                //Delete a node
                deleteNode: function (chk) {
                    var selectedNode = $(chk).parent().parent().parent();
                    selectedNode.remove();

                }
            };

        });




        //Build the object with useful properties and return to users.


    };



});

var parseJSON = function (str) {
    return JSON.parse(str);
}


//var PrintService = {};

//PrintService.Print = function (printBox) {
//    var array = JSON.stringify(printBox);


//    $.getJSON('http://localhost:8888/PrintService/printreceipt' + '?receiptData=' + encodeURIComponent(array) + '&sam=1&callback=?', function (data) {
//        alert('Receipt printed successfully!');
//    }, function (error) {
//        alert('Error in printing this receipt!. Configure your printer properly!');

//    });
//    return "success";
//}

//PrintService.PrintReceipt = function (printBox) {

//    var printBoxString = JSON.stringify(printBox);
//    //var printBox={ 
//    //    PrinterName: "Microsoft Print to PDF",
//    //    Width:300,
//    //    Height:200,
//    //    Lines:[]

//    //}


//    $.ajax({
//        type: "POST",

//        url: "http://localhost:8888/PrintService/printtest",  //CONTEXT.ReceiptPrinterURL  try now   "http://localhost:8087/printtest", //
//        async: true,

//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        // crossDomain: true,
//        data: JSON.stringify(printBox),
//        //headers: {
//        //    "auth-token": getCookie("auth_token")

//        //},
//        success: function (items) {
//            alert("Bill Printed Successfully...");
//        },
//        error: function (err) {
//            alert("Sorry Error Will Occur Please Check Your Printer Configuration");
//        }
//    });

//    //var printBoxString = JSON.stringify(printBox);
//    ////var printBoxString = JSON.stringify({ root: printBox });


//    //$.getJSON(CONTEXT.ReceiptPrinterURL.replace("{printBox}", encodeURIComponent(printBoxString)), function (data) {
//    //    alert('Receipt printed successfully!');
//    //}, function (error) {
//    //    alert('Error in printing this receipt!. Configure your printer properly!');

//    //});
//    //return "success";

//    //var array = JSON.stringify(receipt);
//    ////var url = 'http://example.com/?data=' + encodeURIComponent(array);

//    //$.getJSON('http://localhost:8888/PrintService/printreceipt' + '?receiptData=' + encodeURIComponent(array) + '&sam=1&callback=?', function (data) {
//    //    alert('Receipt printed successfully!');
//    //}, function (error) {
//    //    alert('Error in printing this receipt!. Configure your printer properly!');

//    //});
//    //return "success";
//}


//PrintService.PrintReceiptPDF = function (printBox) {

//    var printBoxString = JSON.stringify(printBox);


//    $.getJSON(CONTEXT.ReceiptPrinterURL.replace("{printBox}", encodeURIComponent(printBoxString)), function (data) {
//        alert('Receipt printed successfully!');
//    }, function (error) {
//        alert('Error in printing this receipt!. Configure your printer properly!');

//    });
//    return "success";

//    //var array = JSON.stringify(receipt);
//    ////var url = 'http://example.com/?data=' + encodeURIComponent(array);

//    //$.getJSON('http://localhost:8888/PrintService/printreceipt' + '?receiptData=' + encodeURIComponent(array) + '&sam=1&callback=?', function (data) {
//    //    alert('Receipt printed successfully!');
//    //}, function (error) {
//    //    alert('Error in printing this receipt!. Configure your printer properly!');

//    //});
//    //return "success";
//}


//PrintService.PrintFile = function (printData) {

//    //printData = { "root": { "BillType": "INVOICE", "CustomerName": "", "Phone": "", "CustAddress": "", "CustCityStreetZipCode": "", "DLNo": "", "isSalesExe": "false", "GST": "", "TIN": "", "Area": "", "SalesExecutiveName": "", "VehicleNo": "", "BillNo": "145", "Abdeen": "Abdeen:", "AbdeenMobile": "9443463089", "Off": "Off:", "OffMobile": "9944410350", "Home": "PH:", "HomeMobile": "04639-245478", "BillDate": "31-08-2017", "NoofItems": "1", "Quantity": "1.00", "BSubTotal": "60.00", "DiscountAmount": "0.00", "BCGST": "3.60", "BSGST": "3.60", "TaxAmount": "7.20", "BillAmount": "67.00", "ApplicaName": "Shop On 3.0", "ApplsName": "SHOP ON 3.0", "CompanyAddress": "VEERAPANDIYAPATNA", "CompanyCityStreetPincode": "", "CompanyPhoneNoEtc": "9944410350", "CompanyDLNo": "TNT/161/20B-TNT/149/21B", "CompanyTINNo": "33586450443", "CompanyGST": "33CCKPS9949CIZ4", "SSSS": "DUPLICATE", "Original": "ORIGINAL", "RoundAmount": "-0.20", "BillItem": [{ "BillItemNo": 1, "ProductName": "Bag", "Pack": "", "Batch": "", "Exp": "", "Qty": "1.00", "Per": "No", "Qty_unit": "1.00", "FreeQty": "0.00", "Rate": "60.00", "PDis": "0.00", "MRP": "60.00", "CGST": "3.60@6.00", "SGST": "3.60@6.00", "GValue": "67.20" }], "BillName": "SALES BILL" } };

//    CONTEXT.BarcodePrinterURL11 = "http://localhost:8888/PrintService/printfile?printData={printData}&appName=ShopOnDev&templateURI=sales-bill-print/main-sales-bill-short-new1.jrxml&exportType=PDF"

//    var printBoxString = JSON.stringify({ root: printData });


//    $.getJSON(CONTEXT.BarcodePrinterURL11.replace("{printData}", encodeURIComponent(printBoxString)), function (data) {
//        alert('Jasper printed successfully!');
//    }, function (error) {
//        alert('Error in printing this receipt!. Configure your printer properly!');

//    });
//    return "success";

//    //// Get the JsonP data

//    //var array = JSON.stringify(barCode);
//    ////var url = 'http://example.com/?data=' + encodeURIComponent(array);


//    //$.getJSON('http://localhost:8888/PrintService/printbarcode' + '?barcodeData=' + encodeURIComponent(array) + '&sam=1&callback=?', function (data) {
//    //    alert('Barcode printed successfully for this item!');
//    //}, function (error) {
//    //    alert('Error in printing this item barcode !. Configure your printer properly!');

//    //});
//    //return "success";
//}



//PrintService.PrintBarcode = function (printBox) {

//    var printBoxString = JSON.stringify(printBox);


//    $.getJSON(CONTEXT.BarcodePrinterURL.replace("{printBox}", encodeURIComponent(printBoxString)), function (data) {
//        alert('Barcode printed successfully!');
//    }, function (error) {
//        alert('Error in printing this receipt!. Configure your printer properly!');

//    });
//    return "success";

//    //// Get the JsonP data

//    //var array = JSON.stringify(barCode);
//    ////var url = 'http://example.com/?data=' + encodeURIComponent(array);


//    //$.getJSON('http://localhost:8888/PrintService/printbarcode' + '?barcodeData=' + encodeURIComponent(array) + '&sam=1&callback=?', function (data) {
//    //    alert('Barcode printed successfully for this item!');
//    //}, function (error) {
//    //    alert('Error in printing this item barcode !. Configure your printer properly!');

//    //});
//    //return "success";
//}