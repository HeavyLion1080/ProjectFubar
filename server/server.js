const http = require('http');
const httpServer = http.createServer();
const io = require("socket.io")(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});


io.on('connection', (socket) => {
    console.log('a user has connected ' + socket.id );
    //io.on("item-pickup", (item) => {
    //    console.log("got an item");
    //    io.emit("item", item); 
    //});   

    io.on("works", () => {
        console.log("this working in cons");
    } );

    io.on("work", (num) => {
        console.log("this working not in cons");
    } );

    socket.on('disconnect', () => {
        console.log("mfs left B");
    });
});

io.listen(3000, () => {
    console.log('listening on *:3000');
});