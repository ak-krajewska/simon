/*jshint browser: true, esversion: 6 */

//nice to have: figure out how to sustain the tone, but let's not get worked up about it yet -> not all simon games sustained the note

//TODO: see if littleTurn and demoTurn can be rolled up into just one counter variable
//TODO: set the victory condition back to 20 when you're done with testing
//TODO: reorder the way the functions appear so that code is easier to read

let isConsoleActive = false;
let strictMode = false;
let gameGoing = false;
let colorSequence = [];
let demoMode = true; //disables playpad 
let bigTurn = 0; //which step of the game as a whole
let littleTurn = 0; //the current player button press within the current bigTurn
let demoTurn = 0; //current computer turn in the demo
let responseTime; //global for the timout variable
let nextGameTimeOutID; //global so turning of the console prevents the next game starting automatically

//assign audio tones. These never change so using const declaration
const tone1 = new Audio('resources/audio/simonSound1.mp3'); //highest ptich, blue button 
const tone2 = new Audio('resources/audio/simonSound2.mp3'); //2n highest, yellow button
const tone3 = new Audio('resources/audio/simonSound3.mp3'); // 3rd highest, red button
const tone4 = new Audio('resources/audio/simonSound4.mp3'); //lowest pitch, green button
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
         //window.console.log("isConsoleActive = " + isConsoleActive);
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
        strictMode = false;
        gameGoing = false;
        deActivateCursor();
        clearTimeout(nextGameTimeOutID);
    } else {
        document.getElementById('power-switch').setAttribute('class', "switch switch-on");
        isConsoleActive = true;
        //window.console.log("isConsoleActive = " + isConsoleActive);
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
    //window.console.log("toggle strict mode");
    if (strictMode === true){
        document.getElementById('mode-led').setAttribute('class', "led");
        strictMode = false;   
    } else {
        //set indicator button to red 
        document.getElementById('mode-led').setAttribute('class', "led led-on");
        strictMode = true;
    } 
}

function activateGamePad(){
    document.getElementById('1').addEventListener('mousedown', playerPushButton);
    document.getElementById('1').addEventListener('mouseup', playerUnPushButton);
    document.getElementById('2').addEventListener('mousedown', playerPushButton);
    document.getElementById('2').addEventListener('mouseup', playerUnPushButton);
    document.getElementById('3').addEventListener('mousedown', playerPushButton);
    document.getElementById('3').addEventListener('mouseup', playerUnPushButton);
    document.getElementById('4').addEventListener('mousedown', playerPushButton);
    document.getElementById('4').addEventListener('mouseup', playerUnPushButton);
}

function playerPushButton() {
    if (demoMode === false){
        clearTimeout(responseTime);
        document.getElementById(this.id).classList.add("light");
        tones[this.id].load(); 
        tones[this.id].play(); 
    } else return;
    
}

function playerUnPushButton(){
    if (demoMode === false){
        document.getElementById(this.id).classList.remove("light");
        scoreCompare(this.id);//send the button press to scoreCompare which will check it against the current place in small turn of the current bigturn
        window.console.log("you released button " + this.id);
    }
}

function computerPushButton(padNum) {
    document.getElementById(padNum).classList.add("light");
    tones[padNum].load(); 
    tones[padNum].play(); 
    //window.console.log("computerPushButton is playing " + padNum);
    setTimeout(function(){
                computerUnPushButton(colorSequence[demoTurn]); 
                demoTurn++;
                //window.console.log("computerUnPushButton incremented demoTurn to " + demoTurn);
            }, 600);
}

function computerUnPushButton(padNum){
    document.getElementById(padNum).classList.remove("light");
    setTimeout(function(){
                playDemo(); 
            }, 50);
}

//pressing start a game while a game is going starts a new game
//it is allowed to toggle strict mode while a game is in progress 
function startGame(){
    //reset turn counters
    bigTurn = 0;
    littleTurn = 0;
    demoTurn = 0;
    demoMode = true;
    deActivateCursor();
    //set the toggle that the game is going
    gameGoing = true;
    //use a random number generator to generate the game sequence
    generateColorSequence();
    //window.console.log(colorSequence);
    //maybe flash the counter to indicate a new game is starting
    //play the game
    setTimeout(function(){
                playDemo(); 
            }, 500);
}

