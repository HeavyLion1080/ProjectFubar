const http = require('http');
const httpServer = http.createServer();
const io = require("socket.io")(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

const state = {};
const playerRooms = {};


io.on('connection', (player) => {
    console.log('a user has connected ' + player.id );
    
    ////////////////////////////////////////////////////////////////////

    player.on('newGame', handleNewGame);
    player.on('joinGame', handleJoinGame);

    player.incorrectQuestions = 0;
    player.clicks = 0;

    function handleNewGame() {
        let roomName = makeid(4);
        console.log(roomName);
        playerRooms[player.id] = roomName;
        player.emit('gameCode', roomName);
        
        console.log("step 1")

        //state[roomName] = initGame();   //sets the room state to initial game state 
    
        player.join(roomName);          // .join is a socket command to join a room
        
        console.log("step 2")
        
        player.number = 1;              //sets player that starts game to player 1 
        
        console.log("step 3")
        
        player.emit('init', 1);         //sends player number back to the client to get set as such
    
        console.log("step 4")
    }
    
    function handleJoinGame(roomName) {
        const room = io.sockets.adapter.rooms.get(roomName);
        console.log(io.sockets.adapter.rooms)
    
        
        console.log("server sees room " + room + "and the name " + roomName)

        let numPlayers = 0;

        if (room) {
            console.log("Got the number of players")
            numPlayers = room.size;
        }
    
        if (numPlayers === 0) {
            console.log("number of player is " + numPlayers)
            player.emit('unknownCode');
            return;
        } else if (numPlayers === 1 ) {
            console.log("number of player is " + numPlayers)
            playerRooms[player.id] = roomName;
    
            player.join(roomName);
            player.number = 2;
            player.emit('init', 2);
        
            room.scholarPlayer = 0;
            room.adventurerPlayer = 0;
            room.questions = 0;
            
        } else if (numPlayers === 2) {
            console.log("number of player is " + numPlayers)
            playerRooms[player.id] = roomName;
    
            player.join(roomName);
            player.number = 3;
            player.emit('init', 3);
            if(room.scholarPlayer)
            {
                player.emit('roleTaken', 'scholar');
            }
            else if(room.adventurerPlayer)
            {
                player.emit('roleTaken', 'adventurer');
            }
                    
        } else if (numPlayers > 2) {
            console.log("number of player is " + numPlayers)
            player.emit('tooManyPlayers');
            return;
        } 
        player.emit('gameCode', roomName);

    
        player.on('roleSelect', checkRole);
    

        function checkRole (theRole){
            console.log("im workin here");

            if(theRole == "scholar"){
                room.scholarPlayer = player.number;
            } else if (theRole == "adventurer"){
                room.adventurerPlayer = player.number;
            }

            console.log("the role be " + theRole);

            io.to(roomName).emit('roleTaken', theRole);
            if(room.scholarPlayer && room.adventurerPlayer)
            {
                io.to(roomName).emit('startGame');
            }
        }

        player.on('startTimer',setTimer);
        function setTimer(timerCountdown)
        {
            room.timerCountdown = timerCountdown;
        }
        function startTimer()
        {
            const timer = setInterval(() => {
                room.timerCountdown -= 1;
                if(timerCountdown <= 0)
                {
                    io.to(roomName).emit('loseGame');
                    clearInterval(timer);
                }
                if(timerCountdown % 5)
                {
                    io.to(roomName).emit('syncTimer',room.timerCountdown);
                }
            },1000);
        }

        player.on('incorrectQuestion',incorrectQuestion);
        player.on('correctQuestion',correctQuestion);

        function incorrectQuestion()
        {
            room.timerCountdown -= 20;
            io.to(roomName).emit('syncTimer',room.timerCountdown);
            player.incorrectQuestions++;
        }
        function correctQuestion(nextTextNodeId)
        {
            room.questions++;
            if(room.questions == 2)
            {
                room.timerCountdown += 20;
                io.to(roomName).emit('syncTimer',room.timerCountdown);
                room.questions = 0;
                if(nextTextNodeId != 5) {
                    io.to(roomName).emit('nextQuestion',nextTextNodeId);
                }
                else {
                    io.to(roomName).emit('startFubar');
                }
            }
        }


    }

    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
     
    ////////////////////////////////////////////////////////////////////////////////

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