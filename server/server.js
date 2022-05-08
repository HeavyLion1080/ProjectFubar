const http = require('http');
const httpServer = http.createServer();
const io = require("socket.io")(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

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
            room.finalPuzzles = 0;
            room.metrics = {};
            room.metrics['scholarIncorrect'] = 0;
            room.metrics['adventurerIncorrect'] = 0;
            room.metrics['scholarClicks'] = 0;
            room.metrics['adventurerClicks'] = 0 ;
            room.metrics['timeRemaining'] = 0;

            
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
            startTimer();
        }
        function startTimer()
        {
            if(!room.timer)
            {
                room.timer = setInterval(() => {
                    room.timerCountdown -= 1;
                    if(room.timerCountdown <= 0)
                    {
                        console.log("time Ran out B");
                        io.to(roomName).emit('loseGame',room.metrics);
                        clearInterval(room.timer);
                    }
                    if(room.timerCountdown % 5)
                    {
                        io.to(roomName).emit('syncTimer',room.timerCountdown);
                    }
                },1000);
            }
        }

        player.on('incorrectQuestion',incorrectQuestion);
        player.on('correctQuestion',correctQuestion);

        function incorrectQuestion()
        {
            room.timerCountdown -= 20;
            io.to(roomName).emit('syncTimer',room.timerCountdown);
            if(player.number == room.scholarPlayer)
            {
                room.metrics['scholorIncorrect']++;
            }
            else if(player.number == room.adventurerPlayer)
            {
                room.metrics['adventurerIncorrect']++;
            }
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

        player.on('click',click);
        function click()
        {
            if(player.number == room.scholarPlayer)
            {
                room.metrics['scholarClicks']++;
            }
            else if(player.number == room.adventurerPlayer)
            {
                room.metrics['adventurerClicks']++;
            }
        }
        
        player.on('finalPuzzleSolved',finalPuzzleSolved);
        function finalPuzzleSolved()
        {
            room.finalPuzzles++;
            if(room.finalPuzzles == 2)
            {
                if(player.number == room.scholarPlayer)
                {
                    room.metrics['scholarClicks']++;
                }
                else if(player.number == room.adventurerPlayer)
                {
                    room.metrics['adventurerClicks']++;
                }  
                clearInterval(room.timer);
                room.metrics['timeRemaining'] = room.timerCountdown; 

                io.to(roomName).emit('winGame',room.metrics);
            }
        }
        player.on('disconnect', () => {
            console.log("mfs left B");
            io.to(roomName).emit('playerLeft');
        });

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
    
});


httpServer.listen(3000);