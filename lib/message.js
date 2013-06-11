var Types = {
  "REGISTRATION" : "register",
  "METHOD" : "method",
  "OFFER" : "offer"
}
var Message = function(type, data) {
  this.type = type;
  this.data = data;
}

module.exports = {
  Types : Types,
  Message : Message
}
