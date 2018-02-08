/*jshint browser: true, esversion: 6 */

//nice to have: figure out how to sustain the tone, but let's not get worked up about it yet -> not all simon games sustained the note


//victory tone is playing the entire sequence, then flashing the circle, or something like that.
//something is making the sound only play once, the first time it's played and then never again -- something is amiss with the event handler?/event?

let isConsoleActive = false;
let strictMode = false;
let gameGoing = false;
let colorSequence = [];
let playerSequence = [];
let demoMode = false; //used to disable playpad while the computer is demoing sequence


//assign audio tones. These never change so using const declaration
const tone1 = new Audio('resources/audio/simonSound1.mp3'); //highest ptich, blue button 
const tone2 = new Audio('resources/audio/simonSound2.mp3'); //second highest, yellow button
const tone3 = new Audio('resources/audio/simonSound3.mp3'); // third highest, red button
const tone4 = new Audio('resources/audio/simonSound4.mp3'); //lowest pitch, green button
//you can make an error tone by playing all the sounds at once

//ok it turns out you can dynamically name variables but you can do an array

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
    document.getElementById(padNum).classList.add("light");
    tones[padNum].load(); //need to do this or else the sound will only play the first time
    tones[padNum].play(); //will need a way to prolong the noise
    //add a number to playerSequence array
    playerSequence.push(padNum);
    window.console.log("player sequence is");
    window.console.log(playerSequence);         
}

function playerUnPushButton(padNum){
    document.getElementById(padNum).classList.remove("light");
}


//pressing start a game while a game is going starts a new game
//though maybe we should instead create a reset button.
//it is allowed to toggle strict mode while a game is in progress (that's weird)
function startGame(){
    if (gameGoing === true){
        //clear out the current game
        playGame();
    } else {
        window.console.log("start a new game!");
        gameGoing = true;
        window.console.log("gameGoing = " + gameGoing);
        playGame();
    }  
}

function playGame(){
    //use a random number generator to generate the game sequence
    generateColorSequence();
    window.console.log(colorSequence);
    //play the first tone
    pushColorPad(colorSequence[0], 700);
    //document.getElementById(colorSequence[0]).classList.add("light");
    //we'll need to depress it also, and abstract this, some kind of function for a generic button press
    //update the counter
    document.getElementById('count').innerHTML = '01';
    //activate the color pad 
    //demoMode = false; //-- is this what's causing it to only play once? nope not this
    //player turn
    //compare score
    
}

function pushColorPad(padNum, holdTime){
    document.getElementById(padNum).classList.add("light");
    //play a corresponding noise for holdTime
    tones[padNum].load();
    tones[padNum].play();
    /*setTimeout(function(){tone2.play();}, 200);
    setTimeout(function(){tone3.play();}, 400);
    setTimeout(function(){tone4.play();}, 600);*/
    //hold it for holdTime amount of time
    setTimeout(function(){ document.getElementById(padNum).classList.remove("light"); }, holdTime);
}

 //getRandomIntInclusive from MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    } 

function generateColorSequence(){
    //clear whatever is in the sequece array
    colorSequence = [];
    //clear the player's inputs as well
    playerSequence = []; //is this what's causing it to only play once? -- nope not this
    //generate X numbers between 1 and 4 and stick them in the array
    for (let i=0; i < 20; i++){
        colorSequence.push(getRandomIntInclusive(1, 4));
    }
}



//compares button press against game sequence
//you have a limited amount of time to press the button
