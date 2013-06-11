var Devices = require('./lib/device');

var chrome = new Devices.Client.Binary(9000);
var remote = new Devices.Device("remote", chrome);
console.log(remote);

setInterval(function() {
    console.log("Toggled!");
    remote.action('toggle', {}, function() {
        console.log('ack');
    });
}, 1000);
