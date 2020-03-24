function MemberPromotionService() {
    this.getMembers = function (term, callback) {
        $.server.webMethod("MemberPromotion.getMembers", "term;%" + term + "%", callback);
    };
    this.getAllMember = function (callback) {
        var map = new Map();
        $.server.webMethod("MemberPromotion.getAllMember", "term;%" + term + "%", callback);
    };
    this.getAddressOfMem = function (mem_id, callback) {
        var map = new Map();
        map.add("mem_id", mem_id);
        $.server.webMethod("MemberPromotion.getAddressOfMem", map.toString(), callback);
    };
    this.getRelationOfMem = function (mem_id_from, callback) {
        var map = new Map();
        map.add("mem_id_from", mem_id_from);
        $.server.webMethod("MemberPromotion.getRelationOfMem", map.toString(), callback);
    };
    this.getMemberByAll = function (term, callback) {
        $.server.webMethod("MemberPromotion.getMemberByAll", "term;%" + term + "%", callback);
    };
    this.getMemberSAll = function (term, callback) {
        if (term == -1)
            $.server.webMethod("MemberPromotion.getMemberSAll", "term;" + term, callback);
        else
            $.server.webMethod("MemberPromotion.getMemberByAll", "term;" + term, callback);
    };
    
    this.getMemberIdSAll = function (term, callback) {
        if (term == -1)
            $.server.webMethod("MemberPromotion.getMemberSAll", "term;" + term, callback);
        else
            $.server.webMethod("MemberPromotion.getMemberIdSAll", "term;" + term, callback);
    };
    this.getMembersByAll = function (term, callback) {
        $.server.webMethod("MemberPromotion.getMembersByAll", "term;%" + term, callback);
    };
    this.getMemberNameByAll = function (term, callback) {
        if (term == -1)
            $.server.webMethod("MemberPromotion.getMemberSAll", "term;" + term, callback);
        else
            $.server.webMethod("MemberPromotion.getMemberNameByAll", "term;%" + term, callback);
    };
}