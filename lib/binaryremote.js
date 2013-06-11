var BinaryRemote = function(name, ip, port, drivers) {
  var fullAddress = "ws://"+ip+":"+port;
  console.log(fullAddress);
  var client = new BinaryClient(fullAddress);
  client.on('stream', function(stream)  {
    stream.on('data', function(obj) {
      obj = JSON.parse(obj);
      if (obj.type == Types.METHOD) {
        if (!drivers[obj.data.action]) {
          send(new Message(Types.FAILED, {}), stream);
          return;
        }
        drivers[obj.data.action](obj.data.options, function(results) {
          send(new Message(Types.ACK, results), stream);
        });
      } else if (obj.type == Types.OFFER) {
        var data = {
          name : name
        }
        var message = new Message(Types.REGISTRATION, data);
        send(message, stream);
      }
    });
  });

  var send = function(data, stream) {
    stream.write(JSON.stringify(data));
  }
}
