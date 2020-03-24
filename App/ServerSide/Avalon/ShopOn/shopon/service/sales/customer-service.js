function CustomerService() {

    this.getCustomerByAll = function (term, callback) {

        if (term == null) {
            term = "";
        }
        if (androidApp == true) {

            AndroidProxy.execute("select cust_no  ,cust_name from local_customer_t lct", function (data) {

                $(data).each(function (i, item) {
                    item.cust_no = item.cust_no;
                });
                callback(data);
            });
            // callback( eval(Android.execute("select * from customer_t")));


        } else {
            $.server.webMethod("Customer.getCustomerByAll", "term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);
        }

    }
    this.getCustomersByAll = function (term, callback) {

        if (term == null) {
            term = "";
        }
        if (androidApp == true) {

            AndroidProxy.execute("select cust_no  ,cust_name from local_customer_t lct", function (data) {

                $(data).each(function (i, item) {
                    item.cust_no = item.cust_no;
                });
                callback(data);
            });
            // callback( eval(Android.execute("select * from customer_t")));


        } else {
            $.server.webMethod("Customer.getCustomersByAll", "term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);
        }

    }
    this.getCustomerSalesByAll = function (term, callback) {
        $.server.webMethod("Customer.getCustomerSalesByAll", "term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);
    }
    this.getActiveCustomer = function (term, callback) {
        $.server.webMethod("Customer.getActiveCustomer", "term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);
    }
    this.getActiveCustomerArea = function (callback) {
        return $.server.webMethod("Customer.getActiveCustomerArea", JSON.stringify({}), callback);
    }
    this.getCustomerByNo = function (cust_no, callback) {
        var map = new Map();
        map.add("cust_no", cust_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Customer.getCustomerByNo", map.toString(), callback);
    };

    this.updateCustomer = function (data, callback) {
        var map = new Map();
        map.add("cust_no", data.cust_no);
        map.add("first_name", data.first_name, "Text");
        map.add("last_name", data.last_name, "Text");
        map.add("company", data.company, "Text");
        if (data.date_of_birth != '')

            map.add("date_of_birth", data.date_of_birth, "Date");
        map.add("address1", data.address1, "Text");
        map.add("address2", data.address2, "Text");
        map.add("city", data.city, "Text");
        map.add("state", data.state, "Text");
        map.add("zip_code", data.zip_code, "Text");
        map.add("phone_no", data.phone_no, "Text");
        map.add("alter_mobile", data.alter_mobile, "Text");
        map.add("landline_no", data.landline_no, "Text");
        map.add("email", data.email, "Text");
        map.add("mobile_comm", data.mobile_comm, "Text");
        map.add("email_comm", data.email_comm, "Text");
        map.add("cus_active", data.cus_active, "Text");
        //Bank Details
        if (data.bank_name != undefined)
            map.add("bank_name", data.bank_name, "Text");
        if (data.account_no != undefined)
            map.add("account_no", data.account_no, "Text");
        if (data.ifsc_code != undefined)
            map.add("ifsc_code", data.ifsc_code, "Text");
        if (data.gst_no != undefined)
            map.add("gst_no", data.gst_no, "Text");
        if (data.license_no != undefined)
            map.add("license_no", data.license_no, "Text");
        if (data.area != undefined)
            map.add("area", data.area, "Text");
        if (data.pan_no != undefined)
            map.add("pan_no", data.pan_no, "Text");
        if (data.aadar_no != undefined)
            map.add("aadar_no", data.aadar_no, "Text");
        if (data.tin_no != undefined)
            map.add("tin_no", data.tin_no, "Text");
        if (data.vehicle_no != undefined)
            map.add("vehicle_no", data.vehicle_no, "Text");
        //reward plans

        map.add("reward_plan_id", data.reward_plan_id, "Text");

        $.server.webMethod("Customer.updateCustomer", map.toString(), callback);
    }

    this.deleteCustomer = function (data, callback) {
        var map = new Map();
        map.add("cust_no", data);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Customer.deleteCustomer", map.toString(), callback);
    }

    this.insertCustomer = function (data, callback) {
        //var map = new Map();
        //if (data.first_name != undefined)
        //    map.add("first_name", data.first_name, "Text");
        //if (data.last_name != undefined)
        //    map.add("last_name", data.last_name, "Text");
        //if (data.company != undefined)
        //    map.add("company", data.company, "Text");
        //if (data.date_of_birth != '' && data.date_of_birth != undefined)
        //    map.add("date_of_birth", data.date_of_birth, "Date");
        //if (data.address1 != undefined)
        //    map.add("address1", data.address1, "Text");
        //if (data.address2 != undefined)
        //    map.add("address2", data.address2, "Text");
        //if (data.city != undefined)
        //    map.add("city", data.city, "Text");
        //if (data.state != undefined)
        //    map.add("state", data.state, "Text");
        //if (data.zip_code != undefined)
        //    map.add("zip_code", data.zip_code, "Text");
        //if (data.phone_no != undefined)
        //    map.add("phone_no", data.phone_no, "Text");
        //if (data.alter_mobile != undefined)
        //    map.add("alter_mobile", data.alter_mobile, "Text");
        //if (data.landline_no != undefined)
        //    map.add("landline_no", data.landline_no, "Text");
        //if (data.email != undefined)
        //    map.add("email", data.email, "Text");
        //if (data.mobile_comm != undefined)
        //    map.add("mobile_comm", data.mobile_comm, "Text");
        //if (data.email_comm != undefined)
        //    map.add("email_comm", data.email_comm, "Text");
        ////Bank Details
        //if (data.bank_name != undefined)
        //    map.add("bank_name", data.bank_name, "Text");
        //if (data.account_no != undefined)
        //    map.add("account_no", data.account_no, "Text");
        //if (data.ifsc_code != undefined)
        //    map.add("ifsc_code", data.ifsc_code, "Text");
        //if (data.gst_no != undefined)
        //    map.add("gst_no", data.gst_no, "Text");
        //if (data.license_no != undefined)
        //    map.add("license_no", data.license_no, "Text");
        //if (data.area != undefined)
        //    map.add("area", data.area, "Text");
        //if (data.pan_no != undefined)
        //    map.add("pan_no", data.pan_no, "Text");
        //if (data.aadar_no != undefined)
        //    map.add("aadar_no", data.aadar_no, "Text");
        //if (data.tin_no != undefined)
        //    map.add("tin_no", data.tin_no, "Text");
        //if (data.vehicle_no != undefined)
        //    map.add("vehicle_no", data.vehicle_no, "Text");
        //// map.add("cus_active", data.cus_active);
        ////reward plans
        //if (data.reward_plan_id != undefined)
        //    map.add("reward_plan_id", data.reward_plan_id, "Text");
        //map.add("comp_id", getCookie("user_company_id"));

        //$.server.webMethod("Customer.insertCustomer", map.toString(), callback);
        $.server.webMethodPOST("shopon/customer/", data, callback);

        
    }

    this.getCustomerById = function (data, callback) {

        return $.server.webMethod("Customer.getCustomerById", "cust_no;" + data + ",comp_id;" + getCookie("user_company_id"), callback);
    }


    this.getAllCustomer = function (callback) {
        var map = new Map();
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Customer.getAllCustomer", map.toString(), callback);
    };
    this.getCityByAll = function (term, callback) {
        $.server.webMethod("Customer.getCityByAll", "term;%" + term + "%", callback);
    };
    this.getStateByAll = function (term, callback) {
        $.server.webMethod("Customer.getStateByAll", "term;%" + term + "%", callback);
    };
    //reward plans
    this.getRewardByAll = function (term, callback) {
        $.server.webMethod("Customer.getRewardByAll", "term;%" + term + "%", callback);
    };

    this.getPointTransaction = function (cust_no, callback) {
        var map = new Map();
        map.add("cust_no", cust_no);
       // map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Customer.getPointTransaction", map.toString(), callback);
    };
    this.getTotalPoint = function (cust_no, callback) {
        var map = new Map();
        map.add("cust_no", cust_no);
       // map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Customer.getTotalPoint", map.toString(), callback);
    };
    this.getTotalPoints = function (term, callback) {

        $.server.webMethod("Customer.getTotalPoints", "term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);
    };
    this.insertCustomerRewardt = function (data, callback) {
        var map = new Map();
        map.add("cust_no", data.cust_no, "Text");
        map.add("trans_date", data.trans_date, "Date");
        map.add("bill_no", data.bill_no, "Text");
        map.add("reward_plan_id", data.reward_plan_id, "Text");
        map.add("points", data.points, "Text");
        map.add("trans_type", data.trans_type, "Text");
        //map.add("description", data.description, "Text");
        map.add("setteled_amount", data.setteled_amount, "Text");
        if (data.description != "" && data.description != null && typeof data.description != "undefined")
            map.add("setteled_amount", data.description, "Text");
        $.server.webMethod("Customer.insertCustomerRewardt", map.toString(), callback);
    }

    this.insertState = function (state_name, callback) {
        var map = new Map();
        map.add("state_name", state_name, "Text");
        map.add("country", "India", "Text");
        $.server.webMethod("Customer.insertState", map.toString(), callback);
    };
    this.insertCity = function (data, callback) {
        var map = new Map();
        map.add("city_name", data.city_name,"Text");
        map.add("state_name", data.state_name,"Text");
        $.server.webMethod("Customer.insertCity", map.toString(), callback);
    };

    this.getPincodeMapping = function (term, callback) {
        $.server.webMethod("Customer.getPincodeMapping", "term;" + term + "%", callback);
    };
}