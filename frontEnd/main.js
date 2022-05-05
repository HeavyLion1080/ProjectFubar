(function () 
{
  const room = document.getElementById("room-container");
  const name = 'scholar';
  const socket = io('http://localhost:4000');
  const fubar = new Fubar(name, socket);

  // Create timer element in the top right of the game
  const timerDisplay = document.getElementById('timer');
  timerDisplay.style.top = '10px';
  timerDisplay.style.right = '10px';

  //start sceen stoof  
  socket.on('init', handleInit);                      //sets player number 
  socket.on('gameState', handleGameState);            //game loop
  socket.on('gameOver', handleGameOver);              //sends win or lose message
  socket.on('gameCode', handleGameCode);              //Displays gamecode
  socket.on('unknownCode', handleUnknownCode);        //sends error message
  socket.on('tooManyPlayers', handleTooManyPlayers);  //send message if a player tries to enter a full room

  const gameScreen = document.getElementById('gameScreen');
  const initialScreen = document.getElementById('initialScreen');
  const newGameBtn = document.getElementById('newGameButton');
  const joinGameBtn = document.getElementById('joinGameButton');
  const gameCodeInput = document.getElementById('gameCodeInput');
  const gameCodeDisplay = document.getElementById('gameCodeDisplay');

  newGameBtn.addEventListener('click', newGame);
  joinGameBtn.addEventListener('click', joinGame);
 
  function newGame() {
    console.log("new game button was clicked");
    socket.emit('newGame', data);
    createQuestions(data); 
  }
  
  function joinGame() {
    const code = gameCodeInput.value;
    socket.emit('joinGame', code);
    createQuestions(data);
  }

  function handleInit(number) {
    playerNumber = number;
  }
  
  function handleGameState(gameState) {
    if (!gameActive) {
      return;
    }
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => paintGame(gameState));
  }
  
  function handleGameOver(data) {
    if (!gameActive) {
      return;
    }
    data = JSON.parse(data);
  
    gameActive = false;
  
    if (data.winner === playerNumber) {
      alert('You Win!');
    } else {
      alert('You Lose :(');
    }
  }
  
  function handleGameCode(gameCode) {
    gameCodeDisplay.innerText = gameCode;
  }
  
  function handleUnknownCode() {
    reset();
    alert('Unknown Game Code')
  }
  
  function handleTooManyPlayers() {
    reset();
    alert('This game is already in progress');
  }
/*
///////////////////////////////////////////////////////////////////

  THE FOLLOWING CODE NEEDS TO BE ADDED TO GET RID OF THE HOME SCREEN 
    AND SHOW THE GAME SCREEN 
initialScreen.style.display = "none";      
gameScreen.style.display = "block";

////////////////////////////////////////////////////////////////////
*/

  var questions;
  var timerCountdown;
  // Grabs the data from the json file and sends it to the question class
  fetch("./questions.json")
  .then(function(u){ return u.json();})
  .then(function(data){createQuestions(data);})



  function createQuestions(data)
  {
    timerCountdown = data[0].time;
    console.log(timerCountdown);
    if(name == 'adventurer')
    {
      questions = new Questions(room, fubar, data[1].questions);
    }
    else if(name == 'scholar')
    {
      questions = new Questions(room, fubar, data[2].questions);
    }
    questions.startGame();
    let start = new Event("start");
    document.dispatchEvent(start);
  };

  // Start timer after questions are started
  document.addEventListener("start", () =>
  {
    const startTime = Date.now();
    const timer = setInterval(() => 
    {
      var delta = Date.now() - startTime;
      var timeRemaining = (timerCountdown - Math.floor(delta / 1000));
      timerDisplay.innerText = "Time Remaining: " + timeRemaining;
      if(timeRemaining <= 0)
      {
        let event = new Event("lose");
        document.dispatchEvent(event);
        clearInterval(timer);
      }
    },100);
    document.addEventListener("subtractTime", () => timerCountdown = timerCountdown - 20);
    document.addEventListener("addTime", () => timerCountdown = timerCountdown + 20);
  });
  
 //   const res = new Result(room1,fubar);
   //  res.displayResults([5,10,23,69,420]);
})();