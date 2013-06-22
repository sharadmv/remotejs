var Message = require('./message').Message;
var Types = require('./message').Types;
var net = require('net');
var BinaryServer = require('binaryjs').BinaryServer;

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
            if (!drivers[obj.data.name] || !drivers[obj.data.name][obj.data.action]) {
                socket.write(JSON.stringify({
                    status : "failure"
                }));
                return;
            }
            drivers[obj.data.name][obj.data.action](obj.data.options, function(results) {
                var message = new Message(Types.ACK, results, obj.data.id);
                socket.write(JSON.stringify(message));
            });
        })
    });
    this.listen = function(port) {
        server.listen(port);
        console.log("Remote listening on %s", port);
    }
}
var TCPClient = function(ip, port) {
    var messageId = 0;
    var client = new net.Socket();
    var callbacks = {};
    client.connect(port, ip, function() {
    });
    client.on('data', function(data) {
        var result = JSON.parse(data);
        if (result.type == Types.ACK) {
            callbacks[result.id](result.data)
            delete callbacks[result.id]
        }
    })
    this.action = function(name, action, options, callback) {
        var obj = {
            name : name,
            action : action,
            options : options,
            id : messageId
        }
        var message = new Message(Types.METHOD, obj);
        client.write(JSON.stringify(message));
        callbacks[messageId] = callback;
        messageId++;
    }
}

var BinaryClient = function(p) {
    var clients = {};
    var sessions = {};
    this.action = function(name, action, options, callback) {
        if (clients[name]) {
            var data = {
                name : name,
                action : action,
                options : options
            }
            var message = new Message(Types.METHOD, data);
            var stream = clients[name].send(JSON.stringify(message));
            stream.on('data', function(data) {
                var obj = JSON.parse(data);
                if (obj.type == Types.ACK) {
                    callback(obj.data);
                }
                if (obj.type == Types.FAILED) {
                    console.log("FAILED");
                }
            });
        }
    }

    var generate = function() {
        return Math.ceil(Math.random() * 1000)
    }

    var listen = function(host, port) {
        server = new BinaryServer({ host : host, port : port });
        server.on('connection', function(client) {
            var ip = client._socket._socket.remoteAddress;
            console.log("Binary conn from", ip);
            var data = {};
            var message = new Message(Types.OFFER, data);
            var stream = send(message, client);
            stream.on('data', function(data) {
                var obj = JSON.parse(data);
                if (obj.type == Types.REGISTRATION) {
                    console.log("Received registration", obj);
                    response = obj.data;
                    clients[obj.data.name] = client;
                }
            });
            client.on('close', function() {
                console.log("Closed");
                delete clients[obj.data.name];
            });
        });

    }
    var send = function(data, client) {
        return client.send(JSON.stringify(data));
    }
    listen(p);
}

var LocalClient = function(drivers) {
    this.action = function(name, action, options, callback) {
        drivers[name][action](options, callback);
    }
}
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
