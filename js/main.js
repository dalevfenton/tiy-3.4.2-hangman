(function(){


//------------------------------------------------------------------------------
//                       INTITIALIZE APPLICATION STATE
//------------------------------------------------------------------------------
  //filter list of commonWords to down to those with 3 letters or more
  var usefulWords = commonWords.filter(function(value){
    if(value.length >= 3){
      return true;
    }else{
      return false;
    }
  });
  //get a random word from our list of usable words
  var randomWord;
  var alphabetObj = new Alphabet();
  var gameBoard = document.querySelector('.game-board');
  var indicator = document.querySelector('.indicator');
  var guessLetters = document.querySelector('.guessed-letters');
  var winScreen = document.querySelector('.winner');
  var loseScreen = document.querySelector('.loser');
  var numGuesses = 10;

  function initializeGame(){
    randomWord = _.sample(usefulWords);
    alphabetObj = new Alphabet();
    numGuesses = 10;
    outputToBoard();
    updateIndicator();
    winScreen.style.top = '-50%';
    loseScreen.style.top = '-50%';
    console.log(alphabetObj);
    console.log(randomWord);
  }
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
  function updateIndicator(){
    indicator.innerHTML = 'Number of Guesses Left: ' + numGuesses;
    alphaOutput = '';
    _.each(alphabetObj, function(value, indexVal, arr){
      if(value.guessed === true){
        if(value.correct === true){
          alphaOutput += '<span class="letter letter-correct">' + indexVal + '</span>';
        }else{
          alphaOutput += '<span class="letter letter-wrong">' + indexVal + '</span>';
        }
      }else{
        alphaOutput += '<span class="letter"></span>';
      }
    });
    guessLetters.innerHTML = alphaOutput;
  }
  function checkWin(){
    var win = true;
    _.each(randomWord, function(value){
      if(alphabetObj[value].correct === false){
        win = false;
      }
    });
    console.log(win);
    return win;
  }
  function checkLose(){
    var lose = false;
    if(numGuesses === 0){
      lose = true;
    }
    return lose;
  }
  function handleKey (){
    if(event.code.slice(0,3) == "Key"){
      var key = event.code.slice(3,4).toLowerCase();
      console.log('key is: ' + event.code.slice(3,4));
      alphabetObj[key].guessed = true;
      if(randomWord.indexOf(key) > -1){
        alphabetObj[key].correct = true;
      }else{
        numGuesses--;
      }
      updateIndicator();
      outputToBoard();
      if(checkWin()){
        winScreen.style.top = '10%';
      }
      if(checkLose()){
        loseScreen.style.top = '10%';
      }
    }else{
      console.log('not a valid letter');
    }
  }
  window.addEventListener('keypress', handleKey);
  winScreen.addEventListener('click', initializeGame);
  loseScreen.addEventListener('click', initializeGame);
  initializeGame();
}());
