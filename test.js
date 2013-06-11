var Devices = require('./lib/device');

var chrome = new Devices.Client.Binary(9000);
var remote = new Devices.Device("remote", chrome);


var drivers = {
  test : {
    tap : function(options, callback) {
        callback({});
    }
  }
}

var server = new Devices.Driver.TCP(drivers);
server.listen(8080);

var client = new Devices.Client.TCP('localhost', 8080, function(results){

});
var tapper = new Devices.Device("test", client);

setInterval(function() {
    tapper.action('tap', {}, function() {
      console.log('tapped');
    });
    remote.action('toggle', {}, function() {
      console.log('toggled');
    });
}, 1000);
