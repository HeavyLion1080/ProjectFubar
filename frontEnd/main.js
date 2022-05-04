(function () 
{
    const room = document.getElementById("room-container");
    const socket = io('http://localhost:4000');
    const fubar = new Fubar("adventurer", socket);

    const btn = document.getElementById("test");
    btn.addEventListener("click", () => {socket.emit("work", 3)});

    // Grabs the data from the json file and sends it to the question class
    fetch("./questions.json")
    .then(function(u){ return u.json();})
    .then(function(data){createQuestions(data);})

  function createQuestions(data)
  {
    
    const questions = new Questions(room, fubar, data);
    questions.startGame();
  }

 //   const res = new Result(room1,fubar);
   //  res.displayResults([5,10,23,69,420]);
})();