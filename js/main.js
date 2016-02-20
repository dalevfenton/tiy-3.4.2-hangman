(function(){

//POSSIBLE FEATURES TO ADD:
//TOGGLE FOR SOUND EFFECTS
//TOGGLE FOR PHRASE VS SINGLE WORD
// :HOVER AND :ACTIVE STYLES AND MOUSE POINTER FOR BUTTONS
//TRY AT CSS OF HANG MAN
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//------------------------------------------------------------------------------
//                       INTITIALIZE APPLICATION STATE
//------------------------------------------------------------------------------
// obsolete function to pull word from static list imported from common-words.js
// var usefulWords = commonWords.filter(function(value){
//   if(value.length >= 3){
//     return true;
//   }else{
//     return false;
//   }
// });

//declare variables
var randomWord, numGuesses, alphabetObj, letterNodes;
var gamesWon = 0;
var gamesLost = 0;
var gameBoard = document.querySelector('.game-board');
var indicator = document.querySelector('.indicator');
var guessLetters = document.querySelector('.guessed-letters');
var winScreen = document.querySelector('.winner');
var loseScreen = document.querySelector('.loser');
var restart = document.querySelector('.restart');
var wrong_audio = new Audio('sounds/wrong.mp3');
var right_audio = new Audio('sounds/right.mp3');
var restart_audio = new Audio('sounds/restart.mp3');
document.querySelector('#wins').innerHTML = gamesWon;
document.querySelector('#losses').innerHTML = gamesLost;

//pulls a random word between 9 and 4 letters long from setgetgo
//when the request returns a word, then we initialize the game
function getRandomWord(){
  var length =  Math.floor(6*Math.random() + 4);
  $.ajax({
    type: "GET",
    url: ('http://randomword.setgetgo.com/get.php'),
    data: {
      len: length
    },
    dataType: "jsonp"
  }).done(function(data){
    initializeGame( data );
  }).fail(function(obj, status, error){
    console.log(obj);
    console.log(status);
    console.log(error);
  });
}

//start execution
getRandomWord();

//this function is called by getRandomWord(), once that function sends a Word
//from its ajax call, then we initialize the game state
function initializeGame(word){
  // console.log(word.Word);
  restart_audio.play();
  randomWord =  word.Word.toLowerCase();
  alphabetObj = new Alphabet();
  numGuesses = 10;

  //outputToBoard sets the empty letter fields for our word
  outputToBoard();
  //updateIndicator sets the indicator status window telling
  //us how many guesses are left and what happened with our
  // last guess
  updateIndicator();
  //reset our winning and losing screen elements if we finished a game
  winScreen.innerHTML = '';
  loseScreen.innerHTML = '';
  winScreen.style.bottom = '';
  winScreen.classList.remove('frame-down');
  loseScreen.classList.remove('frame-down');

  //output our alphabet indicator to the screen
  alphaOutput = '';
  _.each(alphabetObj, function(value, indexVal, arr){
    var prefix = '<span id="Key' + indexVal + '" class="letter';
    if(value.isVowel === true){
        prefix += ' letter-vowel';
      }
    alphaOutput += prefix + ' letter-not-guessed">' + indexVal + '</span>';
    });
    guessLetters.innerHTML = alphaOutput;

  //get the nodes we just sent to the screen and add event handlers for clicks
  letterNodes = document.getElementsByClassName('letter-not-guessed');
  _.each(letterNodes, function(value){
    value.addEventListener('click', handleClick);
  });
  }

//runs through each letter in the word we are guessing at and fills them in
//if they have been guessed, this function redraws the gameboard on each guess
function outputToBoard(  ){
  var outputStr = '';
  _.each( randomWord, function(value, indexVal, arr){
    if(alphabetObj[value].correct === true ){
      outputStr += '<span class="letter letter-' + indexVal + '">' + value + '</span>';
    }else{
      outputStr += '<span class="letter letter-' + indexVal + '"></span>';
    }
  });
  gameBoard.innerHTML = outputStr;
}


//takes a key or click object input and updates our variables and alphabet board
function updateIndicator( keyVal ){
  //Main Indicator Window
  indicator.innerHTML = 'Number of Guesses Left: ' + numGuesses;
  if( keyVal !== undefined ){
    var selector = "#Key" + keyVal;
    // console.log(selector);
    var keyElem = document.querySelector(selector);
    // console.log(keyElem);
    if(alphabetObj[keyVal].guessed === true){
      keyElem.classList.remove('letter-not-guessed');
      if(alphabetObj[keyVal].correct === true){
        keyElem.classList.add('letter-correct');
      }else{
        keyElem.classList.add('letter-wrong');
      }
    }
  }
}


//checks if the game is over with a win and returns true or false
function checkWin(){
  var win = true;
  _.each(randomWord, function(value){
    if(alphabetObj[value].correct === false){
      win = false;
    }
  });
  // console.log(win);
  return win;
}

//checks if the game is over with a loss and returns true or false
function checkLose(){
  var lose = false;
  if(numGuesses === 0){
    lose = true;
  }
  return lose;
}

//builds an object with property code that matches a keyboard event for the
//same letter
function handleClick(){
  var clickObj = {code:this.id };
  handleInput(clickObj);
}
//passes a keypress input to our input handling function
function handleKey (){
  var keyObj = event;
  handleInput(keyObj);
}

//takes input from keyboard or mouse click and identifies what to do with it
//updates application state and provides feedback to user
function handleInput(inputObj){
  //check if the user has entered a valid letter key, other key presses are
  //passed to the end of the function with an error message to the indicator
  if(inputObj.code.slice(0,3) == "Key"){
    //if we have a valid key, get the letter so we can compare to our Alphabet Object
    var key = inputObj.code.slice(3,4).toLowerCase();
    if(alphabetObj[key].guessed === true){
      //key was already guessed
      wrong_audio.play();
      updateIndicator( );
      flashWarn('You Already Guessed That Letter');
    }else{
      //key has not been guessed before, so set it to guessed = true
      alphabetObj[key].guessed = true;
      if(randomWord.indexOf(key) > -1){
        //key is a letter in the word we are guessing
        alphabetObj[key].correct = true;
        right_audio.play();
        updateIndicator( key );
        flashGood('You Were Correct');
      }else{
        //letter was incorrect update numGuesses and alert user
        wrong_audio.play();
        numGuesses--;
        updateIndicator( key );
        flashWarn('Sorry That Letter Is Not Correct');
      }
    }
    //output new board state
    outputToBoard();
    //check if the user has won
    if(checkWin()){
      winScreen.classList.add('frame-down');
      winScreen.innerHTML = '<span class="win-msg restart-game">Great Job!</br>Click or Hit Enter to Restart Game</br>The Word Was: ' + randomWord + '</span><iframe class="youtube" width="420" height="315" src="https://www.youtube.com/embed/NubH5BDOaD8?start=115&controls=0&amp;showinfo=0&autoplay=1" frameborder="0" allowfullscreen></iframe>';
      gamesWon += 1;
      updateGames();
    }
    //check if the user has lost
    if(checkLose()){
      loseScreen.classList.add('frame-down');
      loseScreen.innerHTML = '<span class="lose-msg restart-game">Sorry You Didn\'t Win</br>Please Try Again!</br>Click or Hit Enter to Restart Game</br>The Word Was: ' + randomWord + '</span><iframe class="youtube" width="560" height="315" src="https://www.youtube.com/embed/TnOdAT6H94s?start=128&controls=0&amp;showinfo=0&autoplay=1" frameborder="0" allowfullscreen></iframe>';
      gamesLost += 1;
      updateGames();
    }
  }else if(event.code == 'Enter'){
    //if the user hits enter, reset to a new game
    getRandomWord();
  }else{
    //flash indicator with warning, user entered a non-letter key
    wrong_audio.play();
    flashWarn('Not A Letter');
  }
}

//update games won and lost upon win or loss
function updateGames(){
  document.querySelector('#wins').innerHTML = gamesWon;
  document.querySelector('#losses').innerHTML = gamesLost;
}
//flash indicator with red warning color and message
function flashWarn( warning ){
  indicator.innerHTML += '<br>' + warning + '!';
  indicator.classList.add('indicator-red');
  window.setTimeout( function(){ indicator.classList.remove('indicator-red'); } , 250);
  window.setTimeout( function(){ indicator.classList.add('indicator-red'); } , 500);
  window.setTimeout( function(){ indicator.classList.remove('indicator-red'); } , 750);
}
//flash indicator with green success color and message
function flashGood( success ){
  indicator.innerHTML += '<br>' + success + '!';
  indicator.classList.add('indicator-green');
  window.setTimeout( function(){ indicator.classList.remove('indicator-green'); } , 250);
  window.setTimeout( function(){ indicator.classList.add('indicator-green'); } , 500);
  window.setTimeout( function(){ indicator.classList.remove('indicator-green'); } , 750);
}

//event handlers for keyboard input and game reset on win, loss, or reset button input
window.addEventListener('keypress', handleKey);
winScreen.addEventListener('click', getRandomWord);
loseScreen.addEventListener('click', getRandomWord);
restart.addEventListener('click', getRandomWord);

}());
