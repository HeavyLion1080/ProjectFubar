(function () 
{

  const socket = io('http://localhost:3000');

    const room1 = document.getElementById("room-1-container");
    const room2 = document.getElementById("room-2-container");
    room2.style.display = "none";
    const dotPuzzle = new SeqPuzzle(room1,"dotPuzzle",["card3","card8","card1"]);
    const numberPuzzle = new SeqPuzzle(room1, "symbolPuzzle", ["card6", "card8", "card2"]);
    const memPuzzle = new MemoryPuzzle(room2);
    const fubar = new Fubar(room1,room2,dotPuzzle,memPuzzle, socket);

    socket.emit("work", 3);

    // Grabs the data from the json file and sends it to the question class
    fetch("./questions.json")
    .then(function(u){ return u.json();})
    .then(function(data){createQuestions(data);})

  function createQuestions(data)
  {
  const questions = new Questions(room1, fubar, data);
  questions.startGame();
  }

 //   const res = new Result(room1,fubar);
   //  res.displayResults([5,10,23,69,420]);
})();