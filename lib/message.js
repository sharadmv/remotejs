var Types = {
    "REGISTRATION" : "register",
    "METHOD" : "method",
    "OFFER" : "offer",
    "FAILED" : "failed",
    "ACK" : "ACK"
};
var Message = function(type, data, id) {
    this.type = type;
    this.data = data;
    this.id = id;
};

(function(exports){
    exports.Types = Types;
    exports.Message = Message;
})(typeof(exports)=== 'undefined' ? this['mymodule']={} : exports);
