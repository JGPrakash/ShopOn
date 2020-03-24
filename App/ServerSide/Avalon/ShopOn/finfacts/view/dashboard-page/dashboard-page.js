/// <reference path="../sales-pos/sales-pos.html" />

$.fn.dashBoardPage = function () {
    return $.pageController.getControl(this, function (page, $$) {
        //Import Services required
        page.salesService = new SalesService();
        page.purchaseService = new PurchaseService();
        page.accaccountService = new AccAccountService();
        page.dashboardService = new DashboardService();
        page.revenueService = new RevenueService();
        page.events = {

            page_load: function () {
                page.events.viewGraph();
                page.controls.grdAccountDetails.width("100%");
                page.controls.grdAccountDetails.height("230px");
                page.controls.grdAccountDetails.setTemplate({
                    selection: "Single",
                    columns: [
                            { 'name': "Account Name", 'width': "65%", 'dataField': "acc_name" },
                            { 'name': "Balance", 'width': "25%", 'dataField': "balance" }

                    ]
                });
                $$("grdAccountDetails").dataBind([]);

                page.controls.grdIncomeDetails.width("100%");
                page.controls.grdIncomeDetails.height("240px");
                page.controls.grdIncomeDetails.setTemplate({
                    selection: "Single",
                    columns: [
                            { 'name': "Account Name", 'width': "65%", 'dataField': "acc_name" },
                            { 'name': "Amount", 'width': "25%", 'dataField': "amount" }
                    ]
                });
                $$("grdIncomeDetails").dataBind([]);

                page.salesService.getTotalSalesDashBoard(function (data) {
                    data = data[0];
                    //$$("lblTodayTotSales").selectedObject.html(data.todaytotalsales);
                    //$$("lblTodayTotReturn").selectedObject.html(data.todaytotalreturn);
                    //$$("lblMonthlyTotSales").selectedObject.html(data.monthlytotalsales);
                    //$$("lblMonthlyTotReturn").selectedObject.html(data.monthlytotalreturn);
                });
                page.accaccountService.getAccDetByCompId(1,function (data) {
                    $$("grdAccountDetails").dataBind(data);
                });
                page.accaccountService.getOneWeekTransaction(1, "Debit", function (data) {
                    $$("grdIncomeDetails").dataBind(data);
                });
                page.controls.grdOutcomeDetails.width("100%");
                page.controls.grdOutcomeDetails.height("240px");
                page.controls.grdOutcomeDetails.setTemplate({
                    selection: "Single",
                    columns: [
                            { 'name': "Account Name", 'width': "65%", 'dataField': "acc_name" },
                            { 'name': "Amount", 'width': "25%", 'dataField': "amount" }

                    ]
                });
                $$("grdOutcomeDetails").dataBind([]);

                page.accaccountService.getOneWeekTransaction(1, "Credit", function (data) {
                    $$("grdOutcomeDetails").dataBind(data);
                });

                page.accaccountService.getAmountDetailsByComp(1, function (data) {
                    page.credit = data[0].credit;
                    page.debit = data[0].debit;
                    page.balance = data[0].balance;
                    $$("lblBalance").value(data[0].balance);
                    $$("lblIncome").value(data[0].debit);
                    $$("lblOutcome").value(data[0].credit);
                });

                //Recent Sales
                //page.controls.grdRecentSales.width("100%");
                //page.controls.grdRecentSales.setTemplate({
                //    selection: "Single",
                //    columns: [
                //            { 'name': "Order Id", 'width': "80px", 'dataField': "order_id" },
                //            { 'name': "Quantity", 'width': "80px", 'dataField': "qty" },
                //            { 'name': "Total Price", 'width': "90px", 'dataField': "price" },
                //            { 'name': "Status", 'width': "80px", 'dataField': "state_text" },
                //            { 'name': "Total Paid", 'width': "100px", 'dataField': "total_paid_amount" },
                //    ]
                //});
                //$$("grdRecentSales").dataBind([]);

                //page.salesService.getRecentSales(function (data) {
                //    $$("grdRecentSales").dataBind(data);
                //});

                ////Recent Purchase
                //page.controls.grdRecentPurchase.width("100%");
                //page.controls.grdRecentPurchase.setTemplate({
                //    selection: "Single",
                //    columns: [
                //            { 'name': "Order Id", 'width': "80px", 'dataField': "po_no" },
                //            { 'name': "Quantity", 'width': "80px", 'dataField': "qty" },
                //            { 'name': "Total Price", 'width': "90px", 'dataField': "price" },
                //            { 'name': "Status", 'width': "80px", 'dataField': "state_text" },
                //            { 'name': "Total Paid", 'width': "100px", 'dataField': "total_paid_amount" },
                //    ]
                //});
                //$$("grdRecentPurchase").dataBind([]);

                //page.purchaseService.getRecentPurchase(function (data) {
                //    $$("grdRecentPurchase").dataBind(data);
                //});
                //page.events.getGraphData();
            }
        }
        //page.events.viewGraph = function() {
        //    $('.column').css('height', '0');
        //    $('table tr').each(function (index) {
        //        var ha = $(this).children('td').eq(1).text();
        //        $('#col' + index).animate({ height: ha }, 1500).html("<div>" + ha + "</div>");
        //    });
        //}
        //page.events.getGraphData = function () {
        //    page.dashboardService.getCurrentPeriodByUser(1, function (data) {
        //        page.dashboardService.getRevenueAccountByMonWise(data[0].per_id, function (data) {
        //            $('.column').css('height', '0');
        //                $(data).each(function (i,index) {
        //                    var ha = parseInt(index.amount);
        //                    $('#col' + index).animate({ height: ha }, 1500).html("<div>" + ha + "</div>");
        //                });
        //        });
        //    })
        //}

        page.events.viewGraph = function () {
            var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var color = Chart.helpers.color;
            var horizontalBarChartData = {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: 'Dataset 1',
                    backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                    borderColor: window.chartColors.red,
                    borderWidth: 1,
                    data: [
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor()
                    ]
                }, {
                    label: 'Dataset 2',
                    backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                    borderColor: window.chartColors.blue,
                    data: [
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor()
                    ]
                }]

            };

            window.onload = function () {
                var ctx = document.getElementById("canvas").getContext("2d");
                window.myHorizontalBar = new Chart(ctx, {
                    type: 'horizontalBar',
                    data: horizontalBarChartData,
                    options: {
                        // Elements options apply to all of the options unless overridden in a dataset
                        // In this case, we are setting the border of each horizontal bar to be 2px wide
                        elements: {
                            rectangle: {
                                borderWidth: 2,
                            }
                        },
                        responsive: true,
                        legend: {
                            position: 'right',
                        },
                        title: {
                            display: true,
                            text: 'Chart.js Horizontal Bar Chart'
                        }
                    }
                });

            };

            document.getElementById('randomizeData').addEventListener('click', function () {
                var zero = Math.random() < 0.2 ? true : false;
                horizontalBarChartData.datasets.forEach(function (dataset) {
                    dataset.data = dataset.data.map(function () {
                        return zero ? 0.0 : randomScalingFactor();
                    });

                });
                window.myHorizontalBar.update();
            });

            var colorNames = Object.keys(window.chartColors);

            document.getElementById('addDataset').addEventListener('click', function () {
                var colorName = colorNames[horizontalBarChartData.datasets.length % colorNames.length];;
                var dsColor = window.chartColors[colorName];
                var newDataset = {
                    label: 'Dataset ' + horizontalBarChartData.datasets.length,
                    backgroundColor: color(dsColor).alpha(0.5).rgbString(),
                    borderColor: dsColor,
                    data: []
                };

                for (var index = 0; index < horizontalBarChartData.labels.length; ++index) {
                    newDataset.data.push(randomScalingFactor());
                }

                horizontalBarChartData.datasets.push(newDataset);
                window.myHorizontalBar.update();
            });

            document.getElementById('addData').addEventListener('click', function () {
                if (horizontalBarChartData.datasets.length > 0) {
                    var month = MONTHS[horizontalBarChartData.labels.length % MONTHS.length];
                    horizontalBarChartData.labels.push(month);

                    for (var index = 0; index < horizontalBarChartData.datasets.length; ++index) {
                        horizontalBarChartData.datasets[index].data.push(randomScalingFactor());
                    }

                    window.myHorizontalBar.update();
                }
            });

            document.getElementById('removeDataset').addEventListener('click', function () {
                horizontalBarChartData.datasets.splice(0, 1);
                window.myHorizontalBar.update();
            });

            document.getElementById('removeData').addEventListener('click', function () {
                horizontalBarChartData.labels.splice(-1, 1); // remove the label first

                horizontalBarChartData.datasets.forEach(function (dataset, datasetIndex) {
                    dataset.data.pop();
                });

                window.myHorizontalBar.update();
            });
        }
    
    });

    
}




