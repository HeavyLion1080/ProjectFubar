// Create the server
const http = require('http');
const httpServer = http.createServer();
const io = require("socket.io")(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

const playerRooms = {};

// When user connects to the server listen for these messages
io.on('connection', (player) => {
    
    player.on('newGame', handleNewGame);
    player.on('joinGame', handleJoinGame);

    player.incorrectQuestions = 0;
    player.clicks = 0;

    // New game is sent by the admin
    function handleNewGame() {
        let roomName = makeid(4);           // Generate a random room code
        playerRooms[player.id] = roomName;  // Save room
        player.emit('gameCode', roomName);  // Emit to the admin that a game was made

        player.join(roomName);              // The admin joins the room
        
        player.number = 1;                  // Sets the admin to player 1

        player.emit('init', 1);             // Sends player number back to the client to get set as such
    }
    
    // Join game is sent by other players
    function handleJoinGame(roomName) {
        const room = io.sockets.adapter.rooms.get(roomName);    
        
        let numPlayers = 0;
        // If the room exists set the numPlayers equal to the number of people connected to the room
        if (room) {
            numPlayers = room.size;
        }
        
        // If a room does not exist emit a message back to the player that it does not
        if (numPlayers === 0) {
            player.emit('unknownCode');
            return;
        } 
        // The first player joins
        else if (numPlayers === 1 ) {
            playerRooms[player.id] = roomName;
    
            // Join the room
            player.join(roomName);
            player.number = 2;
            player.emit('init', 2);
        
            // Initialize variables to the room
            room.scholarPlayer = 0;
            room.adventurerPlayer = 0;
            room.questions = 0;
            room.metrics = {};
            room.metrics['scholarIncorrect'] = 0;
            room.metrics['adventurerIncorrect'] = 0;
            room.metrics['scholarClicks'] = 0;
            room.metrics['adventurerClicks'] = 0 ;
            room.metrics['timeRemaining'] = 0;

            
        } 
        // The second player joins
        else if (numPlayers === 2) {
            playerRooms[player.id] = roomName;
    
            player.join(roomName);
            player.number = 3;
            player.emit('init', 3);

            // If the first player already selected a role disable it for the new player
            if(room.scholarPlayer)
            {
                player.emit('roleTaken', 'scholar');
            }
            else if(room.adventurerPlayer)
            {
                player.emit('roleTaken', 'adventurer');
            }
                    
        } 
        // If a third player tries to join return a message that the room is full
        else if (numPlayers > 2) {
            player.emit('tooManyPlayers');
            return;
        } 

        // Send the game code to the user
        player.emit('gameCode', roomName);
        player.on('roleSelect', checkRole);
    
        // A player choose a role
        function checkRole (theRole)
        {
            // Set the scholar/adventurer variable in the room to that player
            if(theRole == "scholar"){
                room.scholarPlayer = player.number;
            } else if (theRole == "adventurer"){
                room.adventurerPlayer = player.number;
            }

            // Emit that the role was taken
            io.to(roomName).emit('roleTaken', theRole);
            // If both roles are selected start the game
            if(room.scholarPlayer && room.adventurerPlayer)
            {
                io.to(roomName).emit('startGame');
            }
        }

        player.on('startTimer',setTimer);
        // Set a time for the room on the server side
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
                    // sync the timer every 5 seconds
                    if(room.timerCountdown % 5)
                    {
                        io.to(roomName).emit('syncTimer',room.timerCountdown);
                    }
                },1000);
            }
        }

        player.on('incorrectQuestion',incorrectQuestion);
        player.on('correctQuestion',correctQuestion);

        // on an incorrect question lower the timer by 20 seconds
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
        // on a correct question add 20 seconds to the timer
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
        // If a player clicks update the metrics
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
        // A final puzzle was solved
        function finalPuzzleSolved()
        {
            room.finalPuzzles++;
            // Both puzzles are solved
            if(room.finalPuzzles == 2)
            {
                // Update the clicks metrics for whoever finished second since it doesn't properly get recorded
                if(player.number == room.scholarPlayer)
                {
                    room.metrics['scholarClicks']++;
                }
                else if(player.number == room.adventurerPlayer)
                {
                    room.metrics['adventurerClicks']++;
                }  
                // Stop the timer
                clearInterval(room.timer);
                room.metrics['timeRemaining'] = room.timerCountdown; 

                // Tell the players that the game was won
                io.to(roomName).emit('winGame',room.metrics);
            }
        }
        
        // if a player disconnected tell all players
        player.on('disconnect', () => {
            io.to(roomName).emit('playerLeft');
        });

    }

    // Generate a random room id
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
     
    // If an item is picked up add it to both players inventories
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