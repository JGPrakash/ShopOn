/*var Android = {
    webMethod: function (methodName, methodParam) {
        if (methodName == 'getCustomer') {
            return [{ 'cust_id': '' , 'cust_name': '' },{ 'cust_id': '3' , 'cust_name': 'rrrR' },{ 'cust_id': '3' , 'cust_name': 'rrrR' }];
        } else if (methodName == 'getStatus') {
            return [{ 'status_id': '' , 'status_name': '' },{ 'status_id': '3' , 'status_name': 'rrrR' },{ 'status_id': '3' , 'status_name': 'rrrR' }];
        } else if (methodName == 'getOrders') {
            return [{ 'order_id': '' , 'ordered_date': '' },{ 'order_id': '3' , 'ordered_date': 'rrrR' },{ 'order_id': '3' , 'ordered_date': 'rrrR' }];
        } else if (methodName == 'getSummary') {
            return {status:'eee',total:'444',paid_now:'300',tray_in:5,tray_out:3};
        }
        else if (methodName == 'getItems') {
 return [{ 'item_name': 'Egg Tray1' , 'qty': '2','cost':'500' },{ 'item_name': 'Egg Tray1' , 'qty': '2','cost':'500' },
 { 'item_name': 'Egg Tray1' , 'qty': '2','cost':'500' }
 ];
        }

    }

}; */
$(document).ready(function(){
    $('#load').hide();
});

function Download_click(){
    Android.download();
    page_load();
}
function pay_click() {
    var d = prompt("Pay", "Enter amount");
    if (d != null) {
        alert("Paid");
    }

}
function deliver_click() {
    alert("Delivered");
}
function in_click() {
    var d = prompt("Tray", "Enter tray delivered");
    if (d != null) {
        alert("TRay delivered");
    }
}
function out_click() {
    var d = prompt("Tray", "Enter tray returned");
    if (d != null) {
        alert("Tray returned");
    }
}
function customer_change() {
    var data =  Android.webMethod("getStatus", document.getElementById("ddlCustomers").value);
    data=eval(data);
    var ddlCustomers = document.getElementById("ddlStatus");
    ddlCustomers.innerHTML = "";
    for (var i = 0; i < data.length; i++) {
        ddlCustomers.innerHTML = ddlCustomers.innerHTML + "<option value='" + data[i].status_id + "'>" + data[i].status_name + "</option>";
    }
}
function status_change() {
    var data = Android.webMethod("getOrders", document.getElementById("ddlCustomers").value + "," + document.getElementById("ddlStatus"));
    data=eval(data);
    var ddlCustomers = document.getElementById("ddlOrders");
    ddlCustomers.innerHTML = "";
    for (var i = 0; i < data.length; i++) {
        ddlCustomers.innerHTML = ddlCustomers.innerHTML + "<option value='" + data[i].order_id + "'>" + data[i].ordered_date + "</option>";
    }
}
function order_change() {
    var data = Android.webMethod("getSummary", "");
    data=eval(data);
    document.getElementById("lblTotal").innerHTML = data.total;
    document.getElementById("lblStatus").innerHTML = data.status;
    document.getElementById("lblPaidNow").innerHTML = data.paid_now;
    document.getElementById("lblTrayIn").innerHTML = data.tray_in;
    document.getElementById("lblTrayOut").innerHTML = data.tray_out;


    data = Android.webMethod("getItems", "");
    data=eval(data);
    var pnlGrid = document.getElementById("pnlGrid");
    pnlGrid.innerHTML = "<div>            <span>Item Name</span>            <span>Qty</span>            <span>Cost</span>         </div>";
    for (var i = 0;i< data.length; i++) {

        pnlGrid.innerHTML = pnlGrid.innerHTML + "<div>            <span>" + data[i].item_name + "</span>            <span>" + data[i].qty + "</span>            <span>" + data[i].cost + "</span>         </div>";

    }

}


 function page_load() {
try{
    var data = Android.webMethod("getCustomer", "");

    data=eval(data);
    var ddlCustomers = document.getElementById("ddlCustomers");
    ddlCustomers.innerHTML = "";
    for (var i = 0; i < data.length; i++) {
        ddlCustomers.innerHTML = ddlCustomers.innerHTML + "<option value='" + data[i].cust_id + "'>" + data[i].cust_name + "</option>";
    }
    alert("hello");
    daySelectGrid();



}catch(e){alert(e);}


};

function proceed(){
window.location.href = "/" + appConfig.root + "/login/view/home-page/home-page.html";
}
$("button").click(function(){
window.location.href = "/" + appConfig.root + "/shopon/view.sales/home/home.html";
})

window.onload =page_load;
function showAndroidToast(toast) {
    var data = Android.webMethod("", "");
    document.getElementById("FF").innerHTML = data;
    alert(data);
}

    function daySelectGrid {
alert("entered");
        $("#jsGrid").jsGrid({
            height: "90%",
            width: "100%",

            filtering: true,
            editing: true,
            sorting: true,
            paging: true,
            autoload: true,

            pageSize: 15,
            pageButtonCount: 5,

            deleteConfirm: "Do you really want to delete the client?",

            controller: db,

            fields: [
                { name: "Name", type: "text", width: 150 },
                { name: "Age", type: "number", width: 50 },
                { name: "Address", type: "text", width: 200 },
                { name: "Country", type: "select", items: db.countries, valueField: "Id", textField: "Name" },
                { name: "Married", type: "checkbox", title: "Is Married", sorting: false },
                { type: "control" }
            ]
        });

    });