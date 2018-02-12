/*jshint browser: true, esversion: 6 */

//nice to have: figure out how to sustain the tone, but let's not get worked up about it yet -> not all simon games sustained the note


//victory tone is playing the entire sequence, then flashing the circle, or something like that.
//todo: take the numberpad event listiners, make them one big event listiner that acts differently depending on which number ID was pressed, ie abstract it further

let isConsoleActive = false;
let strictMode = false;
let gameGoing = false;
let colorSequence = [];
let demoMode = true; //used to disable playpad while the computer is demoing sequence
let bigTurn = 0; //this is what step in the game as a whole we are in, also corresponds to the number of plays the player has to make to get this turn correct (bigTurn+1) eg we are on the 2n'd turn, bigTurm is 1, player has to make 2 correct plays
let littleTurn = 0; //this is the current button press within the current bigTurn
let responseTime; //global for the timout variable


//assign audio tones. These never change so using const declaration
const tone1 = new Audio('resources/audio/simonSound1.mp3'); //highest ptich, blue button 
const tone2 = new Audio('resources/audio/simonSound2.mp3'); //second highest, yellow button
const tone3 = new Audio('resources/audio/simonSound3.mp3'); // third highest, red button
const tone4 = new Audio('resources/audio/simonSound4.mp3'); //lowest pitch, green button
//you can make an error tone by playing all the sounds at once

const tones = ['', tone1, tone2, tone3, tone4]; 

activateGamePad();

//turn the game on and off
document.getElementById('power-switch').addEventListener('click', toggleConsole);

function toggleConsole(){
    //add switch-on class to class switch
    if (isConsoleActive === true) {
        //if switch-on class exists, remove it, and toggle isConsoleActive
        document.getElementById('power-switch').setAttribute('class', "switch");
        isConsoleActive = false;
         window.console.log("isConsoleActive = " + isConsoleActive);
        //deactivate gamepad buttons
        //deactivate start button
        document.getElementById('start').setAttribute('class', "round-btn-red");
        document.getElementById('start').removeEventListener('click', startGame);
        //deactivate strict button
        document.getElementById('mode').setAttribute('class', "round-btn-yellow");
        document.getElementById('mode').removeEventListener('click', toggleStrict);
        //deactivate the strict led indicator
        document.getElementById('mode-led').setAttribute('class', "led");
        //deactivate count window
        document.getElementById('count').setAttribute('class', "count led-off");
        //stop the current game
        gameGoing = false;
    } else {
        document.getElementById('power-switch').setAttribute('class', "switch switch-on");
        isConsoleActive = true;
        window.console.log("isConsoleActive = " + isConsoleActive);
        //activate start button
        document.getElementById('start').setAttribute('class', "round-btn-red clickable");
        document.getElementById('start').addEventListener('click', startGame);
        //activate strict button
        document.getElementById('mode').setAttribute('class', "round-btn-yellow clickable");
        document.getElementById('mode').addEventListener('click', toggleStrict);
        //activate count window with --
        document.getElementById('count').setAttribute('class', "count");
        document.getElementById('count').innerHTML = "--";
    }   
}

function toggleStrict(){
    window.console.log("toggle strict mode");
    if (strictMode === true){
        document.getElementById('mode-led').setAttribute('class', "led");
        //set the strictMode to false
        strictMode = false;   
    } else {
        //set indicator button to red 
        document.getElementById('mode-led').setAttribute('class', "led led-on");
        //set the strictMode to true
        strictMode = true;
    } 
}

function activateGamePad(){
    document.getElementById('1').addEventListener('mousedown', pushBlue);
    document.getElementById('1').addEventListener('mouseup', unPushBlue);
    document.getElementById('2').addEventListener('mousedown', pushYellow);
    document.getElementById('2').addEventListener('mouseup', unPushYellow);
    document.getElementById('3').addEventListener('mousedown', pushRed);
    document.getElementById('3').addEventListener('mouseup', unPushRed);
    document.getElementById('4').addEventListener('mousedown', pushGreen);
    document.getElementById('4').addEventListener('mouseup', unPushGreen);
}

function pushBlue(){
    if (demoMode === false){
        playerPushButton(1);
    } else return;  
}

function unPushBlue(){
   playerUnPushButton(1);
}

function pushYellow(){
   if (demoMode === false){
        playerPushButton(2);
    } else return;  
}

function unPushYellow(){
   playerUnPushButton(2);
}

function pushRed(){
   if (demoMode === false){
        playerPushButton(3);
    } else return;  
}

function unPushRed(){
    playerUnPushButton(3);
}

function pushGreen(){
   if (demoMode === false){
        playerPushButton(4);
    } else return;  
}

function unPushGreen(){
    playerUnPushButton(4);
}

