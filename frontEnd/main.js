(function () 
{
  const room = document.getElementById("room-container");
  const socket = io('http://localhost:4000');

  var name;

  var has_focus = true;
  window.onfocus = () => has_focus = true;
  window.onblur = () => has_focus = false;
  // Create timer element in the top right of the game
  const timerDisplay = document.getElementById('timer');
  timerDisplay.style.top = '10px';
  timerDisplay.style.right = '10px';

  const codeDisplay = document.getElementById('code');
  codeDisplay.style.top = '10px';
  codeDisplay.style.left = '10px';

  //start sceen stoof  
  socket.on('init', handleInit);                      //sets player number 
  socket.on('gameCode', handleGameCode);              //Displays gamecode
  socket.on('unknownCode', handleUnknownCode);        //sends error message
  socket.on('tooManyPlayers', handleTooManyPlayers);  //send message if a player tries to enter a full room
  socket.on('startGame',startGame);
  socket.on('syncTimer',syncTimer);
  socket.on('startFubar',startFubar);
  socket.on('loseGame',showLoseScreen);
  socket.on('winGame',showWinScreen);
  socket.on('playerLeft',playerLeft);

  socket.on('roleTaken', disableButton);

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

  function makeScholar(){
    console.log("mfs wanna be scholars n shit");

    adventurerSelect.removeEventListener('click', makeAdventurer);
    adventurerSelect.style.background = "grey";

    socket.emit('roleSelect', "scholar");
    name = "scholar";
  }

  function makeAdventurer(){
    console.log("mfs wanna die outside");

    scholarSelect.removeEventListener('click', makeScholar);
    scholarSelect.style.background = "grey";

    socket.emit('roleSelect', "adventurer");
    name = "adventurer";
  }
  
  function disableButton (aRole){
    console.log("p[ast my b time to g");
    
    if(aRole == "adventurer"){
      adventurerSelect.removeEventListener('click', makeAdventurer);
      adventurerSelect.style.background = "grey";
    } else if(aRole == "scholar"){
      scholarSelect.removeEventListener('click', makeScholar);
      scholarSelect.style.background = "grey";
    }
  }
 
  function newGame() {
    console.log("new game button was clicked");
    socket.emit('newGame');
    showAdminScreen();
  }
  
  function joinGame() {
    const code = gameCodeInput.value;

    console.log("server sees code " + code)
    
    socket.emit('joinGame', code);
  }

  function handleInit(number) {
    playerNumber = number;
    
    console.log("server sees " + playerNumber)
    
    if(playerNumber > 1)
    {
      showRoleSelectionScreen();
    }
  }

  function handleGameCode(gameCode) {

    console.log("game COde is " + gameCode);
    codeDisplay.innerText = "Game Code: " + gameCode;
  }
  
  function handleUnknownCode() {
    alert('Unknown Game Code')
  }
  
  function handleTooManyPlayers() {
    alert('This game is already in progress');
  }

  function showAdminScreen () {
    console.log("Admin Screen");

    const initialScreen = document.getElementById('initialScreen');
    const roleScreen = document.getElementById('roleSelectScreen');
    initialScreen.remove();
    initialScreen.remove();
    
  }

  function showRoleSelectionScreen(){
    initialScreen.remove();
    roleSelectScreen.style.display = "flex";
  }

  function startGame() {
    roleSelectScreen.remove();
    fetch("./questions.json")
    .then(function(u){ return u.json();})
    .then(function(data){createQuestions(data);})
  }

  function syncTimer(time)
  {
    timerCountdown = time;
  }

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
  function showLoseScreen(metrics)
  {
    console.log('L');
    clearInterval(room.timer);
    removeAllCHildNodes(room);
    const resultScreen = new Result(room);
    if(playerNumber == 1)
      resultScreen.adminLoss(metrics);
    else
      resultScreen.playerLoss(metrics);
  }
  function removeAllCHildNodes(parent)
  {
    while(parent.children[1])
    {
      parent.removeChild(parent.children[1]);
    }
  }
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
  //fetch("./questions.json")
  //.then(function(u){ return u.json();})
  //.then(function(data){createQuestions(data);})


  function createQuestions(data)
  {
    timerCountdown = data[0].time;
    console.log(timerCountdown);
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
  
 //   const res = new Result(room1,fubar);
   //  res.displayResults([5,10,23,69,420]);
})();