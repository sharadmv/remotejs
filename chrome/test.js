var devices = {
  remote : {
    toggle : function(options, callback) {
      console.log("Toggled!")
    }
  }
}
window.blah = new Message(Types.REGISTRATION, {});
var br = new BinaryRemote("remote","localhost",  9000, devices);