function scoreCompare(num){
    //something is looping compareScore, calling it over and over
    if (num == colorSequence[littleTurn]){
        window.console.log("you played "+ num + " the right tone");
        if (littleTurn === bigTurn){
            //check for victory condition
            if (littleTurn === (colorSequence.length - 1)){
                //do victory stuff
                gameGoing = false;
                flashMessage("V", 5);
                demoMode = true;
                deActivateCursor();
                victorySong(0);
                //need a way to clear this long ass timeout in case the player turns off the console
                nextGameTimeOutID = setTimeout(function(){
                    //start a new game
                    startGame();
                }, 5000);
            } else if (littleTurn != (colorSequence.length - 1)){
                demoMode = true;
                deActivateCursor();
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
            //window.console.log("littleTurn is updated by scoreCompare to " + littleTurn);
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
                deActivateCursor();
                //window.console.log("you got it wrong so scoreCompare is calling playDemo, and resetting values. demoTurn: " + demoTurn + " littleTurn: " + littleTurn);
                setTimeout(function(){
                    playDemo(); 
                }, 1500);
            }
        }
}

function playDemo(){
    //no parameter, it uses the global demoTurn
    if (gameGoing === true){
        updateCounter(bigTurn+1);
        //window.console.log("playDemo is checking if it needs to go");
        //window.console.log("at the start of playDemo bigTurn: " + bigTurn + " littleTurn: " + littleTurn + " demoTurn: " + demoTurn);
        //if (demoTurn < (bigTurn+1)){
        if (demoTurn <= bigTurn){
            //window.console.log("playDemo has decided to go");
            //call button press 
            setTimeout(function(){computerPushButton(colorSequence[demoTurn]);}, 500);

        } else if (demoTurn > bigTurn){
                demoMode = false;
                activateCursor();
                //window.console.log("playDemo has decided to stop");
                //if no one presses the button in time, set them up to fail in scoreCompare
            //somehow this gives less time than it should on subsequent presses, like it's getting reset too soon maybe?
                //responseTime = setTimeout(scoreCompare, 3000);
                //return; //is this necessary?
        }
    } else return;
    
}

function flashMessage(message, times){
    //display message 'message' in the 'count' innerHTM 'times' times
    //TODO: do some stuff with intervals to actually make this work as a flash
    //use class led-off to get the flashing effect visually
    document.getElementById('count').innerHTML = message;
    //window.console.log("I'm dispalying the message " + message + " " + times + " times");
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

function victorySong(num) {
    //let victorySounds = [1, 2, 1, 3, 2, 3, 4, 3, 4];
    let victorySounds = [4, 4, 3, 3, 1, 1, 2, 2, 4, 3, 1, 2];
    
    document.getElementById(victorySounds[num]).classList.add("light");
    tones[victorySounds[num]].load();
    tones[victorySounds[num]].play();
    if (num < (victorySounds.length-1)){
        window.console.log("victory song num: " + num);
        num++;
        window.console.log("victory song num incremented to: " + num);
        setTimeout(function(){
            document.getElementById(victorySounds[num-1]).classList.remove("light");
            victorySong(num);
        }, 210);
    } else document.getElementById(victorySounds[num]).classList.remove("light");
}

//not sure it really makes senst to have this as a function but we'll see
function detectVictory(){
    if (littleTurn === (colorSequence.length - 1)){
        //window.console.log("you won!");
        //play victory tune
        victorySong();
        //start the game again after a timeout long enough for the victory song to do its thing
    }
}

function activateCursor(){
    document.getElementById('1').classList.add("activeCursor");
    document.getElementById('2').classList.add("activeCursor");
    document.getElementById('3').classList.add("activeCursor");
    document.getElementById('4').classList.add("activeCursor");
}

function deActivateCursor(){
    document.getElementById('1').classList.remove("activeCursor");
    document.getElementById('2').classList.remove("activeCursor");
    document.getElementById('3').classList.remove("activeCursor");
    document.getElementById('4').classList.remove("activeCursor");
}