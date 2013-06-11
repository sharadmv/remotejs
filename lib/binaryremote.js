var BinaryRemote = function(name, ip, port, drivers) {
  var fullAddress = "ws://"+ip+":"+port;
  console.log(fullAddress);
  var client = new BinaryClient(fullAddress);
  client.on('stream', function(stream)  {
    stream.on('data', function(obj) {
      console.log("Obj: ", obj);
      if (obj.type == Types.METHOD) {
        if (!drivers[obj.action]) {
          stream.write(JSON.stringify({
            status : "failure"
          }));
          return;
        }
        drivers[obj.action](obj.options, function(results) {
          send(results);
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