function playerPushButton(padNum) {
    if (demoMode === false){
        document.getElementById(padNum).classList.add("light");
        tones[padNum].load(); //so the sound plays more than once
        tones[padNum].play(); //will need a way to prolong the noise
        clearTimeout(responseTime);
        scoreCompare(padNum);//send the button press to scoreCompare which will check it against the current place in small turn of the current bigturn
    } else return;
    
}

function computerPushButton(padNum) {
    document.getElementById(padNum).classList.add("light");
    tones[padNum].load(); //need to do this or else the sound will only play the first time
    tones[padNum].play(); //will need a way to prolong the noise
    //add a number to playerSequence array
}

function playerUnPushButton(padNum){
    document.getElementById(padNum).classList.remove("light");
}


//pressing start a game while a game is going starts a new game
//though maybe we should instead create a reset button.
//it is allowed to toggle strict mode while a game is in progress (that's weird)
function startGame(){
    //reset bigturn counter
    bigTurn = 0;
    //set the toggle that the game is going
    gameGoing = true;
    //play the game
    playGame();
}

function playGame(){
    //use a random number generator to generate the game sequence
    generateColorSequence();
    window.console.log(colorSequence);
    //play the first tone
    //document.getElementById('count').innerHTML = '01';
    //computerPushButton(colorSequence[littleTurn]);
    //setTimeout(function() {playerUnPushButton(colorSequence[littleTurn]); }, 500);
    littleTurn = 0;
    playDemo(); //or should it be bigTurn+1? -- not it's littleTurn, if anything
    //I suspect this timeout score compare is causing stupidness
    /*
    responseTime = setTimeout(function(){
        scoreCompare(colorSequence[littleTurn]); 
    }, 3000);
    */
    //activate the color pad 
    demoMode = false; 
}

function scoreCompare(num){
    //something is looping compareScore, calling it over and over
    if (num === colorSequence[littleTurn]){
        window.console.log("you played the right tone");
        if (littleTurn === bigTurn){
            demoMode = true;
            bigTurn++;
            window.console.log("bigTurn is updated by scoreCompare to " + bigTurn);
            littleTurn = 0; 
            window.console.log("scoreCompare is calling playDemo()");
            playDemo(); //it's playing and updating every time any key is right but actaully we only want to update bigTurn AND play the demo at the last item. I think. Is that what's happening?
        } else if (littleTurn < bigTurn){
            littleTurn++;
            window.console.log("littleTurn is updated by scoreCompare to " + littleTurn);
        }
        
        } else if (num != colorSequence[littleTurn]){
            window.console.log("you played the wrong tone");
            //if not in strictmode
            //flash error in the counter
            flashMessage('!!', 3);
            //set counter back to bigTurn, but only after we see the message
            setTimeout(function() {updateCounter(bigTurn+1);}, 1500);
            //reset littleTurn to 0 becasue we have to play the sequence from the start
            littleTurn = 0;
            //demo the sequence again
            window.console.log("you got it wrong so scoreCompare is calling playDemo");
            playDemo(); 
            //somehow if you get it wrong it just plays the demo infinite times
        }
}

function playDemo(){
    //no parameter, it uses the global littleTurn
    window.console.log("playDemo is going");
    window.console.log("at the stat of playDemo bigTurn is " + bigTurn);
    window.console.log("at the start of playDemo littleTurn is " + littleTurn);
    if (gameGoing === true){
        
        if (littleTurn <= bigTurn){
            //call button press 
            setTimeout(function(){computerPushButton(colorSequence[littleTurn]);}, 500);
            //call button release after a timeout
            setTimeout(function(){playerUnPushButton(colorSequence[littleTurn]); }, 1000);
            //after a time out call another function, that calls the button press
            littleTurn++;
            window.console.log("playDemo incremented little turn to " + littleTurn);
            setTimeout(function(){
                littleTurn = 0;
                playDemo(); 
                window.console.log("demo plays due to timeout");}, 3000); //==> is this calling playDemo that second time?
        } else demoMode = false;
    } else return;
    
}

function flashMessage(message, times){
    //display message 'message' in the 'count' innerHTM 'times' times
    //TODO: do some stuff with intervals to actually make this work as a flash
    //use class led-off to get the flashing effect visually
    document.getElementById('count').innerHTML = message;
    window.console.log("I'm dispalying the message " + message + " " + times + " times");
}

function updateCounter(num){
    if (num < 10){
        document.getElementById('count').innerHTML = "0" + num;
    } else document.getElementById('count').innerHTML = "0" + num;
}

 //getRandomIntInclusive from MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The max & min both inclusive
    } 

function generateColorSequence(){
    colorSequence = [];
    for (let i=0; i < 20; i++){
        colorSequence.push(getRandomIntInclusive(1, 4));
    }
}

//this ends up playing all the sounds at the same time so we'll need to rethink it
function victorySong() {
    setTimeout(function(){tone1.play();}, 100);
    setTimeout(function(){tone2.play();}, 500);
    setTimeout(function(){tone3.play();}, 900);
    setTimeout(function(){tone4.play();}, 1300);
}
