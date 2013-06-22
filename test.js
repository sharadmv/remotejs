var Devices = require('./lib/device');

var chrome = new Devices.Client.Binary(9000);
var remote = new Devices.Device("remote", chrome);


var drivers = {
  test : {
    tap : function(options, callback) {
      console.log("Tapped");
      callback({
          message : "sid is awesome"
      });
    }
  }
}

var server = new Devices.Driver.TCP(drivers);
server.listen(8080);

//var client = new Devices.Client.TCP('10.0.0.10', 8080, function(results){

//});
//var tapper = new Devices.Device("awesome", client);

//setInterval(function() {
    //tapper.action('print', {}, function() {
      //console.log('Printed');
    //});
//}, 1000);
