(function () 
{
  const room = document.getElementById("room-container");
  const socket = io('http://localhost:4000');

  var name;

  // Create timer element in the top right of the game
  const timerDisplay = document.getElementById('timer');
  timerDisplay.style.top = '10px';
  timerDisplay.style.right = '10px';

  const codeDisplay = document.getElementById('code');
  codeDisplay.style.top = '10px';
  codeDisplay.style.left = '10px';

  //start sceen stoof  
  socket.on('init', handleInit);                      //sets player number 
  socket.on('gameOver', handleGameOver);              //sends win or lose message
  socket.on('gameCode', handleGameCode);              //Displays gamecode
  socket.on('unknownCode', handleUnknownCode);        //sends error message
  socket.on('tooManyPlayers', handleTooManyPlayers);  //send message if a player tries to enter a full room
  socket.on('startGame',startGame);
  socket.on('syncTimer',syncTimer);
  socket.on('startFubar',startFubar);

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

    console.log("game COde is " + gameCode);
    codeDisplay.innerText = "Game Code: " + gameCode;
  }
  
  function handleUnknownCode() {
    reset();
    alert('Unknown Game Code')
  }
  
  function handleTooManyPlayers() {
    reset();
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

  function reset() {
    playerNumber = null;
    gameCodeInput.value = '';
    initialScreen.style.display = "block";
    roleSelectScreen.style.display = "none";
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
    }
    else if(name == 'scholar')
    {
      questions = new Questions(room, data[2].questions, socket);
    }
    questions.startGame();
    let start = new Event("start");
    socket.emit('startTimer',timerCountdown);
    document.dispatchEvent(start);
  };

  // Start timer after questions are started
  document.addEventListener("start", () =>
  {
    timerDisplay.innerText = "Time Remaining: " + timerCountdown;
    const timer = setInterval(() => 
    {
      timerCountdown -= 1;
      timerDisplay.innerText = "Time Remaining: " + timerCountdown;
      if(timerCountdown <= 0)
      {
        let event = new Event("lose");
        document.dispatchEvent(event);
        clearInterval(timer);
      }
    },1000);
    document.addEventListener("subtractTime", () => timerCountdown = timerCountdown - 20);
    document.addEventListener("addTime", () => timerCountdown = timerCountdown + 20);
  });
  
 //   const res = new Result(room1,fubar);
   //  res.displayResults([5,10,23,69,420]);
})();