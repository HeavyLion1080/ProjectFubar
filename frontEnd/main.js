(function () 
{
  const room = document.getElementById("room-container");
  const socket = io('http://localhost:3000', {
    transports: ["websocket"]
  });

  var name;
  var has_focus = true;
  window.onfocus = () => has_focus = true;
  window.onblur = () => has_focus = false;

  // Create timer element in the top right of the game
  const timerDisplay = document.getElementById('timer');
  timerDisplay.style.top = '10px';
  timerDisplay.style.right = '10px';

  // Create element in the top left to show game code
  const codeDisplay = document.getElementById('code');
  codeDisplay.style.top = '10px';
  codeDisplay.style.left = '10px';

  // Functions the client listens to from the server
  socket.on('init', handleInit);               
  socket.on('gameCode', handleGameCode);             
  socket.on('unknownCode', handleUnknownCode);        
  socket.on('tooManyPlayers', handleTooManyPlayers);  
  socket.on('startGame',startGame);                   
  socket.on('syncTimer',syncTimer);                   
  socket.on('startFubar',startFubar);
  socket.on('loseGame',showLoseScreen);
  socket.on('winGame',showWinScreen);
  socket.on('playerLeft',playerLeft);
  socket.on('roleTaken', disableButton);

  // Grab html elements to be used
  const initialScreen = document.getElementById('initialScreen');
  const newGameBtn = document.getElementById('newGameButton');
  const joinGameBtn = document.getElementById('joinGameButton');
  const gameCodeInput = document.getElementById('gameCodeInput');
  const gameCodeDisplay = document.getElementById('gameCodeDisplay');

  let playerNumber;

  newGameBtn.addEventListener('click', newGame);
  joinGameBtn.addEventListener('click', joinGame);

  scholarSelect.addEventListener('click', makeScholar);
  adventurerSelect.addEventListener('click', makeAdventurer);

  // If scholar button was pressed disable the adventurer button and emit message that scholar was pressed
  function makeScholar(){

    adventurerSelect.removeEventListener('click', makeAdventurer);
    adventurerSelect.style.background = "grey";

    socket.emit('roleSelect', "scholar");
    name = "scholar";
  }

  // If adventurer button was pressed disable the scholar button and emit message that adventurer was pressed
  function makeAdventurer(){

    scholarSelect.removeEventListener('click', makeScholar);
    scholarSelect.style.background = "grey";

    socket.emit('roleSelect', "adventurer");
    name = "adventurer";
  }
  
  // Disable the button that was pressed
  function disableButton (aRole){
    
    if(aRole == "adventurer"){
      adventurerSelect.removeEventListener('click', makeAdventurer);
      adventurerSelect.style.background = "grey";
    } else if(aRole == "scholar"){
      scholarSelect.removeEventListener('click', makeScholar);
      scholarSelect.style.background = "grey";
    }
  }
 
  // Tell the server that a game was created and show the admin screen
  function newGame() {
    socket.emit('newGame');
    showAdminScreen();
  }
  
  // Attempt to join game with the entered code
  function joinGame() {
    const code = gameCodeInput.value;    
    socket.emit('joinGame', code);
  }

  // If the player joined the game and is not the admin show the role select screen
  function handleInit(number) {
    playerNumber = number;
    if(playerNumber > 1)
    {
      showRoleSelectionScreen();
    }
  }

  // Display the game code in the top left
  function handleGameCode(gameCode) {

    codeDisplay.innerText = "Game Code: " + gameCode;
  }
  
  // If the entered code did not belong to a game send alert
  function handleUnknownCode() {
    alert('Unknown Game Code')
  }
  
  // If the game already has 3 players send alert
  function handleTooManyPlayers() {
    alert('This game is already in progress');
  }

  // Remove the buttons and show code and timer for the admin
  function showAdminScreen () {

    const initialScreen = document.getElementById('initialScreen');
    const roleScreen = document.getElementById('roleSelectScreen');
    initialScreen.remove();
    initialScreen.remove();
  }

  // Remove the start buttons and show role select buttons
  function showRoleSelectionScreen(){
    initialScreen.remove();
    roleSelectScreen.style.display = "flex";
  }

  // Once both players joined the game remove the role select buttons and start the question phase
  function startGame() {
    roleSelectScreen.remove();
    fetch("./questions.json")
    .then(function(u){ return u.json();})
    .then(function(data){createQuestions(data);})
  }

  // Sync in game timer with server timer
  function syncTimer(time)
  {
    timerCountdown = time;
  }

  // When the questions are done show the second phase for the players
  function startFubar()
  {
    if(playerNumber != 1)
    {
      const questionContainer = document.getElementById('question-container');
      questionContainer.remove();
      const fubar = new Fubar(name, socket);
      fubar.init();
    }
  }

  // If the final puzzles are solved show the win results
  function showWinScreen(metrics)
  {
    clearInterval(room.timer);
    removeAllCHildNodes(room);
    const resultScreen = new Result(room);
    if(playerNumber == 1)
      resultScreen.adminWin(metrics);
    else
      resultScreen.playerWin(metrics);
  }
  // If the time runs out show the loss results
  function showLoseScreen(metrics)
  {
    clearInterval(room.timer);
    removeAllCHildNodes(room);
    const resultScreen = new Result(room);
    if(playerNumber == 1)
      resultScreen.adminLoss(metrics);
    else
      resultScreen.playerLoss(metrics);
  }

  // Removes all elements from game other than game code
  function removeAllCHildNodes(parent)
  {
    while(parent.children[1])
    {
      parent.removeChild(parent.children[1]);
    }
  }

  // If a player left the game send an alert and reload the page when the alert is closed
  function playerLeft()
  {
    if(has_focus)
    {
      if(!alert("A player has disconnected!")) {
        location.reload();
      }
    }
    else
    {
      setTimeout(() => playerLeft(),250);
    }
  }
  
  // Create the questions from the json file and start the timer
  var questions;
  var timerCountdown;
  function createQuestions(data)
  {
    timerCountdown = data[0].time;
    if(name == 'adventurer')
    {
      questions = new Questions(room, data[1].questions, socket);
      questions.startGame();
    }
    else if(name == 'scholar')
    {
      questions = new Questions(room, data[2].questions, socket);
      questions.startGame();
    }
    let start = new Event("start");
    socket.emit('startTimer',timerCountdown);
    document.dispatchEvent(start);
  };

  // Start timer after questions are started
  document.addEventListener("start", () =>
  {
    timerDisplay.innerText = "Time Remaining: " + timerCountdown;
    room.timer = setInterval(() => 
    {
      timerCountdown -= 1;
      timerDisplay.innerText = "Time Remaining: " + timerCountdown;
      if(timerCountdown <= 0)
      {
        clearInterval(room.timer);
      }
    },1000);
    document.addEventListener("subtractTime", () => timerCountdown = timerCountdown - 20);
    document.addEventListener("addTime", () => timerCountdown = timerCountdown + 20);
  });

})();