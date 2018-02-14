/*jshint browser: true, esversion: 6 */

//nice to have: figure out how to sustain the tone, but let's not get worked up about it yet -> not all simon games sustained the note

//victory tone is playing the entire sequence, then flashing the circle, or something like that.
//todo: take the numberpad event listiners, make them one big event listiner that acts differently depending on which number ID was pressed, ie abstract it further
//TODO: change how the mouse pointer looks between demoMode and interactive mode so player knows they can click now
//TODO: create a victory condtion
//TODO: implement strictmode
//TODO: see if littleTurn and demoTurn can be rolled up into just one counter variable
//TODO: set the victory condition back to 20 when you're done with testing

let isConsoleActive = false;
let strictMode = false;
let gameGoing = false;
let colorSequence = [];
let demoMode = true; //used to disable playpad while the computer is demoing sequence
let bigTurn = 0; //this is what step in the game as a whole we are in, also corresponds to the number of plays the player has to make to get this turn correct (bigTurn+1) eg we are on the 2n'd turn, bigTurm is 1, player has to make 2 correct plays
let littleTurn = 0; //this is the current button press within the current bigTurn
let demoTurn = 0; //this is where the demo is, which hopefully will prevent confusion with the button press but who knows
let responseTime; //global for the timout variable


//assign audio tones. These never change so using const declaration
const tone1 = new Audio('resources/audio/simonSound1.mp3'); //highest ptich, blue button 
const tone2 = new Audio('resources/audio/simonSound2.mp3'); //2n highest, yellow button
const tone3 = new Audio('resources/audio/simonSound3.mp3'); // 3rd highest, red button
const tone4 = new Audio('resources/audio/simonSound4.mp3'); //lowest pitch, green button
//you can make an error tone by playing all the sounds at once. mabye

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
    } else return;
    
}

function playerUnPushButton(padNum){
    if (demoMode === false){
        document.getElementById(padNum).classList.remove("light");
        scoreCompare(padNum);//send the button press to scoreCompare which will check it against the current place in small turn of the current bigturn
    }
}

function computerPushButton(padNum) {
    document.getElementById(padNum).classList.add("light");
    tones[padNum].load(); //need to do this or else the sound will only play the first time
    tones[padNum].play(); //will need a way to prolong the noise
    //add a number to playerSequence array
    setTimeout(function(){
                computerUnPushButton(colorSequence[demoTurn]); 
                /////move the demoturn increment to computer unpushbutton maybe, or even another function to prevent confusion
                demoTurn++;
                window.console.log("computerUnPushButton incremented demoTurn to " + demoTurn);
            }, 600);
}

function computerUnPushButton(padNum){
    document.getElementById(padNum).classList.remove("light");
    setTimeout(function(){
                playDemo(); 
            }, 50);
}

//pressing start a game while a game is going starts a new game
//though maybe we should instead create a reset button.
//it is allowed to toggle strict mode while a game is in progress (that's weird)
function startGame(){
    //reset bigturn counter
    bigTurn = 0;
    littleTurn = 0;
    demoTurn = 0;
    //set the toggle that the game is going
    gameGoing = true;
    //use a random number generator to generate the game sequence
    generateColorSequence();
    window.console.log(colorSequence);
    //maybe flash the counter to indicate a new game is starting
    //play the game
    setTimeout(function(){
                playDemo(); 
            }, 500);
}

