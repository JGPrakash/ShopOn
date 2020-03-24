function EventService() {

    this.getEvents = function(callback) {
        var map = new Map();

        $.server.webMethod("Selfie.getEvents", map.toString(), callback);
    }

    this.getUpcomingRuns = function(event_id, callback) {
        var map = new Map();
        map.add("event_id", event_id);
        $.server.webMethod("Selfie.getUpcomingRuns", map.toString(), callback);
    }

    //voteObject :  event_run_id,obj_id,cust_id,vote
    this.voteEventRun = function (voteObject, callback) {
        var map = new Map();
        map.add("event_run_id", voteObject.event_run_id);
        map.add("obj_id", voteObject.obj_id);
        map.add("cust_id", voteObject.cust_id);
        map.add("vote_count", voteObject.vote_count);
        map.add("source", voteObject.source,"Text");
        $.server.webMethod("Selfie.insertLike", map.toString(), callback);
    }

}