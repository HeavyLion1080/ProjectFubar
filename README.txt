Introduction:
------------

    Welcome to The Virtual Escape Room project from SUNY Oswego's CSC 380 course in Spring 2022. 
In here we attempt to create a project over the course of the semester and learning the process 
of software development. We are a team of 4 of the students in the class, refered to as Team C, 
which contains the members of John Harrington, Abdulrehman Rashid, Mark Reichert, Jacob Singer.

    In here we will connect two players to play the game where during phase 1 of the game we will 
have the players answer trivia questions that are dependent on the administrator of the game 
discretion. When they answer all the questions within the time limit they will move onto phase 2 
of the game where each player will be placed into different rooms where they will have to work 
together in order to complete the game. At the end of the game after all the task have been 
completed we will show a result screen on how the players did. If they fail to complete the game
within the time limit they will be shown the results screen where they have run out of time and 
the metrics they had in the game to that point.

Requirements:
------------

This program will require the following:

    Node.js 
    A text editor such as Notepad.

Installation:
-------------

Install Node.js for which operating system that you will be running here:
https://nodejs.org/en/download/

For instructions on how to set up Node.js visit:
https://phoenixnap.com/kb/install-node-js-npm-on-windows



Configuration:
-------------

Question Instructions:

    When filling out a new questions.json file the "id" is the position the question will be when the questions in phase 1 start. 
Under "id" will be the "text", here is where the question in which the administrator wants to ask. 
Under the "text" for each question, there will be "options" where there will be 4 entries of options. 
Within each option there will be a "text" label that will take in answers for the question above. 
The "nexttext" numerical value will indicate a wrong answer if it is equal to the questions current "id" number,
and a correct answer if its is the questions current "id" numerical value incremented by 1.

Copyright and licensing information:
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
