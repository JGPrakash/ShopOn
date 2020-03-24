function CustomerGroupService() {
    this.getGroups = function (callback) {
        var map = new Map();
        $.server.webMethod("CustomerGroup.getGroups", map.toString(), callback);
    };

    this.getGroupSearch = function (term, callback) {
        $.server.webMethod("CustomerGroup.getGroupSearch", "term;%" + term + "%", callback);
    }
    
    this.getGroupsById = function (data,callback) {
        var map = new Map();
        map.add("group_id", data);
        $.server.webMethod("CustomerGroup.getGroupsById", map.toString(), callback);
    };
    this.getGroupsCustByAll = function (data, callback) {
        var map = new Map();
        map.add("group_id", data);
        $.server.webMethod("CustomerGroup.getGroupsCustByAll", map.toString(), callback);
    }
    this.getAllMember = function (callback) {
        var map = new Map();
        $.server.webMethod("MemberGroup.getAllMember", "term;%" + term + "%", callback);
    };
    this.getAddressOfMem = function (mem_id, callback) {
        var map = new Map();
        map.add("mem_id", mem_id);
        $.server.webMethod("MemberGroup.getAddressOfMem", map.toString(), callback);
    };
    this.getRelationOfMem = function (mem_id_from, callback) {
        var map = new Map();
        map.add("mem_id_from", mem_id_from);
        $.server.webMethod("MemberGroup.getRelationOfMem", map.toString(), callback);
    };
    this.getMemberByAll = function (term, callback) {
        $.server.webMethod("MembeGroup.getMemberByAll", "term;%" + term + "%", callback);
    };
    this.getMemberSAll = function (term, callback) {
        if (term == -1)
            $.server.webMethod("MemberGroup.getMemberSAll", "term;" + term, callback);
        else
            $.server.webMethod("MemberGroup.getMemberByAll", "term;" + term, callback);
    };

    this.getMemberIdSAll = function (term, callback) {
        if (term == -1)
            $.server.webMethod("MemberGroup.getMemberSAll", "term;" + term, callback);
        else
            $.server.webMethod("MemberGroup.getMemberIdSAll", "term;" + term, callback);
    };
    this.getMembersByAll = function (term, callback) {
        $.server.webMethod("MemberGroup.getMembersByAll", "term;%" + term, callback);
    };
    this.getMemberNameByAll = function (term, callback) {
        if (term == -1)
            $.server.webMethod("MemberGroup.getMemberSAll", "term;" + term, callback);
        else
            $.server.webMethod("MemberGroup.getMemberNameByAll", "term;%" + term, callback);
    };

    this.insertGroup = function (data, callback) {
        var map = new Map();
        map.add("group_name", data, 'Text');
        map.add("description", data, 'Text');
        $.server.webMethod("CustomerGroup.insertGroup", map.toString(), callback);
    }
    this.updateGroup = function (data, callback) {
        var map = new Map();
        map.add("group_id", data.group_id);
        map.add("group_name", data.group_name, 'Text');
        $.server.webMethod("CustomerGroup.updateGroup", map.toString(), callback);
    }
    this.removeGroup = function (data, callback) {
        var map = new Map();
        map.add("group_id", data.group_id);
        $.server.webMethod("CustomerGroup.removeGroup", map.toString(), callback);
    }
    this.insertGrpCust = function (data, callback) {
        var map = new Map();
        map.add("group_id", data.group_id);
        map.add("cust_no", data.cust_no);
        $.server.webMethod("CustomerGroup.insertGrpCust", map.toString(), callback);
    }
    this.updateGrpCust = function (data, callback) {
        var map = new Map();
        map.add("group_cust_id", data.group_cust_id);
        map.add("group_id", data.group_id);
        map.add("cust_no", data.cust_no);
        $.server.webMethod("CustomerGroup.updateGrpCust", map.toString(), callback);
    }
    this.deleteGrpCust = function (data, callback) {
        var map = new Map();
        map.add("group_cust_id", data.group_cust_id);
        $.server.webMethod("CustomerGroup.deleteGrpCust", map.toString(), callback);
    }
    this.getGrpCust = function (data, callback) {
        var map = new Map();
        map.add("group_id", data.group_id);
        map.add("cust_no", data.cust_no);
        $.server.webMethod("CustomerGroup.getGrpCust", map.toString(), callback);
    }
    this.getCustomerByAll = function (term, callback) {
        $.server.webMethod("CustomerGroup.getCustomerByAll", "term;%" + term + "%", callback);
    };
    this.getGrpCustById = function (data, callback) {
        var map = new Map();
        map.add("group_cust_id", data);
        $.server.webMethod("CustomerGroup.getGrpCustById", map.toString(), callback);
    }
}