function scoreCompare(num){
    //something is looping compareScore, calling it over and over
    if (num === colorSequence[littleTurn]){
        window.console.log("you played "+ num + " the right tone");
        if (littleTurn === bigTurn){
            //check for victory condition
            if (littleTurn === (colorSequence.length - 1)){
                //do victory stuff
                gameGoing = false;
                flashMessage("**", 5);
                victorySong();
                setTimeout(function(){
                    //start a new game
                    startGame();
                }, 5000);
            } else if (littleTurn != (colorSequence.length - 1)){
                demoMode = true;
                bigTurn++;
                littleTurn = 0; 
                demoTurn = 0;
                window.console.log("scoreCompare updates. bigTurn: " + bigTurn + " littleTurn: " + littleTurn + " demoTurn: " + demoTurn);
                setTimeout(function(){
                    playDemo(); 
                }, 500);
            }
        } else if (littleTurn < bigTurn){
            littleTurn++;
            window.console.log("littleTurn is updated by scoreCompare to " + littleTurn);
        }
        //if you got it wrong
        } else if (num != colorSequence[littleTurn]){
            window.console.log("you played "+ num + " the wrong tone");
            //if strictmode
            if (strictMode === true){
                //error message
                flashMessage('!!', 3);
                //start a new game
                setTimeout(function(){
                    startGame(); 
                }, 1500);
            } else if (strictMode === false){
                //if not in strictmode
                //flash error in the counter
                flashMessage('!!', 3);
                demoTurn = 0;
                littleTurn = 0;
                demoMode = true; //return to demomode, disabling player clicks
                //demo the sequence again
                window.console.log("you got it wrong so scoreCompare is calling playDemo, and resetting values. demoTurn: " + demoTurn + " littleTurn: " + littleTurn);
                setTimeout(function(){
                    playDemo(); 
                }, 1500);
            }
        }
}

function playDemo(){
    //no parameter, it uses the global demoTurn
    window.console.log("playDemo is checking if it needs to go");
    window.console.log("at the start of playDemo bigTurn: " + bigTurn + " littleTurn: " + littleTurn + " demoTurn: " + demoTurn);

    if (gameGoing === true){
        updateCounter(bigTurn+1);
        if (demoTurn < (bigTurn+1)){
            window.console.log("playDemo has decided to go");
            //call button press 
            setTimeout(function(){computerPushButton(colorSequence[demoTurn]);}, 500);

        } else demoMode = false;
            window.console.log("playDemo has decided to stop");
            return; //is this necessary?
    } else return;
    
}

function flashMessage(message, times){
    //display message 'message' in the 'count' innerHTM 'times' times
    //TODO: do some stuff with intervals to actually make this work as a flash
    //use class led-off to get the flashing effect visually
    document.getElementById('count').innerHTML = message;
    window.console.log("I'm dispalying the message " + message + " " + times + " times");
    /////after flash message is done, only then should it return the counter, so have the update called by flash message
            //set counter back to bigTurn, but only after we see the message
            setTimeout(function() {updateCounter(bigTurn+1);}, 1500);
}

function updateCounter(num){
    if (num < 10){
        document.getElementById('count').innerHTML = "0" + num;
    } else document.getElementById('count').innerHTML = "0" + num;
}

function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The max & min both inclusive
    } 

function generateColorSequence(){
    colorSequence = [];
    //fore testing purposes doing win at 5 instead of 20
    for (let i=0; i < 3; i++){
        colorSequence.push(getRandomIntInclusive(1, 4));
    }
}

//lots of copy pasting here, better come up with a way automate/streamline
function victorySong() {
    setTimeout(function(){
        tones[1].load(); //so the sound plays more than once
        tones[1].play(); //will need a way to prolong the noise
    }, 100);
    setTimeout(function(){
        tones[2].load(); //so the sound plays more than once
        tones[2].play(); //will need a way to prolong the noise
    }, 300);
    setTimeout(function(){
        tones[3].load(); //so the sound plays more than once
        tones[3].play(); //will need a way to prolong the noise
    }, 500);
    setTimeout(function(){
        tones[4].load(); //so the sound plays more than once
        tones[4].play(); //will need a way to prolong the noise
    }, 700);
}

//not sure it really makes senst to have this as a function but we'll see
function detectVictory(){
    if (littleTurn === (colorSequence.length - 1)){
        window.console.log("you won!");
        //play victory tune
        victorySong();
        //start the game again after a timeout long enough for the victory song to do its thing
    }
}