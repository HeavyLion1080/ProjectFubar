(function () 
{
    const room = document.getElementById("room-container");
    const name = 'adventurer';
    const socket = io('http://localhost:4000');
    const fubar = new Fubar(name, socket);

    // Create timer element in the top right of the game
    const timerDisplay = document.getElementById('timer');
    timerDisplay.style.top = '10px';
    timerDisplay.style.right = '10px';

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
  }

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