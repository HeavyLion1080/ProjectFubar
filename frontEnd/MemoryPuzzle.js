class MemoryPuzzle
{
  constructor(element)
  {
    // Create the puzzle container and append it to the game-container
    this.container = document.createElement("container");
    this.container.setAttribute("class","puzzleContainer");
    element.appendChild(this.container);
    this.container.style.height = '300px';
    // Create the puzzle and append it to the puzzle container
    this.puzzle = document.createElement("puzzle");
    this.puzzle.setAttribute("class","memPuzzle")
    this.container.appendChild(this.puzzle);

    this.matches = 0;
    this.drawCloseButton();
    this.cardGenerator();
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
    close.style.top = '0px';
    close.style.right = '0px';
    container.appendChild(close);
    close.addEventListener("click", () => container.style.display = 'none');
  }

  // Display the puzzle
  show()
  {
    this.container.style.display = "flex";
  }
  //Generate and randomize the card order
  getData()
  {
  const cardData = [
      { imgSrc: "assets/puzzles/memoryPuzzle/Card1.png", name: "card1" },
      { imgSrc: "assets/puzzles/memoryPuzzle/Card1.png", name: "card1" },
      { imgSrc: "assets/puzzles/memoryPuzzle/Card2.png", name: "card2" },
      { imgSrc: "assets/puzzles/memoryPuzzle/Card2.png", name: "card2" },
      { imgSrc: "assets/puzzles/memoryPuzzle/Card3.png", name: "card3" },
      { imgSrc: "assets/puzzles/memoryPuzzle/Card3.png", name: "card3" },
      { imgSrc: "assets/puzzles/memoryPuzzle/Card4.png", name: "card4" },
      { imgSrc: "assets/puzzles/memoryPuzzle/Card4.png", name: "card4" },
    ];
    cardData.sort(() => Math.random() - 0.5);
    return cardData;
  }

  //Card Generator Function
  cardGenerator()
  {
    const cardData = this.getData();

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
      face.src = item.imgSrc;
      card.setAttribute("name", item.name);

      back.src = "assets/puzzles/memoryPuzzle/CardBack.png";
      
      //Attach the cards to the section
      this.puzzle.appendChild(card);
      card.appendChild(face);
      card.appendChild(back);

      card.addEventListener( "click", (e) =>
      {
        const toggledCards = document.querySelectorAll('.toggleCard');

        // If the card is already flipped, or 2 cards are flipped do nothing
        if(!card.classList.contains("toggleCard") && document.querySelectorAll('.flipped').length !== 2)
        {
          card.classList.toggle("toggleCard");
          this.checkCards(e);
        }
      } );
    });
  };

  //Check Cards
  checkCards = (e) =>
  {
    const clickedCard = e.target;
    clickedCard.classList.add("flipped");
    const flippedCards = document.querySelectorAll('.flipped');
    const toggleCard = document.querySelectorAll('.toggleCard');
    //Logic
    if (flippedCards.length === 2 )
    {
      if (flippedCards[0].getAttribute("name") === flippedCards[1].getAttribute("name") )
      {
        flippedCards.forEach( (card) => 
          {
            card.classList.remove('flipped');
            card.style.pointerEvents = "none";
            this.matches++;
          });
      }
      else
      {
        flippedCards.forEach((card) => 
          {
            setTimeout(() =>{ card.classList.remove('toggleCard'); card.classList.remove('flipped');}, 1000);
          });
      }

    }

    // If the puzzle is solved dispatch event to the game
    if(this.matches == 8)
    {
      close = this.container.childNodes[1];
      let closeEvt = new Event('click');
      close.dispatchEvent(closeEvt);
      let event = new Event("memoryPuzzleSolved");
      document.dispatchEvent(event);
    }
    
  };


}

