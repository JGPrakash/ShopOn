//Requires : JQuery and JSON javascript library

//The Main global object for the framework.
var WEBUI = new Object();
WEBUI.LANG = {};




if (window.location.href.indexOf("version=") === -1) {
    if (window.window.location.href.indexOf("?") === -1)
        window.location = window.location.href + "?version=" + appConfig.app_version;
    else
        window.location = window.location.href.replace("?", "?version=" + appConfig.app_version + "&");
}

var LCACHE = {
    LCACHE_OBJ : {},
    set : function (url,data,timeout) {
        LCACHE.LCACHE_OBJ[url] = data;

        if (typeof timeout !== "undefined" && timeout != null) {
            setTimeout(function () {
                delete LCACHE.LCACHE_OBJ[url];
            }, timeout)
        }
    },
    get: function (url) {
        return LCACHE.LCACHE_OBJ[url];
    },
    isEmpty: function (url) {
        try {
            return LCACHE.LCACHE_OBJ[url] == null;
        } catch (e) {
            return true; //error is thrown when prop is not available
        }
       
    },
    clear: function(resource){
        for (var prop in LCACHE.LCACHE_OBJ) {
            if (prop.indexOf(resource)!== -1)
            {
                delete LCACHE.LCACHE_OBJ[prop];
            }
        }
    }
};
var SCACHE = {
    LCACHE_OBJ: {},
    set: function (url, data, timeout) {
        LCACHE_OBJ[url] = data;

        if (typeof timeout !== "undefined" && timeout != null) {
            setTimeout(function () {
                delete LCACHE_OBJ[url];
            }, timeout)
        }
    },
    get: function (url) {
        return LCACHE_OBJ[url];
    },
    isEmpty: function (url) {
        return LCACHE_OBJ[url] == null;
    },
    clear: function (resource) {
        for (var prop in LCACHE_OBJ) {
            if (prop.indexOf(resource) !== -1) {
                delete LCACHE_OBJ[prop];
            }
        }

    }
};

var ACACHE = {
    LCACHE_OBJ: {},
    set: function (url, data, timeout) {
        LCACHE_OBJ[url] = data;

        if (typeof timeout !== "undefined" && timeout != null) {
            setTimeout(function () {
                delete LCACHE_OBJ[url];
            }, timeout)
        }
    },
    get: function (url) {
        return LCACHE_OBJ[url];
    },
    isEmpty: function (url) {
        return LCACHE_OBJ[url] == null;
    },
    clear: function (resource) {
        for (var prop in LCACHE_OBJ) {
            if (prop.indexOf(resource) !== -1) {
                delete LCACHE_OBJ[prop];
            }
        }
    }
};


window.instanceURL = "localhost:8080";
window.instanceShopOnDataService = "HRWebService";
window.instanceShopOnRestApi = "HRShopOnRestAPI";
window.instancePropOnRestApi = "HRShopOn4DevAPI";
window.instanceFinfactsRestApi = "HRFinFactsRestAPI";
window.instanceCloudRestApi = "HRCloudRestAPI";
window.instanceServiceRestApi = "HRServiceOnRestAPI";


function R(value) {
    return WEBUI.LANG[CONTEXT.CurrentLanguage][value];
}

