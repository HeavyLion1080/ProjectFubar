class Fubar
{
    constructor(room1,room2,puzzle1,puzzle2, socket)
    {

        
        socket.emit("works");
        // Objects
        // Add the class to the container so it can be accessed from eventlisteners
        this.room1 = room1;
        this.room2 = room2;
        this.dotPuzzle = puzzle1;
        this.memoryPuzzle = puzzle2;
        this.canvas1 = document.getElementById("room-1-canvas");
        this.canvas2 = document.getElementById("room-2-canvas");
        room1.ctx = this.canvas1.getContext("2d");
        room2.ctx = this.canvas2.getContext("2d");
        room1.visible = [];
        room2.visible = [];
        
        this.images = [];
        this.loaded = 0;

        // variables
        this.clicks = 0;
        this.items = 0;
        this.selected = -1;

        // Image Ids
        this.ids = {
            hammer: 0,
            key: 1,
            scissors: 2,
            matches: 3,
            piggybank: 4,
            closedCabinet: 5,
            boxOnRope: 6,
            candleOff: 7,
            boxOffRope: 8,
            openedCabinet: 9,
            candleOn: 10,
            memPuzzle: 11,
            numPuzzle: 12,
            dotPuzzle: 13,
            symbolPuzzle: 14,
            shelf: 15,
            inventory: 16,
            leftArrow: 17,
            rightArrow: 18,
            dotPuzzleSol: 19,
            numPuzSol1: 20,
            numPuzSol2: 21,
            numPuzSol3: 22,
            symPuzSol1: 23,
            symPuzSol2: 24,
            symPuzSol3: 25,
        }
    }

    // Load all the images then call base room constructor
    init()
    {
        const srcs = [
            "assets/room/hammer.png", 
            "assets/room/key.png", 
            "assets/room/scissors.png",
            "assets/room/matches.png", 

            "assets/room/piggybank.png",
            "assets/room/ClosedCabinet.png",
            "assets/room/BoxOnRope.png", 
            "assets/room/CandleOff.png", 

            "assets/room/BoxOffRope.png",
            "assets/room/OpenedCabinet.png", 
            "assets/room/CandleOn.png",

            "assets/room/memoryPuzzle.png", 
            "assets/room/numberPuzzle.png", 
            "assets/room/dotPuzzle.png",
            'assets/room/symbolPuzzle.png',

            "assets/room/shelf.png", 
            "assets/room/Inventory.png",
            "assets/room/leftArrow.png",
            "assets/room/rightArrow.png",

            "assets/room/dotPuzzleSol.png",
            "assets/room/numPuzSol1.png",
            "assets/room/numPuzSol2.png",
            "assets/room/numPuzSol3.png",
            "assets/room/symPuzSol1.png",
            "assets/room/symPuzSol2.png",
            "assets/room/symPuzSol3.png",
        ]
        srcs.forEach(src =>
        {
            const image = new Image();
            image.src = src;
            this.images.push(image); 
            image.onload = () => 
            {
                this.loaded++;
                if(this.loaded == 26)
                {
                    this.createRoom();
                }
            };
        });
    }
    changeRoom(oldRoom, newRoom)
    {
        oldRoom.style.display = "none";
        newRoom.style.display = "flex";
    }

    // Clear the current room and draw all visible images
    draw(room)
    {
        room.ctx.beginPath();
        room.ctx.clearRect(0,0,800,600);
        room.ctx.closePath();
        room.visible.forEach(image => 
        {
            room.ctx.drawImage(image.image,image.x,image.y);
        })
    }

    createRoom()
    {
        // Draw the initial rooms
        this.addItem(0,500,0,0,false,this.ids.inventory,this.room1);
        this.addItem(0,500,0,0,false,this.ids.inventory,this.room2);
        this.addItem(10,10,0,0,false,this.ids.boxOnRope,this.room1);
        this.addItem(20,300,100,50,false,this.ids.shelf,this.room1);
        this.addItem(60,220,131,102,false,this.ids.piggybank,this.room1);
        this.addPuzzleListener(60,220,131,102,this.ids.piggybank,0,this.room1);
        this.addItem(500,200,100,100,false,this.ids.dotPuzzle,this.room1);
        this.addPuzzleListener(500,200,100,100,this.ids.dotPuzzle,0,this.room1);
        this.addPuzzleListener(170,300,300,50,this.ids.boxOnRope,51,this.room1);
        this.addItem(750,200,0,0,false,this.ids.rightArrow,this.room1);
        this.addPuzzleListener(750,200,30,100,this.ids.rightArrow,0,this.room1);


        this.addItem(600,100,50,50,true,this.ids.matches,this.room2);
        this.addItem(300,100,100,75,false,this.ids.memPuzzle,this.room2);
        this.addPuzzleListener(300,100,100,75,this.ids.memPuzzle,0,this.room2);
        this.addItem(100,200,200,200,false,this.ids.closedCabinet,this.room2);
        this.addPuzzleListener(100,200,190,200,this.ids.closedCabinet,0,this.room2);
        this.addItem(15,200,0,0,false,this.ids.leftArrow,this.room2);
        this.addPuzzleListener(15,200,30,100,this.ids.leftArrow,0,this.room2);

        this.addItem(500,300,0,0,false,this.ids.shelf,this.room2);
        this.addItem(550,250,0,0,false,this.ids.candleOff,this.room2);
        this.addPuzzleListener(550,250,30,65,this.ids.candleOff,0,this.room2);
        

        // Event listener on the room-container to keep track of clicks, this event triggers after
        // other events as its further back on the page
        this.canvas1.addEventListener("click", this.clickScreen.bind(this));
        this.canvas2.addEventListener("click", this.clickScreen.bind(this));

        // Create event listers which trigger when the puzzles are solved
        document.addEventListener("dotPuzzleSolved", this.dotPuzzleSolved.bind(this));
        document.addEventListener("numberPuzzleSolved", this.numberPuzzleSolved.bind(this));
        document.addEventListener("symbolPuzzleSolved", this.symbolPuzzleSolved.bind(this));
        document.addEventListener("memoryPuzzleSolved", this.memoryPuzzleSolved.bind(this));
    }
    
    // Draw a new item on the page, pickup is a T/F value for if the item can be picked up
    addItem(x,y,w,h,pickUp,id,room)
    {
        // Draw image
        const image = 
        {
            image: this.images[id],
            x: x,
            y: y
        };
        
        room.visible.push(image);
        this.draw(room);

        // If the item can be picked, up a blank element is created on the game-container
        // Which has an event listener used to pick the item up
        if(pickUp)
        {
            const item = document.createElement("item");
            item.setAttribute("class", "item");
            room.appendChild(item);
    
            item.style.left = x + 'px';
            item.style.top = y + 'px';
            item.style.width = w + 'px';
            item.style.height = h + 'px';
            item.style.opacity = '25%';

            // Store the dimensions as local variables on the item to be used in the pickup function
            item.x = x;
            item.y = y;
            item.w = w;
            item.h = h;
            item.inv = false;
            item.id = id;
            item.image = image;

            item.addEventListener("click", this.itemInteraction.bind(this));
        }
    }


    // Add an event listener to the game-container for interacting with puzzles
    // r rotates the image, used to make the cut rope interaction match the image
    addPuzzleListener(x,y,w,h,id,r,room)
    {
        const puzzle = document.createElement("puzzle");
        puzzle.setAttribute("class", "puzzleImg");
        puzzle.setAttribute("id",id);
        room.appendChild(puzzle);
    
        puzzle.style.left = x + 'px';
        puzzle.style.top = y + 'px';
        puzzle.style.width = w + 'px';
        puzzle.style.height = h + 'px';
        puzzle.style.transform = 'rotate('+ r + 'deg)';
        puzzle.style.background = 'green';
        puzzle.style.opacity = '25%';
        puzzle.id = id;

        puzzle.addEventListener("click", this.puzzleClicked.bind(this));
    }

    // Separate the interaction with inventory items based on if the item is in the
    // inventory or not, the event listener could not be changed in the funtion it calls
    itemInteraction(evt)
    {
        var item = evt.currentTarget;
        if(item.inv)
        {
            this.select(item);
        }
        else
        {
            this.clickScreen();
            this.pickup(item); //Replace with a server call

            //socket.emit("item-pickup", item);
            //socket.on("item", this.pickup);
        }
    }

    select(item)
    {
        this.clickScreen();
        this.selected = item.id;
        item.style.background = 'black';
    }

    // Removes the image of the item from the canvas and repaints it on the inventory bar
    // Also adds a new event listener to the item so it can be used
    pickup (item)
    {
        const room = item.parentNode;
        const i = room.visible.indexOf(item.image);
        room.visible.splice(i, 1);
        item.y = 525;
        item.style.top = '525px';

        switch(this.items)
        {
            case 0:
                item.x = 310;
                break;
            case 1:
                item.x = 380;
                break;
            case 2:
                item.x = 450;
                break;
            case 3:
                item.x = 520;
                break;
        }

        item.style.left = item.x + 'px';

        this.addItem(item.x,item.y,0,0,false,item.id,this.room1);
        this.addItem(item.x,item.y,0,0,false,item.id,this.room2);

        ++this.items;
        item.inv = true;

        // Clone the item to put it in the other room
        const itemCopy = item.cloneNode(true);
        itemCopy.inv = true;
        itemCopy.addEventListener("click", this.itemInteraction.bind(this));
        if(room == this.room1)
        {
            this.room2.appendChild(itemCopy);
        }
        else
        {
            this.room1.appendChild(itemCopy);
        }
    }

    // Check which puzzle was clicked and which item is selected
    // If the item is for the puzzle call that method then remove that event listener
    puzzleClicked(evt)
    {
        const puzzle = evt.currentTarget;
        const room = puzzle.parentNode;
        if(puzzle.id == this.ids.boxOnRope && this.selected == this.ids.scissors)
        {
            this.cutRope(room);
            puzzle.removeEventListener("click",this.puzzleClicked);
            puzzle.remove();
        }
        else if(puzzle.id == this.ids.piggybank && this.selected == this.ids.hammer)
        {
            this.breakBank(room);
            puzzle.removeEventListener("click",this.puzzleClicked);
            puzzle.remove();
        }
        else if(puzzle.id == this.ids.closedCabinet && this.selected == this.ids.key)
        {
            this.unlock(room);
            puzzle.removeEventListener("click",this.puzzleClicked);
            puzzle.remove();
        }
        else if(puzzle.id == this.ids.candleOff && this.selected == this.ids.matches)
        {
            this.light(room);
            puzzle.removeEventListener("click",this.puzzleClicked);
            puzzle.remove();
        }
        else if(puzzle.id == this.ids.dotPuzzle && this.selected == -1)
        {
            this.dotPuzzle.show();
        }
        else if(puzzle.id == this.ids.memPuzzle && this.selected == -1)
        {
            this.memoryPuzzle.show();
        }
        else if(puzzle.id == this.ids.rightArrow)
        {
            this.changeRoom(this.room1,this.room2);
        }
        else if(puzzle.id == this.ids.leftArrow)
        {
            this.changeRoom(this.room2,this.room1);
        }
        this.clickScreen();
        
    }

    // Change the background image to the one with the cut rope and add the matches
    cutRope(room)
    {
        const i = room.visible.findIndex(item => item.image === this.images[this.ids.boxOnRope]);
        room.visible.splice(i, 1);
        // Draw the box on the ground and the matches
        this.addItem(15,400,0,0,false,this.ids.boxOffRope,room);
        this.addItem(80,450,50,50,true,this.ids.matches,room);
    }
    breakBank(room)
    {
        const i = room.visible.findIndex(item => item.image === this.images[this.ids.piggybank]);
        room.visible.splice(i, 1);
        this.addItem(100,240,0,0,false,this.ids.symPuzSol1,room);
        this.addItem(100,270,50,50,true,this.ids.key,room);
    }
    unlock(room)
    {
        const i = room.visible.findIndex(item => item.image === this.images[this.ids.closedCabinet]);
        room.visible.splice(i, 1);
        this.addItem(100,200,200,200,false,this.ids.openedCabinet,this.room2);
        this.addItem(293,270,40,50,false,this.ids.dotPuzzleSol,this.room2); 
    }
    light(room)
    {
        const i = room.visible.findIndex(item => item.image === this.images[this.ids.candleOff]);
        room.visible.splice(i,1);
        this.addItem(553,248,0,0,false,this.ids.candleOn,this.room2);
    }
    dotPuzzleSolved()
    {
        const i = this.room1.visible.findIndex(item => item.image === this.images[this.ids.dotPuzzle]);
        this.room1.visible.splice(i, 1);
        document.getElementById(this.ids.dotPuzzle).remove();
        this.addItem(550,250,0,0,false,this.ids.symPuzSol2,this.room1);
    }

    numberPuzzleSolved()
    {

    }

    symbolPuzzleSolved()
    {

    }

    memoryPuzzleSolved()
    {
        const i = this.room2.visible.findIndex(item => item.image === this.images[this.ids.memPuzzle]);
        this.room2.visible.splice(i, 1);
        document.getElementById(this.ids.memPuzzle).remove();
        this.addItem(330,130,50,50,true,this.ids.scissors,this.room2);
        this.addItem(400,130,50,50,false,this.ids.numPuzSol2,this.room2);
    }

    // Keeps track of clicks and clears the selected item
    clickScreen ()
    {
        console.log(++this.clicks);
        var items = [].slice.call(document.getElementsByClassName("item"));
        items.forEach(item => { item.style.background = 'transparent'});
        this.selected = -1;
    }
}