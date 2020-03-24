$.fn.mobilePage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.eventService = new EventService();
        page.objectService = new ObjectService();
       

        page.events.page_load = function () {
            page.events.loading_click();
            $$("pnlLoad").width($(window).width()).height($(window).height());
            $('#loadImg').click(function () {
                $$("pnlLoad").fadeOut();
                $$("pnlHome").fadeIn();
                $$("pnlChoosePgm").hide();
                $$("pnlDateSelection").hide();
                $$("pnlTrackSelection").hide();
                $$("pnlLikeConfirm").hide();
                $$("pnlDislikeConfirm").hide();
                $$("pnlLike").hide();
                $$("pnlDisLike").hide();
            })

            $('#proceedWithoutLogin_click').click(function () {
                $$("pnlLoad").hide();
                $$("pnlHome").fadeOut();
                $$("pnlChoosePgm").fadeIn();
                $$("pnlDateSelection").hide();
                $$("pnlTrackSelection").hide();
                $$("pnlLikeConfirm").hide();
                $$("pnlDislikeConfirm").hide();
                $$("pnlLike").hide();
                $$("pnlDisLike").hide();
                page.events.btnShows_click();
            })
            $('#proceedDate_click').click(function () {
                $$("pnlLoad").hide();
                $$("pnlHome").hide();
                $$("pnlChoosePgm").fadeOut();
                $$("pnlDateSelection").hide();
                $$("pnlTrackSelection").fadeIn();
                $$("pnlLikeConfirm").hide();
                $$("pnlDislikeConfirm").hide();
                $$("pnlLike").hide();
                $$("pnlDisLike").hide();
            })
            $('#proceedLikeWithoutLogin_click').click(function () {
                $$("pnlLoad").hide();
                $$("pnlHome").hide();
                $$("pnlChoosePgm").hide();
                $$("pnlDateSelection").hide();
                $$("pnlTrackSelection").fadeOut();
                $$("pnlLikeConfirm").hide();
                $$("pnlDislikeConfirm").hide();
                $$("pnlLike").fadeIn();
                $$("pnlDisLike").hide();
            })
            $('#proceedDislikeWithoutLogin_click').click(function () {
                $$("pnlLoad").hide();
                $$("pnlHome").hide();
                $$("pnlChoosePgm").hide();
                $$("pnlDateSelection").hide();
                $$("pnlTrackSelection").fadeOut();
                $$("pnlLikeConfirm").hide();
                $$("pnlDislikeConfirm").hide();
                $$("pnlLike").hide();
                $$("pnlDisLike").fadeIn();
            })
            $('#backPnlLike').click(function () {
                $$("pnlLoad").hide();
                $$("pnlHome").hide();
                $$("pnlChoosePgm").hide();
                $$("pnlDateSelection").hide();
                $$("pnlTrackSelection").hide();
                $$("pnlLikeConfirm").fadeIn();
                $$("pnlDislikeConfirm").hide();
                $$("pnlLike").fadeOut();
                $$("pnlDisLike").hide();
            })
            $('#backPnlDislike').click(function () {
                $$("pnlLoad").hide();
                $$("pnlHome").hide();
                $$("pnlChoosePgm").hide();
                $$("pnlDateSelection").hide();
                $$("pnlTrackSelection").hide();
                $$("pnlLikeConfirm").hide();
                $$("pnlDislikeConfirm").fadeIn();
                $$("pnlLike").hide();
                $$("pnlDisLike").fadeOut();
            })
            $('#backPnlDislikeConfirm').click(function () {
                $$("pnlLoad").hide();
                $$("pnlHome").hide();
                $$("pnlChoosePgm").hide();
                $$("pnlDateSelection").hide();
                $$("pnlTrackSelection").fadeIn();
                $$("pnlLikeConfirm").hide();
                $$("pnlDislikeConfirm").fadeOut();
                $$("pnlLike").hide();
                $$("pnlDisLike").hide();
            })
            $('#backPnlLikeConfirm').click(function () {
                $$("pnlLoad").hide();
                $$("pnlHome").hide();
                $$("pnlChoosePgm").hide();
                $$("pnlDateSelection").hide();
                $$("pnlTrackSelection").fadeIn();
                $$("pnlLikeConfirm").fadeOut();
                $$("pnlDislikeConfirm").hide();
                $$("pnlLike").hide();
                $$("pnlDisLike").hide();
            })
            $('#backTrackSelection').click(function () {
                $$("pnlLoad").hide();
                $$("pnlHome").hide();
                $$("pnlChoosePgm").hide();
                $$("pnlDateSelection").fadeIn();
                $$("pnlTrackSelection").fadeOut();
                $$("pnlLikeConfirm").hide();
                $$("pnlDislikeConfirm").hide();
                $$("pnlLike").hide();
                $$("pnlDisLike").hide();
            })
            $('#backChoosePgm').click(function () {
                $$("pnlLoad").hide();
                $$("pnlHome").fadeIn();
                $$("pnlChoosePgm").fadeOut();
                $$("pnlDateSelection").hide();
                $$("pnlTrackSelection").hide();
                $$("pnlLikeConfirm").hide();
                $$("pnlDislikeConfirm").hide();
                $$("pnlLike").hide();
                $$("pnlDisLike").hide();
            })
            $('#backDateSelection').click(function () {
                $$("pnlLoad").hide();
                $$("pnlHome").hide();
                $$("pnlChoosePgm").fadeIn();
                $$("pnlDateSelection").fadeOut();
                $$("pnlTrackSelection").hide();
                $$("pnlLikeConfirm").hide();
                $$("pnlDislikeConfirm").hide();
                $$("pnlLike").hide();
                $$("pnlDisLike").hide();
            })
            $('#like_click').click(function () {
                if ($$("txtLikeEmail").value() == "" || $$("txtLikeEmail").value() == null || $$("txtLikeEmail").value() == undefined) {
                    alert("Enter your details!..");
                } else {
                    var data = {
                        event_run_id: page.event_run_id,
                        obj_id: page.obj_id,
                        cust_id: 1,//Change It
                        vote_count: 1,
                        source:"Mobile"
                    }
                    page.eventService.voteEventRun(data,function (data) {
                        alert("Your Like Added Successfully!...");
                        $$("pnlLoad").hide();
                        $$("pnlHome").hide();
                        $$("pnlDateSelection").hide();
                        $$("pnlTrackSelection").hide();
                        $$("pnlChoosePgm").fadeIn();
                        $$("pnlLikeConfirm").hide();
                        $$("pnlDislikeConfirm").hide();
                        $$("pnlLike").hide();
                        $$("pnlDisLike").hide();
                    });
                }
            })

            //page.events.btnShows_click();
        };
        page.events.loading_click = function () {
            $$("pnlLoad").fadeIn();
            $$("pnlHome").hide();
            $$("pnlDateSelection").hide();
            $$("pnlTrackSelection").hide();
            $$("pnlChoosePgm").hide();
            $$("pnlLikeConfirm").hide();
            $$("pnlDislikeConfirm").hide();
            $$("pnlLike").hide();
            $$("pnlDisLike").hide();
        }

        page.events.btnShows_click = function () {
            page.eventService.getEvents(function (data) {
                page.controls.grdShows.width("100%");
                page.controls.grdShows.setTemplate({
                    selection: "Single",
                    columns: [
                         { 'name': "", 'width': "100%", itemTemplate: "<div  id='pnlDetail' style=''></div>" },
                    ]
                });
                page.controls.grdShows.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "Vote") {
                        page.eventService.getUpcomingRuns(rowData.event_id, function (data) {
                            $$("pnlLoad").hide();
                            $$("pnlHome").hide();
                            $$("pnlDateSelection").fadeIn();
                            $$("pnlTrackSelection").hide();
                            $$("pnlChoosePgm").fadeOut();
                            $$("pnlLikeConfirm").hide();
                            $$("pnlDislikeConfirm").hide();
                            $$("pnlLike").hide();
                            $$("pnlDisLike").hide();
                            page.events.btnChooseDate_click(data);
                        })
                    }
                }
                $$("grdShows").rowBound = function (row, item) {
                   // $(data).each(function (i, items) {
                        var htmlTemplate = [];
                        htmlTemplate.push("<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'><span class='col-xs-12 col-sm-12 col-md-12 col-lg-12' id='shows-name'>" + item.event_name + "</span><img src='launcher.png' class='col-xs-12 col-sm-12 col-md-12 col-lg-12' /><span class='col-xs-9 col-sm-9 col-md-9 col-lg-9'>&nbsp;</span><span class='col-xs-3 col-sm-3 col-md-3 col-lg-3' id='vote-button' action='Vote'>Vote</span></div>");
                        $(row).find("[id=pnlDetail]").html(htmlTemplate.join(""));
                   // });
                }
                $$("grdShows").dataBind(data);
            })
            
            
        }

        page.events.btnChooseDate_click = function (data) {
            page.controls.grdChooseDate.width("100%");
            page.controls.grdChooseDate.setTemplate({
                selection: "Single",
                columns: [
                     { 'name': "", 'width': "100%", itemTemplate: "<div  id='pnlDetail' style=''></div>" },
                ]
            });
            $$("grdChooseDate").rowBound = function (row, item) {
                $(data).each(function (i, items) {
                    var htmlTemplate = [];
                    htmlTemplate.push("<div class='col-xs-6 col-md-6 col-sm-6 col-lg-6'><div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'><span class='label col-xs-12 col-sm-12 col-md-12 col-lg-12' id='start-date'> " + items.start_date + "</span><span class='label col-xs-12 col-sm-12 col-md-12 col-lg-12'id='start-time' >" + items.start_time + "</span></div></div>");
                    $(row).find("[id=pnlDetail]").html(htmlTemplate.join(""));
                });
            }
            $$("grdChooseDate").selectionChanged = function (row, item) {
                page.event_run_id = item.event_run_id;
                page.objectService.getObjects(function (data) {
                    $$("pnlLoad").hide();
                    $$("pnlHome").hide();
                    $$("pnlDateSelection").fadeOut();
                    $$("pnlTrackSelection").fadeIn();
                    $$("pnlChoosePgm").hide();
                    $$("pnlLikeConfirm").hide();
                    $$("pnlDislikeConfirm").hide();
                    $$("pnlLike").hide();
                    $$("pnlDisLike").hide();
                    page.events.pnlTrackSelection(data);
                })
            }
            $$("grdChooseDate").dataBind(data);
        }
        page.events.pnlTrackSelection = function (data) {
            page.controls.grdChooseTrack.width("100%");
            page.controls.grdChooseTrack.setTemplate({
                selection: "Single",
                columns: [
                     { 'name': "", 'width': "100%", itemTemplate: "<div  id='pnlDetail' style=''></div>" },
                ]
            });
            page.controls.grdChooseTrack.rowCommand = function (action, actionElement, rowId, row, rowData) {
                if (action == "Like") {
                    page.obj_id = rowData.obj_id;
                    $$("pnlLoad").hide();
                    $$("pnlHome").hide();
                    $$("pnlDateSelection").hide();
                    $$("pnlTrackSelection").fadeOut();
                    $$("pnlChoosePgm").hide();
                    $$("pnlLikeConfirm").fadeIn();
                    $$("pnlDislikeConfirm").hide();
                    $$("pnlLike").hide();
                    $$("pnlDisLike").hide();
                }
                if (action == "Dislike") {
                    page.obj_id = rowData.obj_id;
                    $$("pnlLoad").hide();
                    $$("pnlHome").hide();
                    $$("pnlDateSelection").hide();
                    $$("pnlTrackSelection").fadeOut();
                    $$("pnlChoosePgm").hide();
                    $$("pnlLikeConfirm").hide();
                    $$("pnlDislikeConfirm").fadeIn();
                    $$("pnlLike").hide();
                    $$("pnlDisLike").hide();
                }
            }
            $$("grdChooseTrack").rowBound = function (row, item) {
               // $(data).each(function (i, items) {
                    var htmlTemplate = [];
                    htmlTemplate.push("<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'><div class='col-xs-3 col-sm-3 col-md-3 col-lg-3'><img src='launcher.png' height='100px;' width='100px;' style='margin-left:-25px;' /></div><div class='col-xs-6 col-sm-6 col-md-6 col-lg-6' style='padding-left:10px;'><h3 style='color:orange;padding-left:10px;'>" + item.obj_type + "</h3><h5 style='color:blue;padding-left:10px;'>" + item.obj_name + "</h5></div><div  class='col-xs-3 col-sm-3 col-md-3 col-lg-3' style='margin-top:20px;'><img action='Like' src='like-icon.png' height='25px;' width='25px;' style='margin-bottom:5px;' /><br><img action='Dislike' src='Dislike.png' height='25px;' width='25px;' /></div>");
                    $(row).find("[id=pnlDetail]").html(htmlTemplate.join(""));
               // });
            }
            $$("grdChooseTrack").dataBind(data);
        }

    });
};