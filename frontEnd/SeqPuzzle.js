class SeqPuzzle
{
  constructor(element,type,solution,socket)
  {
    // Create the puzzle container and append it to the game-container
    this.container = document.createElement("container");
    this.container.setAttribute("class","puzzleContainer");
    element.appendChild(this.container);
    this.container.addEventListener('click',()=>{
      socket.emit('click');
    })
    // Create the puzzle and append it to the puzzle container
    this.puzzle = document.createElement("puzzle");
    this.puzzle.setAttribute("class","puzzle")
    this.container.appendChild(this.puzzle);
    this.type = type;

    this.generator = 1;
    this.cards = [];
    this.flippedCards = [];
    this.solution = solution;
    this.drawCloseButton();
    this.cardGenerator(type);
  }

  // Draw the close button on the puzzle, when clicked it makes the puzzle hidden
  drawCloseButton ()
  {
    const container = this.container;
    const close = document.createElement('close');
    close.setAttribute("class","close");
    close.style.width = '35px';
    close.style.height = '35px';
    close.style.backgroundImage = 'url("assets/puzzles/close.png")';
    close.style.top = '9px';
    close.style.right = '9px';
    container.appendChild(close);
    close.addEventListener("click", () => container.style.display = 'none');
  }

  // Display the puzzle
  show()
  {
    this.container.style.display = "flex";
  }

  //Card Generator Function
  cardGenerator (type)
  {
    const cardData = [1,2,3,4,5,6,7,8,9];
    //Generate HTML
    cardData.forEach ((item) =>
    {
      const card = document.createElement("div");
      const face = document.createElement('img');
      const back = document.createElement('img');

      card.classList = "card";
      face.classList = "face";
      back.classList = "back";

      //Add info to cards
      card.setAttribute("name", "card"+ item);

      if(type === "dotPuzzle")
      {
        face.src = "assets/puzzles/dotPuzzle/CardBack.png";
        back.src = "assets/puzzles/dotPuzzle/Card1.png";
      }
      else
      {
        face.src = "assets/puzzles/"+ type + "/Card" + item + "Pressed.png";
        back.src = "assets/puzzles/"+ type + "/Card" + item + ".png";
      }
      
      //Attach the cards to the puzzle
      this.puzzle.appendChild(card);
      this.cards.push(card);
      card.appendChild(face);
      card.appendChild(back);

      card.addEventListener( "click", (e) =>
      {
        // If the card is already flipped, or 3 cards are flipped do nothing
        if(this.flippedCards.length !== 3 && !card.classList.contains("toggleCard"))
        {
          card.classList.toggle("toggleCard");
          this.checkCards(e);
        }
      } );
    });
  };

  checkCards(e)
  {
    const clickedCard = e.target;
    this.flippedCards.push(clickedCard);
    const toggleCard = document.querySelectorAll('.toggleCard');

    // Compare the name of the selected cards to the solution
    if (this.flippedCards.length === 3 )
    {
      // Input was correct
      if ((this.flippedCards[0].getAttribute("name") === this.solution[0]) && 
          (this.flippedCards[1].getAttribute("name") === this.solution[1]) && 
          (this.flippedCards[2].getAttribute("name") === this.solution[2]))
      {
        // Remove the event listeners from the cards
        this.cards.forEach((card) => card.style.pointerEvents = "none");

        // Close the game
        close = this.container.childNodes[1];
        let closeEvt = new Event('click');
        close.dispatchEvent(closeEvt);
        // Dispatch event to let the game know the puzzle is solved
        if(this.type === "dotPuzzle")
        {
          let event = new Event("dotPuzzleSolved");
          document.dispatchEvent(event);
        }
        else if(this.type === "symbolPuzzle")
        {
          let event = new Event("symbolPuzzleSolved");
          document.dispatchEvent(event);
        }
        else
        {
          let event = new Event("numberPuzzleSolved");
          document.dispatchEvent(event);
        }
      }
      // Input was incorrect, flip cards back over
      else
      {
        this.flippedCards.forEach((card) => 
          {
            setTimeout(() =>{ card.classList.remove('toggleCard');this.flippedCards = [];}, 1000);
          });
      }
    }
  };

}