var driver = {
  toggle : function(options, callback) {
    console.log("Toggled!")
    callback({});
  }
}
var br = new BinaryRemote("remote","localhost",  9000, driver);
