var Message = require('./message').Message;
var Types = require('./message').Types;
var net = require('net');
var bs = require('binaryjs')
var BinaryServer = bs.BinaryServer;

var Device = function(name, driver) {
  this.name = name;
  this.action = function(action, options, callback) {
    driver.action(name, action, options, callback);
  }
}
var TCPServer = function(drivers) {
  var server = net.createServer(function(socket){
    socket.on('data', function(data) {
      var obj = JSON.parse(data);
      if (!drivers[obj.name] || !drivers[obj.name][obj.action]) {
        socket.write(JSON.stringify({
          status : "failure"
        }));
        return;
      }
      drivers[obj.name][obj.action](obj.options, function(results) {
        socket.write(JSON.stringify(results));
      });
    })
  });
  this.listen = function(port) {
    server.listen(port);
    console.log("Remote listening on %s", port);
  }
}
var TCPClient = function(ip, port, callback) {
  var client = new net.Socket();
  client.connect(port, ip, function() {
  });
  client.on('data', function(data) {
    var result = JSON.parse(data);
    //client.destroy();
    if (callback)
      callback(result);
  })
  this.action = function(name, action, options) {
    var obj = {
      name : name,
      action : action,
      options : options
    }
    var write = JSON.stringify(obj);
    client.write(write);
  }
}

var BinaryClient = function(p) {
  var clients = {};
  var sessions = {};
  this.action = function(name, action, options, callback) {
    console.log(clients, name);
    if (clients[name]) {
      for (var client in clients[name]) {
        var data = {
          name : name,
          action : action,
          options : options
        }
        var message = Message(Types.METHOD, data);
        var stream = clients[name][client].send(message);
        stream.on('data', function(data) {
          var obj = JSON.parse(data);
          callback(obj);
        });
      }
    }
  }

  var generate = function() {
    return Math.ceil(Math.random() * 1000)
  }

  var listen = function(port) {
    server = new BinaryServer({ port : port });
    server.on('connection', function(client) {
      var ip = client._socket._socket.remoteAddress;
      console.log("Binary conn from", ip);
      var data = {
      }
      var message = Message(Types.OFFER, data);
      console.log("Creating offer", message);
      var stream = send(message);
      stream.on('data', function(data) {
        var obj = JSON.parse(data);
        if (obj.type == Types.REGISTRATION) {
          console.log("Received registration", obj);
          response = obj.data;
          clients[obj.data.name] = client;
        }
      });
      client.on('close', function() {
        delete clients[id];
      });
    });

  }
  var send = function(data) {
    return stream.write(JSON.stringify(data));
  }
  listen(p);
}

var LocalClient = function(drivers) {
  this.action = function(name, action, options, callback) {
    drivers[name][action](options, callback);
  }
}
if (module) {
  module.exports = {
    Driver : {
      TCP : TCPServer,
    },
    Device : Device,
    Client : {
      TCP : TCPClient,
      Local : LocalClient,
      Binary : BinaryClient
    }
  }
}
