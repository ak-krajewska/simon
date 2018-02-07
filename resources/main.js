/*jshint browser: true, esversion: 6 */

//note the off button isn't clearing something, so pressing start a second time doesn't do anything

let isConsoleActive = false;
let strictMode = false;
let gameGoing = false;
let colorSequence = [];
let playerSequence = [];

//assign audio tones. These never change so using const declaration
const tone1 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'); //highest ptich, blue button 
const tone2 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'); //second highest, yellow button
const tone3 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'); // third highest, red button
const tone4 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'); //lowest pitch, green button
//you can make an error tone by playig all the sounds at once

//ok it turns out you can dynamically name variables but you can do an array

const tones = ['', tone1, tone2, tone3, tone4]; 

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
    //document.getElementById(padNum).classList.remove("light");
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