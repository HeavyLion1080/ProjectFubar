Introduction:
------------------
OperationFubar is a multiplayer virtual escape game that is played on a web browser.
This was developed as a class project from the SUNY Oswego CSC380 class of Spring 2022.
This project was developed by John Harrington, Abdulrehman Rashid, Mark Reichert, and Jacob Singer.


Description:
------------------
OperationFubar requires three players to be played, an admin and two players.
The admin has to create a room which will generate a code that the other players can enter
to join the room. The two players then have to select a role, either the adventure and scholar. 
After the roles are selected the question phase starts. During the question phase players will 
recieve a question and four answers. The admin can edit a CSV file to change the questions.
If an incorrect answer is selected time will be deducted and it will be recorded to be displayed 
to the admin when the game ends. After all of the questions are answered the puzzle phase starts. 
Now the players can interact with items to solve puzzles. If the final puzzles are solved then the 
game ends in victory, if time runs out then the game will end in a loss. The metrics will be displayed 
after the game ends, the admin can see the players clicks, wrong answers, and the time remaining if it 
did not run out. The players will only see the time remaining.


Requirements:
------------------
Nodejs is required and can be installed at https://nodejs.org/


Installation:
------------------
There are two methods to download the game.
(1) If git is installed the command "git clone https://github.com/HeavyLion1080/ProjectFubar.git"
    can be ran from the directory you want the game in.

(2) Or from https://github.com/HeavyLion1080/ProjectFubar click the green "Code" button and download
    the zip, then unzip the file in the directory you want the game in.


Game Customization:
------------------
A file included in with the game is called "questions.json" this file can be customized to change the game
time and the questions. The first section contains 1 value "time", the number is time in seconds and can 
be customized. After that it is broken into 2 sections, adventurer and scholar which separates the questions
each role. Each question contains an "id" field which contains the question id, it starts at 1 and increments
by 1 each question. Under that is a "text" field which contains the question text which can be customized.
Next there is the "options" field, which holds the answers to the questions. "text" is the text for each 
answer. The "nextText" is a number, if the answer is the wrong answer then nextText will be the same as the
question id, if the answer is the correct answer then nextText will be the next questions id.


Set Up:
------------------
Included in the folder is a file called start.bat, this file can be ran to start the server.
If Nodejs is not installed the file will not run. The first time the file is ran it will install
all of the required node packages. If any y/n prompts appear enter y. When the server is running ctrl+c
the prompt "Terminate batch job (Y/N)?" will appear, DO NOT enter y here, it will stop the script file
early and will not shut off the server properly. Instead either enter n, or press ctrl+c again. If y is entered,
the server can be stopped by running the script again and stopping it properly. To connect to the game you can 
enter the address that is displayed near the top of the terminal, the line will look like this: 
"To connect to the game enter: http://0.0.0.0:8080/ into a web browser", just with a different address.


Image credits:
-----------------------------------
Playing-Cards: OpenClipart-Vectors, July 2013, Free for Commercial Use, 
available at: https://pixabay.com/vectors/card-deck-deck-cards-playing-cards-161536/ March 2022.

Cupboard: OpenClipart-Vectors, Jan 2015, Free for Commercial Use, 
available at: https://pixabay.com/vectors/armoire-storage-wardrobe-furniture-576193/ March 2022

Rope: OpenClipart-Vectors, Oct 2013, Free for Commercial Use, 
available at: https://pixabay.com/vectors/rope-cord-sisal-string-material-160161/ March 2022

Box: OpenClipart-Vectors, April 2016, Free for Commercial Use, 
available at: https://pixabay.com/vectors/box-cardboard-cube-isometric-1299001/ March 2022

Candles: OpenClipart-Vectors, Oct 2013, Free for Commercial Use, 
available at: https://pixabay.com/vectors/first-advent-christmas-advent-160890/ March 2022

Hammer: Clicker-Free-Vector-Images, April 2016, Free for Commercial Use, 
available at: https://pixabay.com/vectors/hammer-building-tool-carpentry-296388/ March 2022

Scissors: Clker-Free-Vector-Images, April 2012, Free for Commercial Use, 
available at: https://pixabay.com/vectors/scissors-office-open-scissor-tool-28697/ March 2022

Key: userold, Aug 2020, Free for Commercial Use, 
available at: https://pixabay.com/illustrations/key-lock-security-unlock-door-5471897/ March 2022

Numbers: Wholer, Jan 2022, Free for Commercial Use, 
available at: https://pixabay.com/illustrations/numbers-1-2-3-4-5-6-7-8-9-6925418/ March 2022

Background: Darkmoon_Art, April 2019, Free for Commercial Use, 
available at: https://pixabay.com/illustrations/space-empty-background-image-stage-4152623/ March 2022

Shelf: OpenClipart-Vectors, Dec 2014, Free for Commercial Use, 
available at: https://pixabay.com/vectors/shelf-wood-wall-hanging-wooden-575408/ March 2022

Button: OpenClipart-Vectors, Oct 2013, Free for Commercial Use, 
available at: https://pixabay.com/vectors/button-press-push-red-activate-155539/ March 2022

Frame: chenspec, Jan 2022, Free for Commercial Use, 
available at: https://pixabay.com/illustrations/frame-background-corkboard-6965350/ March 2022

Match Box and Match: sdvigger, Dec 2019, Free for Commercial Use, 
available at: https://pixabay.com/vectors/matches-boxes-fire-smoking-match-4701412/ March 2022

Rope: OpenClipart-Vectors, Oct 2013, Free for Commercial Use, 
available at: https://pixabay.com/vectors/rope-cord-sisal-string-material-160161/ March 2022

Piggy Bank: ArouselandPublicDomain, Oct 2018, Free for Commercial Use, 
available at: https://pixabay.com/vectors/piggy-bank-bank-pork-money-3718557/ March 2022
