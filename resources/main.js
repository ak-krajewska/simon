/*jshint browser: true, esversion: 6 */

//todo: figure out how to sustain the tone, but let's not get worked up about it yet

let isConsoleActive = false;
let strictMode = false;
let gameGoing = false;
let colorSequence = [];
let playerSequence = [];
let demoMode = true; //used to disable playpad while the computer is demoing sequence


//assign audio tones. These never change so using const declaration
const tone1 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'); //highest ptich, blue button 
const tone2 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'); //second highest, yellow button
const tone3 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'); // third highest, red button
const tone4 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'); //lowest pitch, green button
//you can make an error tone by playig all the sounds at once

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
    document.getElementById(1).classList.add("light");
    tones[1].play();
    
    //we'll actually want both a click and a release button so depending on how long you hold it plays the sound a different amount
}

function unPushBlue(){
    document.getElementById(1).classList.remove("light");
}

function pushYellow(){
    document.getElementById(2).classList.add("light");
    tones[2].play();
}

function unPushYellow(){
    document.getElementById(2).classList.remove("light");
}

function pushRed(){
    document.getElementById(3).classList.add("light");
    tones[3].play();
}

function unPushRed(){
    document.getElementById(3).classList.remove("light");
}

function pushGreen(){
    document.getElementById(4).classList.add("light");
    tones[4].play();
}

function unPushGreen(){
    document.getElementById(4).classList.remove("light");
}


//pressing start a game while a game is going starts a new game
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
    //when it's player's turn activate pad
    //when it's computer's turn, de-activeate pad
    
}

function pushColorPad(padNum, holdTime){
    document.getElementById(padNum).classList.add("light");
    //play a corresponding noise for holdTime
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
    //generate X numbers between 1 and 4 and stick them in the array
    for (let i=0; i < 20; i++){
        colorSequence.push(getRandomIntInclusive(1, 4));
    }
}

//series of fucntions for pressing each of the color pads
//changes the color
//makes a noise
//calls another function that
    //compares button press against game sequence
//you have a limited amount of time to press the button
//color pad is NOT active while the game plays, but it seems crazy to add and remove even listiners