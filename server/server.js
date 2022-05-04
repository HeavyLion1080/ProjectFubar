const http = require('http');
const httpServer = http.createServer();
const io = require("socket.io")(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});


io.on('connection', (player) => {
    console.log('a user has connected ' + player.id );
    //io.on("item-pickup", (item) => {
    //    console.log("got an item");
    //    io.emit("item", item); 
    //});   
    player.on("item-pickup",(id) => 
    {
        io.fetchSockets()
        .then((sockets) => {
            sockets.forEach((socket) => {
                console.log(socket.id)
                socket.emit("item", id);
            });
        });
        
    });
    

    player.on('disconnect', () => {
        console.log("mfs left B");
    });
});


httpServer.listen(4000, () => {
    console.log('listening on *:4000');
});