$(document).ready(function () {

    //UI Controls and UserContorls related objects  are heirarchly stored here.
    WEBUI.UICONTROLS = new Object();

    //MAINPAGE will point to the page object currently loaded.
    WEBUI.MAINPAGE = null;

    //Context object to hold current configuration.
    WEBUI.CONTEXT = {};



    //Context for handling Session expiry
    WEBUI.CONTEXT.SessionValidationType = "ExcpetionAndMessage";      //   ExcpetionAndMessage  | Reason
    WEBUI.CONTEXT.SessionExpiredException = "dhdn";
    WEBUI.CONTEXT.SessionExpiredMessage = "InvalidUser : User is not logged in.";
    WEBUI.CONTEXT.SessionExpiredHTTPReason = null;
    WEBUI.CONTEXT.SessionExpiredUserAlert = "User is not Authenticated";
    WEBUI.CONTEXT.HomePage = "/Default.aspx";
    WEBUI.CONTEXT.RootPath = ""; //window.location.pathname.split("/")[1];

    //Context for URL Routing in web service.
    WEBUI.CONTEXT.ServicePathPattern = "../../Usability/Controller/{ClassName}.aspx/{MethodName}";
    WEBUI.CONTEXT.NamedServicePathPattern = "ffff.aspx/ExecuteNamedQuery";

    //Context for Locale
    WEBUI.CONTEXT.Locale = { DateFormat: "yy-mm-dd" };

    //Providing users possibility to override the above context in init method.
    if (WEBUI.init) {
        WEBUI.init(WEBUI.CONTEXT);
    }

    //Session Expiry Handler
    function coreInitSessionExpiryHandler() {
        //A global error handler is setup to monitor session expiry and redirect to home page.
        $(document).ajaxError(function (event, jqxhr, settings, thrownError) {

            /*//Mostly used for ASP.NET PageMethods and ASMX Service
            if (WEBUI.CONTEXT.SessionValidationType == "ExcpetionAndMessage") {
                //InvalidOperation is for XCAG Timeout.
                if (typeof jqxhr.responseJSON != "undefined" && ((jqxhr.responseJSON.ExceptionType === WEBUI.CONTEXT.SessionExpiredException && jqxhr.responseJSON.Message === WEBUI.CONTEXT.SessionExpiredMessage) || (jqxhr.responseJSON.ExceptionType === "System.InvalidOperationException" && jqxhr.responseJSON.Message === "Authentication failed."))) {
                    alert(WEBUI.CONTEXT.SessionExpiredUserAlert);
                    window.location.href = WEBUI.CONTEXT.HomePage;
                }
            } else if (WEBUI.CONTEXT.SessionValidationType == "Reason") {
                if (thrownError == WEBUI.CONTEXT.SessionExpiredHTTPReason) {
                    alert(WEBUI.CONTEXT.SessionExpiredUserAlert);
                    window.location.href = WEBUI.CONTEXT.HomePage;
                }
            }*/
            //TODO : I commented this.need to check throw jqxhr.responseJSON;
        });
    }

    function coreInitPageController() {

        //Page Controller Object.It holds implementation for managing page,usercontrol and ui controls.
        $.pageController = new Object();

        //Read the html template and build equivalant controls heirarchy.
        $.pageController.initControlAndEvents = function (page) {

            //Attribute controlHTML : load the template html from different path.
            if ($(page.container).attr("controlHTML")) {
                jQuery.ajax({
                    url: $(page.container).attr("controlHTML"),
                    success: function (result) {
                        $(page.container).html(result);
                    },
                    async: false
                });
            }

            //Call the page_init.Provide oppurtunity to override or add more html.
            if (page.events.page_init)
                page.events.page_init();

            //Get all child controls with control attribute that belongs to the current user controls.
            //If a usercontrol is inside current user control then we wont get elements inside the nested user control.
            var ucName = $(page.container).attr("control").split(".")[1]; //Get the cotrol name            
            $(page.container).find("[control^='" + ucName + ".']").each(function () {

                try {
                    var controlName = $(this).attr("control").split(".")[1];
                    var controlId = $(this).attr("controlId");

                    try {

                        //Attribute controlLocation : Load the control definition from different JS.
                        var controlLocation = $(this).attr("controlLocation");
                        if (typeof controlLocation != "undefined")
                            $.requireSync(controlLocation);

                        //Instantiate the control and add to control heirarchy.It will recursively calls   initControlAndEvents
                        page.controls[controlId] = $(this)[controlName](); // ex $(this).grid();  //Call default constructor
                    } catch (e) {

                        //Add the error to UI error list.
                        WEBUI.UICONTROLS.error[controlId] = e;

                        //Instantiate a Jquery control instead of actual control and add to control heirarchy
                        page.controls[controlId] = $(this);
                    }

                    //Attribute event : Bind multiple event handler, declared in event attribute.
                    var eventAttr = $(this).attr("event");
                    if (eventAttr) {
                        $(eventAttr.split(",")).each(function (j, eventName) {
                            page.controls[controlId][eventName.split(":")[0]](page["events"][eventName.split(":")[1]]); //ex $(this).click(page.events.new_click); 
                        });
                    }

                } catch (err) {

                    //Log to general error list
                    $.logger.push(err);
                }

            });

            //TODO : Controls can be read only from page.controls and page.view.controls can be decomissioned.
            page.view.controls = page.controls;

            //After other controls are loaded.Call page_load to give option for users to write logic during page load. 
            if (page.events.page_load)
                page.events.page_load();
        }

        //Get the base page object with scope and uniqueId
        $.pageController.getBasePage = function (obj) {

            //Get the unique Id for the page
            var uniqueId = $(obj).attr("controlid");

            //TODO : Need to verify whether this fix is still needed or not
            if (WEBUI.UICONTROLS[uniqueId]) //Fix if control is recreated.
                WEBUI.UICONTROLS[uniqueId].selectedObject = $(obj);

            if (!WEBUI.UICONTROLS[uniqueId]) {

                //Create necessary objects
                WEBUI.UICONTROLS[uniqueId] = new Object();               //Acquire Unique Storage
                WEBUI.UICONTROLS[uniqueId].interface = new Object();     //Hold the interface object which is standard way to communicate with other objects
                WEBUI.UICONTROLS[uniqueId].controls = new Object();      //Hold the controls created under this Page.                                                                                    
                WEBUI.UICONTROLS.error = {};                             //Clear the error objects.

                //Create base properties
                WEBUI.UICONTROLS[uniqueId].uniqueId = uniqueId;
                WEBUI.UICONTROLS[uniqueId].selectedObject = $(obj);

                //Store the unique id in DOM itself. So that UFT can use this id to indentify controls.
                $(obj)[0].uniqueId = uniqueId;
                $(obj).attr("uniqueId", uniqueId);

                //TODO Remove this container
                WEBUI.UICONTROLS[uniqueId].container = $(obj);

            }

            //Return the base page object
            return WEBUI.UICONTROLS[uniqueId];

        }

        //Get the base control object with scope and uniqueId
        $.pageController.getBaseControl = function (obj) {

            //Create a unique id for control based on control heirarchy.Start from control and go till Body tag.
            var sel = obj;
            var str = [];
            while ($(sel)[0].tagName != "BODY") {
                var parentControlName = $(sel).attr("control").split(".")[0];
                if (parentControlName == "page")
                    break;

                var parentControl = $(sel).closest("[control$='." + parentControlName + "']");
                str.push($(parentControl).attr("controlId"));
                sel = parentControl;
            }
            var uniqueId = str.reverse().join("_") + "_" + $(obj).attr("controlId"); // TODO : Generate really unique id by appending parent uersontrol ids

            if (WEBUI.UICONTROLS[uniqueId])
                WEBUI.UICONTROLS[uniqueId].selectedObject = $(obj);

            //Acquire Unique Storage
            if (!WEBUI.UICONTROLS[uniqueId]) {
                WEBUI.UICONTROLS[uniqueId] = new Object();
                WEBUI.UICONTROLS[uniqueId].interface = new Object();//Hold the interface object which is standard way to communicate with other objects
                WEBUI.UICONTROLS[uniqueId].interface.selectedObject = $(obj);

                //Create base properties
                WEBUI.UICONTROLS[uniqueId].state = "new"; //new->template->data->destoryed.
                WEBUI.UICONTROLS[uniqueId].uniqueId = uniqueId;
                WEBUI.UICONTROLS[uniqueId].selectedObject = $(obj);
                WEBUI.UICONTROLS[uniqueId].container = $(obj);
                WEBUI.UICONTROLS[uniqueId].controls = new Object();
                $(obj)[0].uniqueId = uniqueId;   //Store the unique id in DOM itself. So that UFT can use this id to indentify controls.
                $(obj).attr("uniqueId", uniqueId);
            }
            return WEBUI.UICONTROLS[uniqueId];



        }

        $.pageController.getPage = function (container, defineControl) {

            var page = $.pageController.getBasePage(container);
            if (typeof page.controlName === "undefined") { //Do the intitialisation only one time.
                //Automatically set the control name.
                page.controlName = $(container).attr("control").split(".")[1];
                $(page.selectedObject)[0].control = $(container).attr("control").split(".")[1];
                $(page.selectedObject)[0].parentControl = $(container).attr("control").split(".")[0];
                $(page.selectedObject)[0].controlId = $(page.selectedObject).attr("controlid");

                page.view = {};
                page.events = {};

                //template implementation
                page.template = function (url) {
					   //Code to cache the data. Reload only when app version changes
                    if (url.indexOf('?') === -1)
                        url = url + "?version=" + appConfig.app_version;
                    else
                        url = url + "&version=" + appConfig.app_version;
					
					if (LCACHE.isEmpty(url)) {
						$.ajax({
							url: url,
							success: function (result) {
								LCACHE.set(url, result);
								page.selectedObject.html(result);
							},
							async: false, cache: true, dataType: 'HTML'
						});
					
					
					} else {
							page.selectedObject.html(LCACHE.get(url));
							
					}
		
		
                  

                    

                }

                //callback for usercontrol to write some code.
                defineControl(page, function (ctrl) {
                    return page.controls[ctrl];

                }, page.events);

                //Intitialise the controls
                $.pageController.initControlAndEvents(page);
            }
            return page.interface;
        }

        $.pageController.getControl = function (container, defineControl) {

            var page = $.pageController.getBaseControl(container);
            if (typeof page.controlName === "undefined") { //Do the intitialisation only one time.
                page.controlName = $(container).attr("control").split(".")[1];

                $(page.selectedObject)[0].control = $(container).attr("control").split(".")[1];
                $(page.selectedObject)[0].parentControl = $(container).attr("control").split(".")[0];
                $(page.selectedObject)[0].controlId = $(page.selectedObject).attr("controlid");

                page.view = {};        //Initialize View methods
                page.events = {};      //Inititialize events

                //Global method to access html
                page.template = function (url) {
					  if (url.indexOf('?') === -1)
                        url = url + "?version=" + appConfig.app_version;
                    else
                        url = url + "&version=" + appConfig.app_version;
					
					if (LCACHE.isEmpty(url)) {
						$.ajax({
							url: url,
							success: function (result) {
								LCACHE.set(url, result);
								page.selectedObject.html(result);
							},
							async: false, cache: true, dataType: 'HTML'
						});
					
					
					} else {
							page.selectedObject.html(LCACHE.get(url));
							
					}
					

                }

                //Attaching common properties with the controls
                page.attachCommonroperties = function () {
                    // Show the textbox
                    page.interface.show = function () {
                        $(page.selectedObject).show();
                    }
                    // Hide the textbox
                    page.interface.hide = function () {
                        $(page.selectedObject).hide();
                    }
                    //Set Style properties
                    page.interface.css = function (key, value) {
                        $(page.selectedObject).css(key, value);
                    }
                    //Set Style properties through CSS class
                    page.interface.addClass = function () {
                        //TODO
                    }
                    //Set Style properties through CSS class
                    page.interface.removeClass = function () {
                        //TODO
                    }
                    page.interface.disable = function (val) {
                        if (!val)
                            $(page.selectedObject).removeAttr('disabled');
                        else
                            $(page.selectedObject).prop('disabled', 'disabled');
                    }
                    page.interface.selectedObject = $(page.selectedObject);
                }

                //callback for usercontrol to write some code.
                defineControl(page, function (ctrl) {
                    return page.controls[ctrl];

                });

                //Intitialise the controls
                $.pageController.initControlAndEvents(page);
            }
            return page.interface;
        }
    }
    //Global Log Handler
    function coreInitLogger() {
        $.logger = new Array();
    }

    //Initalise require method for loading js files
    function coreInitDependencyManager() {

        //require method to load js files aync 
        $.require = function (file, callback) {
            if (file.indexOf('?') === -1)
                file = file + "?version=" + appConfig.app_version
            else
                file = file + "&version=" + appConfig.app_version


            $.getScript(file, function () {
                if (typeof callback != "undefined")
                    callback(file);
            });
        }

        //require method to load js files 
        $.requireSync = function (file, callback) {
            var loaded = false;
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement('script');
            script.src = file;
            script.type = 'text/javascript';
            //real browsers
            script.onload = function () {
                loaded = true;
            };
            //Internet explorer
            script.onreadystatechange = function () {
                if (this.readyState == 'complete') {
                    loaded = true;
                }
            }
            head.appendChild(script);

            while (!loaded) {
                $.loadJS(file); //Dirty wait. TODO add logic to skip after 5 seconds
            }

            if (typeof callback != "undefined")
                callback(file);

        }
    }

    //Initialise webmethod and named query support
    function coreInitWebMethod() {

        //Object to handle web method call
        $.server = new Object();

        //object to track all async call
        $.server.xhrPool = new Array();

        //Cache to store context
        $.server.ASYNCACHE = new Object();

        //Counter to store context by unique id
        $.server.ASYNCOUNTER = 0;

        //Chek Ajax Request on Demand
        $.server.isBusy = function () {
            return $.server.xhrPool.length > 0;
        }

        //Interupt Ajax Request on Demand
        $.server.abortAll = function () {
            $($.server.xhrPool).each(function (i, jqXhr) { //  cycle through list of recorded connection
                try {
                    jqXhr.abort(); //  aborts connection       
                } catch (e) {

                }
            });
            $.server.xhrPool = new Array();
            $.server.requestStart = null;
        }

        //Track each ajax request to server.
        $.ajaxSetup({
            beforeSend: function (jqXhr) {
                if (!$.server.isBusy())
                    $.server.requestStart = new Date();
                $.server.xhrPool.push(jqXhr);
            },
            complete: function (jqXhr) {
                var i = $.server.xhrPool.indexOf(jqXhr); //  get index for current connection completed
                if (i > -1) $.server.xhrPool.splice(i, 1); //  removes from list by index
                if (!$.server.isBusy())
                    $.server.requestStart = null;
            }
        });


        //WebMethod to interact with Web Serice and NamedQuery in DB
        
        $.server.webMethod = function (methodName, inputData, callback, error, context) {

            if (androidApp == true) {
                var result = "";
                $.server.ASYNCACHE[$.server.ASYNCOUNTER] = context;
                $.ajax({
                    type: "POST",

                    url: "http://104.251.218.116:9080/ShopOnTestSplit/DataServiceApp.jsp" + "?user_id=1&id=" + $.server.ASYNCOUNTER,

                    //url: "http://localhost:8080/ShopOnWebSplit/DataServiceApp.jsp" + "?id=" + $.server.ASYNCOUNTER,
                    data: {
                        'user_id': '1',
                        methodName: methodName,
                        methodParam: inputData
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    //dataType: "json",
                    async: true, crossDomain: true,
                    success: function (items) {
                        items = JSON.parse(items);
                        var cnt = $.util.queryString("id", this.url);
                        var obj = $.server.ASYNCACHE[cnt];
                        result = items;
                        delete $.server.ASYNCACHE[cnt];
                        if (typeof callback !== "undefined")
                            callback(result, obj);
                    },
                    error: function (err) {
                        if (typeof AsyncError !== "undefined")
                            AsyncError(err.responseJSON);
                        var cnt = $.util.queryString("id", this.url);
                        delete $.server.ASYNCACHE[cnt];
                        if (typeof error !== "undefined")
                            error(JSON.parse(err.responseText));


                    }
                });
                $.server.ASYNCOUNTER = $.server.ASYNCOUNTER + 1;
            }
            else {
                var result = "";
                $.server.ASYNCACHE[$.server.ASYNCOUNTER] = context;
                $.ajax({
                    type: "POST",
                    //url: "http://104.251.218.116:9080/ShopOn4WebSplit/DataServiceApp.jsp" + "?user_id=1&id=" + $.server.ASYNCOUNTER,
                    //url: "http://localhost:8080/ShopOnWebSplit/DataServiceApp.jsp" + "?user_id=1&id=" + $.server.ASYNCOUNTER,
                    url: "http://" + window.instanceURL + "/" + window.instanceShopOnDataService + "/DataServiceApp.jsp" + "?user_id=1&id=" + $.server.ASYNCOUNTER,
                    data: {
                        methodName: methodName,
                        methodParam: inputData
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    //dataType: "json",
                    async: true,
                    crossDomain: true,
                    success: function (items) {
                        items = JSON.parse(items);
                        var cnt = $.util.queryString("id", this.url);
                        var obj = $.server.ASYNCACHE[cnt];
                        result = items;
                        delete $.server.ASYNCACHE[cnt];
                        if (typeof callback !== "undefined")
                            callback(result, obj);
                    },
                    error: function (err) {
                        if (typeof AsyncError !== "undefined")
                            AsyncError(err.responseJSON);
                        var cnt = $.util.queryString("id", this.url);
                        delete $.server.ASYNCACHE[cnt];
                        if (typeof error !== "undefined")
                            error(JSON.parse(err.responseText));


                    }
                });
                $.server.ASYNCOUNTER = $.server.ASYNCOUNTER + 1;


            }


        }
        
        $.server.webMethodNQ = function (methodName, inputData, callback, error, context) {
            var result = "";
            var postData = new Object();
            postData.methodName = methodName;
            postData.methodParams = JSON.stringify(inputData);
            $.server.ASYNCACHE[$.server.ASYNCOUNTER] = context;
            $.ajax({
                type: "POST",
                url: "dddd?id=" + $.server.ASYNCOUNTER,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(postData),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (items) {
                    var cnt = $.util.queryString("id", this.url);
                    var obj = $.server.ASYNCACHE[cnt];
                    result = items.d;
                    delete $.server.ASYNCACHE[cnt];
                    if (typeof callback !== "undefined")
                        callback(result, obj);
                },
                error: function (err) {
                    //  if (AsyncError)
                    //   AsyncError(err.responseJSON);
                    var cnt = $.util.queryString("id", this.url);
                    delete $.server.ASYNCACHE[cnt];
                    if (typeof error !== "undefined")
                        error(JSON.parse(err.responseText));
                }
            });
            $.server.ASYNCOUNTER = $.server.ASYNCOUNTER + 1;
        }
        $.server.webMethodSync = function (methodName, inputData, callback) {

            var result = "";
            // $.server.ASYNCACHE[$.server.ASYNCOUNTER] = context;
            $.ajax({
                type: "POST",
                //url: "http://104.251.218.116:9080/ShopOn4WebSplit/DataServiceApp.jsp" + "?user_id=1&id=" + $.server.ASYNCOUNTER,
                //url: "http://localhost:8080/ShopOnWebSplit/DataServiceApp.jsp" + "?user_id=1&id=" + $.server.ASYNCOUNTER,
                url: "http://" + window.instanceURL + "/" + window.instanceShopOnDataService + "/DataServiceApp.jsp" + "?user_id=1&id=" + $.server.ASYNCOUNTER,
                data: {
                    methodName: methodName,
                    methodParam: inputData
                },
                xhrFields: {
                    withCredentials: true
                },
                //dataType: "json",
                async: false,
                crossDomain: true,
                success: function (items) {
                    items = JSON.parse(items);
                    var cnt = $.util.queryString("id", this.url);
                    var obj = $.server.ASYNCACHE[cnt];
                    result = items;
                    delete $.server.ASYNCACHE[cnt];
                    if (typeof callback !== "undefined")
                        callback(result, obj);
                },
                error: function (err) {
                    if (typeof AsyncError !== "undefined")
                        AsyncError(err.responseJSON);
                    var cnt = $.util.queryString("id", this.url);
                    delete $.server.ASYNCACHE[cnt];
                    if (typeof error !== "undefined")
                        error(JSON.parse(err.responseText));


                }
            });



        }
        $.server.webMethodNQSync = function (methodName, inputData) {
            var result = null;

            var postData = new Object();
            postData.methodName = methodName;
            postData.methodParams = JSON.stringify(inputData);

            $.ajax({
                type: "POST",
                url: "",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(postData),
                dataType: "json",
                async: false,
                xhrFields: {
                    withCredentials: true
                },
                success: function (items) {
                    result = items.d;
                },
                failure: function () {
                    alert("Error");
                }
            });
            return result;
        }


        /*   //WebMethod to call the Web Serice in asynchronous mode.Set your correct ServicePathPattern before using this.
           $.server.webMethod = function (methodName, inputData, callback, errorCallback, context) {
   
               //Store the context to be persisted after asynchronous ajax call is completed
               $.server.ASYNCACHE[$.server.ASYNCOUNTER] = context;
   
               //Make the ajax call
               $.ajax({
                   type: "POST",
                   url: WEBUI.CONTEXT.ServicePathPattern.replace("{ClassName}", methodName.split(".")[0]).replace("{MethodName}", methodName.split(".")[1]) + "?id=" + $.server.ASYNCOUNTER,
                   contentType: "application/json; charset=utf-8",
                   data: JSON.stringify(inputData),
                   dataType: "json",
                   async: true,
                   success: function (items) {
   
                       //Retrieve the context
                       var cnt = $.util.queryString("id", this.url);
                       var objContext = $.server.ASYNCACHE[cnt];
                       delete $.server.ASYNCACHE[cnt];
   
                       //Call the callback method with result and context
                       if (typeof callback != "undefined")
                           callback(items.d, objContext);
                   },
                   error: function (err) {
                       //Call the global error handler
                       if (typeof $.webMethodError != "undefined")
                           $.webMethodError(err.responseJSON);
   
                       //Clear the context
                       var cnt = $.util.queryString("id", this.url);
                       delete $.server.ASYNCACHE[cnt];
   
                       //Call the error callback if any
                       if (typeof errorCallback != "undefined")
                           errorCallback(err.responseJSON);
   
                   }
               });
   
               //track the counter for maintaining context
               $.server.ASYNCOUNTER = $.server.ASYNCOUNTER + 1;
   
           }
   
           //WebMethod to call the Web Serice in synchronous mode.Set your correct ServicePathPattern before using this.
           $.server.webMethodSync = function (methodName, inputData, callback, errorCallback) {
               var result = null;
               $.ajax({
                   type: "POST",
                   url: WEBUI.CONTEXT.ServicePathPattern.replace("{ClassName}", methodName.split(".")[0]).replace("{MethodName}", methodName.split(".")[1]),
                   contentType: "application/json; charset=utf-8",
                   data: JSON.stringify(inputData),
                   dataType: "json",
                   async: false,
                   success: function (items) {
                       result = items.d;
   
                       //Call the callback method with result and context
                       if (typeof callback != "undefined")
                           callback(result);
                   },
                   error: function (err) {
                       //Call the global error handler
                       if (typeof $.webMethodError != "undefined")
                           $.webMethodError(err.responseJSON);
   
                       //Call the error callback if any
                       if (typeof errorCallback != "undefined")
                           errorCallback(err.responseJSON);
                   }
               });
               //return the data
               return result;
           }
   
           //Web method to support Named Query(async).Call to DB Packages directly .Use only for read purpose.
           $.server.webMethodNQ = function (methodName, inputData, callback, error, context) {
   
               //Prepare the data to be posted
               var postData = new Object();
               postData.methodName = methodName;
               postData.methodParams = JSON.stringify(inputData);
   
               //Store the context to be persisted after asynchronous ajax call is completed
               $.server.ASYNCACHE[$.server.ASYNCOUNTER] = context;
   
               //Make the ajax call
               $.ajax({
                   type: "POST",
                   url: WEBUI.CONTEXT.NamedServicePathPattern + "?id=" + $.server.ASYNCOUNTER,
                   contentType: "application/json; charset=utf-8",
                   data: JSON.stringify(postData),
                   dataType: "json",
                   async: true,
                   success: function (items) {
                       //Retrieve the context
                       var cnt = $.util.queryString("id", this.url);
                       var obj = $.server.ASYNCACHE[cnt];
                       delete $.server.ASYNCACHE[cnt];
   
                       //Call the callback method with result and context
                       if (typeof callback != "undefined")
                           callback(items.d, obj);
                   },
                   error: function (err) {
   
                       //Call the global error handler
                       if (typeof $.webMethodError != "undefined")
                           $.webMethodError(err.responseJSON);
   
                       //Clear the context
                       var cnt = $.util.queryString("id", this.url);
                       delete $.server.ASYNCACHE[cnt];
   
                       //Call the error callback if any
                       if (typeof error != "undefined")
                           error(err.responseJSON);
   
                   }
   
               });
               //track the counter for maintaining context
               $.server.ASYNCOUNTER = $.server.ASYNCOUNTER + 1;
           }
   
           //Web method to support Named Query(sync).Call to DB Packages directly .Use only for read purpose.
           $.server.webMethodNQSync = function (methodName, inputData, callback, errorCallback) {
               var result = null;
   
               var postData = new Object();
               postData.methodName = methodName;
               postData.methodParams = JSON.stringify(inputData);
   
               $.ajax({
                   type: "POST",
                   url: WEBUI.CONTEXT.NamedServicePathPattern,
                   contentType: "application/json; charset=utf-8",
                   data: JSON.stringify(postData),
                   dataType: "json",
                   async: false,
                   success: function (items) {
                       result = items.d;
   
                       //Call the callback method with result and context
                       if (typeof callback != "undefined")
                           callback(result);
                   },
                   error: function (err) {
                       //Call the global error handler
                       if (typeof $.webMethodError != "undefined")
                           $.webMethodError(err.responseJSON);
   
                       //Call the error callback if any
                       if (typeof errorCallback != "undefined")
                           errorCallback(err.responseJSON);
                   }
               });
   
               //return the data
               return result;
           }
   
           */
        $.server.webMethodGET = function (methodName, callback, error) {
            var mainurl = "http://" + window.instanceURL +"/"+window.instanceShopOnRestApi+ "/api/v1/";
            //var mainurl = "http://localhost:8084/AvalonShopOnRestAPI/api/v1/";
            //var mainurl = "http://104.251.218.116:8080/ShopOnCloudRestAPI/api/v1/";
            
            //var headers = { "auth-token": getCookie("auth_token") }
            var headers = { "auth-token": "0007b0ee-4eb6-11e8-8971-c48e7aba35d9" }
            if (methodName.startsWith("iam") || methodName.startsWith("cloud")) {
                //mainurl = "http://104.251.218.116:9080/CloudIAMRestAPI/api/v1/";
                mainurl = "http://" + window.instanceURL + "/" + window.instanceCloudRestApi + "/api/v1/";
                //mainurl = "http://localhost:8080/CloudIAMRestAPI/api/v1/";
                headers.comp_id = localStorage.getItem("comp_id");
            }
            else if (methodName.startsWith("journal") || methodName.startsWith("finfacts")) {
                mainurl = "http://" + window.instanceURL + "/" + window.instanceFinfactsRestApi + "/api/v1/";
                //mainurl = "http://localhost:8080/FinFactsShopOnRestAPI/api/v1/";
                headers.comp_id = localStorage.getItem("user_finfacts_comp_id");
                //headers.store_no = localStorage.getItem("user_store_no");
            }
            else if (methodName.startsWith("propon")) {
                mainurl = "http://" + window.instanceURL + "/" + window.instancePropOnRestApi + "/api/v1/";
                headers.comp_id = getCookie("user_company_id");
            }
            else if (methodName.startsWith("services")) {
                mainurl = "http://" + window.instanceURL + "/" + window.instanceServiceRestApi + "/api/v1/";
                headers.comp_id = localStorage.getItem("user_company_id");
            }
            else {
                headers.comp_id = localStorage.getItem("user_company_id");
                headers.store_no = localStorage.getItem("user_store_no");
                headers.fulfillment_store_no = localStorage.getItem("user_fulfillment_store_no");
                headers.langcode = CONTEXT.CurrentSecondaryLanguage;//CONTEXT.CurrentLanguage;
            }

            var result = "";

            $.ajax({
                type: "GET",
                url: mainurl + methodName,
                async: true,
                headers: headers,
                success: function (items) {
                    items = JSON.parse(items);
                    var cnt = $.util.queryString("id", this.url);
                    var obj = $.server.ASYNCACHE[cnt];
                    result = items;
                    delete $.server.ASYNCACHE[cnt];
                    if (typeof callback !== "undefined")
                        callback(result, obj);
                },
                error: function (err) {
                    if (typeof AsyncError !== "undefined")
                        AsyncError(err.responseJSON);
                    var cnt = $.util.queryString("id", this.url);
                    delete $.server.ASYNCACHE[cnt];
                    if (typeof error !== "undefined")
                        error(JSON.parse(err.responseText));
                }
            });
            $.server.ASYNCOUNTER = $.server.ASYNCOUNTER + 1;
        }

        $.server.webMethodPOST = function (methodName, inputData, callback, error) {
            var mainurl = "http://" + window.instanceURL + "/" + window.instanceShopOnRestApi + "/api/v1/";
            //var mainurl = "http://localhost:8084/AvalonShopOnRestAPI/api/v1/";
            //var headers = { "auth-token": getCookie("auth_token") }
            var headers = { "auth-token": "0007b0ee-4eb6-11e8-8971-c48e7aba35d9" }
            headers.comp_id = localStorage.getItem("user_company_id");
            
            if (methodName.startsWith("journal") || methodName.startsWith("finfacts")) {
                mainurl = "http://" + window.instanceURL + "/" + window.instanceFinfactsRestApi + "/api/v1/";
                //mainurl = "http://localhost:8080/FinFactsShopOnRestAPI/api/v1/";
                headers.comp_id = localStorage.getItem("user_finfacts_comp_id");
            }
            else if (methodName.startsWith("iam") || methodName.startsWith("cloud")) {
                //mainurl = "http://104.251.218.116:9080/CloudIAMRestAPI/api/v1/";
                mainurl = "http://" + window.instanceURL + "/" + window.instanceCloudRestApi + "/api/v1/";
                //mainurl = "http://localhost:8084/IAMRestAPI/api/v1/";
                headers.comp_id = localStorage.getItem("comp_id");
            }
            else if (methodName.startsWith("eshopon")) {
                methodName = methodName.substring(methodName.indexOf("/") + 1, 200);
                mainurl = "http://" + window.instanceURL + "/" + localStorage.getItem("instance_eshoponAPI") + "/api/v1/";
                headers = {
                    "auth-token": CONTEXT.ESHOPON_AUTH_TOKEN,
                    "comp_id": CONTEXT.ESHOPON_COMP_ID,
                    "store_no": CONTEXT.ESHOPON_STORE_NO,
                }
            }
            else if (methodName.startsWith("propon")) {
                mainurl = "http://" + window.instanceURL + "/" + window.instancePropOnRestApi + "/api/v1/";
                headers.comp_id = getCookie("user_company_id");
            }
            else if (methodName.startsWith("services")) {
                mainurl = "http://" + window.instanceURL + "/" + window.instanceServiceRestApi + "/api/v1/";
            }
            else {
                headers.langcode = CONTEXT.CurrentSecondaryLanguage;//CONTEXT.CurrentLanguage;
                headers.store_no = localStorage.getItem("user_store_no");
                headers.fulfillment_store_no = localStorage.getItem("user_fulfillment_store_no");
            }
            var result = "";

            $.ajax({
                type: "POST",
                url: mainurl + methodName,
                async: true,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(inputData),
                headers: headers,
                success: function (items) {
                    items = items;
                    var cnt = $.util.queryString("id", this.url);
                    var obj = $.server.ASYNCACHE[cnt];
                    result = items;
                    delete $.server.ASYNCACHE[cnt];
                    if (typeof callback !== "undefined")
                        callback(result, obj);
                },
                error: function (err) {
                    if (typeof AsyncError !== "undefined")
                        AsyncError(err.responseJSON);
                    var cnt = $.util.queryString("id", this.url);
                    delete $.server.ASYNCACHE[cnt];
                    if (typeof error !== "undefined")
                        error(JSON.parse(err.responseText));
                }
            });
            $.server.ASYNCOUNTER = $.server.ASYNCOUNTER + 1;

        }
        $.server.webMethodPOSTWithURL = function (url, methodName, inputData, callback, errorCallback) {
            //var mainurl = "http://104.251.218.116:9080//CloudIAMRestAPI/api/v1/";
            var mainurl = "http://" + url + "/api/v1/";
            var result = "";

            $.ajax({
                type: "POST",
                url: mainurl + methodName,
                async: true,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(inputData),
                headers: {
                    "auth-token": getCookie("auth_token")

                },
                success: function (items) {
                    items = items;
                    var cnt = $.util.queryString("id", this.url);
                    var obj = $.server.ASYNCACHE[cnt];
                    result = items;
                    delete $.server.ASYNCACHE[cnt];
                    if (typeof callback !== "undefined")
                        callback(result, obj);
                },
                error: function (err) {
                    if (typeof AsyncError !== "undefined")
                        AsyncError(err.responseJSON);
                    var cnt = $.util.queryString("id", this.url);
                    delete $.server.ASYNCACHE[cnt];
                    if (typeof error !== "undefined")
                        error(JSON.parse(err.responseText));
                }
            });
            $.server.ASYNCOUNTER = $.server.ASYNCOUNTER + 1;

        }
        $.server.webMethodPUT = function (methodName, inputData, callback, errorCallback) {
            var mainurl = "http://" + window.instanceURL + "/" + window.instanceShopOnRestApi + "/api/v1/";
            //var mainurl = "http://localhost:8084/AvalonShopOnRestAPI/api/v1/";
            //var headers = { "auth-token": localStorage.getItem("auth_token") }
            var headers = { "auth-token": "0007b0ee-4eb6-11e8-8971-c48e7aba35d9" }
            headers.comp_id = localStorage.getItem("user_company_id");
            
            if (methodName.startsWith("journal") || methodName.startsWith("finfacts")) {
                mainurl = "http://" + window.instanceURL + "/" + window.instanceFinfactsRestApi + "/api/v1/";
                //mainurl = "http://localhost:8080/FinFactsShopOnRestAPI/api/v1/";
                headers.comp_id = localStorage.getItem("user_finfacts_comp_id");
            }
            else if (methodName.startsWith("iam") || methodName.startsWith("cloud")) {
                //mainurl = "http://104.251.218.116:9080/CloudIAMRestAPI/api/v1/";
                mainurl = "http://" + window.instanceURL + "/" + window.instanceCloudRestApi + "/api/v1/";
                //mainurl = "http://localhost:8080/CloudIAMRestAPI/api/v1/";
                headers.comp_id = localStorage.getItem("comp_id");
            }
            else if (methodName.startsWith("eshopon")) {
                methodName = methodName.substring(methodName.indexOf("/") + 1, 200);
                mainurl = "http://" + window.instanceURL + "/" + localStorage.getItem("instance_eshoponAPI") + "/api/v1/";
                headers = {
                    "auth-token": CONTEXT.ESHOPON_AUTH_TOKEN,
                    "comp_id": CONTEXT.ESHOPON_COMP_ID,
                    "store_no": CONTEXT.ESHOPON_STORE_NO,

                }
            }
            else if (methodName.startsWith("services")) {
                mainurl = "http://" + window.instanceURL + "/" + window.instanceServiceRestApi + "/api/v1/";
            }
            else {
                headers.langcode = CONTEXT.CurrentSecondaryLanguage;//CONTEXT.CurrentLanguage;
            }

            var result = "";

            $.ajax({
                type: "PUT",
                url: mainurl + methodName,
                async: true,

                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(inputData),
                headers: headers,
                success: function (items) {
                    items = items;
                    var cnt = $.util.queryString("id", this.url);
                    var obj = $.server.ASYNCACHE[cnt];
                    result = items;
                    delete $.server.ASYNCACHE[cnt];
                    if (typeof callback !== "undefined")
                        callback(result, obj);
                },
                error: function (err) {
                    if (typeof AsyncError !== "undefined")
                        AsyncError(err.responseJSON);
                    var cnt = $.util.queryString("id", this.url);
                    delete $.server.ASYNCACHE[cnt];
                    if (typeof error !== "undefined")
                        error(JSON.parse(err.responseText));
                }
            });
            $.server.ASYNCOUNTER = $.server.ASYNCOUNTER + 1;

        }

        $.server.webMethodDELETE = function (methodName, inputData, callback, error, context) {
            var mainurl = "http://" + window.instanceURL + "/" + window.instanceShopOnRestApi + "/api/v1/";
            //var mainurl = "http://localhost:8084/AvalonShopOnRestAPI/api/v1/";
            //var headers = { "auth-token": localStorage.getItem("auth_token") }
            var headers = { "auth-token": "0007b0ee-4eb6-11e8-8971-c48e7aba35d9" }
            headers.comp_id = localStorage.getItem("user_company_id");
            
            if (methodName.startsWith("journal") || methodName.startsWith("finfacts")) {
                mainurl = "http://" + window.instanceURL + "/" + window.instanceFinfactsRestApi + "/api/v1/";
                //mainurl = "http://localhost:8080/FinFactsShopOnRestAPI/api/v1/";
                headers.comp_id = localStorage.getItem("user_finfacts_comp_id");
            }
            else if (methodName.startsWith("iam") || methodName.startsWith("cloud")) {
                //mainurl = "http://104.251.218.116:9080/CloudIAMRestAPI/api/v1/";
                mainurl = "http://" + window.instanceURL + "/" + window.instanceCloudRestApi + "/api/v1/";
                //mainurl = "http://localhost:8080/CloudIAMRestAPI/api/v1/";
                headers.comp_id = localStorage.getItem("comp_id");
            }
            else if (methodName.startsWith("services")) {
                mainurl = "http://" + window.instanceURL + "/" + window.instanceServiceRestApi + "/api/v1/";
            }
            else {
                headers.langcode = CONTEXT.CurrentSecondaryLanguage;//CONTEXT.CurrentLanguage;
            }

            var result = "";
            $.ajax({
                type: "DELETE",
                url: mainurl + methodName,
                async: true,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(inputData),
                headers: headers,
                success: function (items) {
                    items = items;
                    var cnt = $.util.queryString("id", this.url);
                    var obj = $.server.ASYNCACHE[cnt];
                    result = items;
                    delete $.server.ASYNCACHE[cnt];
                    if (typeof callback !== "undefined")
                        callback(result, obj);
                },
                error: function (err) {
                    if (typeof AsyncError !== "undefined")
                        AsyncError(err.responseJSON);
                    var cnt = $.util.queryString("id", this.url);
                    delete $.server.ASYNCACHE[cnt];
                    if (typeof error !== "undefined")
                        error(JSON.parse(err.responseText));
                }
            });
            $.server.ASYNCOUNTER = $.server.ASYNCOUNTER + 1;

        }
    }
    Array.prototype.unique = function () {
        var arr = [];
        for (var i = 0; i < this.length; i++) {
            if (!arr.includes(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr;
    }
    //Basic Utilites to perform action like replaceAll etc..
    function coreInitUtilities() {

        //Alert popup default implementation
        $.alert = function (msg, callback) {
            alert(msg);
            callback();
        }

        //Alert confirm popup default implementation
        $.confirm = function (msg, callback) {
            var val = confirm(msg);
            callback(val);
        };

        $.util = {
            //Sort array with multiple data Fiels

            uniqueBy: function (arr, fn) {
                var unique = {};
                var distinct = [];
                arr.forEach(function (x) {
                    var key = fn(x);
                    if (!unique[key]) {
                        distinct.push(key);
                        unique[key] = true;
                    }
                });
                return distinct;
            },

            sortBy: function (array, sortFields) {
                function dynamicSortMultiple(sortFieldsArg) {
                    var props = sortFieldsArg;
                    return function (obj1, obj2) {
                        var i = 0, result = 0, numberOfProperties = props.length;
                        while (result === 0 && i < numberOfProperties) {
                            result = dynamicSort(props[i])(obj1, obj2);
                            i++;
                        }
                        return result;
                    }
                }
                function dynamicSort(property) {
                    var sortOrder = 1;
                    if (property[0] === "-") {
                        sortOrder = -1;
                        property = property.substr(1, property.length - 1);
                    }
                    return function (a, b) {
                        var result;
                        if (a[property] === null) {
                            result = 1;
                        } else if (b[property] === null) {
                            result = -1;
                        } else if (a[property] === null && b[property] === null) {
                            result = -1;
                        } else if (typeof a[property] == "string")
                            result = (a[property] + "").toLowerCase().localeCompare((b[property] + "").toLowerCase(), 'sv');
                        else
                            result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                        return result * sortOrder;
                    }
                }
                return array.sort(dynamicSortMultiple(sortFields));

            },

            //decode querystring parameters by name
            queryString: function (name, url) {
                if (!url) {
                    url = window.location.href;
                }
                var results = new RegExp("[\\?&]" + name + "=([^&#]*)").exec(url);
                if (!results) {
                    return undefined;
                }
                return results[1] || undefined;
            },

            //Clone to a new object with deep copy
            clone: function (obj) {
                return JSON.parse(JSON.stringify(obj));
            },

            //Stirng global replace all 
            replaceAll: function (objectName, replaceThis, withThis) {

                return objectName.replace(new RegExp(replaceThis, 'g'), withThis);
            },

            //String endswith
            endsWith: function (objectName, pattern) {
                var d = objectName.length - pattern.length;
                return d >= 0 && objectName.lastIndexOf(pattern) === d;

            },

            //TODO : Just placeholder
            toDate: function (objectName) {
                try {
                    return objectName.substring(0, 10);
                } catch (e) {
                    return "";
                }
            },

            //TODO : Just placeholder
            toDBDate: function (objectName) {
                try {
                    return objectName.substring(0, 10);
                } catch (e) {
                    return "";
                }
            },

            //String contains
            contains: function (objectName, str2) {
                if (objectName.indexOf(str2) !== -1)
                    return true;
                else
                    return false;
            },

            //String like
            like: function (objectName, str2) {
                str2 = str2.replace(/%/g, ".*");
                if (objectName.match(str2))
                    return true;
                else
                    return false;
            },

        }

    }

    //Method to initialise main page control
    function coreInitLoadPage() {
        if (typeof $("body").attr("control") !== "undefined")
            WEBUI.MAINPAGE = $("body")[$("body").attr("control").split(".")[1]]();
    }

    //Implementation of default button
    function coreInitDefaultButton() {
        $("body").keydown(function (e) {
            if (e.keyCode == 13) {
                var defButton = $(e.target).closest("[default-button]").attr("default-button");
                $(e.target).closest("[default-button]").find("[controlid=" + defButton + "]").click();
            }
        });
    }

    //Implementation of unsaved Changes. Grouping is supported now.
    function coreInitUnSavedCheck() {

        //Method to be called for unsaved changes check.
        $.unSavedChangesCheck = function (groupName, callback) {

            //Check revord is changed
            if (WEBUI.MAINPAGE != null && WEBUI.MAINPAGE.recordChanged(groupName)) {

                //Confirm with user and callback
                $.confirm("There are unsaved changes. Do you want to proceed anyway?", function (val) {
                    if (val == true) {

                        //Clear the flag
                        WEBUI.MAINPAGE.clearFlag(groupName);
                        callback();
                    }
                });
            } else
                callback();
        }
    }

    //Implementation to load and unload controls dynamically
    function coreInitDynamicLoading() {

        //Load a  user control
        $.pageController.loadUserControl = function (page, ctrl, ctrlId, userControlName) {

            //Set controlId and control
            ctrl.attr("controlId", ctrlId);
            ctrl.attr("control", page.controlName + "." + userControlName);

            //Create the user control  and add to page
            page.controls[ctrlId] = ctrl[userControlName]();

            //Return the control
            return $(ctrl)[userControlName]();
        }


        //Unload a user control that is  loaded
        $.pageController.unLoadUserControl = function (page, userControlId) {

            //Verify userControl Id exists
            if (typeof page.controls[userControlId] !== "undefined") {

                //Find its unique Id
                var sel = page.controls[userControlId].selectedObject;
                var str = [];
                while ($(sel)[0].tagName != "BODY") {
                    var parentControlName = $(sel).attr("control").split(".")[0];

                    var parentControl = $(sel).closest("[control$='." + parentControlName + "']");
                    str.push($(parentControl).attr("controlId"));
                    sel = parentControl;
                }
                var uniqueId = str.reverse().join("_") + "_" + page.controls[userControlId].selectedObject.attr("controlId");

                //Delete userControls and all child controls  of it
                for (var prop in WEBUI.UICONTROLS) {
                    if (prop.startsWith(uniqueId))
                        delete WEBUI.UICONTROLS[prop];
                }

                //Clear html,control and controlId
                $(page.controls[userControlId].selectedObject).html("");
                $(page.controls[userControlId].selectedObject).removeAttr("controlId");
                $(page.controls[userControlId].selectedObject).removeAttr("control");

                //Delete the reference in parent control
                delete page.controls[userControlId];


            }

        }
    }

    //Inititalis other utilities
    function coreInitOthers() {
        window.$$$ = function (ctrlId) {
            return WEBUI.UICONTROLS[ctrlId];
        }
    }

    coreInitSessionExpiryHandler(); //Handle Authentication
    coreInitDependencyManager();  //Support to load dependent JS files
    coreInitPageController();    //Controlling page and usercontrols
    coreInitLogger();       //Add support fsor logging
    coreInitWebMethod(); //Initialise WebMethod Calling Support
    coreInitUtilities(); //Initialise utility methods in Common.js     
    coreInitDefaultButton();   //Give control to current page
    coreInitUnSavedCheck();
    coreInitDynamicLoading();
    coreInitOthers();
    coreInitLoadPage();   //Give control to current page
});

//METHOD MISSING FOR OLD CORE.JS FILE START

function isInt(value) {
    var x = parseFloat(value);
    //return !isNaN(value) && (x | 0) === x;
    return !isNaN(value);
}
// return currentdate with dd-MM-YYYY format
function currentDate() {
    var cur_date = new Date();
    var day = cur_date.getDate();
    var month = cur_date.getMonth() + 1;
    var year = cur_date.getFullYear();
    day = ("0" + day).slice(-2);
    month = ("0" + (month)).slice(-2);
    return day + "-" + month + "-" + year;
}
// To Validate Email Address
function ValidateEmail(email) {
    var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return expr.test(email);
};
// To Validate Mobile
function ValidateMobileNo(number) {
    var expr = /^\d{10}$/;// /[2-9]{2}\d{8}/;
    return expr.test(number);
};
// To Validate Domain Name
function ValidateDomainName(name) {
    var expr = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    return expr.test(name);
};
// To Validate GST No
function ValidateGSTNo(no) {
    var expr = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return expr.test(no);
};
// To Validate User Name
function ValidateUserName(name) {
    var expr = /^[a-zA-Z0-9]+$/;
    return expr.test(name);
};
// To Validate Address
function ValidateAddress(address) {
    var expr = /d{1,5}\s\w.\s(\b\w*\b\s){1,2}\w*/;
    return expr.test(address);
};
// alert box
function ShowDialogBox(title, content, btn1text, btn2text, parameterList) {
    var btn1css;
    var btn2css;

    if (btn1text == '') {
        btn1css = "hidecss";
    } else {
        btn1css = "showcss";
    }

    if (btn2text == '') {
        btn2css = "hidecss";
    } else {
        btn2css = "showcss";
    }
    content = WEBUI.LANG[CONTEXT.CurrentLanguage][content]
    title = WEBUI.LANG[CONTEXT.CurrentLanguage]["Message"]
    $("#lblMessage").html(content);

    $("#dialog").dialog({
        resizable: false,
        title: title,
        modal: true,
        width: '400px',
        height: 'auto',
        bgiframe: false,
        hide: { effect: 'scale', duration: 400 },

        buttons: [
                        {
                            text: btn1text,
                            "class": btn1css,
                            "controlid": "btnOk",
                            click: function () {

                                $("#dialog").dialog('close');
                                return true;

                            }
                        },
                        {
                            text: btn2text,
                            "class": btn2css,
                            "controlid": "btnCancel",
                            click: function () {
                                $("#dialog").dialog('close');
                                return false;
                            }
                        }
        ]
    });
}

//confirm dialogue
function ConfirmDialog(title, content, btn1text, btn2text, parameterList) {
    $('<div></div>').appendTo('body')
                    .html('<div><h6>' + content + '?</h6></div>')
                    .dialog({
                        resizable: false,
                        title: title,
                        modal: true,
                        width: '400px',
                        height: 'auto',
                        bgiframe: false,
                        buttons: {
                            Yes: function () {
                                // $(obj).removeAttr('onclick');                                
                                // $(obj).parents('.Parent').remove();

                                $('body').append('<h1>Confirm Dialog Result: <i>Yes</i></h1>');

                                $(this).dialog("close");
                            },
                            No: function () {
                                $('body').append('<h1>Confirm Dialog Result: <i>No</i></h1>');

                                $(this).dialog("close");
                            }
                        },
                        close: function (event, ui) {
                            $(this).remove();
                        }
                    });
};
//METHOD MISSING OLD CORE.JS END

function Map() {
    var cmdText = "";
    var sep = "";
    return {
        add: function (key, value, type) {
            if (cmdText != "")
                sep = ",";
            if (type == "Text")
                cmdText = cmdText + sep + key + ";'" + value + "'";
            else if (type == "Date") {
                var dd = value.substring(0, 2);
                var mm = value.substring(3, 5);
                var yyyy = value.substring(6, 10);


                var tt = value.substring(11, 19);
                if (tt.length == 8)
                    cmdText = cmdText + sep + key + ";'" + yyyy + "-" + mm + "-" + dd + " " + tt + "'";
                else
                    cmdText = cmdText + sep + key + ";'" + yyyy + "-" + mm + "-" + dd + "'";


            } else
                cmdText = cmdText + sep + key + ";" + value;
        },
        toString: function () {
            return cmdText;
        }

    };
}

function dbDate(value) {

    var dd = value.substring(0, 2);
    var mm = value.substring(3, 5);
    var yyyy = value.substring(6, 10);
    return yyyy + "-" + mm + "-" + dd;
}
function dbDateMonthYear(value) {

    var dd = value.substring(0, 2);
    var mm = value.substring(3, 5);
    var yyyy = value.substring(6, 10);
    return dd + "-" + mm + "-" + yyyy;
}
function dbDateTime(value) {
    var date = value.split("-");
    var dd = date[0];
    var mm = date[1];
    var yyyy = date[2];
    dd=(dd.length < 2) ? "0" + dd : dd;
    mm=(mm.length < 2) ? "0" + mm : mm;
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    return yyyy + "-" + mm + "-" + dd + " " + hours + ":" + minutes + ":" + seconds;
}
function sysDate(value) {

    var dd = value.substring(8, 10);
    var mm = value.substring(5,7);
    var yyyy = value.substring(0,4);
    return dd + "-" + mm + "-" + yyyy;
}
function getBitByZero(value, bit) {
    var length;// = value.length();
    length = (parseInt(value) < 10) ? 1 : (parseInt(value) < 100) ? 2 : (parseInt(value) < 1000) ? 3 : (parseInt(value) < 10000) ? 4 : (parseInt(value) < 100000) ? 5 : 6;
    if (parseInt(length) >= (parseInt(bit) - 2)) {
        return value;
    }
    else {
        for (var i = length; i < bit - 1; i++)
            value = "0" + value;
        //value = value + "1";
        value = "0" + value;
        return value;
    }
}
function getBitByOne(value, bit) {
    var length;// = value.length();
    length = (parseInt(value) < 10) ? 1 : (parseInt(value) < 100) ? 2 : (parseInt(value) < 1000) ? 3 : (parseInt(value) < 10000) ? 4 : (parseInt(value) < 100000) ? 5 : 6;
    if (parseInt(length) >= (parseInt(bit) - 2)) {
        return value;
    }
    else {
        for (var i = length; i < bit - 2; i++)
            value = "0" + value;
        value = "1" + value + "1";
        return value;
    }
}
function convertBitString(value, bit) {
    var length = value.length;
    if (length >= bit) {
        return value.substring(0, bit);
    }
    else {
        for (var i = length; i <= bit; i++)
            value = value + " ";
        return value;
    }
}
function getBitByVariation(value, bit) {
    var length;
    length = (parseInt(value) < 10) ? 1 : (parseInt(value) < 100) ? 2 : (parseInt(value) < 1000) ? 3 : (parseInt(value) < 10000) ? 4 : (parseInt(value) < 100000) ? 5 : 6;
    if (parseInt(length) >= (parseInt(bit))) {
        return value;
    }
    else {
        for (var i = length; i < bit - 1; i++)
            value = "0" + value;
        value = "@"+value;
        return value;
    }
}
function getBitByStock(value, bit) {
    var length;
    length = (parseInt(value) < 10) ? 1 : (parseInt(value) < 100) ? 2 : (parseInt(value) < 1000) ? 3 : (parseInt(value) < 10000) ? 4 : (parseInt(value) < 100000) ? 5 : 6;
    if (parseInt(length) >= (parseInt(bit))) {
        return value;
    }
    else {
        for (var i = length; i < bit - 1; i++)
            value = "0" + value;
        value = "S" + value;
        return value;
    }
}
var nvl = function (data, val) {
    if (typeof data == "undefined" || data == null)
        return val;
    else
        return data;
};

function getSalesExecutiveCode(codeStringValue) {
    codeStringValue = executivePad(codeStringValue, 12);
    var chetVal = 0, nechetVal = 0;
    var codeToParse = codeStringValue;

    for (var index = 0; index < 6; index++) {
        chetVal += parseInt(codeToParse.substring(index * 2 + 1, index * 2 + 2));
        nechetVal += parseInt(codeToParse.substring(index * 2, index * 2 + 1));
    }

    chetVal *= 3;
    var controlNumber = 10 - (chetVal + nechetVal) % 10;
    if (controlNumber == 10) controlNumber = 1;

    codeToParse = codeToParse + "" + (controlNumber);

    return codeToParse;

}
function executivePad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : 1+new Array(width - n.length + 1).join(z) + n;
}

function getFullCode(codeStringValue) {
    //codeStringValue = pad(codeStringValue, 12);
    //var chetVal = 0, nechetVal = 0;
    //var codeToParse = codeStringValue;

    //for (var index = 0; index < 6; index++) {
    //    chetVal += parseInt(codeToParse.substring(index * 2 + 1, index * 2 + 2));
    //    nechetVal += parseInt(codeToParse.substring(index * 2, index * 2 + 1));
    //}

    //chetVal *= 3;
    //var controlNumber = 10 - (chetVal + nechetVal) % 10;
    //if (controlNumber == 10) controlNumber = 0;

    //codeToParse = codeToParse + "" + (controlNumber);

    //return codeToParse;
    
    return "000"+codeStringValue;

}
function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
function getNormalDate(value) {
    if (value == "" || value == null)
        return "";
    if (value.charAt(4) == "-") {
        var date = value.split("-");
        var dd = date[2];
        var mm = date[1];
        var yyyy = date[0];
        dd = (dd.length < 2) ? "0" + dd : dd;
        mm = (mm.length < 2) ? "0" + mm : mm;
        return dd + "-" + mm + "-" + yyyy;
    }
    else {
        var date = value.split("-");
        var dd = date[0];
        var mm = date[1];
        var yyyy = date[2];
        dd = (dd.length < 2) ? "0" + dd : dd;
        mm = (mm.length < 2) ? "0" + mm : mm;
        return dd + "-" + mm + "-" + yyyy;
    }
}
function CheckDecimal(inputtxt) {
    var decimal = /^[-+]?[0-9]+\.[0-9]+$/;
    if (inputtxt.match(decimal)) {
        return true;
    }
    else {
        return false;
    }
}
function ReportTesting() {

    var accountInfo = {
        "Phone": "030-0074321",
        "ContactName": "Maria Anders",
        "Fax": "030-0076545",
        "Address": "Obere Str. 57",
        "CustomerID": "ALFKI",
        "CompanyName": "Alfreds Futterkiste",
        "Country": "Germany",
        "City": "Berlin",
        "ContactTitle": "Sales Representative",
        "Orders": [
       {
           "ShipPostalCode": 51100,
           "ShippedDate": null,
           "OrderDate": null,
           "OrderID": 10248,
           "Freight": 32.38,
           "RequiredDate": null,
           "ShipCity": "Reims",
           "ShipCountry": "France",
           "EmployeeID": 5,
           "ShipVia": 3,
           "CustomerID": "VINET",
           "ShipAddress": "59 rue de l'Abbaye",
           "ShipName": "Vins et alcools Chevalier"
       },
       {
           "ShipPostalCode": "05454-876",
           "ShippedDate": null,
           "OrderDate": null,
           "OrderID": 10250,
           "Freight": 65.83,
           "ShipRegion": "RJ",
           "RequiredDate": null,
           "ShipCity": "Rio de Janeiro",
           "ShipCountry": "Brazil",
           "EmployeeID": 4,
           "ShipVia": 2,
           "CustomerID": "HANAR",
           "ShipAddress": "Rua do Pao 67",
           "ShipName": "Hanari Carnes"
       }
        ]
    };

    //  GeneratePrint("ShopOnDev", "Wood.jrxml", accountInfo, "PDF");

    //GeneratePrint("ShopOnDev", "Wood.jrxml", accountInfo, "EXCEL");
    //   GeneratePrint("ShopOnDev", "Wood.jrxml", accountInfo, "WORD");
    //GeneratePrint("ShopOnDev", "Wood.jrxml", accountInfo, "PPT");

    // GeneratePrint("ShopOnDev", "Wood.jrxml", accountInfo, "PPT");

    // GeneratePrint("ShopOnDev", "Wood.jrxml", accountInfo, "CSV");

    // GeneratePrint("ShopOnDev", "Wood.jrxml", accountInfo, "HTML");

    //  GenerateReport(
    // "ShopOnDev", "/balance-sheet/balance-sheet.jrxml", "Finfacts", "report/balance-sheet", "{per_id:12}", "PDF");
}



function GeneratePrint(appName, templateURI, jsonString, exportType, callback) {
    // page.controls.grdSOItems.allData()


    $.ajax({
        type: "POST",
        // url: "http://104.251.218.116:8080/woto-utility-rest/rest/sendEmail/sales-order",
        //url: "http://localhost:8080/woto-utility-rest/rest/communication/print",
        //url: "http://104.251.218.116:9080/woto-utility-rest/rest/communication/print",
        url: CONTEXT.INVOICE_PRINTER_URL,
        //CONTEXT.SOEmailURL,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/octet-stream',
            'app-name': appName,
            'template-uri': templateURI,
            'export-type': exportType,

        },
        crossDomain: false,
        // data: JSON.stringify(jsonString),
        data: JSON.stringify({ root: jsonString }),
        contentType: "application/octet-stream; charset=utf-8",
        // dataType: 'pdf',
        success: function (responseData, status, xhr) {
            //  var win = window.open('', '_blank');
            if (exportType == "PDF") {
                // window.open("data:application/pdf;base64, " + responseData);


                var uri = 'data:text/pdf;base64,' + responseData;
                if (callback)
                    callback(responseData);

                var downloadLink = document.createElement("a");
                downloadLink.href = uri;
                downloadLink.download = "data.pdf";

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
            else if (exportType == "HTML") {
                //  $('#output').html(responseData);
                var uri = 'data:text/html;base64,' + responseData;

                var downloadLink = document.createElement("a");
                downloadLink.href = uri;
                downloadLink.download = "data.html";

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                //window.open("data:application/html;base64, " + responseData);

            }
            else if (exportType == "CSV") {

                var uri = 'data:text/csv;base64,' + responseData;

                var downloadLink = document.createElement("a");
                downloadLink.href = uri;
                downloadLink.download = "data.csv";

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                //window.open("data:application/csv;charset=UTF-8 " + responseData);

            }
            else if (exportType == "EXCEL") {
                var uri = 'data:text/xls;base64,' + responseData;
                if (callback)
                    callback(responseData);
                var downloadLink = document.createElement("a");
                downloadLink.href = uri;
                downloadLink.download = "data.xls";

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);


            }

            else if (exportType == "WORD") {
                var uri = 'data:text/docx;base64,' + responseData;

                var downloadLink = document.createElement("a");
                downloadLink.href = uri;
                downloadLink.download = "data.docx";

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                //   window.open("data:application/docx;charset=UTF-8 " + responseData);

            }

            else if (exportType == "PPT") {
                var uri = 'data:application/pptx;base64,' + responseData;

                var downloadLink = document.createElement("a");
                downloadLink.href = uri;
                downloadLink.download = "data.pptx";

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                //      window.open("data:application/pptx;charset=UTF-8 " + responseData);

            }
            //   win.location.href = responseData;

            /*    console.log(responseData);
                window.open("data:application/pdf;base64, " + responseData);
    
                         alert("REport generated Successfully...");*/
        },
        error: function (request, status, error) {
            console.log(request.responseText);

            alert("Error in report");
        }
    });
}

function GeneratePrintWithoutDownload(appName, templateURI, jsonString, exportType, callback) {
    $.ajax({
        type: "POST",
        url: CONTEXT.INVOICE_PRINTER_URL,
        //CONTEXT.SOEmailURL,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/octet-stream',
            'app-name': appName,
            'template-uri': templateURI,
            'export-type': exportType,

        },
        crossDomain: false,
        // data: JSON.stringify(jsonString),
        data: JSON.stringify({ root: jsonString }),
        contentType: "application/octet-stream; charset=utf-8",
        // dataType: 'pdf',
        success: function (responseData, status, xhr) {
            if (exportType == "PDF") {
                var uri = 'data:text/pdf;base64,' + responseData;
                if (callback)
                    callback(responseData);

                var downloadLink = document.createElement("a");
                downloadLink.href = uri;
                downloadLink.download = "data.pdf";

                document.body.appendChild(downloadLink);
                //downloadLink.click();
                document.body.removeChild(downloadLink);
            }
            else if (exportType == "HTML") {
                var uri = 'data:text/html;base64,' + responseData;

                var downloadLink = document.createElement("a");
                downloadLink.href = uri;
                downloadLink.download = "data.html";

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
            else if (exportType == "CSV") {
                var uri = 'data:text/csv;base64,' + responseData;

                var downloadLink = document.createElement("a");
                downloadLink.href = uri;
                downloadLink.download = "data.csv";

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
            else if (exportType == "EXCEL") {
                var uri = 'data:text/xls;base64,' + responseData;
                if (callback)
                    callback(responseData);
                var downloadLink = document.createElement("a");
                downloadLink.href = uri;
                downloadLink.download = "data.xls";

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
            else if (exportType == "WORD") {
                var uri = 'data:text/docx;base64,' + responseData;

                var downloadLink = document.createElement("a");
                downloadLink.href = uri;
                downloadLink.download = "data.docx";

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
            else if (exportType == "PPT") {
                var uri = 'data:application/pptx;base64,' + responseData;

                var downloadLink = document.createElement("a");
                downloadLink.href = uri;
                downloadLink.download = "data.pptx";

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        },
        error: function (request, status, error) {
            console.log(request.responseText);

            alert("Error in report");
        }
    });
}

var a = ['Zero', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
function inWords(num) {
    var point = num.toString().split('.')[1];
    num = num.toString().split('.')[0];
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'And ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    var point_word = '';
    if (point != "" && point != null && typeof point != "undefined") {
        point_word = "Point "+point_word + " " + a[point[0]];
        point_word = point_word + " " + a[point[1]];
    }
    return str +""+point_word+ " Only";
}


var $$$ = function (uniqueId) {
    var ctrl = CONNECT.UICONTROLS[uniqueId];
    if (ctrl.controlName == "textBox") {
        return {
            value: function (data) {
                return ctrl.interface.val(data);
            },
        };
    } else if (ctrl.controlName == "primaryWriteButton" || ctrl.controlName == "primaryReadButton" || ctrl.controlName == "secondaryButton") {
        return {
            click: function () {
                return ctrl.interface.click();
            }
        };

    } else if (ctrl.controlName == "autoCompleteList") {
        return {
            search: function (term) {
                ctrl.interface.search(term);
            },
        };
    }
    else if (ctrl.controlName == "dropDownList") {
        return {
            value: function (data) {
                ctrl.interface.selectedValue(data);
            },
            index: function (value) {
                ctrl.interface.selectedIndex(value);
            },
            data: function (value) {
                ctrl.interface.selectedData(value);
            },
            append: function (value, text) {
                ctrl.interface.selectedValueAppend(value, text);
            },
            getValue: function (text) {
                ctrl.interface.getValue(text);
            },
        };
    }
    else if (ctrl.controlName == "grid") {

        //action('{ "item_no": 54 }', "edit");
        //value('{ "item_no": 54 }', "input[dataField=pcaName]", "Hellow")
        //$$$("purchaseOrder_grdPOResult").value('{"po_no":67}',"[datafield=vendor_name]")
        //select('{ "item_no": 54 }');
        //$$$("purchaseOrder_grdPOResult").select('{"po_no":67}')
        return {
            value: function (filter, selector, value) {
                if (typeof value != "undefined") {

                    var row = $(ctrl.interface.getRow(JSON.parse(filter))[0]);
                    row.find(selector).val(value).trigger('change');
                } else {
                    var row = $(ctrl.interface.getRow(JSON.parse(filter))[0]);
                    return $(row.find(selector)).first().text().trim();
                }
            },
            select: function (filter) {
                var rowId = $(ctrl.interface.getRow(JSON.parse(filter))[0]).attr("row_id");
                ctrl.interface.selectRow(rowId);
            },
            action: function (filter, actionName) {
                var row = $(ctrl.interface.getRow(JSON.parse(filter))[0]);
                row.find("[action=" + actionName + "]").click();
            }

        };
    }

    else if (ctrl.controlName == "chkBox") {
        return {
            value: function (data) {
                ctrl.interface.selectedValue(data);


            },
        };
    }

    else if (ctrl.controlName == "dateSelector") {
        return {
            setDate: function (date) {
                ctrl.interface.setDate(date);
            },
            getDate: function () {
                ctrl.interface.getDate();
            },
            disable: function (val) {
                ctrl.interface.disable(val);
            },
        };
    }
    else if (ctrl.controlName == "dateTimePicker") {
        return {
            setDate: function (date) {
                ctrl.interface.setDate(date);
            },
            getDate: function () {
                ctrl.interface.getDate();
            },
        };
    }
    else if (ctrl.controlName == "actionButton") {
        return {
            click: function (handler) {
                ctrl.interface.click(handler);
            },
        };
    }
    else if (ctrl.controlName == "tabButton") {
        return {
            click: function (handler) {
                ctrl.interface.click(handler);
            },
        };
    }
    else if (ctrl.controlName == "label") {
        return {
            value: function (val) {
                ctrl.interface.value(val);
            },
            click: function () {
                ctrl.interface.selectedObject.click();
            },
        };
    }
    else if (ctrl.controlName == "labelValue") {
        return {
            value: function (val) {
                ctrl.interface.value(val);
            },
        };
    }
    else if (ctrl.controlName == "hidden") {
        return {
            value: function (data) {
                ctrl.interface.value(data);
            },
        };
    }


}



function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


//English To Tamil Translation Using Google Translate Services
var sendSMS = function (accountInfosp, callback, errorCallback) {

    $.ajax({
        type: "POST",
        url: CONTEXT.SMS_API_URL,
        headers: {
            'Content-Type': 'application/json'
        },
        crossDomain: false,
        data: JSON.stringify(accountInfosp),
        dataType: 'json',
        success: function (responseData, status, xhr) {
            console.log(responseData);
            if (callback != undefined)
                callback(responseData);
        },
        error: function (request, status, error) {
            console.log(request.responseText);
            if (errorCallback != undefined)
                errorCallback(request.responseText);
        }
    });
}